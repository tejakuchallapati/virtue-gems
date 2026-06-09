"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingBag, Heart, MessageCircle, Store } from "lucide-react";
import { useStore } from "@/context/StoreProvider";
import { whatsAppContactUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

const items = [
  { href: "/", label: "Home", icon: Home },
  { href: "/shop", label: "Shop", icon: Store },
  { href: "/wishlist", label: "Wishlist", icon: Heart, badge: "wishlist" as const },
  { href: "/cart", label: "Cart", icon: ShoppingBag, badge: "cart" as const },
  { href: whatsAppContactUrl, label: "WhatsApp", icon: MessageCircle, external: true },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const { cartCount, wishlistCount } = useStore();

  if (pathname.startsWith("/admin")) return null;

  return (
    <nav className="safe-bottom glass-dark fixed bottom-0 left-0 right-0 z-50 border-t border-gold/20 md:hidden">
      <div className="flex items-center justify-around px-1 py-2">
        {items.map((item) => {
          const Icon = item.icon;
          const active = !item.external && pathname === item.href;
          const badge =
            item.badge === "cart"
              ? cartCount
              : item.badge === "wishlist"
                ? wishlistCount
                : 0;

          const className = cn(
            "relative flex flex-1 flex-col items-center gap-0.5 py-1 text-[10px] font-medium transition",
            active ? "text-gold" : "text-light/60",
          );

          const content = (
            <>
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
              {badge > 0 && (
                <span className="absolute right-2 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[9px] font-bold text-dark">
                  {badge}
                </span>
              )}
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
                {content}
              </a>
            );
          }

          return (
            <Link key={item.href} href={item.href} className={className}>
              {content}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
