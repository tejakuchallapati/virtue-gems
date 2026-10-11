import "server-only";

import type { Product } from "@/types";
import {
  getAllProducts,
  getProductById,
  getProductBySlug,
} from "@/lib/products";
import { isSellableCategory } from "@/lib/product-constants";
import { isSupabaseAdminConfigured } from "@/lib/supabase/config";
import {
  getSupabaseProductById,
  getSupabaseProductBySlug,
  listSupabaseProducts,
} from "@/lib/supabase/store";

function sellable(product: Product | undefined): Product | undefined {
  return product && isSellableCategory(product.category) ? product : undefined;
}

/** Production catalog reads use Supabase; local development keeps SQLite/seed fallback. */
export async function getAllProductsSafe(): Promise<Product[]> {
  const products = isSupabaseAdminConfigured()
    ? await listSupabaseProducts()
    : getAllProducts();
  return products.filter((p) => isSellableCategory(p.category));
}

export async function getProductBySlugSafe(
  slug: string,
): Promise<Product | undefined> {
  if (!isSupabaseAdminConfigured()) return sellable(getProductBySlug(slug));
  return sellable(await getSupabaseProductBySlug(slug));
}

export async function getProductByIdSafe(
  id: string,
): Promise<Product | undefined> {
  if (!isSupabaseAdminConfigured()) return sellable(getProductById(id));
  return sellable(await getSupabaseProductById(id));
}
