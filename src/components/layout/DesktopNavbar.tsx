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
    <Link href={href} className="group relative px-1 py-2">
      <span
        className={cn(
          "text-sm font-medium tracking-wide transition-colors duration-300",
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

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
        <Link href="/" className="group flex shrink-0 items-center">
          <motion.div
            whileHover={{ scale: 1.04 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <Image
              src="/logo.png"
              alt="Virtue Gems"
              width={140}
              height={56}
              className="h-11 w-auto object-contain"
              priority
            />
          </motion.div>
        </Link>

        <nav className="flex items-center gap-8">
          {links.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              label={link.label}
              active={pathname === link.href}
            />
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/wishlist"
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-light/70 transition hover:bg-gold/15 hover:text-gold"
              aria-label="Wishlist"
            >
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-bold text-dark"
                >
                  {wishlistCount}
                </motion.span>
              )}
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/cart"
              className={cn(
                "relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300",
                pathname === "/cart"
                  ? "bg-gold text-dark shadow-[0_0_20px_rgba(212,175,55,0.35)]"
                  : cartCount > 0
                    ? "border border-gold/30 bg-gold/15 text-gold hover:bg-gold/25"
                    : "border border-gold/30 bg-gold/10 text-gold hover:bg-gold hover:text-dark",
              )}
            >
              <ShoppingCart className="h-4 w-4" />
              Cart
              {cartCount > 0 && (
                <motion.span
                  key={cartCount}
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  className="flex h-5 min-w-5 items-center justify-center rounded-full bg-dark px-1 text-[10px] font-bold text-gold"
                >
                  {cartCount}
                </motion.span>
              )}
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
}
