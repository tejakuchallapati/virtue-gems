"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

type ScrollRevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
};

const offsets = {
  up: { y: 14, x: 0 },
  down: { y: -14, x: 0 },
  left: { x: 14, y: 0 },
  right: { x: -14, y: 0 },
};

export function ScrollReveal({
  children,
  className,
  delay = 0,
  direction = "up",
}: ScrollRevealProps) {
  const ref = useRef(null);
  const reduceMotion = useReducedMotion();
  const inView = useInView(ref, {
    once: true,
    // Trigger a touch earlier so Lenis inertia still catches the reveal mid-scroll
    margin: "0px 0px -12% 0px",
    amount: 0.12,
  });
  const offset = offsets[direction];

  const classes = cn("min-w-0", className);

  if (reduceMotion) {
    return (
      <div ref={ref} className={classes}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={classes}
      initial={{ opacity: 0, ...offset }}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, ...offset }}
      transition={{
        duration: 0.6,
        delay: Math.min(delay, 0.16),
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
