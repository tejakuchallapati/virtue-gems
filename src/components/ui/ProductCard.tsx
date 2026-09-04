"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useStore } from "@/context/StoreProvider";
import { TAG_LABELS } from "@/lib/product-constants";
import { formatPrice, cn } from "@/lib/utils";
import { PRODUCT_IMAGE_FIT, PRODUCT_IMAGE_FRAME } from "@/lib/ui-classes";
import {
  PRODUCT_CARD_SIZES,
  PRODUCT_IMAGE_QUALITY,
} from "@/lib/product-images";
import { trackEvent } from "@/lib/analytics";
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
    trackEvent("add_to_cart", {
      currency: "INR",
      value: product.price,
      items: 1,
      item_id: product.id,
      item_name: product.name,
      item_category: product.category,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <article className="group relative min-w-0 w-full overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-light-muted/60 transition duration-300 hover:shadow-md hover:ring-gold/35">
      <div className={cn(PRODUCT_IMAGE_FRAME, "aspect-square")}>
        <Link
          href={`/product/${product.slug}`}
          className="relative block h-full w-full"
        >
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            quality={PRODUCT_IMAGE_QUALITY}
            sizes={PRODUCT_CARD_SIZES}
            className={cn(PRODUCT_IMAGE_FIT, "group-hover:scale-[1.02]")}
          />
        </Link>
        <div className="pointer-events-none absolute left-2 top-2 flex max-w-[70%] flex-wrap gap-1">
          {product.tags.slice(0, 1).map((tag) => (
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
        <button
          type="button"
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          onClick={() =>
            wished ? removeFromWishlist(product.id) : addToWishlist(product)
          }
          className={cn(
            "absolute right-2 top-2 flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-sm transition",
            wished
              ? "bg-gold/90 text-dark"
              : "bg-white/90 text-dark/60 hover:bg-gold/15 hover:text-gold-dark",
          )}
        >
          <Heart className={cn("h-4 w-4", wished && "fill-current")} />
        </button>
      </div>

      <div className="border-t border-light-muted/50 p-2.5 sm:p-4">
        <Link href={`/product/${product.slug}`}>
          <h3 className="line-clamp-2 text-[13px] font-medium leading-snug text-dark sm:line-clamp-1 sm:text-base">
            {product.name}
          </h3>
        </Link>
        <div className="mt-2 flex items-center gap-2">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-gold-dark sm:text-base">
              {formatPrice(product.price)}
            </p>
            {product.originalPrice && (
              <p className="text-[10px] text-dark/40 line-through sm:text-xs">
                {formatPrice(product.originalPrice)}
              </p>
            )}
          </div>
          <button
            type="button"
            aria-label={
              product.stock < 1
                ? `${product.name} is out of stock`
                : `Add ${product.name} to cart`
            }
            disabled={product.stock < 1}
            onClick={handleAddToCart}
            className={cn(
              "flex h-10 min-w-0 shrink-0 items-center justify-center gap-1 rounded-full px-3 text-xs font-semibold transition sm:h-11 sm:gap-1.5 sm:px-4 sm:text-sm disabled:cursor-not-allowed disabled:opacity-50",
              added
                ? "bg-green-600 text-white"
                : "bg-dark text-gold hover:bg-gold hover:text-dark",
            )}
          >
            <ShoppingCart className="h-4 w-4 shrink-0" />
            <span className="truncate max-[360px]:hidden">
              {product.stock < 1 ? "Sold" : added ? "Added" : "Add"}
            </span>
          </button>
        </div>
        <span className="sr-only" role="status" aria-live="polite">
          {added ? `${product.name} added to cart` : ""}
        </span>
      </div>
    </article>
  );
}
