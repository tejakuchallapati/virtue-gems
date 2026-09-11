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
    <header className="safe-top safe-x sticky top-0 z-[60] w-full border-b border-[#d4af37]/20 bg-[#1a0a2e]/95 backdrop-blur-xl md:hidden">
      <div className="h-px bg-gradient-to-r from-transparent via-[#d4af37]/45 to-transparent" />

      <div className="relative flex h-14 w-full items-center justify-start px-4">
        <Link
          href="/"
          className="min-w-0 transition active:scale-95"
          aria-label="Virtue Gems home"
        >
          <Image
            src="/logo-vg.png"
            alt="Virtue Gems"
            width={140}
            height={56}
            className="h-10 w-auto max-w-[9.5rem] object-contain"
            priority
          />
        </Link>
      </div>
    </header>
  );
}
