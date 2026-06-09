"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function MobileHeader() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <header className="sticky top-0 z-40 border-b border-gold/10 bg-light/95 md:hidden">
      <div className="flex h-12 items-center justify-center px-4">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="Virtue Gems"
            width={120}
            height={48}
            className="h-8 w-auto object-contain"
            priority
          />
        </Link>
      </div>
    </header>
  );
}
