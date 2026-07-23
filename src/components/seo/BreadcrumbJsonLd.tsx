import { getSiteUrl } from "@/lib/site";

export type BreadcrumbItem = {
  name: string;
  path?: string;
};

/** BreadcrumbList JSON-LD — helps Google show path crumbs in search results. */
export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const siteUrl = getSiteUrl();

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.path
        ? { item: `${siteUrl}${item.path === "/" ? "" : item.path}` }
        : {}),
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
