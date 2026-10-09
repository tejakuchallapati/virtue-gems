"use client";

import { useRef, type CSSProperties, type PointerEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { Cormorant_Garamond } from "next/font/google";
import { useBrandIntroReady } from "@/hooks/useBrandIntroReady";
import { HERO_INTRO_EASE, HERO_SOFT_EASE } from "@/lib/hero-intro-motion";
import { HeroWaterScene } from "@/components/home/HeroWaterScene";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
});

const ease = HERO_INTRO_EASE;
const softEase = HERO_SOFT_EASE;

const GOLD = "#e6d08a";
const CREAM = "#f3ead8";
const BG = "#06030f";
const MOBILE_FADE =
  "linear-gradient(to bottom, transparent 0%, #000 34%, #000 93%, transparent 100%)";

/**
 * Cinematic hero — amethyst ring resting on rippling water, with the logo, title,
 * tagline and Explore CTA on the dark calm water to its left.
 */
export function HeroLanding() {
  const sectionRef = useRef<HTMLElement>(null);
  const introReady = useBrandIntroReady();
  const reduceMotion = useReducedMotion();
  const inView = useInView(sectionRef, { amount: 0.15 });
  const live = introReady && inView && !reduceMotion;
  const dur = reduceMotion ? 0.01 : 1;
  const softDur = reduceMotion ? 0.01 : 1;

  /** Cursor position over the hero, -0.5…0.5 on each axis. */
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const springX = useSpring(pointerX, { stiffness: 40, damping: 18, mass: 0.8 });
  const springY = useSpring(pointerY, { stiffness: 40, damping: 18, mass: 0.8 });
  const ringRotateY = useTransform(springX, (v) => v * 10);
  const ringRotateX = useTransform(springY, (v) => v * -4);

  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse" || reduceMotion) return;
    const r = e.currentTarget.getBoundingClientRect();
    pointerX.set((e.clientX - r.left) / r.width - 0.5);
    pointerY.set((e.clientY - r.top) / r.height - 0.5);
  };

  const onPointerLeave = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  const reveal = (delay: number, y: number) => ({
    initial: false as const,
    animate: introReady ? { opacity: 1, y: 0 } : { opacity: 0, y: reduceMotion ? 0 : y },
    transition: {
      delay: introReady && !reduceMotion ? delay : 0,
      duration: 0.55 * softDur,
      ease: softEase,
    },
  });

  return (
    <section
      ref={sectionRef}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className="relative h-[100dvh] max-h-[100dvh] w-full max-w-[100vw] overflow-hidden overscroll-none md:h-screen md:max-h-none"
      style={{ backgroundColor: BG }}
    >
      <motion.div
        className="absolute inset-0 will-change-transform"
        initial={false}
        animate={
          introReady
            ? { opacity: 1, scale: reduceMotion ? 1 : 1.02 }
            : { opacity: 0.85, scale: reduceMotion ? 1 : 1.05 }
        }
        transition={{ duration: 1.4 * dur, ease }}
        aria-hidden
      >
        {/*
          16:9 scene box so effects stay pinned to the photo.
          Phones & portrait tablets: ring centred under the text, top/bottom fading into the backdrop.
          wide: behaves like object-cover anchored at 60% x.
        */}
        <div className="absolute bottom-[calc(var(--mobile-nav-offset)-1rem)] left-1/2 aspect-video w-[min(200vw,150dvh)] -translate-x-[68%] [-webkit-mask-image:var(--hero-fade)] [mask-image:var(--hero-fade)] wide:bottom-auto wide:left-[60%] wide:top-1/2 wide:w-[max(100%,177.78vh)] wide:-translate-x-[60%] wide:-translate-y-1/2 wide:[-webkit-mask-image:none] wide:[mask-image:none]"
          style={{ "--hero-fade": MOBILE_FADE } as CSSProperties}
        >
          <HeroWaterScene
            live={live}
            sizes="(min-width: 1024px) 100vw, 200vw"
            rotateX={ringRotateX}
            rotateY={ringRotateY}
          />
        </div>
      </motion.div>

      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background: [
            "linear-gradient(90deg, rgba(6,3,15,0.45) 0%, rgba(6,3,15,0.15) 32%, transparent 52%)",
            "linear-gradient(to bottom, rgba(6,3,15,0.4) 0%, transparent 16%, transparent 90%, rgba(6,3,15,0.2) 100%)",
          ].join(", "),
        }}
        aria-hidden
      />

      {/* Brand stack — top on phones & portrait tablets, left side on wide screens */}
      <div className="relative z-10 flex h-full w-full flex-col items-center px-5 pt-[calc(4.5rem+env(safe-area-inset-top,0px))] text-center sm:pt-[calc(6rem+env(safe-area-inset-top,0px))] wide:w-[44%] wide:justify-center wide:pl-[1.5vw] wide:pr-[2vw] wide:pb-[3vh] wide:pt-0">
        <motion.div
          {...reveal(0.2, 8)}
          className="relative aspect-[603/236] w-[min(60vw,16rem)] sm:w-[min(48vw,20rem)] wide:w-[min(27vw,46vh,32rem)]"
        >
          <Image
            src="/logo-vg.png"
            alt=""
            fill
            priority
            quality={100}
            sizes="(max-width: 1024px) 60vw, 27vw"
            className="object-contain drop-shadow-[0_8px_28px_rgba(0,0,0,0.45)]"
          />
        </motion.div>

        <motion.h1
          {...reveal(0.28, 8)}
          className={`${serif.className} mt-2 bg-clip-text pb-1 text-[clamp(2.7rem,13vw,4rem)] font-medium leading-[1.05] text-transparent sm:text-[clamp(3.4rem,9vw,5rem)] wide:mt-[1.2vh] wide:text-[min(6vw,11vh)]`}
          style={{
            backgroundImage: "linear-gradient(180deg, #f7e8b4 0%, #e6c97c 48%, #c9a14f 100%)",
            filter: "drop-shadow(0 2px 14px rgba(0,0,0,0.45))",
          }}
        >
          Virtue Gems
        </motion.h1>

        <motion.p
          {...reveal(0.36, 6)}
          className={`${serif.className} mt-2 text-[clamp(1.2rem,5.2vw,1.5rem)] italic leading-snug sm:text-[clamp(1.35rem,3.4vw,1.8rem)] wide:mt-[1.6vh] wide:text-[min(2.5vw,4.5vh)]`}
          style={{ color: CREAM, letterSpacing: "0.015em", textShadow: "0 1px 12px rgba(0,0,0,0.45)" }}
        >
          Wear your Virtue. Shine with Grace
        </motion.p>

        <motion.div {...reveal(0.46, 8)} className="mt-6 sm:mt-7 wide:mt-[4.5vh]">
          <Link
            href="/shop"
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#e6d08a]/85 px-7 text-[0.64rem] font-normal tracking-[0.2em] uppercase transition active:bg-[#e6d08a]/15 hover:bg-[#e6d08a] hover:text-[#1a0a2e] sm:min-h-11 sm:px-9 sm:text-[0.68rem] wide:min-h-[min(3.3vw,5.8vh)] wide:px-[min(2.4vw,3rem)] wide:text-[clamp(0.68rem,0.85vw,0.82rem)] touch-manipulation"
            style={{ color: GOLD, backgroundColor: "rgba(6,3,15,0.25)" }}
          >
            Explore Collection
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
