"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
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
 * Clean silk folds (no baked text) + jewellery — single logo/title/CTA overlay only.
 */
export function HeroLanding() {
  const introReady = useBrandIntroReady();

  return (
    <section className="relative h-[100dvh] max-h-[100dvh] w-full max-w-[100vw] overflow-hidden bg-[#1a0a2e] md:h-screen md:max-h-none">
      <motion.div
        className="absolute inset-0"
        initial={false}
        animate={introReady ? { opacity: 1, scale: 1.02 } : { opacity: 0.85, scale: 1.05 }}
        transition={{ duration: 1.35, ease }}
      >
        <Image
          src="/hero-bg-clean.jpg"
          alt=""
          fill
          priority
          quality={95}
          sizes="100vw"
          className="object-cover object-center"
          aria-hidden
        />
      </motion.div>

      {/* Necklace */}
      <div
        className="pointer-events-none absolute top-[6%] right-[-1%] z-[2] hidden h-[58%] w-[36%] md:block lg:w-[32%]"
        aria-hidden
      >
        <Image
          src="/hero-pendant.png"
          alt=""
          fill
          priority
          quality={95}
          sizes="35vw"
          className="object-contain object-right-top drop-shadow-[0_18px_36px_rgba(0,0,0,0.45)]"
        />
      </div>

      {/* Ring */}
      <div
        className="pointer-events-none absolute bottom-[12%] right-[4%] z-[2] hidden h-[26%] w-[20%] md:block lg:right-[8%] lg:w-[16%]"
        aria-hidden
      >
        <Image
          src="/hero-ring.png"
          alt=""
          fill
          priority
          quality={95}
          sizes="18vw"
          className="object-contain object-bottom drop-shadow-[0_14px_28px_rgba(0,0,0,0.4)]"
        />
      </div>

      <div
        className="pointer-events-none absolute inset-0 z-[3]"
        style={{
          background:
            "radial-gradient(ellipse 42% 48% at 46% 36%, rgba(16,5,28,0.32) 0%, rgba(16,5,28,0.1) 55%, rgba(10,3,20,0.22) 100%)",
        }}
        aria-hidden
      />

      <div className="relative z-10 flex h-full w-full flex-col items-center px-5 pb-[calc(5rem+env(safe-area-inset-bottom,0px))] pt-[min(18vh,7.5rem)] sm:pt-[min(20vh,8.5rem)] md:pt-[min(18vh,9rem)]">
        <motion.div
          initial={false}
          animate={introReady ? { opacity: 1, y: 0 } : { opacity: 0.4, y: 12 }}
          transition={{ duration: 0.85, ease }}
          className="relative h-14 w-[9rem] shrink-0 sm:h-16 sm:w-[10.5rem] md:h-[4.75rem] md:w-[12.5rem]"
        >
          <Image
            src="/logo-vg.png"
            alt="Virtue Gems"
            fill
            priority
            quality={100}
            sizes="200px"
            className="object-contain drop-shadow-[0_6px_20px_rgba(0,0,0,0.35)]"
          />
        </motion.div>

        <motion.h1
          initial={false}
          animate={introReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ delay: introReady ? 0.25 : 0, duration: 0.65, ease: softEase }}
          className={`${brand.className} mt-3 max-w-[92vw] text-center text-[clamp(3.25rem,11vw,7.25rem)] font-normal leading-[1.05] sm:mt-4`}
          style={{
            color: GOLD,
            letterSpacing: "0.02em",
            wordSpacing: "0.08em",
            textShadow: "0 2px 18px rgba(0,0,0,0.35)",
          }}
        >
          Virtue Gems
        </motion.h1>

        <motion.p
          initial={false}
          animate={introReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
          transition={{ delay: introReady ? 0.4 : 0, duration: 0.55, ease: softEase }}
          className={`${caption.className} mt-4 text-center text-[clamp(0.95rem,2vw,1.25rem)] font-normal sm:mt-5`}
          style={{
            color: GOLD,
            letterSpacing: "0.16em",
            textShadow: "0 1px 12px rgba(0,0,0,0.3)",
          }}
        >
          Wear your Virtue. Shine with Grace
        </motion.p>

        <motion.div
          aria-hidden
          initial={false}
          animate={introReady ? { opacity: 0.75, scaleX: 1 } : { opacity: 0, scaleX: 0.35 }}
          transition={{ delay: introReady ? 0.5 : 0, duration: 0.5, ease: softEase }}
          className="mt-5 h-px w-[min(40%,11rem)] origin-center"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(230,208,138,0.2) 12%, #e6d08a 50%, rgba(230,208,138,0.2) 88%, transparent 100%)",
          }}
        />

        <motion.div
          initial={false}
          animate={introReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
          transition={{ delay: introReady ? 0.55 : 0, duration: 0.55, ease: softEase }}
          className="mt-8 sm:mt-10"
        >
          <Link
            href="/shop"
            className="inline-flex items-center justify-center border border-[#e6d08a]/90 px-10 py-3.5 text-[11px] font-normal tracking-[0.28em] uppercase transition hover:bg-[#e6d08a] hover:text-[#1a0a2e] sm:text-xs"
            style={{ color: GOLD }}
          >
            Explore Collection
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
