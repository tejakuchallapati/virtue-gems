"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

/** Set after the first client render so the initial page load never starts hidden. */
let hasClientNavigated = false;

/**
 * Soft fade between routes. Opacity only — a transform here would re-anchor
 * fixed descendants (sticky add-to-cart bars, overlays) during the animation.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const reduceMotion = useReducedMotion();
  const [animateIn] = useState(() => hasClientNavigated);

  useEffect(() => {
    hasClientNavigated = true;
  }, []);

  if (reduceMotion || !animateIn) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
