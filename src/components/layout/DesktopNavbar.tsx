"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { useStore } from "@/context/StoreProvider";
import { cn } from "@/lib/utils";
import Image from "next/image";

const links = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

const GOLD = "#d4af37";

/** Inner pages — always purple bar + gold letters (never black). */
export function DesktopNavbar() {
  const pathname = usePathname();
  const { cartCount, hydrated } = useStore();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname.startsWith("/admin") || pathname === "/") return null;

  return (
    <header className="safe-top fixed inset-x-0 top-0 z-[90] hidden w-full px-4 pt-3 print:hidden md:block lg:px-6">
      <div
        className={cn(
          "mx-auto flex items-center gap-2 rounded-2xl border border-[#d4af37]/30 bg-[#1a0a2e] px-4 shadow-lg transition-all duration-500",
          scrolled ? "h-12 max-w-3xl" : "h-14 max-w-[1400px] lg:h-16 lg:px-8",
        )}
      >
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <span className="relative h-8 w-[5.25rem]">
            <Image
              src="/logo-vg.png"
              alt=""
              width={120}
              height={48}
              className="h-full w-full object-contain drop-shadow-[0_2px_8px_rgba(212,175,55,0.3)]"
              priority
            />
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-[12px] font-bold tracking-[0.16em]" style={{ color: GOLD }}>
              VIRTUE
            </span>
            <span className="mt-0.5 text-[9px] font-semibold tracking-[0.3em]" style={{ color: GOLD }}>
              GEMS
            </span>
          </span>
        </Link>

        <nav className="flex flex-1 items-center justify-center">
          {links.map((link) => {
            const active = isActivePath(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] lg:px-4 lg:text-xs"
                style={{ color: active ? "#f0d78c" : GOLD }}
              >
                {link.label}
                {active && (
                  <span className="absolute bottom-0.5 left-2 right-2 h-px bg-[#d4af37]" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/cart"
            className="relative flex h-9 w-9 items-center justify-center"
            style={{ color: GOLD }}
            aria-label="Cart"
          >
            <ShoppingCart className="h-4 w-4" />
            {hydrated && cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#d4af37] px-0.5 text-[9px] font-bold text-[#1a0a2e]">
                {cartCount}
              </span>
            )}
          </Link>
          <Link
            href="/shop"
            className="border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em]"
            style={{ color: GOLD, borderColor: "rgba(212,175,55,0.5)" }}
          >
            Shop
          </Link>
        </div>
      </div>
    </header>
  );
}
