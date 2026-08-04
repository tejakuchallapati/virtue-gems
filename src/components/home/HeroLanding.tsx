"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { HeroBackground } from "./HeroBackground";
import { useBrandIntroReady } from "@/hooks/useBrandIntroReady";

const ease = [0.22, 1, 0.36, 1] as const;

export function HeroLanding() {
  const introReady = useBrandIntroReady();

  return (
    <section className="relative min-h-[100dvh] w-full overflow-hidden bg-[#1a0a2e] md:min-h-screen">
      <div className="md:hidden">
        <HeroBackground />
      </div>

      <div className="relative z-10 flex min-h-[100dvh] flex-col items-center justify-center px-4 pb-36 pt-20 md:hidden">
        <AnimatePresence>
          {introReady && (
            <>
              <motion.p
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.7, ease }}
                className="mb-6 rounded-full border border-gold/30 bg-gold/10 px-5 py-1.5 text-[10px] tracking-[0.35em] text-gold uppercase backdrop-blur-sm"
              >
                ✦ Shop · WhatsApp checkout · Free delivery in AP & TG ✦
              </motion.p>
              <motion.div
                initial={{ opacity: 0, scale: 0.88, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 1, ease }}
                className="relative aspect-square w-full max-w-[280px]"
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
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.65, ease }}
                className="absolute inset-x-0 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-20 flex justify-center px-4"
              >
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 rounded-full bg-gold px-8 py-3.5 text-sm font-semibold text-dark"
                >
                  Explore Collection
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      <div className="relative z-10 hidden h-screen w-full md:block">
        <motion.div
          className="absolute inset-0 h-full w-full overflow-hidden"
          initial={false}
          animate={
            introReady
              ? { opacity: 1, scale: 1, filter: "blur(0px) brightness(1)" }
              : { opacity: 0.35, scale: 1.08, filter: "blur(10px) brightness(0.55)" }
          }
          transition={{ duration: 1.35, ease }}
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
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#1a0a2e]/25 via-transparent to-[#1a0a2e]/88" />
        </motion.div>

        <AnimatePresence>
          {introReady && (
            <>
              <motion.div
                key="d-curtain-l"
                aria-hidden
                className="pointer-events-none absolute inset-y-0 left-0 z-[4] w-1/2 bg-[#1a0a2e]"
                initial={{ x: "0%" }}
                animate={{ x: "-105%" }}
                transition={{ duration: 1.2, ease }}
              />
              <motion.div
                key="d-curtain-r"
                aria-hidden
                className="pointer-events-none absolute inset-y-0 right-0 z-[4] w-1/2 bg-[#1a0a2e]"
                initial={{ x: "0%" }}
                animate={{ x: "105%" }}
                transition={{ duration: 1.2, ease }}
              />
              <motion.div
                key="d-bloom"
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-[42%] z-[2] h-[55vmin] w-[55vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, rgba(212,175,55,0.28) 0%, transparent 68%)",
                }}
                initial={{ opacity: 0, scale: 0.4 }}
                animate={{ opacity: [0, 0.9, 0.35], scale: [0.4, 1.15, 1] }}
                transition={{ duration: 1.6, delay: 0.15, ease }}
              />
              <motion.div
                key="d-sweep"
                aria-hidden
                className="pointer-events-none absolute inset-0 z-[3]"
                style={{
                  background:
                    "linear-gradient(105deg, transparent 38%, rgba(212,175,55,0.18) 50%, transparent 62%)",
                }}
                initial={{ x: "-100%", opacity: 0 }}
                animate={{ x: "130%", opacity: [0, 1, 0] }}
                transition={{ duration: 1.7, delay: 0.5, ease: "easeInOut" }}
              />
              {[
                { left: "18%", top: "28%", delay: 0.2 },
                { left: "78%", top: "24%", delay: 0.45 },
                { left: "22%", top: "62%", delay: 0.65 },
                { left: "72%", top: "58%", delay: 0.35 },
              ].map((s, i) => (
                <motion.span
                  key={`spark-${i}`}
                  aria-hidden
                  className="pointer-events-none absolute z-[3] h-1.5 w-1.5 rounded-full bg-gold shadow-[0_0_10px_rgba(212,175,55,0.8)]"
                  style={{ left: s.left, top: s.top }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: [0, 1, 0.5], scale: [0, 1.5, 1] }}
                  transition={{ duration: 1.8, delay: 0.65 + s.delay, ease: "easeInOut" }}
                />
              ))}

              <div className="relative z-[5] flex h-full w-full flex-col items-center justify-end px-8 pb-14 pointer-events-none [&_a]:pointer-events-auto">
                <motion.p
                  initial={{ opacity: 0, y: 16, letterSpacing: "0.55em" }}
                  animate={{ opacity: 1, y: 0, letterSpacing: "0.4em" }}
                  transition={{ delay: 0.9, duration: 0.75, ease }}
                  className="mb-5 text-[11px] tracking-[0.4em] text-gold/85 uppercase"
                >
                  Introducing Virtue Gems
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 24, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 1.1, duration: 0.7, ease }}
                >
                  <Link
                    href="/shop"
                    className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-gold px-10 py-4 text-sm font-semibold text-dark shadow-[0_0_32px_rgba(212,175,55,0.45)]"
                  >
                    <span className="relative">Explore Collection</span>
                    <ArrowRight className="relative h-4 w-4 transition group-hover:translate-x-1" />
                  </Link>
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>

        {!introReady && <div className="absolute inset-0 z-[6] bg-[#1a0a2e]" aria-hidden />}
      </div>
    </section>
  );
}
