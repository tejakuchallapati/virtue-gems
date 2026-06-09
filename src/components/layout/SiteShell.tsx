"use client";

import { DesktopNavbar } from "./DesktopNavbar";
import { MobileHeader } from "./MobileHeader";
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
      {/* Desktop: animated top nav */}
      <DesktopNavbar />
      {/* Mobile: dark luxury top bar */}
      <MobileHeader />
      <PageTransition>
        <main className="min-h-[calc(100dvh-2.75rem)] pb-[calc(4.75rem+env(safe-area-inset-bottom))] md:min-h-[calc(100vh-4rem)] md:pb-0">
          {children}
        </main>
      </PageTransition>
      <Footer />
      {/* Mobile: bottom nav with effects */}
      <MobileBottomNav />
      {/* WhatsApp float — desktop only (bottom nav has WhatsApp on mobile) */}
      <WhatsAppFloat />
    </>
  );
}
