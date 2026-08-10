"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";
import { usePathname } from "next/navigation";
import { useStore } from "@/context/StoreProvider";
import { cn } from "@/lib/utils";

export function MobileHeader() {
  const pathname = usePathname();
  const { cartCount, wishlistCount, hydrated } = useStore();

  if (pathname.startsWith("/admin") || pathname === "/") return null;

  return (
    <header className="safe-top safe-x sticky top-0 z-[60] w-full overflow-hidden border-b border-gold/20 bg-gradient-to-r from-[#1a0a2e] via-[#12061f] to-[#1a0a2e] md:hidden">
      <div className="h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

      <div className="relative flex h-12 w-full items-center justify-between px-2">
        <Link
          href="/wishlist"
          className="relative flex h-11 w-11 shrink-0 items-center justify-center text-light/75 active:scale-95"
          aria-label="Wishlist"
        >
          <Heart className="h-[18px] w-[18px]" />
          {hydrated && wishlistCount > 0 && (
            <span className="absolute right-1.5 top-1.5 text-[9px] font-bold text-gold">
              {wishlistCount}
            </span>
          )}
        </Link>

        <Link
          href="/"
          className="mx-1 min-w-0 shrink transition active:scale-95"
          aria-label="Virtue Gems home"
        >
          <Image
            src="/logo.png"
            alt="Virtue Gems"
            width={100}
            height={40}
            className="mx-auto h-8 w-auto max-w-[7.5rem] object-contain"
            priority
          />
        </Link>

        <Link
          href="/cart"
          className={cn(
            "relative flex h-11 w-11 shrink-0 items-center justify-center active:scale-95",
            pathname === "/cart" ? "text-gold" : "text-light/75",
          )}
          aria-label="Cart"
        >
          <ShoppingCart className="h-[18px] w-[18px]" />
          {hydrated && cartCount > 0 && (
            <span className="absolute right-1.5 top-1.5 text-[9px] font-bold text-gold">
              {cartCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
