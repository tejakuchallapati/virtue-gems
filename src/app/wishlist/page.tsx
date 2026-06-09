"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useStore } from "@/context/StoreProvider";
import { ProductCard } from "@/components/ui/ProductCard";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export default function WishlistPage() {
  const { wishlist } = useStore();

  if (wishlist.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center sm:py-24">
        <Heart className="mx-auto h-12 w-12 text-dark/20" />
        <h1 className="mt-4 text-xl font-semibold text-dark">Wishlist is empty</h1>
        <p className="mt-2 text-sm text-dark/60">
          Save your favourite pieces for later.
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-block rounded-xl bg-gold px-8 py-3 text-sm font-semibold text-dark"
        >
          Explore Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Wishlist" }]} />
      <h1 className="mb-6 text-2xl font-semibold text-dark sm:text-3xl">
        My Wishlist
      </h1>
      <p className="mb-6 text-sm text-dark/60">{wishlist.length} saved item(s)</p>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {wishlist.map((p, i) => (
          <ScrollReveal key={p.id} delay={i * 0.05}>
            <ProductCard product={p} />
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}
