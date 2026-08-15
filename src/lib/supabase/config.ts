const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

function isValidProjectUrl(value?: string): value is string {
  if (!value || value.includes("YOUR_PROJECT")) return false;
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" && parsed.hostname.endsWith(".supabase.co");
  } catch {
    return false;
  }
}

function isRealKey(value?: string): value is string {
  return Boolean(
    value &&
      value.length >= 20 &&
      !value.startsWith("your-") &&
      !value.includes("YOUR_"),
  );
}

export function isSupabaseConfigured(): boolean {
  return isValidProjectUrl(url) && isRealKey(anonKey);
}

export function isSupabaseAdminConfigured(): boolean {
  return isValidProjectUrl(url) && isRealKey(serviceRoleKey);
}

export function getSupabasePublicConfig() {
  if (!isValidProjectUrl(url) || !isRealKey(anonKey)) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }
  return { url, anonKey };
}

export function getSupabaseAdminConfig() {
  if (!isValidProjectUrl(url) || !isRealKey(serviceRoleKey)) {
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
