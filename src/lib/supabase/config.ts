const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

export function isSupabaseConfigured(): boolean {
  return Boolean(url && anonKey);
}

export function isSupabaseAdminConfigured(): boolean {
  return Boolean(url && serviceRoleKey);
}

export function getSupabasePublicConfig() {
  if (!url || !anonKey) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }
  return { url, anonKey };
}

export function getSupabaseAdminConfig() {
  if (!url || !serviceRoleKey) {
    throw new Error(
      "Supabase admin access is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    );
  }
  return { url, serviceRoleKey };
}

export function getProductImageBucket(): string {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET?.trim() ||
    process.env.SUPABASE_STORAGE_BUCKET?.trim() ||
    "product-images"
  );
}
