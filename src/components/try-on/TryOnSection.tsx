"use client";

import dynamic from "next/dynamic";
import type { Product } from "@/types";

const VirtualTryOn = dynamic(
  () => import("./VirtualTryOn").then((m) => m.VirtualTryOn),
  {
    ssr: false,
    loading: () => (
      <div className="h-64 animate-pulse rounded-2xl bg-light ring-1 ring-light-muted/60" />
    ),
  },
);

export function TryOnSection({ product }: { product: Product }) {
  return <VirtualTryOn product={product} />;
}
