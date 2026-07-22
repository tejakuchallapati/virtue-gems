/** Canonical production domain for Virtue Gems (custom domain on Vercel). */
export const PRODUCTION_SITE_URL = "https://virtuegems.com";

export function getSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (configured) return configured;

  const vercel = process.env.VERCEL_URL;
  if (vercel) {
    return vercel.startsWith("http")
      ? vercel.replace(/\/$/, "")
      : `https://${vercel}`.replace(/\/$/, "");
  }

  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3001";
  }

  return PRODUCTION_SITE_URL;
}

/** Hostname only (e.g. virtuegems.com) for invoices and footers. */
export function getSiteHost(): string {
  try {
    return new URL(getSiteUrl()).host;
  } catch {
    return "virtuegems.com";
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
