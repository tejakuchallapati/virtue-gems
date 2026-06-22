"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import { useStore } from "@/context/StoreProvider";
import { cn } from "@/lib/utils";
import { NavBrand } from "./NavBrand";

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
          layoutId="desktop-nav-underline"
          className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-gold to-transparent"
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      ) : (
        <span className="absolute bottom-0 left-1/2 h-px w-0 -translate-x-1/2 bg-gold/70 transition-all duration-300 group-hover:w-full" />
      )}
    </Link>
  );
}

export function DesktopNavbar() {
  const pathname = usePathname();
  const { cartCount, hydrated } = useStore();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    setScrolled(y > 20);
  });

  if (pathname.startsWith("/admin")) return null;

  return (
    <motion.header
      className={cn(
        "sticky top-0 z-50 hidden transition-all duration-500 md:block",
        scrolled
          ? "border-b border-gold/20 bg-[#1a0a2e]/96 shadow-[0_4px_24px_rgba(0,0,0,0.3)] backdrop-blur-xl"
          : "border-b border-gold/10 bg-[#1a0a2e]/88 backdrop-blur-md",
      )}
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="relative mx-auto flex h-16 max-w-[1400px] items-center px-6 lg:px-10">
        <NavBrand className="relative z-10" logoClassName="h-9 w-9" />

        <nav className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center">
          {links.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              label={link.label}
              active={pathname === link.href}
            />
          ))}
        </nav>

        <div className="relative z-10 ml-auto flex items-center gap-4">
          <Link
            href="/cart"
            className={cn(
              "group relative flex h-9 w-9 items-center justify-center transition-colors duration-300",
              pathname === "/cart" ? "text-gold" : "text-light/60 hover:text-gold",
            )}
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
            className="border border-gold/35 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.24em] text-gold transition hover:border-gold/60 hover:bg-gold/10"
          >
            Shop
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
