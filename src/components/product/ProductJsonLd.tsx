import type { Product } from "@/types";
import { getSiteUrl } from "@/lib/site";

type Props = { product: Product };

export function ProductJsonLd({ product }: Props) {
  const siteUrl = getSiteUrl();
  const url = `${siteUrl}/product/${product.slug}`;
  const images = product.images.map((img) =>
    img.startsWith("http") ? img : `${siteUrl}${img}`,
  );

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: images,
    sku: product.id,
    mpn: product.id,
    category: product.category,
    brand: {
      "@type": "Brand",
      name: "Virtue Gems",
    },
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "INR",
      price: product.price,
      priceValidUntil: new Date(Date.now() + 1000 * 60 * 60 * 24 * 90)
        .toISOString()
        .slice(0, 10),
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: "Virtue Gems",
        url: siteUrl,
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "IN",
          addressRegion: ["Telangana", "Andhra Pradesh"],
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 1,
            maxValue: 2,
            unitCode: "DAY",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: 3,
            maxValue: 7,
            unitCode: "DAY",
          },
        },
      },
    },
    aggregateRating:
      product.reviewCount > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: product.rating,
            reviewCount: product.reviewCount,
            bestRating: 5,
            worstRating: 1,
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
