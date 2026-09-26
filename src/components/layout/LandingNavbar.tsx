"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Playfair_Display } from "next/font/google";
import { useStore } from "@/context/StoreProvider";
import { cn } from "@/lib/utils";

const wordmark = Playfair_Display({
  subsets: ["latin"],
  weight: ["400"],
});

/** "Virtue Gems" wordmark over the hero; crossfades to the logo once the hero logo scrolls away. */
function NavBrand({ showLogo, size }: { showLogo: boolean; size: "mobile" | "desktop" }) {
  const mobile = size === "mobile";

  return (
    <span className="grid items-center [&>*]:col-start-1 [&>*]:row-start-1">
      <span
        aria-hidden={showLogo}
        className={cn(
          wordmark.className,
          "whitespace-nowrap text-[#e6d08a] transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          mobile ? "text-xl sm:text-2xl" : "text-2xl lg:text-[1.7rem]",
          showLogo ? "pointer-events-none -translate-y-1 opacity-0" : "translate-y-0 opacity-100",
        )}
        style={{ letterSpacing: "0.02em", textShadow: "0 1px 12px rgba(0,0,0,0.35)" }}
      >
        Virtue Gems
      </span>
      <Image
        src="/logo-vg.png"
        alt=""
        aria-hidden={!showLogo}
        width={120}
        height={48}
        priority
        className={cn(
          "w-auto object-contain transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          mobile ? "h-8 sm:h-9" : "h-9 drop-shadow-[0_2px_8px_rgba(212,175,55,0.3)]",
          showLogo ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-1 opacity-0",
        )}
      />
    </span>
  );
}

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

/** Home nav — gold text always. Transparent on hero; purple pill after scroll; wordmark → logo past the hero. */
export function LandingNavbar() {
  const pathname = usePathname();
  const { cartCount, hydrated } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        setScrolled(window.scrollY > 40);
        setPastHero(window.scrollY > window.innerHeight * 0.45);
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname !== "/") return null;

  const gold = "#d4af37";

  return (
    <>
      <header
        className={cn(
          "safe-top safe-x fixed inset-x-0 top-0 z-[90] w-full transition-[background-color,border-color,backdrop-filter,box-shadow] duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] md:hidden",
          scrolled
            ? "border-b border-[#d4af37]/30 bg-[#1a0a2e]/95 shadow-[0_8px_24px_rgba(10,3,20,0.25)] backdrop-blur-md"
            : "border-b border-transparent bg-transparent shadow-none",
        )}
      >
        <div className="flex h-12 items-center px-3 sm:h-14 sm:px-4">
          <Link href="/" aria-label="Virtue Gems home" className="shrink-0 touch-manipulation active:opacity-80">
            <NavBrand showLogo={pastHero} size="mobile" />
          </Link>
        </div>
      </header>

      <header className="safe-top fixed inset-x-0 top-0 z-[90] hidden w-full px-4 pt-3 md:block lg:px-6">
        <div
          className={cn(
            "mx-auto flex items-center gap-2 px-4 transition-[max-width,height,background-color,border-color,box-shadow,padding] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
            scrolled
              ? "h-12 max-w-3xl rounded-2xl border border-[#d4af37]/35 bg-[#1a0a2e] shadow-lg"
              : "h-14 max-w-6xl bg-transparent lg:h-16 lg:px-6",
          )}
        >
          <Link href="/" className="flex shrink-0 items-center touch-manipulation" aria-label="Virtue Gems home">
            <NavBrand showLogo={pastHero} size="desktop" />
          </Link>

          <nav className="flex flex-1 items-center justify-center gap-1">
            {desktopLinks.map((link) => {
              const active = isActivePath(pathname, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] lg:px-4 lg:text-xs"
                  style={{ color: active ? "#f0d78c" : gold }}
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
              style={{ color: gold }}
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
              style={{ color: gold, borderColor: "rgba(212,175,55,0.55)" }}
            >
              Shop
              <ArrowRight className="ml-1 inline h-3 w-3" />
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}
