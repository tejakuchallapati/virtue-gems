"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ExternalLink, PenLine, Star, Quote } from "lucide-react";
import { ReviewForm } from "@/components/reviews/ReviewForm";
import { googleReviewUrl } from "@/lib/reviews-shared";
import { cn } from "@/lib/utils";
import { PRODUCT_IMAGE_BG } from "@/lib/ui-classes";
import type { StoreReview } from "@/types";

type DisplayReview = {
  key: string;
  author: string;
  city?: string;
  text: string;
  rating: number;
  photos: string[];
};

const showcaseReviews: DisplayReview[] = [
  {
    key: "showcase-priya",
    author: "Priya Sharma",
    text: "Virtue Gems delivered beyond expectations. The necklace is gorgeous — exquisite detailing and premium packaging.",
    rating: 5,
    photos: ["/reviews/customer-3.jpg"],
  },
  {
    key: "showcase-rahul",
    author: "Rahul Verma",
    text: "Bought a set for my wife's anniversary. The quality is outstanding and WhatsApp ordering was so easy.",
    rating: 5,
    photos: ["/reviews/customer-7.jpg"],
  },
  {
    key: "showcase-anjali",
    author: "Anjali Reddy",
    text: "Mobile shopping was seamless. The earrings are even more beautiful in person — great value!",
    rating: 5,
    photos: ["/reviews/customer-11.jpg"],
  },
  {
    key: "showcase-karthik",
    author: "Karthik Nair",
    text: "Beautiful traditional designs at fair prices. Virtue Gems is now my go-to for festive jewellery.",
    rating: 5,
    photos: ["/reviews/customer-15.jpg"],
  },
];

function toDisplay(review: StoreReview): DisplayReview {
  return {
    key: review.id,
    author: review.authorName,
    city: review.city,
    text: review.comment,
    rating: review.rating,
    photos: review.photos,
  };
}

export function CustomerReviews({ reviews = [] }: { reviews?: StoreReview[] }) {
  const list = [...reviews.map(toDisplay), ...showcaseReviews];
  const [index, setIndex] = useState(0);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [formOpen, setFormOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const googleUrl = googleReviewUrl();
  const closeForm = () => setFormOpen(false);

  function goTo(i: number) {
    setIndex(i);
    setPhotoIndex(0);
  }

  useEffect(() => {
    if (reduceMotion || formOpen) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % list.length);
      setPhotoIndex(0);
    }, 6000);
    return () => clearInterval(id);
  }, [reduceMotion, formOpen, index, list.length]);

  const review = list[index % list.length];
  const photo = review.photos[photoIndex] ?? review.photos[0];

  return (
    <div className="space-y-8 sm:space-y-10">
      <div className="mx-auto max-w-3xl">
        <AnimatePresence mode="wait">
          <motion.article
            key={review.key}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden rounded-2xl bg-white ring-1 ring-gold/20 shadow-sm"
          >
            <div className="grid min-h-[220px] grid-cols-1 md:grid-cols-2">
              <div className={cn("relative min-h-[220px] md:min-h-[280px]", PRODUCT_IMAGE_BG)}>
                {photo ? (
                  <Image
                    src={photo}
                    alt={`${review.author} review photo`}
                    fill
                    sizes="(max-width: 768px) 100vw, 420px"
                    className="object-cover"
                    priority={index === 0}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#1a0a2e] via-[#2d1450] to-[#1a0a2e]">
                    <span className="text-6xl font-semibold text-gold/80">
                      {review.author.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                {review.photos.length > 1 && (
                  <div className="absolute inset-x-0 bottom-0 flex justify-center gap-1.5 bg-gradient-to-t from-black/55 to-transparent p-2.5 pt-6">
                    {review.photos.map((src, i) => (
                      <button
                        key={src}
                        type="button"
                        onClick={() => setPhotoIndex(i)}
                        aria-label={`Show photo ${i + 1}`}
                        className={cn(
                          "relative h-11 w-11 overflow-hidden rounded-lg ring-2 transition",
                          i === photoIndex ? "ring-gold" : "ring-white/30 opacity-75 hover:opacity-100",
                        )}
                      >
                        <Image src={src} alt="" fill sizes="44px" className="object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-col justify-center px-5 py-6 sm:px-7 sm:py-8">
                <Quote className="mb-3 h-6 w-6 text-gold/45" />
                <div className="mb-3 flex gap-0.5" aria-label={`${review.rating} out of 5 stars`}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn("h-4 w-4", i < review.rating ? "fill-gold text-gold" : "text-dark/20")}
                    />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-dark/80 sm:text-base">
                  &ldquo;{review.text}&rdquo;
                </p>
                <p className="mt-4 text-sm font-semibold text-gold-dark">
                  — {review.author}
                  {review.city && <span className="font-normal text-dark/50">, {review.city}</span>}
                </p>
              </div>
            </div>
          </motion.article>
        </AnimatePresence>

        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {list.map((item, i) => (
            <button
              key={item.key}
              type="button"
              aria-label={`Review ${i + 1}`}
              onClick={() => goTo(i)}
              className={`h-2 rounded-full transition-all ${
                i === index ? "w-6 bg-gold" : "w-2 bg-dark/20"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => setFormOpen(true)}
          className="inline-flex min-h-12 w-full touch-manipulation items-center justify-center gap-2 rounded-full bg-dark px-6 py-3 text-sm font-semibold text-gold shadow-sm transition hover:bg-gold hover:text-dark active:scale-[0.98] sm:w-auto"
        >
          <PenLine className="h-4 w-4" />
          Write a review
        </button>
        {googleUrl && (
          <a
            href={googleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 w-full touch-manipulation items-center justify-center gap-2 rounded-full border border-gold/35 bg-white px-6 py-3 text-sm font-semibold text-gold-dark shadow-sm transition hover:border-gold hover:bg-gold/10 active:scale-[0.98] sm:w-auto"
          >
            Review us on Google
            <ExternalLink className="h-4 w-4" />
          </a>
        )}
      </div>

      {/* Portal: the section sits inside transformed reveal wrappers, which would re-anchor a fixed modal */}
      {formOpen && createPortal(<ReviewForm onClose={closeForm} />, document.body)}
    </div>
  );
}
