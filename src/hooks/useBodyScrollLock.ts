"use client";

import { useEffect } from "react";

const LOCK_CLASS = "scroll-locked";

let lockCount = 0;

/**
 * Locks background scroll while `locked` is true.
 * Uses a body class only — never touches `html` overflow (that breaks iOS/Safari scrolling).
 */
export function useBodyScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked || typeof document === "undefined") return;

    lockCount += 1;
    document.body.classList.add(LOCK_CLASS);

    return () => {
      lockCount = Math.max(0, lockCount - 1);
      if (lockCount === 0) {
        document.body.classList.remove(LOCK_CLASS);
        // Clear any leftover inline styles from older lock implementations
        document.body.style.removeProperty("overflow");
        document.documentElement.style.removeProperty("overflow");
      }
    };
  }, [locked]);
}

/** Force-clear scroll lock (route changes / recovery). */
export function clearBodyScrollLock() {
  lockCount = 0;
  if (typeof document === "undefined") return;
  document.body.classList.remove(LOCK_CLASS);
  document.body.style.removeProperty("overflow");
  document.documentElement.style.removeProperty("overflow");
  delete document.body.dataset.scrollLocked;
}
