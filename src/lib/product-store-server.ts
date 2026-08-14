import "server-only";

import type { Product } from "@/types";
import {
  createProduct,
  getStoredProductById,
  getStoredProductByIdAdmin,
  getStoredProductBySlug,
  listProducts,
  restoreProduct,
  softDeleteProduct,
  updateProduct,
  type ProductInput,
} from "@/lib/product-store";
import { isSupabaseAdminConfigured } from "@/lib/supabase/config";
import {
  createSupabaseProduct,
  getSupabaseProductById,
  getSupabaseProductBySlug,
  listSupabaseProducts,
  setSupabaseProductActive,
  updateSupabaseProduct,
} from "@/lib/supabase/store";

export async function listProductsSafe(options?: {
  includeInactive?: boolean;
}): Promise<(Product & { active?: boolean })[]> {
  if (!isSupabaseAdminConfigured()) return listProducts(options);
  return listSupabaseProducts(options);
}

export async function getProductByIdSafe(
  id: string,
  includeInactive = false,
): Promise<(Product & { active?: boolean }) | undefined> {
  if (!isSupabaseAdminConfigured()) {
    return includeInactive
      ? getStoredProductByIdAdmin(id)
      : getStoredProductById(id);
  }
  return getSupabaseProductById(id, includeInactive);
}

export async function getProductBySlugSafe(
  slug: string,
): Promise<Product | undefined> {
  if (!isSupabaseAdminConfigured()) return getStoredProductBySlug(slug);
  return getSupabaseProductBySlug(slug);
}

export async function createProductSafe(input: ProductInput): Promise<Product> {
  if (!isSupabaseAdminConfigured()) return createProduct(input);
  return createSupabaseProduct(input);
}

export async function updateProductSafe(
  id: string,
  patch: Partial<ProductInput>,
): Promise<Product | null> {
  if (!isSupabaseAdminConfigured()) return updateProduct(id, patch);
  return updateSupabaseProduct(id, patch);
}

export async function setProductActiveSafe(
  id: string,
  active: boolean,
): Promise<boolean> {
  if (!isSupabaseAdminConfigured()) {
    return active ? Boolean(restoreProduct(id)) : softDeleteProduct(id);
  }
  return setSupabaseProductActive(id, active);
}
