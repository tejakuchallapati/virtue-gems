import type Lenis from "lenis";

/** Shared Lenis handle so overlays can pause inertia without prop drilling. */
let lenisInstance: Lenis | null = null;

export function setLenisInstance(instance: Lenis | null) {
  lenisInstance = instance;
}

export function getLenisInstance() {
  return lenisInstance;
}

export function pauseSmoothScroll() {
  lenisInstance?.stop();
}

export function resumeSmoothScroll() {
  if (typeof document !== "undefined" && document.body.classList.contains("scroll-locked")) {
    return;
  }
  lenisInstance?.start();
}
