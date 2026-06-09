"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { useStore } from "@/context/StoreProvider";
import { formatPrice } from "@/lib/utils";
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

  return (
    <motion.article
      layout
      className="group relative overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-light-muted/60 transition hover:shadow-lg hover:ring-gold/30"
    >
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-light">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
          <div className="absolute left-2 top-2 flex flex-wrap gap-1">
            {product.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide sm:text-xs ${tagStyles[tag]}`}
              >
                {tagLabels[tag]}
              </span>
            ))}
          </div>
        </div>
      </Link>

      <div className="p-3 sm:p-4">
        <Link href={`/product/${product.slug}`}>
          <h3 className="line-clamp-1 text-sm font-medium text-dark sm:text-base">
            {product.name}
          </h3>
          <p className="mt-1 line-clamp-2 text-xs text-dark/60 sm:text-sm">
            {product.description}
          </p>
        </Link>
        <div className="mt-3 flex items-center justify-between gap-2">
          <div>
            <p className="text-sm font-semibold text-gold-dark sm:text-base">
              {formatPrice(product.price)}
            </p>
            {product.originalPrice && (
              <p className="text-xs text-dark/40 line-through">
                {formatPrice(product.originalPrice)}
              </p>
            )}
          </div>
          <div className="flex gap-1.5">
            <button
              type="button"
              aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
              onClick={() =>
                wished
                  ? removeFromWishlist(product.id)
                  : addToWishlist(product)
              }
              className={`flex h-9 w-9 items-center justify-center rounded-full transition ${
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
              onClick={() => addToCart(product)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-dark text-gold transition hover:bg-gold hover:text-dark"
            >
              <ShoppingBag className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
