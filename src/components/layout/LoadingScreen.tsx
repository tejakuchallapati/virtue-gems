"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import {
  BRAND_INTRO_KEY,
  BRAND_INTRO_MS,
  markBrandIntroSeen,
  notifyBrandIntroReady,
} from "@/lib/brand-intro";

const BRAND = "VIRTUE GEMS";

export function LoadingScreen() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (sessionStorage.getItem(BRAND_INTRO_KEY)) {
      setShow(false);
      notifyBrandIntroReady();
      return;
    }

    const timer = setTimeout(() => {
      setShow(false);
      markBrandIntroSeen();
      notifyBrandIntroReady();
    }, BRAND_INTRO_MS);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-[#1a0a2e]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="pointer-events-none absolute h-[min(70vw,480px)] w-[min(70vw,480px)] rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(212,175,55,0.28) 0%, rgba(212,175,55,0.08) 42%, transparent 70%)",
            }}
            initial={{ opacity: 0, scale: 0.55 }}
            animate={{ opacity: [0.45, 1, 0.7], scale: [0.75, 1.08, 1] }}
            transition={{ duration: 2.2, ease: "easeInOut" }}
          />

          <motion.div
            className="pointer-events-none absolute rounded-full border border-gold/35"
            initial={{ width: 80, height: 80, opacity: 0 }}
            animate={{
              width: [80, 320, 420],
              height: [80, 320, 420],
              opacity: [0, 0.55, 0],
            }}
            transition={{ duration: 2.1, ease: "easeOut" }}
          />

          <motion.div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(115deg, transparent 35%, rgba(212,175,55,0.14) 50%, transparent 65%)",
            }}
            initial={{ x: "-120%" }}
            animate={{ x: "120%" }}
            transition={{ duration: 1.6, delay: 0.35, ease: "easeInOut" }}
          />

          <div
            className="relative z-10 flex flex-col items-center px-6"
            style={{ perspective: 900, transformStyle: "preserve-3d" }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.75, rotateY: -35, z: -120 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0, z: 40 }}
              transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformStyle: "preserve-3d" }}
              className="relative h-36 w-36 sm:h-44 sm:w-44"
            >
              <Image
                src="/logo.png"
                alt="Virtue Gems"
                fill
                priority
                quality={90}
                sizes="176px"
                className="object-contain drop-shadow-[0_0_32px_rgba(212,175,55,0.4)]"
              />
            </motion.div>

            <motion.h1
              className="mt-7 flex flex-wrap justify-center gap-x-[0.12em] text-center text-2xl font-semibold tracking-[0.28em] text-gold sm:text-3xl"
              aria-label="Virtue Gems"
            >
              {BRAND.split("").map((char, i) => (
                <motion.span
                  key={`${char}-${i}`}
                  initial={{ opacity: 0, y: 18, rotateX: -80, z: -40 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0, z: 0 }}
                  transition={{
                    delay: 0.55 + i * 0.055,
                    duration: 0.45,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  style={{
                    display: "inline-block",
                    transformStyle: "preserve-3d",
                    transformOrigin: "50% 100%",
                  }}
                  className={char === " " ? "w-[0.35em]" : undefined}
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.25, duration: 0.55 }}
              className="mt-4 text-[10px] tracking-[0.38em] text-gold/75 uppercase sm:text-xs"
            >
              Wear Your Virtue · Shine With Grace
            </motion.p>

            <motion.div
              className="mt-8 h-px w-40 overflow-hidden bg-white/10 sm:w-52"
              initial={{ opacity: 0, scaleX: 0.4 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 1.1, duration: 0.5 }}
            >
              <motion.div
                className="h-full origin-left bg-gradient-to-r from-transparent via-gold to-transparent"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 1.2, duration: 0.9, ease: "easeOut" }}
              />
            </motion.div>
          </div>

          <motion.div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#1a0a2e] via-[#1a0a2e]/40 to-transparent"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 0.6 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
