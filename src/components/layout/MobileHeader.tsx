"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function MobileHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  if (pathname.startsWith("/admin")) return null;

  return (
    <header
      className={cn(
        "safe-top sticky top-0 z-40 overflow-hidden md:hidden",
        isHome
          ? "border-b border-gold/25 bg-[#1a0a2e]/60 backdrop-blur-md"
          : "border-b border-gold/20 bg-gradient-to-r from-[#1a0a2e] via-[#12061f] to-[#1a0a2e]",
      )}
    >
      <div className="relative h-px overflow-hidden bg-gold/10">
        <motion.div
          className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-gold/80 to-transparent"
          animate={{ x: ["-100%", "400%"] }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "linear",
            repeatDelay: 1,
          }}
        />
      </div>

      <div className="relative flex h-11 items-center justify-center px-4">
        <Link href="/" className="group flex items-center gap-2">
          <span
            className="h-4 w-px bg-gradient-to-b from-transparent via-gold to-transparent opacity-60"
            aria-hidden
          />
          <div className="flex flex-col items-center leading-none">
            <span className="text-[11px] font-bold tracking-[0.32em] text-gold transition group-active:scale-95">
              VIRTUE
            </span>
            <span className="mt-0.5 text-[8px] font-light tracking-[0.55em] text-light/75">
              GEMS
            </span>
          </div>
          <span
            className="h-4 w-px bg-gradient-to-b from-transparent via-gold to-transparent opacity-60"
            aria-hidden
          />
        </Link>
      </div>
    </header>
  );
}
