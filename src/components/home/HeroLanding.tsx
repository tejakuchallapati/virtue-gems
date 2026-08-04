"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { HeroBackground } from "./HeroBackground";
import { useBrandIntroReady } from "@/hooks/useBrandIntroReady";

const ease = [0.22, 1, 0.36, 1] as const;

export function HeroLanding() {
  const introReady = useBrandIntroReady();

  return (
    <section className="relative min-h-[100dvh] w-full overflow-hidden bg-[#1a0a2e] md:min-h-screen">
      <div className="md:hidden">
        <HeroBackground />
      </div>

      <div className="relative z-10 flex min-h-[100dvh] flex-col items-center justify-center px-4 pb-36 pt-20 md:hidden">
        <AnimatePresence>
          {introReady && (
            <>
              <motion.p
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.7, ease }}
                className="mb-6 rounded-full border border-gold/30 bg-gold/10 px-5 py-1.5 text-[10px] tracking-[0.35em] text-gold uppercase backdrop-blur-sm"
              >
                ✦ Shop · WhatsApp checkout · Free delivery in AP & TG ✦
              </motion.p>
              <motion.div
                initial={{ opacity: 0, scale: 0.88, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 1, ease }}
                className="relative aspect-square w-full max-w-[280px]"
              >
                <Image
                  src="/logo-with-text.png"
                  alt="Virtue Gems"
                  fill
                  priority
                  quality={100}
                  sizes="560px"
                  className="object-contain"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.65, ease }}
                className="absolute inset-x-0 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-20 flex justify-center px-4"
              >
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 rounded-full bg-gold px-8 py-3.5 text-sm font-semibold text-dark"
                >
                  Explore Collection
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      <div className="relative z-10 hidden h-screen w-full md:block">
        <motion.div
          className="absolute inset-0 h-full w-full overflow-hidden"
          initial={false}
          animate={
            introReady
              ? { opacity: 1, scale: 1, filter: "blur(0px) brightness(1)" }
              : { opacity: 0.35, scale: 1.08, filter: "blur(10px) brightness(0.55)" }
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
        {!introReady && <div className="absolute inset-0 z-[6] bg-[#1a0a2e]" aria-hidden />}
      </div>
    </section>
  );
}
