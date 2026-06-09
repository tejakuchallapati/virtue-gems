"use client";

import { useStore } from "@/context/StoreProvider";
import { ProductCard } from "@/components/ui/ProductCard";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export function RecentlyViewed() {
  const { recentlyViewed, hydrated } = useStore();

  if (!hydrated || recentlyViewed.length === 0) return null;

  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="mb-8">
          <p className="text-sm tracking-[0.2em] text-gold uppercase">Continue Browsing</p>
          <h2 className="mt-1 text-2xl font-semibold text-dark sm:text-3xl">
            Recently Viewed
          </h2>
        </ScrollReveal>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {recentlyViewed.slice(0, 4).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
