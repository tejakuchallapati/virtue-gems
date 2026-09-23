"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Playfair_Display, Cormorant_Garamond } from "next/font/google";
import { useBrandIntroReady } from "@/hooks/useBrandIntroReady";
import { HERO_INTRO_EASE, HERO_SOFT_EASE } from "@/lib/hero-intro-motion";

const brand = Playfair_Display({
  subsets: ["latin"],
  weight: ["400"],
});

const caption = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400"],
});

const ease = HERO_INTRO_EASE;
const softEase = HERO_SOFT_EASE;

const GOLD = "#e6d08a";

/**
 * Cinematic hero — mobile-tuned framing, type scale, and CTA placement.
 */
export function HeroLanding() {
  const introReady = useBrandIntroReady();
  const reduceMotion = useReducedMotion();
  const dur = reduceMotion ? 0.01 : 1;
  const softDur = reduceMotion ? 0.01 : 1;

  return (
    <section className="relative h-[100dvh] max-h-[100dvh] w-full max-w-[100vw] overflow-hidden overscroll-none bg-[#1a0a2e] md:h-screen md:max-h-none">
      <motion.div
        className="absolute inset-0 will-change-transform"
        initial={false}
        animate={
          introReady
            ? { opacity: 1, scale: reduceMotion ? 1 : 1.02 }
            : { opacity: 0.85, scale: reduceMotion ? 1 : 1.04 }
        }
        transition={{ duration: 1.2 * dur, ease }}
      >
        <Image
          src="/hero-bg-clean.jpg"
          alt=""
          fill
          priority
          quality={100}
          sizes="100vw"
          className="object-cover object-[72%_42%] max-[380px]:object-[78%_40%] sm:object-[65%_center] md:object-center"
          aria-hidden
        />
      </motion.div>

      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background: [
            "radial-gradient(ellipse 42% 48% at 46% 36%, rgba(16,5,28,0.28) 0%, rgba(16,5,28,0.08) 55%, rgba(10,3,20,0.22) 100%)",
            "linear-gradient(to bottom, rgba(26,10,46,0.35) 0%, transparent 18%, transparent 72%, rgba(26,10,46,0.45) 100%)",
          ].join(", "),
        }}
        aria-hidden
      />

      {/* Brand stack — mobile-safe scale and spacing */}
      <div className="relative z-10 flex h-full w-full flex-col items-center px-4 pb-[calc(10.5rem+env(safe-area-inset-bottom,0px))] pt-[calc(5.5rem+env(safe-area-inset-top,0px))] max-[380px]:pb-[calc(9.5rem+env(safe-area-inset-bottom,0px))] sm:px-6 sm:pt-[min(28vh,12rem)] md:pb-40 md:pt-[min(32vh,15rem)]">
        <motion.div
          initial={false}
          animate={introReady ? { opacity: 1, y: 0 } : { opacity: 0.4, y: reduceMotion ? 0 : 10 }}
          transition={{ duration: 0.7 * dur, ease }}
          className="relative h-10 w-[6.5rem] shrink-0 sm:h-12 sm:w-[7.75rem] md:h-16 md:w-[10.5rem]"
        >
          <Image
            src="/logo-vg.png"
            alt="Virtue Gems"
            fill
            priority
            quality={100}
            sizes="(max-width: 640px) 120px, 168px"
            className="object-contain drop-shadow-[0_6px_20px_rgba(0,0,0,0.35)]"
          />
        </motion.div>

        <motion.h1
          initial={false}
          animate={introReady ? { opacity: 1, y: 0 } : { opacity: 0, y: reduceMotion ? 0 : 8 }}
          transition={{ delay: introReady && !reduceMotion ? 0.2 : 0, duration: 0.55 * softDur, ease: softEase }}
          className={`${brand.className} mt-3 max-w-[100%] whitespace-nowrap text-center text-[clamp(2.35rem,11vw,8.75rem)] font-normal leading-[1.02] max-[360px]:tracking-normal sm:mt-5`}
          style={{
            color: GOLD,
            letterSpacing: "0.02em",
            wordSpacing: "0.06em",
            textShadow: "0 2px 18px rgba(0,0,0,0.35)",
          }}
        >
          Virtue Gems
        </motion.h1>

        <motion.p
          initial={false}
          animate={introReady ? { opacity: 1, y: 0 } : { opacity: 0, y: reduceMotion ? 0 : 6 }}
          transition={{ delay: introReady && !reduceMotion ? 0.32 : 0, duration: 0.5 * softDur, ease: softEase }}
          className={`${caption.className} mt-3 max-w-[18.5rem] text-center text-[clamp(0.82rem,2.6vw,1.25rem)] font-normal leading-snug sm:mt-5 sm:max-w-none`}
          style={{
            color: GOLD,
            letterSpacing: "0.12em",
            textShadow: "0 1px 12px rgba(0,0,0,0.3)",
          }}
        >
          Wear your Virtue. Shine with Grace
        </motion.p>

        <motion.div
          aria-hidden
          initial={false}
          animate={
            introReady
              ? { opacity: 0.75, scaleX: 1 }
              : { opacity: 0, scaleX: reduceMotion ? 1 : 0.35 }
          }
          transition={{ delay: introReady && !reduceMotion ? 0.42 : 0, duration: 0.45 * softDur, ease: softEase }}
          className="mt-4 h-px w-[min(48%,9.5rem)] origin-center sm:mt-5 sm:w-[min(40%,11rem)]"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(230,208,138,0.2) 12%, #e6d08a 50%, rgba(230,208,138,0.2) 88%, transparent 100%)",
          }}
        />
      </div>

      {/* Explore CTA — mobile centered above bottom nav; desktop beside ring */}
      <motion.div
        initial={false}
        animate={introReady ? { opacity: 1, y: 0 } : { opacity: 0, y: reduceMotion ? 0 : 8 }}
        transition={{ delay: introReady && !reduceMotion ? 0.48 : 0, duration: 0.5 * softDur, ease: softEase }}
        className="absolute bottom-[calc(5.25rem+env(safe-area-inset-bottom,0px))] left-1/2 z-10 w-[min(100%-2rem,20rem)] -translate-x-1/2 sm:bottom-[6.25rem] sm:w-auto md:bottom-[14%] md:left-[38%] md:w-auto md:translate-x-0 lg:left-[40%]"
      >
        <Link
          href="/shop"
          className="inline-flex min-h-11 w-full items-center justify-center border border-[#e6d08a]/90 px-8 py-3 text-[10px] font-normal tracking-[0.22em] uppercase transition active:bg-[#e6d08a]/15 hover:bg-[#e6d08a] hover:text-[#1a0a2e] sm:min-h-0 sm:w-auto sm:px-10 sm:py-3.5 sm:text-[11px] sm:tracking-[0.28em] sm:text-xs touch-manipulation"
          style={{ color: GOLD }}
        >
          Explore Collection
        </Link>
      </motion.div>
    </section>
  );
}
