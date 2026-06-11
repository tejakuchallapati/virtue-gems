"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { HeroBackground } from "./HeroBackground";

export function HeroLanding() {
  return (
    <section className="relative min-h-[100dvh] w-full overflow-hidden bg-[#1a0a2e]">
      <HeroBackground />

      {/* ── Mobile hero (unchanged layout) ── */}
      <div className="relative z-10 flex min-h-[100dvh] flex-col items-center justify-center px-4 pb-36 pt-20 md:hidden">
        <motion.p
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mb-6 rounded-full border border-gold/30 bg-gold/10 px-5 py-1.5 text-[10px] tracking-[0.35em] text-gold uppercase backdrop-blur-sm"
        >
          ✦ New Festive Collection ✦
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.88, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-[280px]"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="relative aspect-square w-full"
          >
            <Image
              src="/logo-with-text.png"
              alt="Virtue Gems"
              fill
              priority
              sizes="280px"
              className="object-contain"
            />
          </motion.div>
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
          className="mt-6 max-w-sm text-center text-sm leading-relaxed text-light/60"
        >
          Wear your virtue, shine with grace — handcrafted jewellery from{" "}
          <span className="text-gold">₹599</span> to{" "}
          <span className="text-gold">₹2,000</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.7 }}
          className="absolute inset-x-0 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-20 flex flex-col items-center gap-4 px-4"
        >
          <div className="flex w-full max-w-sm flex-col gap-3">
            <Link
              href="/shop"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-gold px-8 py-3.5 text-sm font-semibold text-dark shadow-[0_0_24px_rgba(212,175,55,0.4)]"
            >
              Explore Collection
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center rounded-full border-2 border-gold/70 bg-[#1a0a2e]/90 px-8 py-3.5 text-sm font-semibold text-gold"
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

      {/* ── Desktop full-screen hero ── */}
      <div className="relative z-10 hidden min-h-screen flex-col items-center justify-center px-8 pt-[4.25rem] md:flex">
        <motion.div
          initial={{ opacity: 0, scale: 1.15 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex h-[min(72vh,780px)] w-full items-center justify-center"
        >
          <motion.div
            className="relative h-full w-full max-w-[min(90vw,1100px)]"
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <Image
              src="/logo-with-text.png"
              alt="Virtue Gems — Wear Your Virtue, Shine With Grace"
              fill
              priority
              sizes="90vw"
              className="object-contain"
            />
          </motion.div>

          <motion.div
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(212,175,55,0.18) 0%, transparent 65%)",
            }}
            animate={{ opacity: [0.5, 0.9, 0.5], scale: [0.95, 1.08, 0.95] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-2 text-center text-lg tracking-wide text-light/60"
        >
          Wear your virtue, shine with grace
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-1 text-center text-sm text-light/45"
        >
          Handcrafted jewellery · <span className="text-gold">₹599</span> –{" "}
          <span className="text-gold">₹2,000</span>
        </motion.p>

        {/* Centered CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.7 }}
          className="mt-10 flex items-center justify-center gap-5"
        >
          <Link
            href="/shop"
            className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-gold px-10 py-4 text-sm font-semibold text-dark shadow-[0_0_32px_rgba(212,175,55,0.45)] transition hover:shadow-[0_0_48px_rgba(212,175,55,0.6)]"
          >
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition duration-700 group-hover:translate-x-full" />
            <span className="relative">Explore Collection</span>
            <ArrowRight className="relative h-4 w-4 transition group-hover:translate-x-1" />
          </Link>
          <Link
            href="/about"
            className="group inline-flex items-center justify-center rounded-full border-2 border-gold/60 bg-transparent px-10 py-4 text-sm font-semibold text-gold transition hover:border-gold hover:bg-gold/10 hover:shadow-[0_0_24px_rgba(212,175,55,0.2)]"
          >
            Our Story
          </Link>
        </motion.div>

        <motion.a
          href="#collections"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.6 }}
          className="mt-12 flex flex-col items-center gap-1 text-xs tracking-[0.3em] text-gold/60 uppercase"
        >
          <motion.span animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
            Discover
          </motion.span>
          <ChevronDown className="h-5 w-5" />
        </motion.a>
      </div>
    </section>
  );
}
