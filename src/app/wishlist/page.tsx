"use client";

import { Heart } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useStore } from "@/context/StoreProvider";
import { ProductCard } from "@/components/ui/ProductCard";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { EmptyState } from "@/components/ui/EmptyState";
import { WishlistLoadingSkeleton } from "@/components/ui/BagLoadingSkeleton";
import { SectionDivider } from "@/components/ui/PageSection";
import { PAGE_CONTENT_SHELL, PAGE_GRADIENT_SHELL, PRODUCT_GRID } from "@/lib/ui-classes";

export default function WishlistPage() {
  const { wishlist, hydrated } = useStore();
  const reduceMotion = useReducedMotion();

  if (!hydrated) {
    return <WishlistLoadingSkeleton />;
  }

  if (wishlist.length === 0) {
    return (
      <EmptyState
        icon={Heart}
        title="Wishlist is empty"
        description="Tap the heart on any piece to save it for later."
        actionLabel="Explore Shop"
        actionHref="/shop"
      />
    );
  }

  return (
    <div className={PAGE_GRADIENT_SHELL}>
      <div className={PAGE_CONTENT_SHELL}>
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Wishlist" }]} />
      <h1 className="mb-6 text-2xl font-semibold text-dark sm:text-3xl">
        My Wishlist
      </h1>
      <p className="mb-6 text-sm text-dark/60">{wishlist.length} saved item(s)</p>
      <div className={PRODUCT_GRID}>
        <AnimatePresence initial={false} mode="popLayout">
          {wishlist.map((p) => (
            <motion.div
              key={p.id}
              layout={!reduceMotion}
              initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
              <ProductCard product={p} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      </div>
      <SectionDivider />
    </div>
  );
}
