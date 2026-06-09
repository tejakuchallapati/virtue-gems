"use client";

import { Navbar } from "./Navbar";
import { MobileBottomNav } from "./MobileBottomNav";
import { Footer } from "./Footer";
import { WhatsAppFloat } from "./WhatsAppFloat";
import { LoadingScreen } from "./LoadingScreen";
import { PageTransition } from "./PageTransition";
import { usePathname } from "next/navigation";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) return <>{children}</>;

  return (
    <>
      <LoadingScreen />
      <Navbar />
      <PageTransition>
        <main className="min-h-[calc(100vh-3.5rem)] pb-20 md:pb-0">{children}</main>
      </PageTransition>
      <Footer />
      <MobileBottomNav />
      <WhatsAppFloat />
    </>
  );
}
