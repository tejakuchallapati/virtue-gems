"use client";

import { motion, useReducedMotion } from "framer-motion";

const sparkles = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  left: `${(i * 17 + 7) % 100}%`,
  top: `${(i * 23 + 11) % 100}%`,
  size: 2 + (i % 3),
  delay: (i % 6) * 0.4,
  duration: 4.2 + (i % 4) * 0.6,
}));

/* Keep rings within typical phone widths so they never force horizontal scroll. */
const rings = [
  { size: 220, opacity: 0.12, duration: 28 },
  { size: 320, opacity: 0.07, duration: 38 },
];

/**
 * Same DOM always (SSR + client) — only animation is gated by reduced motion
 * to avoid hydration mismatches.
 */
export function HeroBackground() {
  const reduceMotion = useReducedMotion();
  const animate = !reduceMotion;

  return (
    <>
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 40% 45%, rgba(212,175,55,0.16) 0%, transparent 55%)",
        }}
        aria-hidden
      />

      {rings.map((ring, i) => (
        <motion.div
          key={i}
          className="pointer-events-none absolute left-1/2 top-1/2 rounded-full border border-gold"
          style={{
            width: ring.size,
            height: ring.size,
            marginLeft: -ring.size / 2,
            marginTop: -ring.size / 2,
            opacity: ring.opacity,
          }}
          animate={animate ? { rotate: i % 2 === 0 ? 360 : -360 } : undefined}
          transition={
            animate
              ? {
                  duration: ring.duration,
                  repeat: Infinity,
                  ease: "linear",
                }
              : undefined
          }
        />
      ))}

      {sparkles.map((s) => (
        <motion.span
          key={s.id}
          className="pointer-events-none absolute rounded-full bg-gold"
          style={{
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            opacity: animate ? undefined : 0.35,
          }}
          animate={
            animate
              ? {
                  opacity: [0.25, 0.9, 0.25],
                  scale: [0.85, 1.25, 0.85],
                }
              : undefined
          }
          transition={
            animate
              ? {
                  duration: s.duration,
                  repeat: Infinity,
                  delay: s.delay,
                  ease: "easeInOut",
                }
              : undefined
          }
        />
      ))}
    </>
  );
}
