"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Store,
  Info,
  Mail,
  Heart,
  ShoppingCart,
  ArrowRight,
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
    <Link href={href} className="group relative flex items-center gap-1 px-1.5 py-1.5">
      <Icon
        className={cn(
          "h-3.5 w-3.5 transition-all duration-300",
          active ? "text-gold" : "text-light/45 group-hover:text-gold group-hover:scale-110",
        )}
      />
      <span
        className={cn(
          "text-[11px] font-medium uppercase tracking-[0.2em] transition-all duration-300",
          active ? "text-gold" : "text-light/70 group-hover:text-gold group-hover:tracking-[0.24em]",
        )}
      >
        {label}
      </span>
      {active ? (
        <motion.span
          layoutId="landing-nav-underline"
          className="absolute bottom-1 left-2 right-2 h-px bg-gradient-to-r from-transparent via-gold to-transparent"
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      ) : (
        <span className="absolute bottom-1 left-1/2 h-px w-0 -translate-x-1/2 bg-gold transition-all duration-300 group-hover:w-full" />
      )}
    </Link>
  );
}

function DesktopActionLink({
  href,
  label,
  icon: Icon,
  badge,
  accent,
}: {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
  accent?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative flex items-center gap-1 px-1.5 py-1.5 transition-colors duration-300",
        accent ? "text-gold" : "text-light/65 hover:text-gold",
      )}
    >
      <span className="relative">
        <Icon className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
        {badge !== undefined && badge > 0 && (
          <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-0.5 text-[9px] font-bold text-dark">
            {badge}
          </span>
        )}
      </span>
      <span className="text-[11px] font-medium uppercase tracking-[0.18em]">
        {label}
      </span>
      {!accent && (
        <span className="absolute bottom-1 left-0 h-px w-0 bg-gold transition-all duration-300 group-hover:w-full" />
      )}
    </Link>
  );
}

function MobileNavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="group relative px-2 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-light/70 transition hover:text-gold"
    >
      {label}
      <span className="absolute bottom-0 left-1/2 h-px w-0 -translate-x-1/2 bg-gold transition-all group-hover:w-full" />
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
      {/* Mobile */}
      <header
        className={cn(
          "safe-top fixed left-0 right-0 top-0 z-50 md:hidden",
          scrolled
            ? "bg-[#1a0a2e]/90 backdrop-blur-lg"
            : "bg-gradient-to-b from-[#1a0a2e]/80 to-transparent",
        )}
      >
        <div className="flex h-11 items-center justify-center border-b border-gold/15 px-3">
          <div className="flex items-center gap-2.5">
            <Link href="/" className="shrink-0 transition opacity-90 hover:opacity-100">
              <Image
                src="/logo.png"
                alt="Virtue Gems"
                width={100}
                height={40}
                className="h-7 w-auto object-contain"
                priority
              />
            </Link>
            <span className="h-3 w-px shrink-0 bg-gold/25" aria-hidden />
            <nav className="flex items-center gap-0.5">
              {mobileLinks.map((link) => (
                <MobileNavLink key={link.href} href={link.href} label={link.label} />
              ))}
            </nav>
            <span className="h-3 w-px shrink-0 bg-gold/25" aria-hidden />
            <div className="flex items-center gap-2.5">
              <Link href="/wishlist" className="relative text-light/65 hover:text-gold" aria-label="Wishlist">
                <Heart className="h-4 w-4" />
                {wishlistCount > 0 && (
                  <span className="absolute -right-1.5 -top-1.5 text-[9px] font-bold text-gold">
                    {wishlistCount}
                  </span>
                )}
              </Link>
              <Link href="/cart" className="relative text-light/65 hover:text-gold" aria-label="Cart">
                <ShoppingCart className="h-4 w-4" />
                {cartCount > 0 && (
                  <span className="absolute -right-1.5 -top-1.5 text-[9px] font-bold text-gold">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Desktop — minimal luxury bar */}
      <motion.header
        className={cn(
          "safe-top fixed left-0 right-0 top-0 z-50 hidden transition-all duration-500 md:block",
          scrolled
            ? "border-b border-gold/20 bg-[#1a0a2e]/92 backdrop-blur-xl"
            : "bg-gradient-to-b from-[#1a0a2e]/70 via-[#1a0a2e]/30 to-transparent",
        )}
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="mx-auto flex h-12 max-w-7xl items-center justify-center px-5 lg:px-8">
          <div className="flex items-center gap-3 lg:gap-4">
            <Link href="/" className="group shrink-0 transition duration-300 hover:opacity-90">
              <Image
                src="/logo.png"
                alt="Virtue Gems"
                width={120}
                height={48}
                className="h-8 w-auto object-contain transition duration-300 group-hover:scale-[1.03]"
                priority
              />
            </Link>

            <span className="h-3.5 w-px shrink-0 bg-gold/25" aria-hidden />

            <nav className="flex items-center">
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

            <span className="h-3.5 w-px shrink-0 bg-gold/25" aria-hidden />

            <div className="flex items-center">
              <DesktopActionLink
                href="/wishlist"
                label="Wishlist"
                icon={Heart}
                badge={wishlistCount}
              />
              <DesktopActionLink href="/cart" label="Cart" icon={ShoppingCart} badge={cartCount} />
              <Link
                href="/shop"
                className="group flex items-center gap-1.5 py-1.5 pl-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-gold transition hover:tracking-[0.24em]"
              >
                Shop
                <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </motion.header>
    </>
  );
}
