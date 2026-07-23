import type { Metadata } from "next";
import { getSiteUrl, PRODUCTION_SITE_URL } from "@/lib/site";

export const SITE_NAME = "Virtue Gems";

export const SITE_TAGLINE =
  "Premium handcrafted jewellery for Hyderabad, Andhra Pradesh & Telangana";

export const DEFAULT_DESCRIPTION =
  "Shop premium handcrafted gold-plated jewellery at Virtue Gems — rings, necklaces, earrings & bracelets with WhatsApp checkout, virtual try-on, and doorstep delivery across AP & Telangana.";

/** Local + category keywords that help Google understand the store. */
export const DEFAULT_KEYWORDS = [
  "Virtue Gems",
  "jewellery online India",
  "handcrafted jewellery Hyderabad",
  "gold plated jewellery",
  "artificial jewellery AP Telangana",
  "buy rings online Hyderabad",
  "necklace set online",
  "earrings online India",
  "festive jewellery",
  "WhatsApp jewellery shop",
  "virtual try on jewellery",
];

export function absoluteAssetUrl(path: string): string {
  if (path.startsWith("http")) return path;
  return `${getSiteUrl()}${path.startsWith("/") ? path : `/${path}`}`;
}

type PageMetaInput = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  image?: string;
  noIndex?: boolean;
};

/** Consistent titles, canonicals, and social tags for every public page. */
export function buildPageMetadata({
  title,
  description,
  path,
  keywords = [],
  image = "/logo-with-text.png",
  noIndex = false,
}: PageMetaInput): Metadata {
  const siteUrl = getSiteUrl();
  const url = `${siteUrl}${path === "/" ? "" : path}`;
  const ogImage = absoluteAssetUrl(image);
  const fullTitle = title.includes(SITE_NAME) ? title : undefined;

  return {
    title: fullTitle ?? title,
    description,
    keywords: [...DEFAULT_KEYWORDS, ...keywords],
    alternates: {
      canonical: path,
    },
    openGraph: {
      title: fullTitle ?? `${title} | ${SITE_NAME}`,
      description,
      url,
      siteName: SITE_NAME,
      locale: "en_IN",
      type: "website",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${SITE_NAME} — ${title}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle ?? `${title} | ${SITE_NAME}`,
      description,
      images: [ogImage],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

export function getVerificationMetadata(): Metadata["verification"] {
  const google = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;
  if (!google) return undefined;
  return { google };
}

export { PRODUCTION_SITE_URL };
