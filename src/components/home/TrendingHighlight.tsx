import Image from "next/image";
import Link from "next/link";
import { Gift, Sparkles } from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { formatPrice } from "@/lib/utils";
import { PRODUCT_IMAGE_FIT, PRODUCT_IMAGE_FRAME } from "@/lib/ui-classes";
import type { Product } from "@/types";

const tagLabels: Record<string, string> = {
  bestseller: "Best Seller",
  new: "New Arrival",
  trending: "Trending",
};

function HighlightCard({ product }: { product: Product }) {
  const primaryTag = product.tags[0];

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-[#1a0a2e] ring-1 ring-gold/25 transition hover:ring-gold/50 md:flex-row"
    >
      <div className={`aspect-square w-full shrink-0 md:aspect-auto md:h-56 md:w-56 ${PRODUCT_IMAGE_FRAME}`}>
        <span className="relative block h-full w-full">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 224px"
            className={`${PRODUCT_IMAGE_FIT} group-hover:scale-[1.04]`}
          />
        </span>
      </div>
      <div className="flex flex-1 flex-col justify-center p-4 md:p-6">
        {primaryTag && (
          <span className="mb-2 w-fit rounded-full bg-gold/15 px-3 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-gold md:text-xs">
            {tagLabels[primaryTag] ?? primaryTag}
          </span>
        )}
        <h3 className="text-sm font-semibold text-light md:text-lg">{product.name}</h3>
        <p className="mt-1 line-clamp-2 text-xs text-light/55 md:text-sm">
          {product.description}
        </p>
        <p className="mt-3 text-lg font-bold text-gold md:text-xl">
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
  const picks = [trending, bestseller].filter(Boolean) as Product[];
  if (picks.length === 0) return null;

  return (
    <section
      id="collections"
      className="relative overflow-hidden bg-gradient-to-b from-[#faf6ee] via-[#f3ead8] to-[#ebe0c8] py-10 sm:py-14"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent"
        aria-hidden
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <ScrollReveal className="text-center">
          <p className="text-sm tracking-[0.2em] text-gold-dark uppercase">Limited Stock</p>
          <h2 className="mt-2 text-2xl font-semibold text-dark sm:text-3xl">
            Trending &amp; Best Sellers
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.1} className="mt-6">
          <div className="flex items-start gap-3 rounded-2xl border border-gold/30 bg-white/80 p-4 shadow-sm backdrop-blur-sm md:items-center md:gap-4 md:p-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold-dark md:h-12 md:w-12">
              <Gift className="h-5 w-5 md:h-6 md:w-6" />
            </div>
            <p className="text-left text-sm leading-relaxed text-dark/75 md:text-base">
              <span className="font-medium text-gold-dark">Items are very limited</span> — book
              your order soon and get a special discount, beautifully{" "}
              <span className="font-medium text-dark">letter-packed</span> for gifting.
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-8 grid gap-4 md:grid-cols-2 md:gap-6">
          {picks.map((product, i) => (
            <ScrollReveal key={product.id} delay={i * 0.1}>
              <HighlightCard product={product} />
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.2} className="mt-8 hidden text-center md:block">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 rounded-full border border-gold/50 bg-white/60 px-6 py-2.5 text-sm font-medium text-gold-dark transition hover:bg-gold hover:text-dark"
          >
            <Sparkles className="h-4 w-4" />
            View Full Collection
          </Link>
        </ScrollReveal>
      </div>
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent"
        aria-hidden
      />
    </section>
  );
}
