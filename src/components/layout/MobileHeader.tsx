"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
      <div className="h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

      <div className="relative flex h-12 items-center justify-center px-4">
        <Link href="/" className="transition active:scale-95">
          <Image
            src="/logo.png"
            alt="Virtue Gems"
            width={100}
            height={40}
            className="h-8 w-auto object-contain"
            priority
          />
        </Link>
      </div>
    </header>
  );
}
