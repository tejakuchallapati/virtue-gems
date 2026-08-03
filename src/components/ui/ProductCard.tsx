"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useStore } from "@/context/StoreProvider";
import { TAG_LABELS } from "@/lib/product-constants";
import { formatPrice, cn } from "@/lib/utils";
import { PRODUCT_IMAGE_FIT, PRODUCT_IMAGE_FRAME } from "@/lib/ui-classes";
import type { Product, ProductTag } from "@/types";

const tagStyles: Partial<Record<ProductTag, string>> = {
  bestseller: "bg-gold text-dark",
  new: "bg-dark text-gold",
  trending: "bg-dark-soft text-light",
};

export function ProductCard({ product }: { product: Product }) {
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } =
    useStore();
  const wished = isInWishlist(product.id);
  const [added, setAdded] = useState(false);

  function handleAddToCart() {
    if (product.stock < 1) return;
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <article className="group relative overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-light-muted/60 transition hover:shadow-md hover:ring-gold/35">
      <div className={cn(PRODUCT_IMAGE_FRAME, "aspect-square")}>
        <Link
          href={`/product/${product.slug}`}
          className="relative block h-full w-full"
        >
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={cn(PRODUCT_IMAGE_FIT, "group-hover:scale-[1.03]")}
          />
        </Link>
        <div className="pointer-events-none absolute left-2 top-2 flex flex-wrap gap-1">
          {product.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className={cn(
                "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide sm:text-xs",
                tagStyles[tag],
              )}
            >
              {TAG_LABELS[tag] ?? tag}
            </span>
          ))}
        </div>
      </div>

      <div className="border-t border-light-muted/50 p-3 sm:p-4">
        <Link href={`/product/${product.slug}`}>
          <h3 className="line-clamp-1 text-sm font-medium text-dark sm:text-base">
            {product.name}
          </h3>
          <p className="mt-1 hidden line-clamp-2 text-xs text-dark/60 sm:block sm:text-sm">
            {product.description}
          </p>
        </Link>
        <div className="mt-2 flex items-center justify-between gap-1.5 sm:mt-3 sm:gap-2">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gold-dark sm:text-base">
              {formatPrice(product.price)}
            </p>
            {product.originalPrice && (
              <p className="text-[10px] text-dark/40 line-through sm:text-xs">
                {formatPrice(product.originalPrice)}
              </p>
            )}
          </div>
          <div className="flex shrink-0 gap-1 sm:gap-1.5">
            <button
              type="button"
              aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
              onClick={() =>
                wished
                  ? removeFromWishlist(product.id)
                  : addToWishlist(product)
              }
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full transition",
                wished
                  ? "bg-gold/20 text-gold-dark"
                  : "bg-light text-dark/60 hover:bg-gold/10 hover:text-gold-dark",
              )}
            >
              <Heart className={cn("h-4 w-4", wished && "fill-current")} />
            </button>
            <button
              type="button"
              aria-label={product.stock < 1 ? "Out of stock" : "Add to cart"}
              disabled={product.stock < 1}
              onClick={handleAddToCart}
              className={cn(
                "flex h-9 min-w-9 items-center justify-center gap-1.5 rounded-full px-3 text-xs font-semibold transition sm:min-w-0 sm:px-3.5 sm:text-sm disabled:cursor-not-allowed disabled:opacity-50",
                added
                  ? "bg-green-600 text-white"
                  : "bg-dark text-gold hover:bg-gold hover:text-dark",
              )}
            >
              <ShoppingCart className="h-4 w-4 shrink-0" />
              <span className="hidden sm:inline">
                {product.stock < 1 ? "Sold out" : added ? "Added!" : "Add"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
