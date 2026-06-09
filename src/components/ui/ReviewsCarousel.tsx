"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote } from "lucide-react";

const reviews = [
  {
    author: "Priya Sharma",
    text: "Virtue Gems delivered beyond expectations. The ring is a masterpiece — exquisite detailing and premium packaging.",
    rating: 5,
  },
  {
    author: "Rahul Verma",
    text: "Bought a necklace for my wife's anniversary. The quality is outstanding and customer service was incredibly helpful.",
    rating: 5,
  },
  {
    author: "Anjali Reddy",
    text: "Mobile shopping was seamless. Fast WhatsApp checkout and the earrings are even more beautiful in person!",
    rating: 5,
  },
  {
    author: "Karthik Nair",
    text: "Authentic hallmarked gold at fair prices. Virtue Gems is now my go-to for all special occasions.",
    rating: 4,
  },
];

export function ReviewsCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setIndex((i) => (i + 1) % reviews.length),
      5000,
    );
    return () => clearInterval(id);
  }, []);

  const review = reviews[index];

  return (
    <div className="relative mx-auto max-w-2xl px-4 text-center">
      <Quote className="mx-auto mb-4 h-8 w-8 text-gold/40" />
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.4 }}
        >
          <div className="mb-3 flex justify-center gap-0.5">
            {Array.from({ length: review.rating }).map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-gold text-gold" />
            ))}
          </div>
          <p className="text-base leading-relaxed text-dark/80 sm:text-lg">
            &ldquo;{review.text}&rdquo;
          </p>
          <p className="mt-4 text-sm font-medium text-gold-dark">
            — {review.author}
          </p>
        </motion.div>
      </AnimatePresence>
      <div className="mt-6 flex justify-center gap-2">
        {reviews.map((_, i) => (
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
  );
}
