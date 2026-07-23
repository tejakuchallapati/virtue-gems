/**
 * Canonical production domain for Virtue Gems.
 * Vercel currently redirects apex → www, so www is the public URL.
 */
export const PRODUCTION_SITE_URL = "https://www.virtuegems.com";

export function getSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (configured) return configured;

  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3001";
  }

  // Preview deployments only — never use ephemeral Vercel URLs in production SEO.
  if (process.env.VERCEL_ENV === "preview" && process.env.VERCEL_URL) {
    const vercel = process.env.VERCEL_URL;
    return vercel.startsWith("http")
      ? vercel.replace(/\/$/, "")
      : `https://${vercel}`.replace(/\/$/, "");
  }

  return PRODUCTION_SITE_URL;
}

/** Hostname only (e.g. www.virtuegems.com) for invoices and footers. */
export function getSiteHost(): string {
  try {
    return new URL(getSiteUrl()).host;
  } catch {
    return "www.virtuegems.com";
  }
}

/**
 * Absolute URL for a path. Prefers NEXT_PUBLIC_SITE_URL so WhatsApp / invoice
 * links use the custom domain even when opened from a preview host.
 */
export function getAbsoluteUrl(path = "/"): string {
  const envBase = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  const base =
    envBase ||
    (typeof window !== "undefined" ? window.location.origin : getSiteUrl());

  if (!path || path === "/") return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
