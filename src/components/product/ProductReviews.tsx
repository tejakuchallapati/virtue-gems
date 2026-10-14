"use client";

import { useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { PenLine, Star } from "lucide-react";
import { ReviewForm } from "@/components/reviews/ReviewForm";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { productRatingSummary } from "@/lib/reviews-shared";
import { cn, formatDate } from "@/lib/utils";
import type { StoreReview } from "@/types";

const subscribeToNothing = () => () => {};

function Stars({ rating, className }: { rating: number; className?: string }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(className, i < Math.round(rating) ? "fill-gold text-gold" : "text-dark/20")}
        />
      ))}
    </div>
  );
}

export function ProductReviews({
  product,
  reviews,
}: {
  product: { id: string; name: string };
  reviews: StoreReview[];
}) {
  const linkAsksForReview = useSyncExternalStore(
    subscribeToNothing,
    () => new URLSearchParams(window.location.search).has("review"),
    () => false,
  );
  const [formState, setFormState] = useState<"auto" | "open" | "closed">("auto");
  const formOpen = formState === "open" || (formState === "auto" && linkAsksForReview);
  const summary = productRatingSummary(reviews);

  return (
    <ScrollReveal className="mt-12 sm:mt-16">
      <section id="reviews" aria-labelledby="product-reviews-title">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 id="product-reviews-title" className="text-xl font-semibold text-dark">
              Customer Reviews
            </h2>
            {summary.count > 0 ? (
              <div className="mt-2 flex items-center gap-2">
                <Stars rating={summary.average} className="h-4 w-4" />
                <span className="text-sm text-dark/60">
                  {summary.average} out of 5 · {summary.count}{" "}
                  {summary.count === 1 ? "review" : "reviews"}
                </span>
              </div>
            ) : (
              <p className="mt-1 text-sm text-dark/60">
                Bought this piece? Share a photo and a few words for other shoppers.
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => setFormState("open")}
            className="inline-flex min-h-11 touch-manipulation items-center justify-center gap-2 rounded-full bg-dark px-5 text-sm font-semibold text-gold transition hover:bg-gold hover:text-dark"
          >
            <PenLine className="h-4 w-4" />
            Write a review
          </button>
        </div>

        {reviews.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2">
            {reviews.map((review) => (
              <article
                key={review.id}
                className="rounded-2xl bg-white p-5 ring-1 ring-light-muted/60"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-medium capitalize text-dark">
                    {review.authorName}
                    {review.city && (
                      <span className="font-normal text-dark/50">, {review.city}</span>
                    )}
                  </p>
                  <Stars rating={review.rating} className="h-3.5 w-3.5" />
                </div>
                <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-dark/75">
                  {review.comment}
                </p>
                {review.photos.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {review.photos.map((src, i) => (
                      <a
                        key={src}
                        href={src}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative h-20 w-20 overflow-hidden rounded-xl ring-1 ring-gold/20"
                      >
                        <Image
                          src={src}
                          alt={`Photo ${i + 1} from ${review.authorName}'s review`}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </a>
                    ))}
                  </div>
                )}
                <p className="mt-3 text-xs text-dark/40">{formatDate(review.createdAt)}</p>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Portal: reveal wrappers are transformed, which would re-anchor a fixed modal */}
      {formOpen &&
        createPortal(
          <ReviewForm onClose={() => setFormState("closed")} product={product} />,
          document.body,
        )}
    </ScrollReveal>
  );
}
