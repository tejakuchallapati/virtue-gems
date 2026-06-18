"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Gift,
  MessageCircle,
  Search,
  SlidersHorizontal,
  Sparkles,
  Truck,
  X,
} from "lucide-react";
import { ProductCard } from "@/components/ui/ProductCard";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { filterProducts, getCategories } from "@/lib/products";
import { DELIVERY_REGION_LABEL, DELIVERY_SHORT } from "@/lib/delivery";
import { whatsAppContactUrl } from "@/lib/whatsapp";
import type { Product, ProductCategory } from "@/types";

const tags = [
  { value: "", label: "All" },
  { value: "bestseller", label: "Best Seller" },
  { value: "new", label: "New Arrival" },
  { value: "trending", label: "Trending" },
];

const priceRanges = [
  { label: "All Prices", min: 0, max: Infinity },
  { label: "₹500 – ₹999", min: 500, max: 999 },
  { label: "₹1,000 – ₹1,499", min: 1000, max: 1499 },
  { label: "₹1,500 – ₹2,000", min: 1500, max: 2000 },
];

const trustItems = [
  { icon: Truck, text: `Free delivery · ${DELIVERY_SHORT}` },
  { icon: MessageCircle, text: "Order easily via WhatsApp" },
  { icon: Gift, text: "Earn rewards on every purchase" },
];

function CategoryFilters({
  category,
  categories,
  onSelect,
  variant = "hero",
}: {
  category: string;
  categories: ReturnType<typeof getCategories>;
  onSelect: (value: string) => void;
  variant?: "hero" | "panel";
}) {
  const isHero = variant === "hero";

  return (
    <div
      className={
        isHero
          ? "flex gap-2 overflow-x-auto pb-1 no-scrollbar"
          : "flex flex-wrap gap-2"
      }
    >
      <button
        type="button"
        onClick={() => onSelect("")}
        className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
          !category
            ? isHero
              ? "bg-gold text-dark shadow-[0_0_20px_rgba(212,175,55,0.35)]"
              : "bg-gold/15 font-medium text-gold-dark"
            : isHero
              ? "border border-white/15 bg-white/5 text-light/75 hover:border-gold/40 hover:text-gold"
              : "bg-light text-dark/70 hover:bg-gold/10"
        }`}
      >
        All
      </button>
      {categories.map((c) => (
        <button
          key={c.value}
          type="button"
          onClick={() => onSelect(c.value)}
          className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
            category === c.value
              ? isHero
                ? "bg-gold text-dark shadow-[0_0_20px_rgba(212,175,55,0.35)]"
                : "bg-gold/15 font-medium text-gold-dark"
              : isHero
                ? "border border-white/15 bg-white/5 text-light/75 hover:border-gold/40 hover:text-gold"
                : "bg-light text-dark/70 hover:bg-gold/10"
          }`}
        >
          {c.label}
          <span className="ml-1.5 text-[11px] opacity-70">({c.count})</span>
        </button>
      ))}
    </div>
  );
}

