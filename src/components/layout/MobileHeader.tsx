"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Mobile top bar — logo only.
 * Cart / wishlist live in the bottom nav so we avoid duplicate chrome.
 */
export function MobileHeader() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin") || pathname === "/") return null;

  return (
    <header className="safe-top safe-x sticky top-0 z-[60] w-full border-b border-gold/20 bg-gradient-to-r from-[#1a0a2e] via-[#12061f] to-[#1a0a2e] md:hidden">
      <div className="h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

      <div className="relative flex h-12 w-full items-center justify-center px-3">
        <Link
          href="/"
          className="min-w-0 transition active:scale-95"
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
      </div>
    </header>
  );
}
