import type { Metadata } from "next";
import { Suspense } from "react";
import { ShopClient } from "@/components/shop/ShopClient";
import { ShopLoadingSkeleton } from "@/components/ui/ShopLoadingSkeleton";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { buildPageMetadata } from "@/lib/seo";
import { getAllProductsSafe } from "@/lib/products-server";

export const revalidate = 60;

export const metadata: Metadata = buildPageMetadata({
  title: "Shop Jewellery Collections Online",
  description:
    "Browse Virtue Gems necklaces, earrings and bracelets. Festive & daily-wear jewellery with WhatsApp ordering and delivery across Hyderabad, AP & Telangana.",
  path: "/shop",
  keywords: [
    "shop jewellery online",
    "jewellery collections Hyderabad",
    "buy necklace set online",
    "gold plated earrings India",
    "bracelets online India",
  ],
});

export default async function ShopPage() {
  const products = await getAllProductsSafe();
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
