"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { ProductCard } from "@/components/ui/ProductCard";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { filterProducts, getCategories } from "@/lib/products";
import type { Product } from "@/types";

const tags = [
  { value: "", label: "All" },
  { value: "bestseller", label: "Best Seller" },
  { value: "new", label: "New Arrival" },
  { value: "trending", label: "Trending" },
];

const priceRanges = [
  { label: "All Prices", min: 0, max: Infinity },
  { label: "Under ₹30,000", min: 0, max: 30000 },
  { label: "₹30,000 – ₹70,000", min: 30000, max: 70000 },
  { label: "Above ₹70,000", min: 70000, max: Infinity },
];

export function ShopClient({ products }: { products: Product[] }) {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(searchParams.get("category") ?? "");
  const [tag, setTag] = useState(searchParams.get("tag") ?? "");
  const [priceIdx, setPriceIdx] = useState(0);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const categories = getCategories();
  const range = priceRanges[priceIdx];

  const filtered = useMemo(
    () =>
      filterProducts({
        search,
        category: category || undefined,
        tag: tag || undefined,
        minPrice: range.min,
        maxPrice: range.max === Infinity ? undefined : range.max,
      }),
    [search, category, tag, range],
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Shop" }]} />

      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl font-semibold text-dark sm:text-3xl">Collections</h1>
        <p className="mt-1 text-sm text-dark/60">
          {filtered.length} piece{filtered.length !== 1 ? "s" : ""} found
        </p>
      </div>

      {/* Search + filter toggle */}
      <div className="mb-6 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-dark/40" />
          <input
            type="search"
            placeholder="Search jewellery..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-light-muted bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
          />
        </div>
        <button
          type="button"
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="flex items-center gap-2 rounded-xl border border-light-muted bg-white px-4 py-3 text-sm font-medium text-dark lg:hidden"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </button>
      </div>

      <div className="flex gap-8">
        {/* Sidebar filters — desktop always, mobile toggle */}
        <aside
          className={`${
            filtersOpen ? "fixed inset-0 z-50 flex flex-col bg-white p-4 pt-16" : "hidden"
          } w-full lg:static lg:block lg:w-56 lg:shrink-0 lg:bg-transparent lg:p-0`}
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

          <div className="space-y-6 overflow-y-auto">
            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-dark/50">
                Category
              </h3>
              <div className="flex flex-wrap gap-2 lg:flex-col lg:gap-1">
                <button
                  type="button"
                  onClick={() => setCategory("")}
                  className={`rounded-lg px-3 py-1.5 text-sm transition ${
                    !category ? "bg-gold/15 text-gold-dark font-medium" : "text-dark/70 hover:bg-light"
                  }`}
                >
                  All
                </button>
                {categories.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setCategory(c.value)}
                    className={`rounded-lg px-3 py-1.5 text-sm transition ${
                      category === c.value
                        ? "bg-gold/15 text-gold-dark font-medium"
                        : "text-dark/70 hover:bg-light"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-dark/50">
                Tags
              </h3>
              <div className="flex flex-wrap gap-2 lg:flex-col lg:gap-1">
                {tags.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setTag(t.value)}
                    className={`rounded-lg px-3 py-1.5 text-sm transition ${
                      tag === t.value
                        ? "bg-gold/15 text-gold-dark font-medium"
                        : "text-dark/70 hover:bg-light"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-dark/50">
                Price
              </h3>
              <div className="flex flex-col gap-1">
                {priceRanges.map((r, i) => (
                  <button
                    key={r.label}
                    type="button"
                    onClick={() => setPriceIdx(i)}
                    className={`rounded-lg px-3 py-1.5 text-left text-sm transition ${
                      priceIdx === i
                        ? "bg-gold/15 text-gold-dark font-medium"
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
        <div className="flex-1">
          {filtered.length === 0 ? (
            <p className="py-16 text-center text-dark/50">
              No products match your filters.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
              {filtered.map((p, i) => (
                <ScrollReveal key={p.id} delay={i * 0.05}>
                  <ProductCard product={p} />
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
