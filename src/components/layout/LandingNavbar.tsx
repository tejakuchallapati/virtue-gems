"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Heart,
  ShoppingCart,
  ArrowRight,
} from "lucide-react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useState } from "react";
import { useStore } from "@/context/StoreProvider";
import { useBrandIntroReady } from "@/hooks/useBrandIntroReady";
import { cn } from "@/lib/utils";
import { NavBrand } from "./NavBrand";

const mobileLinks = [
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
];

const desktopLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

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
    <Link href={href} className="group relative px-4 py-2">
      <span
        className={cn(
          "text-sm font-semibold uppercase tracking-[0.12em] transition-colors duration-300 lg:text-[15px]",
          active ? "text-gold" : "text-light/90 group-hover:text-gold",
        )}
      >
        {label}
      </span>
      {active ? (
        <motion.span
          layoutId="landing-nav-underline"
          className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-gold to-transparent"
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      ) : (
        <span className="absolute bottom-0 left-1/2 h-px w-0 -translate-x-1/2 bg-gold/70 transition-all duration-300 group-hover:w-full" />
      )}
    </Link>
  );
}

function MobileNavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="group relative flex min-h-10 items-center px-2 py-2 text-[10px] font-medium uppercase tracking-[0.08em] text-light/75 transition hover:text-gold active:scale-95"
    >
      {label}
      <span className="absolute bottom-1 left-1/2 h-px w-0 -translate-x-1/2 bg-gold transition-all group-hover:w-3/4" />
    </Link>
  );
}

export function LandingNavbar() {
  const pathname = usePathname();
  const { cartCount, wishlistCount, hydrated } = useStore();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const introReady = useBrandIntroReady();

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
        <div className="flex h-12 items-center justify-between gap-1 border-b border-gold/15 px-2">
          <Link href="/" className="shrink-0 px-1 transition opacity-90 hover:opacity-100 active:scale-95">
            <Image
              src="/logo.png"
              alt="Virtue Gems"
              width={100}
              height={40}
              className="h-6 w-auto object-contain"
              priority
            />
          </Link>
          <nav className="flex min-w-0 flex-1 items-center justify-center">
            {mobileLinks.map((link) => (
              <MobileNavLink key={link.href} href={link.href} label={link.label} />
            ))}
          </nav>
          <div className="flex shrink-0 items-center">
            <Link
              href="/wishlist"
              className="relative flex h-10 w-10 items-center justify-center text-light/70 hover:text-gold active:scale-95"
              aria-label="Wishlist"
            >
              <Heart className="h-[18px] w-[18px]" />
              {hydrated && wishlistCount > 0 && (
                <span className="absolute right-1 top-1 text-[9px] font-bold text-gold">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link
              href="/cart"
              className="relative flex h-10 w-10 items-center justify-center text-light/70 hover:text-gold active:scale-95"
              aria-label="Cart"
            >
              <ShoppingCart className="h-[18px] w-[18px]" />
              {hydrated && cartCount > 0 && (
                <span className="absolute right-1 top-1 text-[9px] font-bold text-gold">
                  {cartCount}
                </span>
              )}
            </Link>
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
        initial={{ y: -72, opacity: 0 }}
        animate={
          introReady
            ? { y: 0, opacity: 1 }
            : { y: -72, opacity: 0 }
        }
        transition={{ duration: 0.75, delay: introReady ? 0.35 : 0, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="relative mx-auto flex h-16 max-w-[1400px] items-center px-6 lg:px-10">
          <motion.div
            className="relative z-10"
            initial={{ opacity: 0, rotateY: -55, z: -40, x: -20 }}
            animate={
              introReady
                ? { opacity: 1, rotateY: 0, z: 0, x: 0 }
                : { opacity: 0, rotateY: -55, z: -40, x: -20 }
            }
            transition={{ delay: 0.4, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformStyle: "preserve-3d" }}
          >
            <NavBrand logoClassName="h-9 w-9" />
          </motion.div>

          <nav
            className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center"
            style={{ perspective: 800, transformStyle: "preserve-3d" }}
          >
            {desktopLinks.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, rotateX: -90, z: -50, y: -16 }}
                animate={
                  introReady
                    ? { opacity: 1, rotateX: 0, z: 0, y: 0 }
                    : { opacity: 0, rotateX: -90, z: -50, y: -16 }
                }
                transition={{
                  delay: 0.55 + i * 0.12,
                  duration: 0.55,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{ transformStyle: "preserve-3d", transformOrigin: "50% 0%" }}
              >
                <DesktopNavLink
                  href={link.href}
                  label={link.label}
                  active={pathname === link.href}
                />
              </motion.div>
            ))}
          </nav>

          <motion.div
            className="relative z-10 ml-auto flex items-center gap-4"
            initial={{ opacity: 0, rotateY: 55, z: -40, x: 20 }}
            animate={
              introReady
                ? { opacity: 1, rotateY: 0, z: 0, x: 0 }
                : { opacity: 0, rotateY: 55, z: -40, x: 20 }
            }
            transition={{ delay: 1.05, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformStyle: "preserve-3d" }}
          >
            <Link
              href="/cart"
              className="group relative flex h-9 w-9 items-center justify-center text-light/60 transition hover:text-gold"
              aria-label="Cart"
            >
              <ShoppingCart className="h-[18px] w-[18px] transition-transform duration-300 group-hover:scale-110" />
              {hydrated && cartCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-0.5 text-[9px] font-bold text-dark">
                  {cartCount}
                </span>
              )}
            </Link>
            <Link
              href="/shop"
              className="group flex items-center gap-1.5 border border-gold/35 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.24em] text-gold transition hover:border-gold/60 hover:bg-gold/10"
            >
              Shop
              <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </motion.div>
        </div>
      </motion.header>
    </>
  );
}
