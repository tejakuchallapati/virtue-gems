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
  earrings: "Earrings are placed on your ears automatically. Drag to fine-tune if needed.",
  necklaces: "Necklace is placed on your neck automatically. Drag to adjust if needed.",
  rings: "Ring is placed automatically. Drag onto your finger to adjust.",
  bracelets: "Bracelet is placed automatically. Drag to your wrist if needed.",
  pendants: "Pendant is aligned on your neckline automatically. Drag to adjust.",
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
