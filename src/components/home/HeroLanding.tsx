"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { HeroBackground } from "./HeroBackground";
import { useBrandIntroReady } from "@/hooks/useBrandIntroReady";
import {
  HERO_DEPTH_ORBS,
  HERO_DEPTH_RINGS,
  HERO_INTRO_EASE,
} from "@/lib/hero-intro-motion";

const ease = HERO_INTRO_EASE;
const depthOrbs = HERO_DEPTH_ORBS;
const depthRings = HERO_DEPTH_RINGS;

export function HeroLanding() {
  const introReady = useBrandIntroReady();

  return (
    <section className="relative min-h-[100dvh] w-full max-w-full overflow-hidden bg-[#1a0a2e] md:min-h-screen">
      <div className="absolute inset-0 overflow-hidden md:hidden" aria-hidden>
        <HeroBackground />
      </div>

      {/*
        Mobile hero: always render the same DOM on server + client.
        Animate with introReady — never conditionally mount (that caused hydration errors).
      */}
      <div className="relative z-10 flex min-h-[100dvh] w-full flex-col items-center justify-center px-4 pb-28 pt-16 max-[390px]:pb-24 max-[390px]:pt-12 md:hidden">
        <motion.p
          initial={false}
          animate={introReady ? { opacity: 1, y: 0 } : { opacity: 0, y: -12 }}
          transition={{ delay: introReady ? 0.05 : 0, duration: 0.5, ease }}
          className="mb-6 max-w-[min(100%,20rem)] rounded-full border border-gold/30 bg-gold/10 px-3 py-1.5 text-center text-[9px] leading-snug tracking-[0.14em] text-gold uppercase backdrop-blur-sm sm:px-5 sm:text-[10px] sm:tracking-[0.28em]"
        >
          Shop · WhatsApp checkout · Free delivery
        </motion.p>

        <motion.div
          initial={false}
          animate={introReady ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 16, scale: 0.94 }}
          transition={{ delay: introReady ? 0.15 : 0, duration: 0.65, ease }}
          className="relative aspect-square w-full max-w-[220px] max-[390px]:max-w-[168px] sm:max-w-[280px]"
        >
          <Image
            src="/logo-with-text.png"
            alt="Virtue Gems"
            fill
            priority
            quality={100}
            sizes="560px"
            className="object-contain drop-shadow-[0_20px_40px_rgba(212,175,55,0.25)]"
          />
        </motion.div>

        <motion.p
          initial={false}
          animate={introReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ delay: introReady ? 0.35 : 0, duration: 0.5, ease }}
          className="mt-5 text-center text-[11px] tracking-[0.28em] text-gold/80 uppercase"
        >
          Wear Your Virtue · Shine With Grace
        </motion.p>

        <motion.div
          initial={false}
          animate={introReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ delay: introReady ? 0.5 : 0, duration: 0.5, ease }}
          className="mt-6 max-[390px]:mt-4"
        >
          <Link
            href="/shop"
            className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-gold px-8 py-3.5 text-sm font-semibold text-dark shadow-[0_12px_32px_rgba(212,175,55,0.45)]"
          >
            Explore Collection
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>

      {/* Desktop — same rule: stable DOM, animate only */}
      <div className="relative z-10 hidden h-screen w-full overflow-hidden md:block">
        <div
          className="absolute inset-0"
          style={{ perspective: 1600, transformStyle: "preserve-3d" }}
        >
          <motion.div
            className="absolute inset-0 h-full w-full overflow-hidden"
            style={{ transformStyle: "preserve-3d", transformOrigin: "50% 45%" }}
            initial={false}
            animate={
              introReady
                ? {
                    opacity: 1,
                    scale: 1,
                    rotateX: 0,
                    filter: "blur(0px) brightness(1)",
                  }
                : {
                    opacity: 0.35,
                    scale: 1.06,
                    rotateX: 0,
                    filter: "blur(6px) brightness(0.55)",
                  }
            }
            transition={{ duration: 1.1, ease }}
          >
            <Image
              src="/logo-with-text.png"
              alt="Virtue Gems — Wear Your Virtue, Shine With Grace"
              fill
              priority
              quality={90}
              sizes="100vw"
              className="object-cover object-center"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#1a0a2e]/25 via-transparent to-[#1a0a2e]/88" />
          </motion.div>

          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 z-[8] w-1/2 origin-left bg-[#1a0a2e]"
            initial={false}
            animate={introReady ? { rotateY: -78, x: "-8%" } : { rotateY: 0, x: "0%" }}
            transition={{ duration: 1.15, ease }}
          />
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 z-[8] w-1/2 origin-right bg-[#1a0a2e]"
            initial={false}
            animate={introReady ? { rotateY: 78, x: "8%" } : { rotateY: 0, x: "0%" }}
            transition={{ duration: 1.15, delay: introReady ? 0.08 : 0, ease }}
          />

          {depthRings.map((ring, i) => (
            <motion.div
              key={`ring-${i}`}
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-[42%] z-[2] -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold/25"
              style={{ width: ring.size, height: ring.size }}
              initial={false}
              animate={
                introReady
                  ? { opacity: 0.4 - i * 0.08, scale: 1 }
                  : { opacity: 0, scale: 0.6 }
              }
              transition={{ delay: introReady ? 0.35 + i * 0.18 : 0, duration: 0.85, ease }}
            />
          ))}

          <motion.div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-[42%] z-[2] h-[50vmin] w-[50vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(212,175,55,0.32) 0%, transparent 68%)",
            }}
            initial={false}
            animate={
              introReady
                ? { opacity: [0, 0.95, 0.4], scale: [0.3, 1.2, 1] }
                : { opacity: 0, scale: 0.3 }
            }
            transition={{ duration: 1.4, delay: introReady ? 0.4 : 0, ease }}
          />

          {depthOrbs.map((orb, i) => (
            <motion.span
              key={`orb-${i}`}
              aria-hidden
              className="pointer-events-none absolute z-[4] rounded-full bg-gold shadow-[0_0_18px_rgba(212,175,55,0.85)]"
              style={{
                left: orb.left,
                top: orb.top,
                width: orb.size,
                height: orb.size,
              }}
              initial={false}
              animate={
                introReady
                  ? { opacity: [0, 1, 0.75], scale: 1 }
                  : { opacity: 0, scale: 0 }
              }
              transition={{
                delay: introReady ? 0.55 + orb.delay * 0.55 : 0,
                duration: 0.85,
                ease,
              }}
            />
          ))}

          <div className="pointer-events-none relative z-[9] flex h-full w-full flex-col items-center justify-end px-8 pb-14 [&_a]:pointer-events-auto">
            <motion.p
              initial={false}
              animate={introReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
              transition={{ delay: introReady ? 1.1 : 0, duration: 0.7, ease }}
              className="mb-5 text-[11px] tracking-[0.4em] text-gold/85 uppercase"
            >
              Introducing Virtue Gems
            </motion.p>

            <motion.div
              initial={false}
              animate={
                introReady
                  ? { opacity: 1, y: 0, scale: 1 }
                  : { opacity: 0, y: 24, scale: 0.96 }
              }
              transition={{ delay: introReady ? 1.25 : 0, duration: 0.7, ease }}
            >
              <Link
                href="/shop"
                className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-gold px-10 py-4 text-sm font-semibold text-dark shadow-[0_16px_40px_rgba(212,175,55,0.5)] transition hover:shadow-[0_20px_52px_rgba(212,175,55,0.65)]"
              >
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition duration-700 group-hover:translate-x-full" />
                <span className="relative">Explore Collection</span>
                <ArrowRight className="relative h-4 w-4 transition group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
