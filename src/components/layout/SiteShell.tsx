"use client";

import { DesktopNavbar } from "./DesktopNavbar";
import { LandingNavbar } from "./LandingNavbar";
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

  const isHome = pathname === "/";

  return (
    <>
      <LoadingScreen />
      {/* Landing: dedicated dark nav with hover effects */}
      {isHome && <LandingNavbar />}
      {/* Inner pages: standard nav */}
      {!isHome && <DesktopNavbar />}
      {!isHome && <MobileHeader />}
      <PageTransition>
        <main
          className={
            isHome
              ? "min-h-[100dvh] pb-[calc(4.75rem+env(safe-area-inset-bottom))] md:pb-0"
              : "min-h-[calc(100dvh-2.75rem)] pb-[calc(4.75rem+env(safe-area-inset-bottom))] md:min-h-[calc(100vh-4rem)] md:pb-0"
          }
        >
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
