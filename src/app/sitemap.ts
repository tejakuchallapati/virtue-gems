import type { MetadataRoute } from "next";
import { getAllProducts } from "@/lib/products";
import { getSiteUrl } from "@/lib/site";

const STATIC_ROUTES = [
  "",
  "/shop",
  "/about",
  "/contact",
  "/rewards",
  "/faq",
  "/try-on",
  "/privacy",
  "/terms",
  "/refunds",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl();
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
    changeFrequency: path === "" || path === "/shop" ? "daily" : "monthly",
    priority: path === "" ? 1 : path === "/shop" ? 0.9 : 0.6,
  }));

  const productEntries: MetadataRoute.Sitemap = getAllProducts().map((product) => ({
    url: `${baseUrl}/product/${product.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticEntries, ...productEntries];
}
