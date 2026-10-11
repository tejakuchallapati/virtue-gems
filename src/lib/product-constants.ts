import type { ProductCategory, ProductTag } from "@/types";

export const PRODUCT_CATEGORIES: ProductCategory[] = ["necklaces", "earrings", "bracelets"];

export const PRODUCT_TAGS: ProductTag[] = ["bestseller", "new", "trending"];

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  necklaces: "Necklaces",
  earrings: "Earrings",
  bracelets: "Bracelets",
};

/** Older rows may still carry retired categories (e.g. rings) — keep them out of the storefront. */
export function isSellableCategory(category: string): category is ProductCategory {
  return (PRODUCT_CATEGORIES as string[]).includes(category);
}

export const TAG_LABELS: Record<ProductTag, string> = {
  bestseller: "Best Seller",
  new: "New Arrival",
  trending: "Trending",
};
