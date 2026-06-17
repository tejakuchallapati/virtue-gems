"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const SPLASH_KEY = "vg-splash-seen";
const SPLASH_MS = 2200;

export function LoadingScreen() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (sessionStorage.getItem(SPLASH_KEY)) {
      setShow(false);
      return;
    }

    const timer = setTimeout(() => {
      setShow(false);
      sessionStorage.setItem(SPLASH_KEY, "1");
    }, SPLASH_MS);

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
          {/* Ambient gold glow */}
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

          {/* Shimmer sweep */}
          <motion.div
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-gold/8 to-transparent"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ duration: 1.4, delay: 0.2, ease: "easeInOut" }}
          />

          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.88 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 flex flex-col items-center"
          >
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              className="relative h-44 w-44 sm:h-56 sm:w-56"
            >
              <Image
                src="/logo-with-text.png"
                alt="Virtue Gems"
                fill
                priority
                quality={100}
                sizes="(max-width: 640px) 176px, 224px"
                className="object-contain drop-shadow-[0_0_28px_rgba(212,175,55,0.35)]"
              />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.6 }}
              className="mt-5 text-[10px] tracking-[0.35em] text-gold/80 uppercase sm:text-xs"
            >
              Wear Your Virtue · Shine With Grace
            </motion.p>
          </motion.div>

          <motion.div
            className="relative z-10 mt-10 h-0.5 w-44 overflow-hidden rounded-full bg-white/10 sm:w-52"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-gold-dark via-gold to-gold-light"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.8, delay: 0.15, ease: "easeInOut" }}
            />
          </motion.div>

          {/* Curtain lift on exit */}
          <motion.div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#1a0a2e] to-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
