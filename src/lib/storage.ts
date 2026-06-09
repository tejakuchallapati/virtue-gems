const isBrowser = typeof window !== "undefined";

export function getStorage<T>(key: string, fallback: T): T {
  if (!isBrowser) return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function setStorage<T>(key: string, value: T): void {
  if (!isBrowser) return;
  localStorage.setItem(key, JSON.stringify(value));
}

export const STORAGE_KEYS = {
  cart: "vg-cart",
  wishlist: "vg-wishlist",
  recentlyViewed: "vg-recently-viewed",
} as const;
