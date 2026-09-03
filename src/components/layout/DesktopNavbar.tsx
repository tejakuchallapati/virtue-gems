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
          "text-xs font-semibold uppercase tracking-[0.08em] transition-colors duration-200 lg:text-[15px] lg:tracking-[0.12em]",
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
      <div className="relative mx-auto flex h-14 max-w-[1400px] items-center gap-2 px-4 lg:h-16 lg:px-10">
        <NavBrand className="relative z-10 min-w-0" logoClassName="h-8 w-8 lg:h-9 lg:w-9" />

        <nav className="relative z-20 ml-2 hidden min-w-0 flex-1 items-center justify-center overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] md:flex lg:absolute lg:left-1/2 lg:top-1/2 lg:ml-0 lg:flex-none lg:-translate-x-1/2 lg:-translate-y-1/2 lg:overflow-visible [&::-webkit-scrollbar]:hidden">
          {links.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              label={link.label}
              active={isActivePath(pathname, link.href)}
            />
          ))}
        </nav>

        <div className="relative z-10 ml-auto flex shrink-0 items-center gap-2 lg:gap-3">
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
