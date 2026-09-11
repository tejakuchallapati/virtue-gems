"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ExternalLink, Star, Quote } from "lucide-react";
import { cn } from "@/lib/utils";
import { PRODUCT_IMAGE_BG } from "@/lib/ui-classes";

const textReviews = [
  {
    author: "Priya Sharma",
    text: "Virtue Gems delivered beyond expectations. The necklace is gorgeous — exquisite detailing and premium packaging.",
    rating: 5,
    photo: "/reviews/customer-3.jpg",
  },
  {
    author: "Rahul Verma",
    text: "Bought a set for my wife's anniversary. The quality is outstanding and WhatsApp ordering was so easy.",
    rating: 5,
    photo: "/reviews/customer-7.jpg",
  },
  {
    author: "Anjali Reddy",
    text: "Mobile shopping was seamless. The earrings are even more beautiful in person — great value!",
    rating: 5,
    photo: "/reviews/customer-11.jpg",
  },
  {
    author: "Karthik Nair",
    text: "Beautiful traditional designs at fair prices. Virtue Gems is now my go-to for festive jewellery.",
    rating: 5,
    photo: "/reviews/customer-15.jpg",
  },
];

export function CustomerReviews() {
  const [index, setIndex] = useState(0);
  const reduceMotion = useReducedMotion();
  const googleReviewUrl =
    process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL?.startsWith("https://")
      ? process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL
      : undefined;

  useEffect(() => {
    if (reduceMotion) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % textReviews.length),
      5000,
    );
    return () => clearInterval(id);
  }, [reduceMotion, index]);

  const review = textReviews[index];

  return (
    <div className="space-y-8 sm:space-y-10">
      <div className="mx-auto max-w-3xl">
        <AnimatePresence mode="wait">
          <motion.article
            key={index}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4 }}
            className="overflow-hidden rounded-2xl bg-white ring-1 ring-gold/20 shadow-sm"
          >
            <div className="grid min-h-[220px] grid-cols-1 md:grid-cols-2">
              <div className={cn("relative min-h-[200px] md:min-h-[260px]", PRODUCT_IMAGE_BG)}>
                <Image
                  src={review.photo}
                  alt={`${review.author} review photo`}
                  fill
                  sizes="(max-width: 768px) 100vw, 420px"
                  className="object-cover"
                  priority={index === 0}
                />
              </div>

              <div className="flex flex-col justify-center px-5 py-6 sm:px-7 sm:py-8">
                <Quote className="mb-3 h-6 w-6 text-gold/45" />
                <div className="mb-3 flex gap-0.5">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-gold text-gold" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-dark/80 sm:text-base">
                  &ldquo;{review.text}&rdquo;
                </p>
                <p className="mt-4 text-sm font-semibold text-gold-dark">
                  — {review.author}
                </p>
              </div>
            </div>
          </motion.article>
        </AnimatePresence>

        <div className="mt-4 flex justify-center gap-2">
          {textReviews.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Review ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-2 rounded-full transition-all ${
                i === index ? "w-6 bg-gold" : "w-2 bg-dark/20"
              }`}
            />
          ))}
        </div>
      </div>

      {googleReviewUrl && (
        <div className="text-center">
          <a
            href={googleReviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-gold/35 bg-white px-6 py-3 text-sm font-semibold text-gold-dark shadow-sm transition hover:border-gold hover:bg-gold/10"
          >
            Review Virtue Gems on Google
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      )}
    </div>
  );
}
