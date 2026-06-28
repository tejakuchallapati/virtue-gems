"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote, Play, X } from "lucide-react";
import customerMedia from "@/data/customer-media.json";
import { PRODUCT_IMAGE_FIT, PRODUCT_IMAGE_FRAME } from "@/lib/ui-classes";

const textReviews = [
  {
    author: "Priya Sharma",
    text: "Virtue Gems delivered beyond expectations. The necklace is gorgeous — exquisite detailing and premium packaging.",
    rating: 5,
  },
  {
    author: "Rahul Verma",
    text: "Bought a set for my wife's anniversary. The quality is outstanding and WhatsApp checkout was so easy.",
    rating: 5,
  },
  {
    author: "Anjali Reddy",
    text: "Mobile shopping was seamless. The earrings are even more beautiful in person — great value under ₹2,000!",
    rating: 5,
  },
  {
    author: "Karthik Nair",
    text: "Beautiful traditional designs at fair prices. Virtue Gems is now my go-to for festive jewellery.",
    rating: 5,
  },
];

type MediaItem = (typeof customerMedia)[number];

function MediaModal({
  item,
  onClose,
}: {
  item: MediaItem;
  onClose: () => void;
}) {
  const isVideoFile = item.video?.endsWith(".mp4") || item.video?.endsWith(".webm");

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-dark/90 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-[#1a0a2e] shadow-2xl ring-1 ring-gold/30 max-sm:max-h-[92dvh] max-sm:rounded-xl"
        initial={{ scale: 0.92, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.92, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-10 rounded-full bg-dark/70 p-2 text-light backdrop-blur-sm"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="relative aspect-[9/16] max-h-[75dvh] w-full overflow-hidden bg-[#1a0a2e]">
          {isVideoFile && item.video ? (
            <video
              src={item.video}
              poster={item.poster}
              controls
              autoPlay
              playsInline
              className="h-full w-full object-contain"
            />
          ) : (
            <motion.div
              className="relative h-full w-full"
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            >
              <Image
                src={item.poster}
                alt={item.caption}
                fill
                sizes="(max-width: 768px) 100vw, 480px"
                className="object-contain"
              />
            </motion.div>
          )}
        </div>

        <div className="border-t border-gold/20 p-4">
          <p className="text-sm leading-relaxed text-light/90">{item.caption}</p>
          <p className="mt-2 text-xs font-medium text-gold">— {item.author}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function CustomerReviews() {
  const [index, setIndex] = useState(0);
  const [activeMedia, setActiveMedia] = useState<MediaItem | null>(null);

  useEffect(() => {
    const id = setInterval(
      () => setIndex((i) => (i + 1) % textReviews.length),
      5000,
    );
    return () => clearInterval(id);
  }, []);

  const review = textReviews[index];

  return (
    <div className="space-y-10">
      {/* Text reviews carousel */}
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

      {/* Customer photos & videos */}
      <div>
        <p className="mb-4 text-center text-sm tracking-[0.15em] text-gold uppercase">
          Real Moments from Our Customers
        </p>
        <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 no-scrollbar sm:justify-center sm:px-0">
          {customerMedia.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveMedia(item)}
              className={`group h-48 w-36 shrink-0 snap-center rounded-xl transition active:scale-[0.98] hover:ring-gold/50 sm:h-52 sm:w-36 ${PRODUCT_IMAGE_FRAME} ring-1 ring-gold/20`}
            >
              <Image
                src={item.poster}
                alt={item.caption}
                fill
                sizes="144px"
                className={`${PRODUCT_IMAGE_FIT} group-hover:scale-105`}
              />
              {item.type === "video" && (
                <div className="absolute inset-0 flex items-center justify-center bg-dark/30">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/90 text-dark shadow-lg">
                    <Play className="ml-0.5 h-4 w-4 fill-current" />
                  </span>
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-dark/80 to-transparent p-2 pt-6">
                <p className="line-clamp-2 text-left text-[10px] leading-tight text-light/90">
                  {item.caption}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {activeMedia && (
          <MediaModal item={activeMedia} onClose={() => setActiveMedia(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
