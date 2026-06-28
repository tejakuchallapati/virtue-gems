"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useStore } from "@/context/StoreProvider";
import { formatPrice } from "@/lib/utils";
import { PRODUCT_IMAGE_FIT, PRODUCT_IMAGE_FRAME } from "@/lib/ui-classes";
import type { Product } from "@/types";

const tagStyles: Record<string, string> = {
  bestseller: "bg-gold text-dark",
  new: "bg-dark text-gold",
  trending: "bg-dark-soft text-light",
};

const tagLabels: Record<string, string> = {
  bestseller: "Best Seller",
  new: "New Arrival",
  trending: "Trending",
};

export function ProductCard({ product }: { product: Product }) {
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } =
    useStore();
  const wished = isInWishlist(product.id);
  const [added, setAdded] = useState(false);

  function handleAddToCart() {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <article className="group relative overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-light-muted/60 transition hover:shadow-md hover:ring-gold/35">
      <div className={`aspect-square ${PRODUCT_IMAGE_FRAME}`}>
        <Link href={`/product/${product.slug}`} className="block h-full w-full">
          <span className="relative block h-full w-full">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className={`${PRODUCT_IMAGE_FIT} group-hover:scale-[1.03]`}
            />
          </span>
        </Link>
        <div className="pointer-events-none absolute left-2 top-2 flex flex-wrap gap-1">
          {product.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide sm:text-xs ${tagStyles[tag]}`}
            >
              {tagLabels[tag] ?? tag}
            </span>
          ))}
        </div>

        <button
          type="button"
          aria-label="Add to cart"
          onClick={handleAddToCart}
          className={`absolute bottom-2 right-2 z-10 flex h-10 w-10 items-center justify-center rounded-full shadow-lg transition sm:bottom-3 sm:right-3 sm:h-11 sm:w-11 ${
            added
              ? "bg-green-600 text-white"
              : "bg-gold text-dark hover:bg-gold-light"
          }`}
        >
          <ShoppingCart className="h-5 w-5" />
        </button>
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
              className={`flex h-10 w-10 items-center justify-center rounded-full transition sm:h-9 sm:w-9 ${
                wished
                  ? "bg-gold/20 text-gold-dark"
                  : "bg-light text-dark/60 hover:bg-gold/10 hover:text-gold-dark"
              }`}
            >
              <Heart className={`h-4 w-4 ${wished ? "fill-current" : ""}`} />
            </button>
            <button
              type="button"
              aria-label="Add to cart"
              onClick={handleAddToCart}
              className={`flex h-10 min-w-10 items-center justify-center gap-1.5 rounded-full px-3 text-xs font-semibold transition sm:h-9 sm:min-w-0 sm:px-3.5 sm:py-2 sm:text-sm ${
                added
                  ? "bg-green-600 text-white"
                  : "bg-dark text-gold hover:bg-gold hover:text-dark"
              }`}
            >
              <ShoppingCart className="h-4 w-4 shrink-0" />
              <span className="hidden sm:inline">
                {added ? "Added!" : "Add"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
