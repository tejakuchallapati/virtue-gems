"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, ShoppingCart } from "lucide-react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import { useStore } from "@/context/StoreProvider";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

function NavLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link href={href} className="group relative px-1.5 py-1.5">
      <span
        className={cn(
          "text-xs font-medium tracking-wide transition-colors duration-300",
          active ? "text-gold" : "text-light/75 group-hover:text-gold",
        )}
      >
        {label}
      </span>
      {active ? (
        <motion.span
          layoutId="desktop-nav-indicator"
          className="absolute -bottom-0.5 left-0 right-0 h-0.5 rounded-full bg-gradient-to-r from-transparent via-gold to-transparent"
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      ) : (
        <span className="absolute -bottom-0.5 left-1/2 h-0.5 w-0 -translate-x-1/2 rounded-full bg-gold transition-all duration-300 group-hover:w-full" />
      )}
    </Link>
  );
}

export function DesktopNavbar() {
  const pathname = usePathname();
  const { cartCount, wishlistCount } = useStore();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    setScrolled(y > 20);
  });

  if (pathname.startsWith("/admin")) return null;

  return (
    <motion.header
      className={cn(
        "sticky top-0 z-50 hidden border-b transition-colors duration-500 md:block",
        scrolled
          ? "border-gold/20 bg-[#1a0a2e]/95 shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-xl"
          : "border-gold/15 bg-[#1a0a2e]/90 backdrop-blur-md",
      )}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Animated gold shimmer line */}
      <div className="relative h-px overflow-hidden bg-gold/10">
        <motion.div
          className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-gold to-transparent"
          animate={{ x: ["-100%", "400%"] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
        />
      </div>

      <div className="mx-auto flex h-12 max-w-7xl items-center justify-center px-5 lg:px-8">
        <div className="flex items-center gap-3 lg:gap-4">
          <Link href="/" className="group flex shrink-0 items-center">
            <motion.div
              whileHover={{ scale: 1.04 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Image
                src="/logo.png"
                alt="Virtue Gems"
                width={120}
                height={48}
                className="h-8 w-auto object-contain"
                priority
              />
            </motion.div>
          </Link>

          <span className="h-3.5 w-px shrink-0 bg-gold/25" aria-hidden />

          <nav className="flex items-center gap-1">
            {links.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                label={link.label}
                active={pathname === link.href}
              />
            ))}
          </nav>

          <span className="h-3.5 w-px shrink-0 bg-gold/25" aria-hidden />

          <div className="flex items-center gap-0.5">
            <Link
              href="/wishlist"
              className="group relative flex items-center gap-1 px-1.5 py-1.5 text-light/70 transition hover:text-gold"
              aria-label="Wishlist"
            >
              <Heart className="h-3.5 w-3.5 transition group-hover:scale-110" />
              <span className="text-[10px] font-medium uppercase tracking-wider">Wishlist</span>
              {wishlistCount > 0 && (
                <span className="text-[9px] font-bold text-gold">{wishlistCount}</span>
              )}
              <span className="absolute bottom-0 left-0 h-px w-0 bg-gold transition-all group-hover:w-full" />
            </Link>

            <Link
              href="/cart"
              className={cn(
                "group relative flex items-center gap-1 px-1.5 py-1.5 transition-all duration-300",
                pathname === "/cart" ? "text-gold" : "text-light/70 hover:text-gold",
              )}
            >
              <ShoppingCart className="h-3.5 w-3.5 transition group-hover:scale-110" />
              <span className="text-[10px] font-medium uppercase tracking-wider">Cart</span>
              {cartCount > 0 && (
                <span className="text-[9px] font-bold text-gold">{cartCount}</span>
              )}
              <span className="absolute bottom-0 left-0 h-px w-0 bg-gold transition-all group-hover:w-full" />
            </Link>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
