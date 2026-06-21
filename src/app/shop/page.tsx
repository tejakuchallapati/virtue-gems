import { Suspense } from "react";
import type { Metadata } from "next";
import { ShopClient } from "@/components/shop/ShopClient";
import { ShopLoadingSkeleton } from "@/components/ui/ShopLoadingSkeleton";
import { getAllProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Shop Collections",
  description: "Browse rings, necklaces, earrings, bracelets and pendants at Virtue Gems.",
};

export default function ShopPage() {
  const products = getAllProducts();
  return (
    <Suspense fallback={<ShopLoadingSkeleton />}>
      <ShopClient products={products} />
    </Suspense>
  );
}
