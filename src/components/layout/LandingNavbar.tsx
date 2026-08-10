"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, ShoppingCart, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useStore } from "@/context/StoreProvider";
import { cn } from "@/lib/utils";
import { NavBrand } from "./NavBrand";

const desktopLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function DesktopNavLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className="group relative z-20 px-3 py-2 lg:px-4"
      aria-current={active ? "page" : undefined}
    >
      <span
        className={cn(
          "text-sm font-semibold uppercase tracking-[0.12em] transition-colors duration-200 lg:text-[15px]",
          active ? "text-gold" : "text-light/90 group-hover:text-gold",
        )}
      >
        {label}
      </span>
      <span
        className={cn(
          "absolute bottom-0 left-3 right-3 h-px bg-gradient-to-r from-transparent via-gold to-transparent transition-opacity lg:left-4 lg:right-4",
          active ? "opacity-100" : "opacity-0 group-hover:opacity-60",
        )}
      />
    </Link>
  );
}

export function LandingNavbar() {
  const pathname = usePathname();
  const { cartCount, wishlistCount, hydrated } = useStore();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname !== "/") return null;

  return (
    <>
      {/*
        Mobile top bar — logo + actions only.
        Primary destinations live in the bottom nav so this row never overflows.
      */}
      <header
        className={cn(
          "safe-top safe-x fixed inset-x-0 top-0 z-[60] w-full overflow-hidden md:hidden",
          scrolled
            ? "border-b border-gold/20 bg-[#1a0a2e]/95 backdrop-blur-lg"
            : "bg-gradient-to-b from-[#1a0a2e]/90 to-transparent",
        )}
      >
        <div className="flex h-12 w-full items-center justify-between px-2">
          <Link
            href="/"
            className="flex min-w-0 shrink items-center px-1 opacity-95 active:scale-95"
            aria-label="Virtue Gems home"
          >
            <Image
              src="/logo.png"
              alt="Virtue Gems"
              width={100}
              height={40}
              className="h-6 w-auto max-w-[7.5rem] object-contain"
              priority
            />
          </Link>
          <div className="flex shrink-0 items-center">
            <Link
              href="/wishlist"
              className="relative flex h-11 w-11 items-center justify-center text-light/80 active:scale-95"
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
              href="/cart"
              className="relative flex h-11 w-11 items-center justify-center text-light/80 active:scale-95"
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
        </div>
      </header>

      {/* Desktop — no 3D transforms (they broke link hit-testing) */}
      <header
        className={cn(
          "safe-top fixed inset-x-0 top-0 z-[60] hidden w-full transition-[background,border-color] duration-300 md:block",
          scrolled
            ? "border-b border-gold/20 bg-[#1a0a2e]/92 backdrop-blur-xl"
            : "border-b border-transparent bg-gradient-to-b from-[#1a0a2e]/75 via-[#1a0a2e]/30 to-transparent",
        )}
      >
        <div className="relative mx-auto flex h-16 max-w-[1400px] items-center px-6 lg:px-10">
          <div className="relative z-10 shrink-0">
            <NavBrand logoClassName="h-9 w-9" />
          </div>

          <nav className="absolute left-1/2 top-1/2 z-20 flex -translate-x-1/2 -translate-y-1/2 items-center">
            {desktopLinks.map((link) => (
              <DesktopNavLink
                key={link.href}
                href={link.href}
                label={link.label}
                active={isActivePath(pathname, link.href)}
              />
            ))}
          </nav>

          <div className="relative z-10 ml-auto flex items-center gap-3">
            <Link
              href="/cart"
              className="relative flex h-10 w-10 items-center justify-center text-light/70 transition hover:text-gold"
              aria-label="Cart"
            >
              <ShoppingCart className="h-[18px] w-[18px]" />
              {hydrated && cartCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-0.5 text-[9px] font-bold text-dark">
                  {cartCount}
                </span>
              )}
            </Link>
            <Link
              href="/shop"
              className="flex items-center gap-1.5 border border-gold/35 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-gold transition hover:border-gold/60 hover:bg-gold/10"
            >
              Shop
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}
