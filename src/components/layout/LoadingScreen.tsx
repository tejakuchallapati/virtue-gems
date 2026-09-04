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

function shouldShowSplash(): boolean {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return false;
  }
  try {
    return sessionStorage.getItem(BRAND_INTRO_KEY) !== "1";
  } catch {
    return false;
  }
}

export function LoadingScreen() {
  const [show, setShow] = useState(shouldShowSplash);

  useEffect(() => {
    if (!show) {
      notifyBrandIntroReady();
      return;
    }

    const timer = window.setTimeout(() => {
      markBrandIntroSeen();
      setShow(false);
      notifyBrandIntroReady();
    }, BRAND_INTRO_MS);

    return () => window.clearTimeout(timer);
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-[#1a0a2e]"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          // Disable hit-testing as soon as exit starts so nav/buttons work again
          exit={{ opacity: 0, scale: 1.02, pointerEvents: "none" }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          aria-hidden
        >
          <motion.div
            className="pointer-events-none absolute h-[min(70vw,480px)] w-[min(70vw,480px)] rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(212,175,55,0.28) 0%, rgba(212,175,55,0.08) 42%, transparent 70%)",
            }}
            animate={{ scale: [0.92, 1.06, 1], opacity: [0.7, 1, 0.85] }}
            transition={{ duration: 2.4, ease: [0.22, 1, 0.36, 1] }}
          />

          <div className="relative z-10 flex flex-col items-center px-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.86, y: 14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
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
              className="mt-7 max-w-full px-2 text-center text-xl font-semibold tracking-[0.18em] text-gold sm:text-3xl sm:tracking-[0.28em]"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            >
              {BRAND}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.42, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="mt-4 max-w-[18rem] text-center text-[10px] leading-relaxed tracking-[0.2em] text-gold/75 uppercase sm:max-w-none sm:text-xs sm:tracking-[0.38em]"
            >
              Wear Your Virtue · Shine With Grace
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
