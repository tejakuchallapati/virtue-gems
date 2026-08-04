/** Shared splash / brand-intro timing for home landing. */
export const BRAND_INTRO_KEY = "vg-splash-seen";
export const BRAND_INTRO_MS = 2600;
export const BRAND_INTRO_READY_EVENT = "vg-intro-ready";

export function hasSeenBrandIntro(): boolean {
  if (typeof window === "undefined") return true;
  try {
    return sessionStorage.getItem(BRAND_INTRO_KEY) === "1";
  } catch {
    return true;
  }
}

export function markBrandIntroSeen(): void {
  try {
    sessionStorage.setItem(BRAND_INTRO_KEY, "1");
  } catch {
    /* ignore */
  }
}

export function notifyBrandIntroReady(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(BRAND_INTRO_READY_EVENT));
}
