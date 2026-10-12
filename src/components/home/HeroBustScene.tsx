"use client";

import Image from "next/image";
import { motion, useTransform, type MotionValue } from "framer-motion";

const SCENE_SRC = "/hero-velvet-bust.jpg";

/** All positions are % of the 16:9 photo — keep in sync with /hero-velvet-bust.jpg. */
const GLINTS = [
  { left: "69.5%", top: "44.8%", size: 2, delay: 0.3 },
  { left: "62%", top: "37%", size: 1.4, delay: 1.9 },
  { left: "80%", top: "36%", size: 1.4, delay: 3.4 },
  { left: "69%", top: "61.5%", size: 1.2, delay: 2.6 },
  { left: "86.4%", top: "55.5%", size: 1.3, delay: 1.1 },
  { left: "94%", top: "55.5%", size: 1.3, delay: 4.2 },
  { left: "50.8%", top: "79.5%", size: 1.6, delay: 3 },
] as const;

/** Dust motes drifting inside the spotlight beam (x %, start y %, size px, duration s, delay s). */
const MOTES = [
  [68, 8, 2, 11, 0],
  [71, 20, 1.5, 13, 2.5],
  [74, 4, 2.5, 12, 5],
  [77, 14, 1.5, 14, 1],
  [79, 26, 2, 10, 6.5],
  [72, 30, 1.5, 12, 3.8],
  [66, 18, 2, 15, 7.2],
  [81, 6, 1.5, 13, 4.4],
  [75, 34, 2, 11, 8.6],
  [70, 12, 1.5, 12, 9.4],
] as const;

const centered = { x: "-50%", y: "-50%" } as const;

function Glint({ left, top, size, delay, live }: (typeof GLINTS)[number] & { live: boolean }) {
  return (
    <motion.svg
      aria-hidden
      viewBox="0 0 24 24"
      className="absolute aspect-square"
      style={{ left, top, width: `${size}%`, ...centered, filter: "drop-shadow(0 0 6px rgba(255,244,214,0.95))" }}
      initial={{ opacity: 0, scale: 0.2 }}
      animate={live ? { opacity: [0, 1, 0], scale: [0.2, 1, 0.2], rotate: [0, 90] } : { opacity: 0, scale: 0.2 }}
      transition={
        live ? { duration: 1.6, delay, repeat: Infinity, repeatDelay: 4.6, ease: "easeInOut" } : { duration: 0.3 }
      }
    >
      <path
        d="M12 0C12.6 7.5 16.5 11.4 24 12C16.5 12.6 12.6 16.5 12 24C11.4 16.5 7.5 12.6 0 12C7.5 11.4 11.4 7.5 12 0Z"
        fill="#fffaf0"
      />
    </motion.svg>
  );
}

type HeroBustSceneProps = {
  /** Ambient loops run only when true (intro done, on screen, motion allowed). */
  live: boolean;
  sizes: string;
  /** Smoothed cursor position over the hero, -0.5…0.5 on each axis. */
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
};

/** Velvet bust photo with a breathing spotlight, drifting dust, gold glints and a cursor-following warm light. */
export function HeroBustScene({ live, sizes, pointerX, pointerY }: HeroBustSceneProps) {
  const shiftX = useTransform(pointerX, (v) => `${v * -0.8}%`);
  const shiftY = useTransform(pointerY, (v) => `${v * -0.8}%`);
  const lightX = useTransform(pointerX, (v) => `${70 + v * 40}%`);
  const lightY = useTransform(pointerY, (v) => `${48 + v * 40}%`);

  return (
    <motion.div className="absolute inset-0" style={{ x: shiftX, y: shiftY }}>
      <Image src={SCENE_SRC} alt="" fill priority quality={100} sizes={sizes} className="object-cover" />

      {/* Breathing spotlight cone */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-[56%] top-0 h-[62%] w-[36%] mix-blend-screen"
        style={{
          background:
            "radial-gradient(ellipse 45% 100% at 50% 0%, rgba(255,232,190,0.28) 0%, rgba(255,220,170,0.1) 45%, transparent 75%)",
        }}
        initial={{ opacity: 0.6 }}
        animate={live ? { opacity: [0.45, 0.9, 0.45] } : { opacity: 0.6 }}
        transition={live ? { duration: 6, repeat: Infinity, ease: "easeInOut" } : { duration: 0.6 }}
      />

      <div aria-hidden className="pointer-events-none absolute inset-0">
        {MOTES.map(([x, y, size, duration, delay]) => (
          <motion.span
            key={`${x}-${y}`}
            className="absolute rounded-full bg-[#fff1d0]"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: size,
              height: size,
              boxShadow: "0 0 6px rgba(255,236,200,0.8)",
            }}
            initial={{ opacity: 0 }}
            animate={live ? { opacity: [0, 0.8, 0], y: [0, 60], x: [0, 10, -6] } : { opacity: 0 }}
            transition={live ? { duration, delay, repeat: Infinity, ease: "linear" } : { duration: 0.4 }}
          />
        ))}
      </div>

      {/* Warm light that follows the cursor across the gold */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute aspect-square w-[34%] rounded-full mix-blend-soft-light"
        style={{
          left: lightX,
          top: lightY,
          ...centered,
          background: "radial-gradient(circle, rgba(255,226,170,0.55) 0%, rgba(255,210,150,0.18) 40%, transparent 70%)",
        }}
      />

      <div aria-hidden className="pointer-events-none absolute inset-0">
        {GLINTS.map((g) => (
          <Glint key={`${g.left}-${g.top}`} {...g} live={live} />
        ))}
      </div>
    </motion.div>
  );
}
