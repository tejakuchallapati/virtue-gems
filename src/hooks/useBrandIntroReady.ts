"use client";

import { useEffect, useState } from "react";
import {
  BRAND_INTRO_MS,
  BRAND_INTRO_READY_EVENT,
  hasSeenBrandIntro,
} from "@/lib/brand-intro";

/** True once the home splash has finished (or was already seen this session). */
export function useBrandIntroReady() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (hasSeenBrandIntro()) {
      setReady(true);
      return;
    }

    const onReady = () => setReady(true);
    window.addEventListener(BRAND_INTRO_READY_EVENT, onReady);
    const fallback = window.setTimeout(onReady, BRAND_INTRO_MS + 400);

    return () => {
      window.removeEventListener(BRAND_INTRO_READY_EVENT, onReady);
      window.clearTimeout(fallback);
    };
  }, []);

  return ready;
}
