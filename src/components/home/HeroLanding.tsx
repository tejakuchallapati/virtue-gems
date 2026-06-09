"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";

const sparkles = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  left: `${(i * 17 + 7) % 100}%`,
  top: `${(i * 23 + 11) % 100}%`,
  size: 2 + (i % 3),
  delay: (i % 8) * 0.4,
  duration: 3 + (i % 4),
}));

const rings = [
  { size: 280, opacity: 0.12, duration: 18 },
  { size: 420, opacity: 0.08, duration: 24 },
  { size: 560, opacity: 0.05, duration: 30 },
];

export function HeroLanding() {
  return (
    <section className="relative min-h-[100dvh] w-full overflow-hidden bg-[#1a0a2e]">
      {/* Animated background gradient — no blur on logo */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        animate={{
          background: [
            "radial-gradient(ellipse at 30% 40%, rgba(212,175,55,0.15) 0%, transparent 55%)",
            "radial-gradient(ellipse at 70% 60%, rgba(212,175,55,0.2) 0%, transparent 55%)",
            "radial-gradient(ellipse at 50% 50%, rgba(212,175,55,0.12) 0%, transparent 55%)",
          ],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Rotating gold rings */}
      {rings.map((ring, i) => (
        <motion.div
          key={i}
          className="pointer-events-none absolute left-1/2 top-1/2 rounded-full border border-gold"
          style={{
            width: ring.size,
            height: ring.size,
            marginLeft: -ring.size / 2,
            marginTop: -ring.size / 2,
            opacity: ring.opacity,
          }}
          animate={{ rotate: i % 2 === 0 ? 360 : -360, scale: [1, 1.05, 1] }}
          transition={{
            rotate: { duration: ring.duration, repeat: Infinity, ease: "linear" },
            scale: { duration: 6, repeat: Infinity, ease: "easeInOut" },
          }}
        />
      ))}

      {/* Floating sparkles */}
      {sparkles.map((s) => (
        <motion.span
          key={s.id}
          className="pointer-events-none absolute rounded-full bg-gold"
          style={{
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
          }}
          animate={{
            opacity: [0.2, 1, 0.2],
            scale: [0.8, 1.4, 0.8],
            y: [0, -12, 0],
          }}
          transition={{
            duration: s.duration,
            repeat: Infinity,
            delay: s.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Shimmer sweep */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(105deg, transparent 40%, rgba(212,175,55,0.08) 50%, transparent 60%)",
        }}
        animate={{ x: ["-100%", "200%"] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", repeatDelay: 2 }}
      />

      {/* Corner ornaments */}
      <div className="pointer-events-none absolute inset-0 z-[2]">
        <div className="absolute left-4 top-20 h-16 w-16 border-l border-t border-gold/30 sm:left-8 sm:top-24 sm:h-24 sm:w-24" />
        <div className="absolute right-4 top-20 h-16 w-16 border-r border-t border-gold/30 sm:right-8 sm:top-24 sm:h-24 sm:w-24" />
        <div className="absolute bottom-36 left-4 h-16 w-16 border-b border-l border-gold/20 sm:bottom-32 sm:left-8 sm:h-20 sm:w-20" />
        <div className="absolute bottom-36 right-4 h-16 w-16 border-b border-r border-gold/20 sm:bottom-32 sm:right-8 sm:h-20 sm:w-20" />
      </div>

      {/* Logo — crisp, no blur, object-contain */}
      <div className="relative z-10 flex min-h-[100dvh] flex-col items-center justify-center px-4 pb-36 pt-20 sm:pb-32 sm:pt-24">
        <motion.p
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mb-6 rounded-full border border-gold/30 bg-gold/10 px-5 py-1.5 text-[10px] tracking-[0.35em] text-gold uppercase backdrop-blur-sm sm:text-xs"
        >
          ✦ New Festive Collection ✦
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.88, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-[280px] sm:max-w-lg md:max-w-xl lg:max-w-2xl"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="relative aspect-square w-full"
          >
            <Image
              src="/logo-with-text.png"
              alt="Virtue Gems — Wear Your Virtue, Shine With Grace"
              fill
              priority
              quality={100}
              sizes="(max-width: 640px) 90vw, (max-width: 1024px) 60vw, 672px"
              className="object-contain"
              style={{ imageRendering: "auto" }}
            />
          </motion.div>

          {/* Gold glow pulse behind logo — not blur filter */}
          <motion.div
            className="pointer-events-none absolute inset-0 -z-10 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(212,175,55,0.25) 0%, transparent 70%)",
            }}
            animate={{ opacity: [0.4, 0.8, 0.4], scale: [0.9, 1.05, 0.9] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="mt-6 max-w-sm text-center text-sm leading-relaxed text-light/60 sm:max-w-md sm:text-base"
        >
          Wear your virtue, shine with grace — handcrafted jewellery from{" "}
          <span className="text-gold">₹599</span> to{" "}
          <span className="text-gold">₹2,000</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          className="mt-4 hidden flex-wrap items-center justify-center gap-6 text-center sm:mt-6 sm:flex sm:gap-10"
        >
          {[
            { value: "29+", label: "Designs" },
            { value: "4.8★", label: "Rated" },
            { value: "100%", label: "Quality" },
          ].map((stat) => (
            <div key={stat.label} className="group cursor-default">
              <p className="text-lg font-semibold text-gold transition group-hover:scale-110 sm:text-xl">
                {stat.value}
              </p>
              <p className="text-[10px] tracking-[0.2em] text-light/50 uppercase sm:text-xs">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.7 }}
          className="absolute inset-x-0 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-20 flex flex-col items-center gap-4 px-4 md:bottom-12"
        >
          <div className="flex w-full max-w-sm flex-col gap-3 sm:max-w-none sm:flex-row">
            <Link
              href="/shop"
              className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-gold px-8 py-3.5 text-sm font-semibold text-dark shadow-[0_0_24px_rgba(212,175,55,0.4)] transition hover:bg-gold-light hover:shadow-[0_0_32px_rgba(212,175,55,0.55)]"
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/35 to-transparent transition duration-700 group-hover:translate-x-full" />
              <span className="relative">Explore Collection</span>
              <ArrowRight className="relative h-4 w-4 transition group-hover:translate-x-1" />
            </Link>
            <Link
              href="/about"
              className="group inline-flex items-center justify-center rounded-full border-2 border-gold/70 bg-[#1a0a2e]/90 px-8 py-3.5 text-sm font-semibold text-gold transition hover:border-gold hover:bg-gold/15 hover:shadow-[0_0_20px_rgba(212,175,55,0.2)]"
            >
              Our Story
            </Link>
          </div>

          <motion.a
            href="#collections"
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-1 text-xs tracking-[0.25em] text-gold/70 uppercase"
          >
            Scroll to explore
            <ChevronDown className="h-4 w-4" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
