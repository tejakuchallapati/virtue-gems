import type { ProductCategory } from "@/types";
import { getDefaultPlacements, loadImage, type OverlayPlacement } from "./try-on";

const CONTAINER_ASPECT = 3 / 4;
const MODEL_URL = "https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.13/model";

let modelsReady: Promise<void> | null = null;

async function ensureFaceModels() {
  if (!modelsReady) {
    modelsReady = (async () => {
      const faceapi = await import("@vladmandic/face-api");
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.faceLandmark68TinyNet.loadFromUri(MODEL_URL);
    })();
  }
  await modelsReady;
}

type CoverMapping = {
  offsetX: number;
  offsetY: number;
  visibleW: number;
  visibleH: number;
};

function getObjectCoverMapping(imgW: number, imgH: number): CoverMapping {
  const imageAspect = imgW / imgH;

  if (imageAspect > CONTAINER_ASPECT) {
    const visibleH = imgH;
    const visibleW = imgH * CONTAINER_ASPECT;
    return {
      offsetX: (imgW - visibleW) / 2,
      offsetY: 0,
      visibleW,
      visibleH,
    };
  }

  const visibleW = imgW;
  const visibleH = imgW / CONTAINER_ASPECT;
  return {
    offsetX: 0,
    offsetY: (imgH - visibleH) / 2,
    visibleW,
    visibleH,
  };
}

function toDisplayPercent(
  x: number,
  y: number,
  mapping: CoverMapping,
): { xPercent: number; yPercent: number } {
  const xPercent = ((x - mapping.offsetX) / mapping.visibleW) * 100;
  const yPercent = ((y - mapping.offsetY) / mapping.visibleH) * 100;
  return {
    xPercent: Math.min(92, Math.max(0, xPercent)),
    yPercent: Math.min(92, Math.max(0, yPercent)),
  };
}

function distance(a: { x: number; y: number }, b: { x: number; y: number }) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

type Point = { x: number; y: number };

export async function detectJewelleryPlacements(
  imageUrl: string,
  category: ProductCategory,
): Promise<OverlayPlacement[]> {
  try {
    await ensureFaceModels();
    const faceapi = await import("@vladmandic/face-api");
    const img = await loadImage(imageUrl);

    const detection = await faceapi
      .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions({ inputSize: 416, scoreThreshold: 0.4 }))
      .withFaceLandmarks(true);

    if (!detection) {
      return getDefaultPlacements(category);
    }

    const mapping = getObjectCoverMapping(img.naturalWidth, img.naturalHeight);
    const points = detection.landmarks.positions as Point[];

    const chin = points[8];
    const leftJaw = points[3];
    const rightJaw = points[13];
    const leftEar = points[0];
    const rightEar = points[16];
    const jawWidth = distance(leftJaw, rightJaw);

    switch (category) {
      case "necklaces": {
        const centerX = chin.x;
        const centerY = chin.y + jawWidth * 0.12;
        const scale = Math.min(0.85, Math.max(0.35, (jawWidth * 1.55) / mapping.visibleW));
        const widthPx = scale * mapping.visibleW;
        const topLeft = toDisplayPercent(centerX - widthPx * 0.5, centerY - widthPx * 0.15, mapping);

        return [
          {
            id: "necklace",
            xPercent: topLeft.xPercent,
            yPercent: topLeft.yPercent,
            scale,
            rotation: 0,
          },
        ];
      }

      case "earrings": {
        const earScale = Math.min(0.28, Math.max(0.12, (jawWidth * 0.42) / mapping.visibleW));
        const earSize = earScale * mapping.visibleW;

        const leftPos = toDisplayPercent(leftEar.x - earSize * 0.5, leftEar.y - earSize * 0.2, mapping);
        const rightPos = toDisplayPercent(rightEar.x - earSize * 0.5, rightEar.y - earSize * 0.2, mapping);

        return [
          { id: "ear-left", ...leftPos, scale: earScale, rotation: -8 },
          { id: "ear-right", ...rightPos, scale: earScale, rotation: 8 },
        ];
      }

      case "pendants": {
        const centerX = chin.x;
        const centerY = chin.y + jawWidth * 0.22;
        const scale = Math.min(0.4, Math.max(0.15, (jawWidth * 0.55) / mapping.visibleW));
        const size = scale * mapping.visibleW;
        const pos = toDisplayPercent(centerX - size * 0.5, centerY - size * 0.25, mapping);

        return [{ id: "pendant", ...pos, scale, rotation: 0 }];
      }

      case "rings": {
        const centerX = chin.x - jawWidth * 0.55;
        const centerY = chin.y + jawWidth * 1.1;
        const scale = Math.min(0.22, Math.max(0.1, (jawWidth * 0.28) / mapping.visibleW));
        const size = scale * mapping.visibleW;
        const pos = toDisplayPercent(centerX - size * 0.5, centerY - size * 0.5, mapping);

        return [{ id: "ring", ...pos, scale, rotation: -10 }];
      }

      case "bracelets": {
        const centerX = chin.x - jawWidth * 0.95;
        const centerY = chin.y + jawWidth * 1.25;
        const scale = Math.min(0.38, Math.max(0.18, (jawWidth * 0.7) / mapping.visibleW));
        const size = scale * mapping.visibleW;
        const pos = toDisplayPercent(centerX - size * 0.5, centerY - size * 0.35, mapping);

        return [{ id: "bracelet", ...pos, scale, rotation: 15 }];
      }

      default:
        return getDefaultPlacements(category);
    }
  } catch {
    return getDefaultPlacements(category);
  }
}
