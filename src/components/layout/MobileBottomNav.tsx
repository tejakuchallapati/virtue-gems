"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  ShoppingCart,
  Heart,
  MessageCircle,
  Store,
} from "lucide-react";
import { useStore } from "@/context/StoreProvider";
import { whatsAppContactUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

const items = [
  { href: "/", label: "Home", icon: Home },
  { href: "/shop", label: "Shop", icon: Store },
  { href: "/wishlist", label: "Wishlist", icon: Heart, badge: "wishlist" as const },
  { href: "/cart", label: "Cart", icon: ShoppingCart, badge: "cart" as const },
  { href: whatsAppContactUrl, label: "WhatsApp", icon: MessageCircle, external: true },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function MobileBottomNav() {
  const pathname = usePathname();
  const { cartCount, wishlistCount, hydrated } = useStore();

  if (pathname.startsWith("/admin")) return null;

  return (
    <nav
      data-mobile-bottom-nav
      className="safe-bottom safe-x fixed inset-x-0 bottom-0 z-[60] w-full md:hidden"
      aria-label="Mobile primary"
    >
      <div className="h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />

      <div className="border-t border-gold/20 bg-[#0f172a]/96 shadow-[0_-8px_32px_rgba(0,0,0,0.25)] backdrop-blur-md">
        <div className="flex w-full min-w-0 items-stretch justify-around px-0.5 py-1">
          {items.map((item) => {
            const Icon = item.icon;
            const active = !item.external && isActivePath(pathname, item.href);
            const badge =
              item.badge === "cart"
                ? cartCount
                : item.badge === "wishlist"
                  ? wishlistCount
                  : 0;

            const className = cn(
              "relative flex min-h-12 flex-1 flex-col items-center justify-center gap-0.5 py-1.5 active:scale-95",
              active ? "text-gold" : item.external ? "text-[#25D366]" : "text-light/75",
            );

            const inner = (
              <>
                {active && (
                  <span
                    className="absolute inset-x-1 inset-y-0.5 rounded-xl bg-gold/15"
                    aria-hidden
                  />
                )}
                <span className="relative">
                  <Icon className="h-5 w-5" />
                  {hydrated && badge > 0 && (
                    <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-0.5 text-[9px] font-bold text-dark">
                      {badge}
                    </span>
                  )}
                </span>
                <span className="relative text-[10px] font-medium">{item.label}</span>
              </>
            );

            if (item.external) {
              return (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={className}
                >
                  {inner}
                </a>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={className}
                aria-current={active ? "page" : undefined}
              >
                {inner}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
