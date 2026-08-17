"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  Heart,
  ShoppingCart,
  Share2,
  Star,
  Minus,
  Plus,
  ZoomIn,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/context/StoreProvider";
import { ProductCard } from "@/components/ui/ProductCard";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { SectionDivider } from "@/components/ui/PageSection";
import { formatPrice } from "@/lib/utils";
import { TAG_LABELS } from "@/lib/product-constants";
import { PRODUCT_IMAGE_FIT, PRODUCT_IMAGE_FRAME, PAGE_CONTENT_SHELL, PAGE_GRADIENT_SHELL, PRODUCT_GRID } from "@/lib/ui-classes";
import {
  PRODUCT_DETAIL_SIZES,
  PRODUCT_IMAGE_QUALITY,
} from "@/lib/product-images";
import { buildProductShareMessage, getWhatsAppUrl } from "@/lib/whatsapp";
import { VIRTUAL_TRY_ON_ENABLED } from "@/lib/features";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { trackEvent } from "@/lib/analytics";
import { ProductTryOnExtras } from "@/components/product/ProductTryOnExtras";
import type { Product } from "@/types";

export function ProductDetailClient({
  product,
  similar,
}: {
  product: Product;
  similar: Product[];
}) {
  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [zoom, setZoom] = useState(false);
  const [addedMessage, setAddedMessage] = useState("");
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist, addRecentlyViewed } =
    useStore();
  const wished = isInWishlist(product.id);

  useBodyScrollLock(zoom);

  useEffect(() => {
    addRecentlyViewed(product);
  }, [product, addRecentlyViewed]);

  useEffect(() => {
    trackEvent("view_item", {
      currency: "INR",
      value: product.price,
      item_id: product.id,
      item_name: product.name,
      item_category: product.category,
    });
  }, [product.id, product.name, product.category, product.price]);

  function trackAddToCart(quantity: number) {
    trackEvent("add_to_cart", {
      currency: "INR",
      value: product.price * quantity,
      quantity,
      item_id: product.id,
      item_name: product.name,
      item_category: product.category,
    });
  }

  function handleAddToCart() {
    const quantity = Math.min(qty, product.stock);
    if (quantity < 1) return;
    addToCart(product, quantity);
    trackAddToCart(quantity);
    setAddedMessage(`Added ${quantity} ${product.name} to cart`);
  }

  useEffect(() => {
    if (!addedMessage) return;
    const timer = window.setTimeout(() => setAddedMessage(""), 2500);
    return () => window.clearTimeout(timer);
  }, [addedMessage]);

  useEffect(() => {
    if (!zoom) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setZoom(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [zoom]);

  function handleShare() {
    const msg = buildProductShareMessage(product.name, product.slug);
    if (navigator.share) {
      void navigator.share({
        title: product.name,
        text: msg,
        url: window.location.href,
      }).catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        window.open(getWhatsAppUrl(msg), "_blank");
      });
      return;
    }
    window.open(getWhatsAppUrl(msg), "_blank");
  }

  return (
    <div className={PAGE_GRADIENT_SHELL}>
      <div className={`${PAGE_CONTENT_SHELL} pb-[calc(var(--mobile-nav-offset)+5.5rem)] lg:pb-10`}>
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/shop" },
          { label: product.name },
        ]}
      />

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Images */}
        <div>
          <button
            type="button"
            aria-label="Zoom product image"
            className={`relative aspect-square w-full cursor-zoom-in overflow-hidden rounded-2xl text-left ${PRODUCT_IMAGE_FRAME}`}
            onClick={() => setZoom(true)}
          >
            <Image
              src={product.images[activeImage]}
              alt={product.name}
              fill
              quality={PRODUCT_IMAGE_QUALITY}
              sizes={PRODUCT_DETAIL_SIZES}
              className={PRODUCT_IMAGE_FIT}
              priority
            />
            <div className="pointer-events-none absolute right-3 top-3 rounded-full bg-white/80 p-2">
              <ZoomIn className="h-4 w-4 text-dark" />
            </div>
          </button>
          <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar">
            {product.images.map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveImage(i)}
                aria-label={`View image ${i + 1} of ${product.images.length}`}
                aria-pressed={i === activeImage}
                className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg sm:h-20 sm:w-20 ${PRODUCT_IMAGE_FRAME} ring-2 transition ${
                  i === activeImage ? "ring-gold" : "ring-transparent"
                }`}
              >
                <Image
                  src={img}
                  alt=""
                  fill
                  quality={85}
                  sizes="80px"
                  className={PRODUCT_IMAGE_FIT}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <div className="flex flex-wrap gap-2">
            {product.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-gold/15 px-3 py-0.5 text-xs font-semibold uppercase text-gold-dark"
              >
                {TAG_LABELS[tag] ?? tag}
              </span>
            ))}
          </div>
          <h1 className="mt-3 text-2xl font-semibold text-dark sm:text-3xl">
            {product.name}
          </h1>
          <div className="mt-2 flex items-center gap-2">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.round(product.rating)
                      ? "fill-gold text-gold"
                      : "text-dark/20"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-dark/60">
              {product.rating} ({product.reviewCount} reviews)
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-3">
            <p className="text-2xl font-bold text-gold-dark sm:text-3xl">
              {formatPrice(product.price)}
            </p>
            {product.originalPrice && (
              <p className="text-lg text-dark/40 line-through">
                {formatPrice(product.originalPrice)}
              </p>
            )}
          </div>
          <p className="mt-4 text-sm leading-relaxed text-dark/70 sm:text-base">
            {product.longDescription}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="text-sm text-dark/60">Qty</span>
            <div className="flex shrink-0 items-center rounded-xl border border-light-muted">
              <button
                type="button"
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="flex h-11 w-11 items-center justify-center text-dark/60 hover:text-dark"
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-8 text-center text-sm font-medium">{qty}</span>
              <button
                type="button"
                onClick={() => setQty(Math.min(product.stock, qty + 1))}
                disabled={qty >= product.stock}
                className="flex h-11 w-11 items-center justify-center text-dark/60 hover:text-dark disabled:opacity-40"
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <span className="text-xs text-dark/50">
              {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
            </span>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              disabled={product.stock < 1}
              onClick={handleAddToCart}
              className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-dark py-3.5 text-sm font-semibold text-gold transition hover:bg-gold hover:text-dark disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ShoppingCart className="h-4 w-4" />
              {product.stock < 1 ? "Out of Stock" : "Add to Cart"}
            </button>
            <button
              type="button"
              aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
              onClick={() =>
                wished ? removeFromWishlist(product.id) : addToWishlist(product)
              }
              className={`flex items-center justify-center gap-2 rounded-xl border py-3.5 px-6 text-sm font-semibold transition ${
                wished
                  ? "border-gold bg-gold/10 text-gold-dark"
                  : "border-light-muted text-dark hover:border-gold"
              }`}
            >
              <Heart className={`h-4 w-4 ${wished ? "fill-current" : ""}`} />
            </button>
            <button
              type="button"
              aria-label="Share product"
              onClick={handleShare}
              className="flex items-center justify-center gap-2 rounded-xl border border-light-muted py-3.5 px-6 text-sm font-semibold text-dark hover:border-gold"
            >
              <Share2 className="h-4 w-4" />
            </button>
          </div>

          <p aria-live="polite" className="min-h-5 text-sm text-green-700">
            {addedMessage}
          </p>

          {VIRTUAL_TRY_ON_ENABLED && <ProductTryOnExtras product={product} />}

          {/* Specifications */}
          <div className="mt-8 rounded-2xl bg-white p-5 ring-1 ring-light-muted/60">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-dark">
              Specifications
            </h3>
            <dl className="space-y-2">
              {Object.entries(product.specifications).map(([key, val]) => (
                <div key={key} className="flex justify-between gap-3 text-sm">
                  <dt className="shrink-0 text-dark/60">{key}</dt>
                  <dd className="min-w-0 text-right font-medium break-words text-dark">{val}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Reviews */}
      {product.reviews.length > 0 && (
        <ScrollReveal className="mt-12 sm:mt-16">
          <h2 className="mb-6 text-xl font-semibold text-dark">Customer Reviews</h2>
          <div className="space-y-4">
            {product.reviews.map((r) => (
              <div
                key={r.id}
                className="rounded-2xl bg-white p-5 ring-1 ring-light-muted/60"
              >
                <div className="flex items-center justify-between">
                  <p className="font-medium text-dark">{r.author}</p>
                  <div className="flex">
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-gold text-gold" />
                    ))}
                  </div>
                </div>
                <p className="mt-2 text-sm text-dark/70">{r.comment}</p>
                <p className="mt-1 text-xs text-dark/40">{r.date}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      )}

      {/* Similar */}
      {similar.length > 0 && (
        <ScrollReveal className="mt-12 sm:mt-16">
          <h2 className="mb-6 text-xl font-semibold text-dark">Similar Pieces</h2>
          <div className={PRODUCT_GRID}>
            {similar.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </ScrollReveal>
      )}

      {/* Mobile sticky add-to-cart bar — sits above bottom nav; nav already has safe-area */}
      <div className="safe-x fixed bottom-[var(--mobile-nav-offset)] left-0 right-0 z-40 border-t border-gold/20 bg-white/95 px-4 py-3 shadow-[0_-4px_24px_rgba(15,23,42,0.08)] backdrop-blur-md lg:hidden">
        <div className="mx-auto flex max-w-lg items-center gap-3">
          <div className="min-w-0 shrink-0">
            <p className="text-base font-bold text-gold-dark">
              {formatPrice(product.price)}
            </p>
            {product.originalPrice && (
              <p className="text-[10px] text-dark/40 line-through">
                {formatPrice(product.originalPrice)}
              </p>
            )}
          </div>
          <button
            type="button"
            disabled={product.stock < 1}
            onClick={handleAddToCart}
            className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-dark text-sm font-semibold text-gold disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ShoppingCart className="h-4 w-4" />
            {product.stock < 1 ? "Out of Stock" : "Add to Cart"}
          </button>
          <button
            type="button"
            aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
            onClick={() =>
              wished ? removeFromWishlist(product.id) : addToWishlist(product)
            }
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${
              wished
                ? "border-gold bg-gold/10 text-gold-dark"
                : "border-light-muted text-dark"
            }`}
          >
            <Heart className={`h-4 w-4 ${wished ? "fill-current" : ""}`} />
          </button>
        </div>
      </div>

      {/* Zoom modal */}
      <AnimatePresence>
        {zoom && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="safe-x safe-top safe-bottom fixed inset-0 z-[70] flex items-center justify-center bg-dark/90 p-4"
            onClick={() => setZoom(false)}
            role="dialog"
            aria-modal="true"
            aria-label="Zoomed product image"
          >
            <button
              type="button"
              onClick={() => setZoom(false)}
              className="absolute right-4 top-[calc(1rem+env(safe-area-inset-top))] z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-light backdrop-blur-sm"
              aria-label="Close zoom"
            >
              <span className="text-xl leading-none">×</span>
            </button>
            <div className="relative h-full max-h-[80vh] w-full max-w-3xl">
              <Image
                src={product.images[activeImage]}
                alt={product.name}
                fill
                quality={PRODUCT_IMAGE_QUALITY}
                className="object-contain"
                sizes="100vw"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
      <SectionDivider />
    </div>
  );
}
