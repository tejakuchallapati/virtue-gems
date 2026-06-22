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
import { motion } from "framer-motion";
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

export function MobileBottomNav() {
  const pathname = usePathname();
  const { cartCount, wishlistCount, hydrated } = useStore();

  if (pathname.startsWith("/admin")) return null;

  const navItems =
    pathname === "/" ? items.filter((item) => !item.external) : items;

  return (
    <nav className="safe-bottom fixed bottom-0 left-0 right-0 z-50 md:hidden">
      {/* Gold shimmer top edge */}
      <div className="relative h-px overflow-hidden">
        <motion.div
          className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-gold to-transparent"
          animate={{ x: ["-100%", "300%"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="border-t border-gold/20 bg-[#0f172a]/95 shadow-[0_-8px_32px_rgba(0,0,0,0.25)]">
        <div className="flex items-stretch justify-around px-1 py-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = !item.external && pathname === item.href;
            const badge =
              item.badge === "cart"
                ? cartCount
                : item.badge === "wishlist"
                  ? wishlistCount
                  : 0;

            const inner = (
              <>
                {active && (
                  <motion.div
                    layoutId="mobile-nav-pill"
                    className="absolute inset-x-1 inset-y-0 rounded-xl bg-gold/15"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <motion.span
                  className="relative flex flex-col items-center gap-0.5"
                  whileTap={{ scale: 0.9 }}
                >
                  <span className="relative">
                    <Icon
                      className={cn(
                        "h-5 w-5 transition-colors",
                        item.external
                          ? "text-[#25D366]"
                          : active
                            ? "text-gold"
                            : "text-light/50",
                      )}
                    />
                    {hydrated && badge > 0 && (
                      <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-0.5 text-[9px] font-bold text-dark">
                        {badge}
                      </span>
                    )}
                  </span>
                  <span
                    className={cn(
                      "text-[10px] font-medium transition-colors",
                      item.external
                        ? "text-[#25D366]/80"
                        : active
                          ? "text-gold"
                          : "text-light/50",
                    )}
                  >
                    {item.label}
                  </span>
                </motion.span>
              </>
            );

            if (item.external) {
              return (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative flex min-h-[52px] flex-1 flex-col items-center justify-center py-1.5"
                >
                  {inner}
                </a>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative flex min-h-[52px] flex-1 flex-col items-center justify-center py-1.5"
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
