"use client";

import { motion, useReducedMotion } from "framer-motion";

const sparkles = Array.from({ length: 10 }, (_, i) => ({
  id: i,
  left: `${(i * 19 + 9) % 100}%`,
  top: `${(i * 27 + 13) % 100}%`,
  size: 2 + (i % 2),
  delay: (i % 5) * 0.45,
  duration: 3.5 + (i % 3),
}));

const rings = [
  { size: 260, opacity: 0.12, duration: 22 },
  { size: 400, opacity: 0.07, duration: 30 },
];

export function HeroBackground() {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 42%, rgba(212,175,55,0.16) 0%, transparent 58%)",
        }}
        aria-hidden
      />
    );
  }

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
          animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
          transition={{
            duration: ring.duration,
            repeat: Infinity,
            ease: "linear",
          }}
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
          }}
          animate={{
            opacity: [0.25, 0.9, 0.25],
            scale: [0.85, 1.25, 0.85],
          }}
          transition={{
            duration: s.duration,
            repeat: Infinity,
            delay: s.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </>
  );
}
