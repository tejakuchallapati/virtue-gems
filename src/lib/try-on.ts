import type { ProductCategory } from "@/types";

export type OverlayPlacement = {
  id: string;
  xPercent: number;
  yPercent: number;
  scale: number;
  rotation: number;
};

export function getDefaultPlacements(category: ProductCategory): OverlayPlacement[] {
  switch (category) {
    case "earrings":
      return [
        { id: "ear-left", xPercent: 18, yPercent: 36, scale: 0.22, rotation: -6 },
        { id: "ear-right", xPercent: 62, yPercent: 36, scale: 0.22, rotation: 6 },
      ];
    case "necklaces":
      return [
        { id: "necklace", xPercent: 12, yPercent: 44, scale: 0.62, rotation: 0 },
      ];
    case "rings":
      return [
        { id: "ring", xPercent: 38, yPercent: 62, scale: 0.2, rotation: -12 },
      ];
    case "bracelets":
      return [
        { id: "bracelet", xPercent: 8, yPercent: 58, scale: 0.35, rotation: 18 },
      ];
    case "pendants":
      return [
        { id: "pendant", xPercent: 32, yPercent: 48, scale: 0.28, rotation: 0 },
      ];
    default:
      return [
        { id: "piece", xPercent: 25, yPercent: 45, scale: 0.4, rotation: 0 },
      ];
  }
}

export const TRY_ON_HINTS: Record<ProductCategory, string> = {
  earrings: "Drag each earring over your ears. Use sliders to resize.",
  necklaces: "Place the necklace along your neck and collarbone.",
  rings: "Move the ring onto your finger in the photo.",
  bracelets: "Position the bracelet on your wrist.",
  pendants: "Align the pendant on your neckline.",
};

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
