import type { Product } from "@/types";
import { getSiteUrl } from "@/lib/site";

type Props = { product: Product };

export function ProductJsonLd({ product }: Props) {
  const siteUrl = getSiteUrl();
  const url = `${siteUrl}/product/${product.slug}`;
  const image = product.images[0]?.startsWith("http")
    ? product.images[0]
    : `${siteUrl}${product.images[0]}`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images.map((img) =>
      img.startsWith("http") ? img : `${siteUrl}${img}`,
    ),
    sku: product.id,
    brand: {
      "@type": "Brand",
      name: "Virtue Gems",
    },
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "INR",
      price: product.price,
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "Virtue Gems",
      },
    },
    aggregateRating:
      product.reviewCount > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: product.rating,
            reviewCount: product.reviewCount,
          }
        : undefined,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
