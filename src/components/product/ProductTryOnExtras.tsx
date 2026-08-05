"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Camera } from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import type { Product } from "@/types";

const TryOnModal = dynamic(
  () => import("@/components/try-on/TryOnModal").then((m) => m.TryOnModal),
  { ssr: false },
);

const VirtualTryOn = dynamic(
  () => import("@/components/try-on/VirtualTryOn").then((m) => m.VirtualTryOn),
  {
    ssr: false,
    loading: () => (
      <div className="mt-10 hidden h-48 animate-pulse rounded-2xl bg-light sm:block" />
    ),
  },
);

export function ProductTryOnExtras({ product }: { product: Product }) {
  const [tryOnOpen, setTryOnOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setTryOnOpen(true)}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-gold/40 bg-gold/10 py-3.5 text-sm font-semibold text-gold-dark transition hover:bg-gold/20 sm:hidden"
      >
        <Camera className="h-4 w-4" />
        Try on me — see how it looks
      </button>

      <ScrollReveal className="mt-10 hidden sm:block">
        <VirtualTryOn product={product} />
      </ScrollReveal>

      <TryOnModal product={product} open={tryOnOpen} onClose={() => setTryOnOpen(false)} />
    </>
  );
}
