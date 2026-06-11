"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Store,
  Info,
  Mail,
  Heart,
  ShoppingCart,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useState } from "react";
import { useStore } from "@/context/StoreProvider";
import { cn } from "@/lib/utils";

const mobileLinks = [
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
];

const desktopLinks: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/", label: "Home", icon: Home },
  { href: "/shop", label: "Shop", icon: Store },
  { href: "/about", label: "About", icon: Info },
  { href: "/contact", label: "Contact", icon: Mail },
];

function DesktopNavItem({
  href,
  label,
  icon: Icon,
  active,
}: {
  href: string;
  label: string;
  icon: LucideIcon;
  active: boolean;
}) {
  return (
    <Link href={href} className="group relative flex items-center gap-2 rounded-xl px-3 py-2">
      <motion.span
        className={cn(
          "absolute inset-0 rounded-xl transition-colors duration-300",
          active ? "bg-gold/15" : "bg-transparent group-hover:bg-gold/10",
        )}
        layoutId={active ? "nav-active-bg" : undefined}
      />
      <Icon
        className={cn(
          "relative h-4 w-4 transition-all duration-300",
          active ? "text-gold" : "text-light/60 group-hover:scale-110 group-hover:text-gold",
        )}
      />
      <span
        className={cn(
          "relative text-sm font-medium transition-colors duration-300",
          active ? "text-gold" : "text-light/75 group-hover:text-gold",
        )}
      >
        {label}
      </span>
      <span
        className={cn(
          "absolute -bottom-1 left-1/2 h-px -translate-x-1/2 bg-gradient-to-r from-transparent via-gold to-transparent transition-all duration-300",
          active ? "w-3/4 opacity-100" : "w-0 opacity-0 group-hover:w-3/4 group-hover:opacity-80",
        )}
      />
    </Link>
  );
}

function DesktopActionItem({
  href,
  label,
  icon: Icon,
  badge,
  variant = "default",
}: {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
  variant?: "default" | "cta";
}) {
  const isCta = variant === "cta";

  return (
    <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
      <Link
        href={href}
        className={cn(
          "group relative flex items-center gap-2 overflow-hidden rounded-xl px-3 py-2 text-sm font-semibold transition-all duration-300",
          isCta
            ? "bg-gold text-dark shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_28px_rgba(212,175,55,0.5)]"
            : "text-light/75 hover:bg-gold/10 hover:text-gold",
        )}
      >
        {isCta && (
          <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/35 to-transparent transition duration-700 group-hover:translate-x-full" />
        )}
        <Icon className={cn("relative h-4 w-4", isCta && "text-dark")} />
        <span className="relative">{label}</span>
        {badge !== undefined && badge > 0 && (
          <span
            className={cn(
              "relative flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-bold",
              isCta ? "bg-dark text-gold" : "bg-gold text-dark",
            )}
          >
            {badge}
          </span>
        )}
      </Link>
    </motion.div>
  );
}

function MobileNavLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <Link href={href} className="group relative px-3 py-2">
      <span className="relative text-xs font-medium tracking-[0.18em] uppercase text-light/75 transition group-hover:text-gold">
        {label}
      </span>
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

  if (pathname !== "/") return null;

  return (
    <>
      {/* ── Mobile nav (unchanged) ── */}
      <header className="safe-top fixed left-0 right-0 top-0 z-50 overflow-hidden border-b border-gold/25 bg-[#1a0a2e]/60 backdrop-blur-md md:hidden">
        <div className="relative h-px overflow-hidden bg-gold/10">
          <motion.div
            className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-gold/80 to-transparent"
            animate={{ x: ["-100%", "400%"] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
          />
        </div>
        <div className="flex h-11 items-center justify-between px-4">
          <Link href="/" className="flex flex-col items-center leading-none">
            <span className="text-[11px] font-bold tracking-[0.32em] text-gold">VIRTUE</span>
            <span className="mt-0.5 text-[8px] font-light tracking-[0.55em] text-light/75">
              GEMS
            </span>
          </Link>
          <nav className="flex items-center gap-0.5">
            {mobileLinks.map((link) => (
              <MobileNavLink key={link.href} href={link.href} label={link.label} />
            ))}
          </nav>
          <div className="flex items-center gap-1">
            <Link href="/wishlist" className="relative p-2 text-light/70" aria-label="Wishlist">
              <Heart className="h-4 w-4" />
              {wishlistCount > 0 && (
                <span className="absolute right-0 top-0 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-gold text-[8px] font-bold text-dark">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link href="/cart" className="relative p-2 text-light/70" aria-label="Cart">
              <ShoppingCart className="h-4 w-4" />
              {cartCount > 0 && (
                <span className="absolute right-0 top-0 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-gold text-[8px] font-bold text-dark">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* ── Desktop animated nav ── */}
      <motion.header
        className={cn(
          "safe-top fixed left-0 right-0 top-0 z-50 hidden transition-all duration-500 md:block",
          scrolled
            ? "border-b border-gold/25 bg-[#1a0a2e]/95 shadow-[0_8px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl"
            : "border-b border-gold/10 bg-[#1a0a2e]/40 backdrop-blur-md",
        )}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="relative h-px overflow-hidden">
          <motion.div
            className="absolute inset-y-0 w-1/4 bg-gradient-to-r from-transparent via-gold to-transparent"
            animate={{ x: ["-100%", "500%"] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
          />
        </div>

        <div className="mx-auto flex h-[4.25rem] max-w-7xl items-center justify-between gap-4 px-6 lg:px-8">
          <Link href="/" className="group flex shrink-0 items-center gap-2.5">
            <motion.div
              className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/30 bg-gold/10"
              whileHover={{ rotate: 12, scale: 1.08 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Sparkles className="h-4 w-4 text-gold" />
            </motion.div>
            <div className="flex flex-col leading-none">
              <span className="text-xs font-bold tracking-[0.25em] text-gold transition group-hover:tracking-[0.3em]">
                VIRTUE
              </span>
              <span className="mt-0.5 text-[9px] font-light tracking-[0.45em] text-light/65">
                GEMS
              </span>
            </div>
          </Link>

          <nav className="flex items-center gap-0.5 rounded-2xl border border-gold/10 bg-[#12061f]/60 px-2 py-1 backdrop-blur-sm">
            {desktopLinks.map((link) => (
              <DesktopNavItem
                key={link.href}
                href={link.href}
                label={link.label}
                icon={link.icon}
                active={pathname === link.href}
              />
            ))}
          </nav>

          <div className="flex items-center gap-1.5">
            <DesktopActionItem
              href="/wishlist"
              label="Wishlist"
              icon={Heart}
              badge={wishlistCount}
            />
            <DesktopActionItem
              href="/cart"
              label="Cart"
              icon={ShoppingCart}
              badge={cartCount}
            />
            <DesktopActionItem
              href="/shop"
              label="Shop Now"
              icon={Sparkles}
              variant="cta"
            />
          </div>
        </div>
      </motion.header>
    </>
  );
}
