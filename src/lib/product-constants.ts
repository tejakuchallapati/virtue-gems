import type { ProductCategory, ProductTag } from "@/types";

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  "rings",
  "necklaces",
  "earrings",
  "bracelets",
  "pendants",
];

export const PRODUCT_TAGS: ProductTag[] = ["bestseller", "new", "trending"];

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  rings: "Rings",
  necklaces: "Necklaces",
  earrings: "Earrings",
  bracelets: "Bracelets",
  pendants: "Pendants",
};
