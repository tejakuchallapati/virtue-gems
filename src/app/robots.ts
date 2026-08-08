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
          "/cart",
          "/checkout",
          "/wishlist",
          ...(VIRTUAL_TRY_ON_ENABLED ? [] : ["/try-on"]),
          ...(LOYALTY_ENABLED ? [] : ["/rewards"]),
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
