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
    "@id": `${url}#product`,
    url,
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
      priceValidUntil: "2027-12-31",
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
    review:
      product.reviews.length > 0
        ? product.reviews.map((review) => ({
            "@type": "Review",
            "@id": `${url}#review-${review.id}`,
            author: {
              "@type": "Person",
              name: review.author,
            },
            datePublished: review.date,
            reviewBody: review.comment,
            reviewRating: {
              "@type": "Rating",
              ratingValue: review.rating,
              bestRating: 5,
              worstRating: 1,
            },
          }))
        : undefined,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