export function ShopClient({ products }: { products: Product[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
  const [priceIdx, setPriceIdx] = useState(0);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const category = (searchParams.get("category") ?? "") as ProductCategory | "";
  const tag = searchParams.get("tag") ?? "";

  const categories = getCategories();
  const range = priceRanges[priceIdx];
  const activeCategory = categories.find((c) => c.value === category);
  const activeTag = tags.find((t) => t.value === tag);

  const filtered = useMemo(
    () =>
      filterProducts({
        search,
        category: category || undefined,
        tag: tag || undefined,
        minPrice: range.min,
        maxPrice: range.max === Infinity ? undefined : range.max,
      }),
    [search, category, tag, range, products],
  );

  function updateQuery(key: "category" | "tag", value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  const hasActiveFilters =
    Boolean(category) || Boolean(tag) || priceIdx > 0 || search.length > 0;

  function clearAllFilters() {
    setSearch("");
    setPriceIdx(0);
    router.push(pathname, { scroll: false });
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#faf6ee] via-light to-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1a0a2e] via-[#2d1450] to-[#1a0a2e] px-4 pb-8 pt-6 sm:px-6 sm:pb-10 sm:pt-8 lg:px-8">
        <div
          className="pointer-events-none absolute -right-20 top-0 h-56 w-56 rounded-full bg-gold/10 blur-3xl"
          aria-hidden
        />
        <div className="relative mx-auto max-w-7xl">
          <Breadcrumb
            className="mb-0 text-light/55 [&_a:hover]:text-gold [&_span]:text-light/80"
            items={[
                { label: "Home", href: "/" },
                { label: "Shop", href: "/shop" },
                ...(activeCategory ? [{ label: activeCategory.label }] : []),
              ]}
            />

          <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs tracking-[0.25em] text-gold uppercase">
                Virtue Gems
              </p>
              <h1 className="mt-1 text-2xl font-semibold text-light sm:text-4xl">
                {activeCategory ? activeCategory.label : "Shop Collections"}
              </h1>
              <p className="mt-2 max-w-xl text-sm text-light/65">
                Handpicked jewellery under ₹2,000 — crafted for everyday elegance
                and festive gifting in {DELIVERY_REGION_LABEL}.
              </p>
            </div>
            <div className="rounded-2xl border border-gold/25 bg-white/5 px-4 py-3 text-right backdrop-blur-sm">
              <p className="text-2xl font-bold text-gold">{filtered.length}</p>
              <p className="text-[10px] tracking-wider text-light/50 uppercase">
                Pieces available
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="mt-6 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-dark/40" />
              <input
                type="search"
                placeholder="Search necklaces, rings, earrings..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white py-3.5 pl-11 pr-4 text-sm text-dark shadow-lg outline-none focus:border-gold focus:ring-2 focus:ring-gold/25"
              />
            </div>
            <button
              type="button"
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="flex items-center gap-2 rounded-2xl border border-gold/30 bg-gold/10 px-4 py-3.5 text-sm font-medium text-gold backdrop-blur-sm lg:hidden"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </button>
          </div>

          {/* Category chips */}
          <div className="mt-5">
            <CategoryFilters
              category={category}
              categories={categories}
              onSelect={(value) => updateQuery("category", value)}
            />
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <div className="border-b border-gold/15 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl gap-4 overflow-x-auto px-4 py-3 no-scrollbar sm:justify-center sm:gap-8 sm:px-6 lg:px-8">
          {trustItems.map(({ icon: Icon, text }) => (
            <div
              key={text}
              className="flex shrink-0 items-center gap-2 text-xs text-dark/65 sm:text-sm"
            >
              <Icon className="h-4 w-4 text-gold" />
              {text}
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        {/* Active filters */}
        {hasActiveFilters && (
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-wider text-dark/45">
              Active filters
            </span>
            {activeCategory && (
              <span className="rounded-full bg-gold/15 px-3 py-1 text-xs font-medium text-gold-dark">
                {activeCategory.label}
              </span>
            )}
            {activeTag && activeTag.value && (
              <span className="rounded-full bg-gold/15 px-3 py-1 text-xs font-medium text-gold-dark">
                {activeTag.label}
              </span>
            )}
            {priceIdx > 0 && (
              <span className="rounded-full bg-gold/15 px-3 py-1 text-xs font-medium text-gold-dark">
                {priceRanges[priceIdx].label}
              </span>
            )}
            {search && (
              <span className="rounded-full bg-gold/15 px-3 py-1 text-xs font-medium text-gold-dark">
                &ldquo;{search}&rdquo;
              </span>
            )}
            <button
              type="button"
              onClick={clearAllFilters}
              className="text-xs font-medium text-gold-dark underline-offset-2 hover:underline"
            >
              Clear all
            </button>
          </div>
        )}

        <div className="flex gap-8">
          {/* Sidebar */}
          <aside
            className={`${
              filtersOpen
                ? "safe-top safe-bottom fixed inset-0 z-50 flex flex-col bg-white p-4 pt-14 pb-6"
                : "hidden"
            } w-full lg:static lg:block lg:w-60 lg:shrink-0 lg:bg-transparent lg:p-0`}
          >
            {filtersOpen && (
              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                className="absolute right-4 top-4 lg:hidden"
                aria-label="Close filters"
              >
                <X className="h-6 w-6" />
              </button>
            )}

            <div className="space-y-5 overflow-y-auto lg:sticky lg:top-24">
              <div className="hidden rounded-2xl bg-gradient-to-br from-[#1a0a2e] to-[#2d1450] p-5 text-light lg:block">
                <Sparkles className="h-5 w-5 text-gold" />
                <p className="mt-2 text-sm font-semibold">Need help choosing?</p>
                <p className="mt-1 text-xs text-light/60">
                  Message us on WhatsApp for sizing, availability, or gifting advice.
                </p>
                <a
                  href={whatsAppContactUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex text-xs font-semibold text-gold hover:underline"
                >
                  Chat with us →
                </a>
              </div>

              <div className="rounded-2xl bg-white p-5 ring-1 ring-light-muted/60 lg:shadow-sm">
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-dark/50">
                  Category
                </h3>
                <div className="flex flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => updateQuery("category", "")}
                    className={`rounded-xl px-3 py-2 text-left text-sm transition ${
                      !category
                        ? "bg-gold/15 font-medium text-gold-dark"
                        : "text-dark/70 hover:bg-light"
                    }`}
                  >
                    All Collections
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => updateQuery("category", c.value)}
                      className={`rounded-xl px-3 py-2 text-left text-sm transition ${
                        category === c.value
                          ? "bg-gold/15 font-medium text-gold-dark"
                          : "text-dark/70 hover:bg-light"
                      }`}
                    >
                      {c.label}{" "}
                      <span className="text-dark/40">({c.count})</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl bg-white p-5 ring-1 ring-light-muted/60 lg:shadow-sm">
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-dark/50">
                  Collection
                </h3>
                <div className="flex flex-col gap-1">
                  {tags.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => updateQuery("tag", t.value)}
                      className={`rounded-xl px-3 py-2 text-left text-sm transition ${
                        tag === t.value
                          ? "bg-gold/15 font-medium text-gold-dark"
                          : "text-dark/70 hover:bg-light"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl bg-white p-5 ring-1 ring-light-muted/60 lg:shadow-sm">
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-dark/50">
                  Price
                </h3>
                <div className="flex flex-col gap-1">
                  {priceRanges.map((r, i) => (
                    <button
                      key={r.label}
                      type="button"
                      onClick={() => setPriceIdx(i)}
                      className={`rounded-xl px-3 py-2 text-left text-sm transition ${
                        priceIdx === i
                          ? "bg-gold/15 font-medium text-gold-dark"
                          : "text-dark/70 hover:bg-light"
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {filtersOpen && (
              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                className="mt-4 w-full rounded-xl bg-gold py-3 text-sm font-semibold text-dark lg:hidden"
              >
                Show {filtered.length} results
              </button>
            )}
          </aside>

          {/* Product grid */}
          <div className="min-w-0 flex-1">
            <div className="mb-5 flex items-center justify-between">
              <p className="text-sm text-dark/55">
                Showing{" "}
                <span className="font-semibold text-dark">{filtered.length}</span>{" "}
                {filtered.length === 1 ? "piece" : "pieces"}
              </p>
            </div>

            {filtered.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-gold/30 bg-white/80 px-6 py-16 text-center">
                <Sparkles className="mx-auto h-10 w-10 text-gold/50" />
                <p className="mt-4 text-lg font-medium text-dark">
                  No pieces match your filters
                </p>
                <p className="mt-2 text-sm text-dark/55">
                  Try a different category or clear your filters to explore the full
                  collection.
                </p>
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="mt-6 rounded-full bg-dark px-6 py-2.5 text-sm font-semibold text-gold transition hover:bg-gold hover:text-dark"
                >
                  View all jewellery
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
                {filtered.map((p, i) => (
                  <ScrollReveal key={p.id} delay={Math.min(i * 0.04, 0.4)}>
                    <ProductCard product={p} />
                  </ScrollReveal>
                ))}
              </div>
            )}

            {filtered.length > 0 && (
              <div className="mt-12 rounded-2xl bg-gradient-to-r from-[#1a0a2e] to-[#2d1450] p-6 text-center sm:p-8">
                <p className="text-sm text-light/70">
                  Earn loyalty points on every order
                </p>
                <Link
                  href="/rewards"
                  className="mt-3 inline-flex items-center gap-2 rounded-full bg-gold px-6 py-2.5 text-sm font-semibold text-dark transition hover:bg-gold-light"
                >
                  <Gift className="h-4 w-4" />
                  Explore Rewards
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
