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
 * Cinematic hero — large stacked title with the Explore CTA directly beneath it.
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
          className="object-cover object-[72%_42%] max-[380px]:object-[74%_40%] sm:object-[65%_center] md:object-center"
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

      {/* Brand stack — top on phones, left silk (clear of jewellery) from md up */}
      <div className="relative z-10 flex h-full w-full flex-col items-center px-4 pt-[calc(4.75rem+env(safe-area-inset-top,0px))] sm:px-6 sm:pt-[calc(6rem+env(safe-area-inset-top,0px))] md:w-[60%] md:justify-center md:pb-[6vh] md:pl-[4vw] md:pr-0 md:pt-0">
        <motion.h1
          initial={false}
          animate={introReady ? { opacity: 1, y: 0 } : { opacity: 0, y: reduceMotion ? 0 : 8 }}
          transition={{ delay: introReady && !reduceMotion ? 0.2 : 0, duration: 0.55 * softDur, ease: softEase }}
          className={`${brand.className} flex max-w-full flex-col items-center text-center text-[clamp(3.25rem,16.8vw,7.5rem)] font-normal leading-[0.92] md:text-[min(16vw,26vh,14rem)]`}
          style={{
            color: GOLD,
            letterSpacing: "0.02em",
            textShadow: "0 2px 18px rgba(0,0,0,0.35)",
          }}
        >
          <span className="block">Virtue</span>{" "}
          <span className="block">Gems</span>
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
          className="mt-3 h-px w-[min(48%,9.5rem)] origin-center sm:mt-4 sm:w-[min(40%,11rem)]"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(230,208,138,0.2) 12%, #e6d08a 50%, rgba(230,208,138,0.2) 88%, transparent 100%)",
          }}
        />

        <motion.div
          initial={false}
          animate={introReady ? { opacity: 1, y: 0 } : { opacity: 0, y: reduceMotion ? 0 : 8 }}
          transition={{ delay: introReady && !reduceMotion ? 0.48 : 0, duration: 0.5 * softDur, ease: softEase }}
          className="mt-5 sm:mt-6"
        >
          <Link
            href="/shop"
            className="inline-flex min-h-12 items-center justify-center border border-[#e6d08a]/90 px-9 py-3.5 text-xs font-normal tracking-[0.24em] uppercase transition active:bg-[#e6d08a]/15 hover:bg-[#e6d08a] hover:text-[#1a0a2e] max-[380px]:px-7 max-[380px]:tracking-[0.2em] sm:min-h-14 sm:px-12 sm:py-4 sm:text-sm sm:tracking-[0.28em] lg:min-h-16 lg:px-14 lg:text-base touch-manipulation"
            style={{ color: GOLD }}
          >
            Explore Collection
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
