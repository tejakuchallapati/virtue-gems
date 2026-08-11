"use client";

import { useEffect, useState } from "react";
import {
  BRAND_INTRO_MS,
  BRAND_INTRO_READY_EVENT,
  hasSeenBrandIntro,
} from "@/lib/brand-intro";

/**
 * True once the home splash has finished (or was already seen this session).
 * Always starts `false` on server + client so SSR HTML matches hydration.
 */
export function useBrandIntroReady() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const markReady = () => {
      if (!cancelled) setReady(true);
    };

    if (hasSeenBrandIntro()) {
      // Defer so we don't setState synchronously inside the effect body.
      const id = window.setTimeout(markReady, 0);
      return () => {
        cancelled = true;
        window.clearTimeout(id);
      };
    }

    window.addEventListener(BRAND_INTRO_READY_EVENT, markReady);
    const fallback = window.setTimeout(markReady, BRAND_INTRO_MS + 400);

    return () => {
      cancelled = true;
      window.removeEventListener(BRAND_INTRO_READY_EVENT, markReady);
      window.clearTimeout(fallback);
    };
  }, []);

  return ready;
}
