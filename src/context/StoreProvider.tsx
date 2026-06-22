"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getProductById } from "@/lib/products";
import { getStorage, setStorage, STORAGE_KEYS } from "@/lib/storage";
import type { CartItem, Product } from "@/types";

type StoreContextValue = {
  cart: CartItem[];
  wishlist: Product[];
  recentlyViewed: Product[];
  cartCount: number;
  wishlistCount: number;
  cartTotal: number;
  addToCart: (product: Product, qty?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  addRecentlyViewed: (product: Product) => void;
  hydrated: boolean;
};

const StoreContext = createContext<StoreContextValue | null>(null);

type StoredCart = { productId: string; quantity: number }[];

function hydrateProducts(ids: string[]): Product[] {
  return ids
    .map((id) => getProductById(id))
    .filter((product): product is Product => Boolean(product));
}

function normalizeStoredIds(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  if (raw.length === 0) return [];
  if (typeof raw[0] === "string") {
    return raw.filter((id): id is string => typeof id === "string");
  }
  return raw
    .map((item) => {
      if (item && typeof item === "object" && "id" in item) {
        return String((item as Product).id);
      }
      return null;
    })
    .filter((id): id is string => Boolean(id));
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const storedCart = getStorage<StoredCart | unknown>(STORAGE_KEYS.cart, []);
    const cartRows = Array.isArray(storedCart) ? storedCart : [];

    setCart(
      cartRows
        .map((item) => {
          if (!item || typeof item !== "object") return null;
          const row = item as { productId?: string; quantity?: number };
          if (!row.productId || typeof row.quantity !== "number") return null;
          const product = getProductById(row.productId);
          return product ? { product, quantity: row.quantity } : null;
        })
        .filter(Boolean) as CartItem[],
    );

    const wishlistIds = normalizeStoredIds(
      getStorage<unknown>(STORAGE_KEYS.wishlist, []),
    );
    const recentIds = normalizeStoredIds(
      getStorage<unknown>(STORAGE_KEYS.recentlyViewed, []),
    );

    setWishlist(hydrateProducts(wishlistIds));
    setRecentlyViewed(hydrateProducts(recentIds).slice(0, 8));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    setStorage(
      STORAGE_KEYS.cart,
      cart.map((c) => ({ productId: c.product.id, quantity: c.quantity })),
    );
  }, [cart, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    setStorage(
      STORAGE_KEYS.wishlist,
      wishlist.map((product) => product.id),
    );
  }, [wishlist, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    setStorage(
      STORAGE_KEYS.recentlyViewed,
      recentlyViewed.map((product) => product.id).slice(0, 8),
    );
  }, [recentlyViewed, hydrated]);

  const addToCart = useCallback((product: Product, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.product.id === product.id);
      if (existing) {
        return prev.map((c) =>
          c.product.id === product.id
            ? { ...c, quantity: c.quantity + qty }
            : c,
        );
      }
      return [...prev, { product, quantity: qty }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => prev.filter((c) => c.product.id !== productId));
  }, []);

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      if (quantity < 1) {
        setCart((prev) => prev.filter((c) => c.product.id !== productId));
        return;
      }
      setCart((prev) =>
        prev.map((c) =>
          c.product.id === productId ? { ...c, quantity } : c,
        ),
      );
    },
    [],
  );

  const clearCart = useCallback(() => setCart([]), []);

  const addToWishlist = useCallback((product: Product) => {
    setWishlist((prev) =>
      prev.some((p) => p.id === product.id) ? prev : [...prev, product],
    );
  }, []);

  const removeFromWishlist = useCallback((productId: string) => {
    setWishlist((prev) => prev.filter((p) => p.id !== productId));
  }, []);

  const isInWishlist = useCallback(
    (productId: string) => wishlist.some((p) => p.id === productId),
    [wishlist],
  );

  const addRecentlyViewed = useCallback((product: Product) => {
    setRecentlyViewed((prev) => [
      product,
      ...prev.filter((p) => p.id !== product.id),
    ].slice(0, 8));
  }, []);

  const value = useMemo(
    () => ({
      cart,
      wishlist,
      recentlyViewed,
      cartCount: cart.reduce((s, c) => s + c.quantity, 0),
      wishlistCount: wishlist.length,
      cartTotal: cart.reduce(
        (s, c) => s + c.product.price * c.quantity,
        0,
      ),
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      addRecentlyViewed,
      hydrated,
    }),
    [
      cart,
      wishlist,
      recentlyViewed,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      addRecentlyViewed,
      hydrated,
    ],
  );

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
