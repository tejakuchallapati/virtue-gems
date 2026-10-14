import type { MetadataRoute } from "next";
import { VIRTUAL_TRY_ON_ENABLED, LOYALTY_ENABLED } from "@/lib/features";
import { getSiteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getSiteUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/api/",
          "/invoice/",
          "/review/",
          "/cart",
          "/checkout",
          "/wishlist",
          ...(VIRTUAL_TRY_ON_ENABLED ? [] : ["/try-on"]),
          ...(LOYALTY_ENABLED ? [] : ["/rewards"]),
        ],
      },
      {
        // Lets WhatsApp build the invoice preview card; invoice pages are still noindex.
        userAgent: ["WhatsApp", "facebookexternalhit"],
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
