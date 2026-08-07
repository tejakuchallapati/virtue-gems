"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
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
    <section
      className="relative min-h-[100dvh] w-full overflow-hidden bg-[#1a0a2e] md:min-h-screen"
      style={{ perspective: 1400 }}
    >
      <div className="md:hidden">
        <HeroBackground />
      </div>

      {/* ── Mobile: 3D one-by-one ── */}
      <div
        className="relative z-10 flex min-h-[100dvh] flex-col items-center justify-center px-4 pb-36 pt-20 md:hidden"
        style={{ transformStyle: "preserve-3d" }}
      >
        <AnimatePresence>
          {introReady && (
            <>
              <motion.p
                key="m-badge"
                initial={{ opacity: 0, rotateX: -70, z: -80, y: -20 }}
                animate={{ opacity: 1, rotateX: 0, z: 0, y: 0 }}
                transition={{ delay: 0.1, duration: 0.75, ease }}
                style={{ transformStyle: "preserve-3d" }}
                className="mb-6 rounded-full border border-gold/30 bg-gold/10 px-5 py-1.5 text-[10px] tracking-[0.35em] text-gold uppercase backdrop-blur-sm"
              >
                ✦ Shop · WhatsApp checkout · Free delivery in AP & TG ✦
              </motion.p>

              <motion.div
                key="m-logo"
                initial={{
                  opacity: 0,
                  rotateY: -42,
                  rotateX: 18,
                  z: -180,
                  scale: 0.72,
                }}
                animate={{
                  opacity: 1,
                  rotateY: 0,
                  rotateX: 0,
                  z: 40,
                  scale: 1,
                }}
                transition={{ delay: 0.28, duration: 1.05, ease }}
                style={{ transformStyle: "preserve-3d" }}
                className="relative w-full max-w-[280px]"
              >
                <motion.div
                  aria-hidden
                  className="pointer-events-none absolute left-1/2 top-1/2 -z-10 rounded-full border border-gold/30"
                  style={{
                    width: 260,
                    height: 260,
                    marginLeft: -130,
                    marginTop: -130,
                    transformStyle: "preserve-3d",
                  }}
                  initial={{ opacity: 0, rotateX: 60, z: -60, scale: 0.5 }}
                  animate={{ opacity: 0.45, rotateX: 0, z: -20, scale: 1 }}
                  transition={{ delay: 0.45, duration: 0.9, ease }}
                />

                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{
                    duration: 5.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1.4,
                  }}
                  className="relative aspect-square w-full"
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
              </motion.div>

              <motion.p
                key="m-tag"
                initial={{ opacity: 0, rotateX: 55, z: -60, y: 24 }}
                animate={{ opacity: 1, rotateX: 0, z: 20, y: 0 }}
                transition={{ delay: 0.7, duration: 0.7, ease }}
                style={{ transformStyle: "preserve-3d" }}
                className="mt-5 text-center text-[11px] tracking-[0.28em] text-gold/80 uppercase"
              >
                Wear Your Virtue · Shine With Grace
              </motion.p>

              <motion.div
                key="m-cta"
                initial={{ opacity: 0, rotateX: 75, z: -100, y: 40 }}
                animate={{ opacity: 1, rotateX: 0, z: 60, y: 0 }}
                transition={{ delay: 0.95, duration: 0.75, ease }}
                style={{ transformStyle: "preserve-3d" }}
                className="absolute inset-x-0 bottom-[calc(var(--mobile-nav-offset)+1.25rem)] z-20 flex justify-center px-4"
              >
                <Link
                  href="/shop"
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-gold px-8 py-3.5 text-sm font-semibold text-dark shadow-[0_12px_32px_rgba(212,175,55,0.45)]"
                >
                  Explore Collection
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </Link>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* ── Desktop: staggered 3D depth reveal ── */}
      <div
        className="relative z-10 hidden h-screen w-full md:block"
        style={{ transformStyle: "preserve-3d", perspective: 1600 }}
      >
        {/* Stage 1 — silk canvas flies in from depth */}
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
                  z: 0,
                  filter: "blur(0px) brightness(1)",
                }
              : {
                  opacity: 0,
                  scale: 1.18,
                  rotateX: 18,
                  z: -220,
                  filter: "blur(16px) brightness(0.4)",
                }
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
              {/* Stage 2 — curtains open (left then feel of depth) */}
              <motion.div
                key="d-curtain-l"
                aria-hidden
                className="pointer-events-none absolute inset-y-0 left-0 z-[8] w-1/2 origin-left bg-[#1a0a2e]"
                style={{ transformStyle: "preserve-3d" }}
                initial={{ rotateY: 0, x: "0%" }}
                animate={{ rotateY: -78, x: "-8%" }}
                transition={{ duration: 1.15, ease }}
              />
              <motion.div
                key="d-curtain-r"
                aria-hidden
                className="pointer-events-none absolute inset-y-0 right-0 z-[8] w-1/2 origin-right bg-[#1a0a2e]"
                style={{ transformStyle: "preserve-3d" }}
                initial={{ rotateY: 0, x: "0%" }}
                animate={{ rotateY: 78, x: "8%" }}
                transition={{ duration: 1.15, delay: 0.08, ease }}
              />

              {/* Stage 3 — depth rings appear one by one behind logo */}
              {depthRings.map((ring, i) => (
                <motion.div
                  key={`ring-${i}`}
                  aria-hidden
                  className="pointer-events-none absolute left-1/2 top-[42%] z-[2] -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold/25"
                  style={{
                    width: ring.size,
                    height: ring.size,
                    transformStyle: "preserve-3d",
                  }}
                  initial={{
                    opacity: 0,
                    rotateX: 70,
                    z: -120,
                    scale: 0.4,
                  }}
                  animate={{
                    opacity: 0.4 - i * 0.08,
                    rotateX: 0,
                    z: ring.z,
                    scale: 1,
                  }}
                  transition={{
                    delay: 0.35 + i * 0.18,
                    duration: 0.85,
                    ease,
                  }}
                />
              ))}

              {/* Stage 4 — gold bloom from center */}
              <motion.div
                key="d-bloom"
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-[42%] z-[2] h-[50vmin] w-[50vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, rgba(212,175,55,0.32) 0%, transparent 68%)",
                  transformStyle: "preserve-3d",
                }}
                initial={{ opacity: 0, z: -80, scale: 0.3 }}
                animate={{ opacity: [0, 0.95, 0.4], z: 30, scale: [0.3, 1.2, 1] }}
                transition={{ duration: 1.4, delay: 0.4, ease }}
              />

              {/* Stage 5 — orbs fly in one by one from depth */}
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
                    transformStyle: "preserve-3d",
                  }}
                  initial={{
                    opacity: 0,
                    z: -200,
                    scale: 0,
                    rotateY: orb.rot * 3,
                    rotateX: 40,
                  }}
                  animate={{
                    opacity: [0, 1, 0.75],
                    z: orb.z,
                    scale: 1,
                    rotateY: orb.rot,
                    rotateX: 0,
                  }}
                  transition={{
                    delay: 0.55 + orb.delay * 0.55,
                    duration: 0.85,
                    ease,
                  }}
                />
              ))}

              {/* Stage 6 — light sweep across depth */}
              <motion.div
                key="d-sweep"
                aria-hidden
                className="pointer-events-none absolute inset-0 z-[5]"
                style={{
                  background:
                    "linear-gradient(105deg, transparent 38%, rgba(212,175,55,0.2) 50%, transparent 62%)",
                  transformStyle: "preserve-3d",
                }}
                initial={{ x: "-110%", z: 50, opacity: 0 }}
                animate={{ x: "130%", z: 50, opacity: [0, 1, 0] }}
                transition={{ duration: 1.55, delay: 1.05, ease: "easeInOut" }}
              />

              {/* Stage 7 + 8 — copy & CTA flip up from below in 3D */}
              <div
                className="relative z-[9] flex h-full w-full flex-col items-center justify-end px-8 pb-14 pointer-events-none [&_a]:pointer-events-auto"
                style={{ transformStyle: "preserve-3d" }}
              >
                <motion.p
                  key="d-intro"
                  initial={{
                    opacity: 0,
                    rotateX: 85,
                    z: -90,
                    y: 36,
                    letterSpacing: "0.6em",
                  }}
                  animate={{
                    opacity: 1,
                    rotateX: 0,
                    z: 40,
                    y: 0,
                    letterSpacing: "0.4em",
                  }}
                  transition={{ delay: 1.25, duration: 0.8, ease }}
                  style={{ transformStyle: "preserve-3d", transformOrigin: "50% 100%" }}
                  className="mb-5 text-[11px] tracking-[0.4em] text-gold/85 uppercase"
                >
                  Introducing Virtue Gems
                </motion.p>

                <motion.div
                  key="d-cta"
                  initial={{
                    opacity: 0,
                    rotateX: 90,
                    z: -120,
                    y: 48,
                    scale: 0.9,
                  }}
                  animate={{
                    opacity: 1,
                    rotateX: 0,
                    z: 70,
                    y: 0,
                    scale: 1,
                  }}
                  transition={{ delay: 1.5, duration: 0.85, ease }}
                  style={{ transformStyle: "preserve-3d", transformOrigin: "50% 100%" }}
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
            </>
          )}
        </AnimatePresence>

        {!introReady && (
          <div className="absolute inset-0 z-[10] bg-[#1a0a2e]" aria-hidden />
        )}
      </div>
    </section>
  );
}
