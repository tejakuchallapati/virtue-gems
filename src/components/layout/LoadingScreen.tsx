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
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="pointer-events-none absolute h-[420px] w-[420px] rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(212,175,55,0.22) 0%, rgba(212,175,55,0.06) 45%, transparent 70%)",
            }}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: [0.5, 0.9, 0.6], scale: [0.85, 1.05, 0.95] }}
            transition={{ duration: 2.2, ease: "easeInOut" }}
          />

          <div className="relative z-10 flex flex-col items-center px-6">
            <motion.div
              initial={{ opacity: 0, y: 28, scale: 0.88 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
              className="relative h-36 w-36 sm:h-44 sm:w-44"
            >
              <Image
                src="/logo.png"
                alt="Virtue Gems"
                fill
                priority
                quality={90}
                sizes="176px"
                className="object-contain drop-shadow-[0_0_28px_rgba(212,175,55,0.35)]"
              />
            </motion.div>

            <motion.h1
              className="mt-7 flex flex-wrap justify-center gap-x-[0.12em] text-center text-2xl font-semibold tracking-[0.28em] text-gold sm:text-3xl"
              aria-label="Virtue Gems"
            >
              {BRAND.split("").map((char, i) => (
                <motion.span
                  key={`${char}-${i}`}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.55 + i * 0.045,
                    duration: 0.4,
                    ease: [0.22, 1, 0.36, 1],
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
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
