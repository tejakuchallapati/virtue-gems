"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { HeroBackground } from "./HeroBackground";

export function HeroLanding() {
  return (
    <section className="relative min-h-[100dvh] w-full overflow-hidden bg-[#1a0a2e] md:min-h-screen">
      <div className="md:hidden">
        <HeroBackground />
      </div>

      {/* ── Mobile hero ── */}
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
              quality={100}
              sizes="560px"
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

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.7 }}
          className="absolute inset-x-0 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-20 flex justify-center px-4"
        >
          <Link
            href="/shop"
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-gold px-8 py-3.5 text-sm font-semibold text-dark shadow-[0_0_24px_rgba(212,175,55,0.4)]"
          >
            Explore Collection
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>

      {/* ── Desktop: full-screen logo-with-text ── */}
      <div className="relative z-10 hidden h-screen w-full md:block">
        <motion.div
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 h-full w-full"
        >
          <Image
            src="/logo-with-text.png"
            alt="Virtue Gems — Wear Your Virtue, Shine With Grace"
            fill
            priority
            quality={100}
            unoptimized
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#1a0a2e]/20 via-transparent to-[#1a0a2e]/85" />
        </motion.div>

        <div className="relative flex h-full w-full flex-col items-center justify-end px-8 pb-14 pointer-events-none [&_a]:pointer-events-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.7 }}
          >
            <Link
              href="/shop"
              className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-gold px-10 py-4 text-sm font-semibold text-dark shadow-[0_0_32px_rgba(212,175,55,0.45)] transition hover:shadow-[0_0_48px_rgba(212,175,55,0.6)]"
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition duration-700 group-hover:translate-x-full" />
              <span className="relative">Explore Collection</span>
              <ArrowRight className="relative h-4 w-4 transition group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
