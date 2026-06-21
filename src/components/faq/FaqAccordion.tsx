"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { FAQ_CATEGORIES, FAQ_ITEMS, type FaqItem } from "@/data/faq";

const categoryOrder: FaqItem["category"][] = [
  "orders",
  "delivery",
  "products",
  "rewards",
  "returns",
];

export function FaqAccordion() {
  const [openId, setOpenId] = useState<string | null>(FAQ_ITEMS[0]?.id ?? null);
  const [activeCategory, setActiveCategory] = useState<FaqItem["category"] | "all">(
    "all",
  );

  const filtered =
    activeCategory === "all"
      ? FAQ_ITEMS
      : FAQ_ITEMS.filter((item) => item.category === activeCategory);

  return (
    <div>
      <div className="mb-6 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        <button
          type="button"
          onClick={() => setActiveCategory("all")}
          className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
            activeCategory === "all"
              ? "bg-gold text-dark"
              : "bg-white text-dark/70 ring-1 ring-light-muted hover:ring-gold/40"
          }`}
        >
          All
        </button>
        {categoryOrder.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
              activeCategory === cat
                ? "bg-gold text-dark"
                : "bg-white text-dark/70 ring-1 ring-light-muted hover:ring-gold/40"
            }`}
          >
            {FAQ_CATEGORIES[cat]}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((item) => {
          const isOpen = openId === item.id;
          return (
            <div
              key={item.id}
              className="overflow-hidden rounded-2xl bg-white ring-1 ring-light-muted/60"
            >
              <button
                type="button"
                id={`faq-${item.id}`}
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${item.id}`}
                onClick={() => setOpenId(isOpen ? null : item.id)}
                className="flex min-h-12 w-full items-start justify-between gap-3 px-4 py-4 text-left sm:px-5"
              >
                <span className="text-sm font-medium text-dark sm:text-base">
                  {item.question}
                </span>
                <ChevronDown
                  className={`mt-0.5 h-5 w-5 shrink-0 text-gold transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {isOpen && (
                <div
                  id={`faq-panel-${item.id}`}
                  role="region"
                  aria-labelledby={`faq-${item.id}`}
                  className="border-t border-light-muted/60 px-4 pb-4 pt-3 sm:px-5"
                >
                  <p className="text-sm leading-relaxed text-dark/70">{item.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
