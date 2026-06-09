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
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <ShopClient products={products} />
    </Suspense>
  );
}
