import Image from "next/image";
import Link from "next/link";
import { Gift, Sparkles } from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { TAG_LABELS } from "@/lib/product-constants";
import { formatPrice, cn } from "@/lib/utils";
import {
  PAGE_CONTAINER,
  PRODUCT_IMAGE_BG,
  PRODUCT_IMAGE_FIT,
  PRODUCT_IMAGE_FRAME,
  SECTION_DIVIDER,
} from "@/lib/ui-classes";
import {
  PRODUCT_HIGHLIGHT_SIZES,
  PRODUCT_IMAGE_QUALITY,
} from "@/lib/product-images";
import type { Product } from "@/types";

function HighlightCard({ product }: { product: Product }) {
  const primaryTag = product.tags[0];

  return (
    <Link
      href={`/product/${product.slug}`}
      className={cn(
        "group flex h-full min-h-[15rem] min-w-0 items-stretch overflow-hidden rounded-2xl ring-1 ring-gold/30 transition hover:ring-gold/55 sm:min-h-[16.5rem] lg:min-h-[18rem]",
        PRODUCT_IMAGE_BG,
      )}
    >
      <div
        className={cn(
          PRODUCT_IMAGE_FRAME,
          "h-auto w-[46%] max-w-[14rem] shrink-0 self-stretch sm:max-w-[16rem] lg:max-w-[18rem]",
        )}
      >
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          quality={PRODUCT_IMAGE_QUALITY}
          sizes={PRODUCT_HIGHLIGHT_SIZES}
          className={cn(PRODUCT_IMAGE_FIT, "group-hover:scale-[1.03]")}
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-center px-4 py-4 sm:px-5 sm:py-5">
        {primaryTag && (
          <span className="mb-2 w-fit rounded-full bg-gold/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-gold">
            {TAG_LABELS[primaryTag] ?? primaryTag}
          </span>
        )}
        <h3 className="line-clamp-2 text-lg font-semibold leading-snug text-light sm:text-xl">
          {product.name}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-light/55 sm:text-base">
          {product.description}
        </p>
        <p className="mt-4 text-2xl font-bold text-gold">
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  );
}

export function TrendingHighlight({
  trending,
  bestseller,
}: {
  trending: Product | undefined;
  bestseller: Product | undefined;
}) {
  const picks: Product[] = [];
  if (trending) picks.push(trending);
  if (bestseller && bestseller.id !== trending?.id) picks.push(bestseller);
  if (picks.length === 0) return null;

  return (
    <section
      id="collections"
      className="relative overflow-hidden bg-gradient-to-b from-[#faf6ee] via-[#f3ead8] to-[#ebe0c8] py-8 sm:py-10"
    >
      <div className={cn(SECTION_DIVIDER, "absolute inset-x-0 top-0")} aria-hidden />
      <div className={PAGE_CONTAINER}>
        <ScrollReveal className="text-center">
          <p className="text-xs tracking-[0.14em] text-gold-dark uppercase sm:text-sm sm:tracking-[0.2em]">
            Limited Stock
          </p>
          <h2 className="mt-1.5 text-xl font-semibold text-dark sm:text-2xl">
            Trending &amp; Best Sellers
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.1} className="mt-5">
          <div className="flex items-start gap-3 rounded-xl border border-gold/30 bg-white/80 px-3.5 py-3 shadow-sm backdrop-blur-sm md:items-center md:px-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold-dark">
              <Gift className="h-4 w-4" />
            </div>
            <p className="text-left text-xs leading-relaxed text-dark/75 sm:text-sm">
              <span className="font-medium text-gold-dark">Items are very limited</span> — book
              your order soon and get a special discount, beautifully{" "}
              <span className="font-medium text-dark">letter-packed</span> for gifting.
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-5 grid grid-cols-1 items-stretch gap-4 md:grid-cols-2 md:gap-5">
          {picks.map((product, i) => (
            <ScrollReveal key={product.id} delay={i * 0.08} className="h-full">
              <HighlightCard product={product} />
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.12} className="mt-6 text-center">
          <Link
            href="/shop"
            className="inline-flex min-h-10 items-center gap-2 rounded-full border border-gold/50 bg-white/60 px-5 py-2 text-sm font-medium text-gold-dark transition hover:bg-gold hover:text-dark"
          >
            <Sparkles className="h-4 w-4" />
            View Full Collection
          </Link>
        </ScrollReveal>
      </div>
      <div className={cn(SECTION_DIVIDER, "absolute inset-x-0 bottom-0")} aria-hidden />
    </section>
  );
}
