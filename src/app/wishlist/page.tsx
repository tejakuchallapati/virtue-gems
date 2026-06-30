"use client";

import { Heart } from "lucide-react";
import { useStore } from "@/context/StoreProvider";
import { ProductCard } from "@/components/ui/ProductCard";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { EmptyState } from "@/components/ui/EmptyState";
import { PAGE_SHELL, PRODUCT_GRID } from "@/lib/ui-classes";

export default function WishlistPage() {
  const { wishlist } = useStore();

  if (wishlist.length === 0) {
    return (
      <EmptyState
        icon={Heart}
        title="Wishlist is empty"
        description="Save your favourite pieces for later."
        actionLabel="Explore Shop"
        actionHref="/shop"
      />
    );
  }

  return (
    <div className={PAGE_SHELL}>
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Wishlist" }]} />
      <h1 className="mb-6 text-2xl font-semibold text-dark sm:text-3xl">
        My Wishlist
      </h1>
      <p className="mb-6 text-sm text-dark/60">{wishlist.length} saved item(s)</p>
      <div className={PRODUCT_GRID}>
        {wishlist.map((p, i) => (
          <ScrollReveal key={p.id} delay={i * 0.05}>
            <ProductCard product={p} />
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}
