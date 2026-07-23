import type { Metadata } from "next";
import { Suspense } from "react";
import { ShopClient } from "@/components/shop/ShopClient";
import { ShopLoadingSkeleton } from "@/components/ui/ShopLoadingSkeleton";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { buildPageMetadata } from "@/lib/seo";
import { getAllProducts } from "@/lib/products";

export const metadata: Metadata = buildPageMetadata({
  title: "Shop Jewellery Collections Online",
  description:
    "Browse Virtue Gems rings, necklaces, earrings, bracelets and pendants. Festive & daily-wear jewellery with WhatsApp ordering and delivery across Hyderabad, AP & Telangana.",
  path: "/shop",
  keywords: [
    "shop jewellery online",
    "jewellery collections Hyderabad",
    "buy necklace set online",
    "gold plated rings India",
  ],
});

export default function ShopPage() {
  const products = getAllProducts();
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Shop" },
        ]}
      />
      <Suspense fallback={<ShopLoadingSkeleton />}>
        <ShopClient products={products} />
      </Suspense>
    </>
  );
}
