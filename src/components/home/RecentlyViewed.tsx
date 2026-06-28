"use client";

import { useStore } from "@/context/StoreProvider";
import { ProductCard } from "@/components/ui/ProductCard";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { PageSection, SectionHeader } from "@/components/ui/PageSection";
import { PRODUCT_GRID } from "@/lib/ui-classes";

export function RecentlyViewed() {
  const { recentlyViewed, hydrated } = useStore();

  if (!hydrated || recentlyViewed.length === 0) return null;

  return (
    <PageSection tone="cream" dividerTop>
      <ScrollReveal>
        <SectionHeader
          eyebrow="Continue Browsing"
          title="Recently Viewed"
          description="Pick up where you left off."
        />
      </ScrollReveal>
      <div className={PRODUCT_GRID}>
        {recentlyViewed.slice(0, 4).map((p, i) => (
          <ScrollReveal key={p.id} delay={i * 0.05}>
            <ProductCard product={p} />
          </ScrollReveal>
        ))}
      </div>
    </PageSection>
  );
}
