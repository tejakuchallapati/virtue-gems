import "server-only";

import type { Product } from "@/types";
import {
  getAllProducts,
  getProductById,
  getProductBySlug,
} from "@/lib/products";
import { isSupabaseAdminConfigured } from "@/lib/supabase/config";
import {
  getSupabaseProductById,
  getSupabaseProductBySlug,
  listSupabaseProducts,
} from "@/lib/supabase/store";

/** Production catalog reads use Supabase; local development keeps SQLite/seed fallback. */
export async function getAllProductsSafe(): Promise<Product[]> {
  if (!isSupabaseAdminConfigured()) return getAllProducts();
  return listSupabaseProducts();
}

export async function getProductBySlugSafe(
  slug: string,
): Promise<Product | undefined> {
  if (!isSupabaseAdminConfigured()) return getProductBySlug(slug);
  return getSupabaseProductBySlug(slug);
}

export async function getProductByIdSafe(
  id: string,
): Promise<Product | undefined> {
  if (!isSupabaseAdminConfigured()) return getProductById(id);
  return getSupabaseProductById(id);
}
