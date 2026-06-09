"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, ShoppingCart } from "lucide-react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useState } from "react";
import { useStore } from "@/context/StoreProvider";
import { cn } from "@/lib/utils";

const links = [
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

function LandingNavLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link href={href} className="group relative px-3 py-2 md:px-4">
      <motion.span
        className="absolute inset-0 rounded-full bg-gold/0 transition-colors duration-300 group-hover:bg-gold/10"
        whileHover={{ scale: 1.02 }}
      />
      <span
        className={cn(
          "relative text-xs font-medium tracking-[0.18em] uppercase transition-all duration-300 md:text-sm",
          active
            ? "text-gold"
            : "text-light/75 group-hover:text-gold group-hover:tracking-[0.22em]",
        )}
      >
        {label}
      </span>
      <span
        className={cn(
          "absolute -bottom-0.5 left-1/2 h-px -translate-x-1/2 bg-gradient-to-r from-transparent via-gold to-transparent transition-all duration-300",
          active ? "w-full opacity-100" : "w-0 opacity-0 group-hover:w-full group-hover:opacity-100",
        )}
      />
      <span className="pointer-events-none absolute -inset-1 rounded-full opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100 bg-gold/20" />
    </Link>
  );
}

export function LandingNavbar() {
  const pathname = usePathname();
  const { cartCount, wishlistCount } = useStore();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    setScrolled(y > 60);
  });

  if (pathname !== "/" || pathname.startsWith("/admin")) return null;

  return (
    <motion.header
      className={cn(
        "safe-top fixed left-0 right-0 top-0 z-50 transition-all duration-500",
        scrolled
          ? "border-b border-gold/25 bg-[#1a0a2e]/95 shadow-[0_8px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl"
          : "border-b border-gold/15 bg-[#1a0a2e]/50 backdrop-blur-md",
      )}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="relative h-px overflow-hidden">
        <motion.div
          className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-gold to-transparent"
          animate={{ x: ["-100%", "400%"] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear", repeatDelay: 1.5 }}
        />
      </div>

      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:h-16 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="group relative flex shrink-0 items-center gap-2">
          <span
            className="hidden h-5 w-px bg-gradient-to-b from-transparent via-gold/70 to-transparent sm:block"
            aria-hidden
          />
          <div className="flex flex-col leading-none">
            <span className="text-[11px] font-bold tracking-[0.28em] text-gold transition duration-300 group-hover:tracking-[0.34em] sm:text-xs">
              VIRTUE
            </span>
            <span className="mt-0.5 text-[8px] font-light tracking-[0.5em] text-light/70 transition duration-300 group-hover:text-light sm:text-[9px]">
              GEMS
            </span>
          </div>
          <motion.span
            className="absolute -inset-2 rounded-lg opacity-0 ring-1 ring-gold/0 transition group-hover:opacity-100 group-hover:ring-gold/30"
            aria-hidden
          />
        </Link>

        {/* Desktop links */}
        <nav className="hidden items-center gap-1 md:flex">
          <LandingNavLink href="/" label="Home" active />
          {links.map((link) => (
            <LandingNavLink
              key={link.href}
              href={link.href}
              label={link.label}
              active={pathname === link.href}
            />
          ))}
        </nav>

        {/* Mobile quick links */}
        <nav className="flex items-center gap-0.5 md:hidden">
          {links.slice(0, 2).map((link) => (
            <LandingNavLink
              key={link.href}
              href={link.href}
              label={link.label}
              active={false}
            />
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}>
            <Link
              href="/wishlist"
              className="group relative flex h-10 w-10 items-center justify-center rounded-full text-light/70 transition hover:text-gold"
              aria-label="Wishlist"
            >
              <span className="absolute inset-0 rounded-full bg-gold/0 transition group-hover:bg-gold/15" />
              <Heart className="relative h-5 w-5 transition group-hover:fill-gold/20" />
              {wishlistCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[9px] font-bold text-dark">
                  {wishlistCount}
                </span>
              )}
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/cart"
              className="group relative flex h-10 items-center gap-1.5 overflow-hidden rounded-full border border-gold/30 bg-gold/10 px-3 text-xs font-semibold text-gold transition hover:border-gold hover:bg-gold hover:text-dark sm:px-4 sm:text-sm"
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition duration-500 group-hover:translate-x-full" />
              <ShoppingCart className="relative h-4 w-4" />
              <span className="relative hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="relative flex h-5 min-w-5 items-center justify-center rounded-full bg-dark px-1 text-[10px] font-bold text-gold group-hover:bg-[#1a0a2e]">
                  {cartCount}
                </span>
              )}
            </Link>
          </motion.div>

          <motion.div
            className="hidden md:block"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            <Link
              href="/shop"
              className="group relative overflow-hidden rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-dark shadow-[0_0_20px_rgba(212,175,55,0.35)] transition hover:shadow-[0_0_28px_rgba(212,175,55,0.55)]"
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition duration-700 group-hover:translate-x-full" />
              <span className="relative">Shop Now</span>
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
}
