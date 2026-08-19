"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { useStore } from "@/context/StoreProvider";
import { cn } from "@/lib/utils";
import { NavBrand } from "./NavBrand";

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

  if (pathname.startsWith("/admin")) return null;

  return (
    <header
      className={cn(
        "sticky top-0 z-[60] hidden border-b transition-[background,box-shadow] duration-300 md:block",
        scrolled
          ? "border-gold/20 bg-[#1a0a2e]/96 shadow-[0_4px_24px_rgba(0,0,0,0.28)] backdrop-blur-xl"
          : "border-gold/10 bg-[#1a0a2e]/90 backdrop-blur-md",
      )}
    >
      <div className="relative mx-auto flex h-16 max-w-[1400px] items-center px-6 lg:px-10">
        <NavBrand className="relative z-10" logoClassName="h-9 w-9" />

        <nav className="absolute left-1/2 top-1/2 z-20 flex -translate-x-1/2 -translate-y-1/2 items-center">
          {links.map((link) => (
            <NavLink
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
            className={cn(
              "relative flex h-10 w-10 items-center justify-center transition-colors",
              pathname === "/cart" || pathname.startsWith("/cart/")
                ? "text-gold"
                : "text-light/60 hover:text-gold",
            )}
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
            className="border border-gold/35 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-gold transition hover:border-gold/60 hover:bg-gold/10"
          >
            Shop
          </Link>
        </div>
      </div>
    </header>
  );
}
