import { Suspense } from "react";
import type { Metadata } from "next";
import { ShopClient } from "@/components/shop/ShopClient";
import { getAllProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Shop Collections",
  description: "Browse rings, necklaces, earrings, bracelets and pendants at Virtue Gems.",
};

export default function ShopPage() {
  const products = getAllProducts();
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center bg-gradient-to-b from-[#faf6ee] to-light">
          <p className="text-sm text-dark/50">Loading collections...</p>
        </div>
      }
    >
      <ShopClient products={products} />
    </Suspense>
  );
}
