import type { MetadataRoute } from "next";
import { getAllProducts } from "@/lib/products";
import { getSiteUrl } from "@/lib/site";
import { absoluteAssetUrl } from "@/lib/seo";

const STATIC_ROUTES: {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}[] = [
  { path: "", changeFrequency: "daily", priority: 1 },
  { path: "/shop", changeFrequency: "daily", priority: 0.95 },
  { path: "/try-on", changeFrequency: "weekly", priority: 0.85 },
  { path: "/rewards", changeFrequency: "weekly", priority: 0.8 },
  { path: "/about", changeFrequency: "monthly", priority: 0.7 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.7 },
  { path: "/faq", changeFrequency: "monthly", priority: 0.75 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
  { path: "/refunds", changeFrequency: "yearly", priority: 0.4 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl();
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const productEntries: MetadataRoute.Sitemap = getAllProducts().map((product) => ({
    url: `${baseUrl}/product/${product.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
    images: product.images.map((img) => absoluteAssetUrl(img)),
  }));

  return [...staticEntries, ...productEntries];
}
