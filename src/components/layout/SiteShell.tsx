"use client";

import dynamic from "next/dynamic";
import { Suspense, useEffect } from "react";
import { usePathname } from "next/navigation";
import { clearBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { AnalyticsPageViews } from "@/components/analytics/AnalyticsPageViews";
import { DesktopNavbar } from "./DesktopNavbar";
import { LandingNavbar } from "./LandingNavbar";
import { MobileHeader } from "./MobileHeader";
import { MobileBottomNav } from "./MobileBottomNav";
import { Footer } from "./Footer";
import { WhatsAppFloat } from "./WhatsAppFloat";

const LoadingScreen = dynamic(
  () => import("./LoadingScreen").then((m) => m.LoadingScreen),
  { ssr: false },
);

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  // Recover document scroll on every route (and after bfcache restores).
  useEffect(() => {
    clearBodyScrollLock();
    const onPageShow = () => clearBodyScrollLock();
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, [pathname]);

  if (isAdmin) return <>{children}</>;

  const isHome = pathname === "/";

  return (
    <div className="relative w-full min-w-0 max-w-full overflow-x-clip">
      <a
        href="#main-content"
        className="fixed left-3 top-3 z-[120] -translate-y-20 rounded-lg bg-dark px-4 py-2 text-sm font-semibold text-gold shadow-lg transition-transform focus:translate-y-0"
      >
        Skip to main content
      </a>
      <GoogleAnalytics />
      <Suspense fallback={null}>
        <AnalyticsPageViews />
      </Suspense>
      {isHome && <LoadingScreen />}
      {isHome && <LandingNavbar />}
      {!isHome && <DesktopNavbar />}
      {!isHome && <MobileHeader />}
      <main
        id="main-content"
        tabIndex={-1}
        className={
          isHome
            ? "page-mobile-safe min-h-dvh w-full min-w-0 max-w-full"
            : "page-mobile-safe min-h-[calc(100dvh-3rem)] w-full min-w-0 max-w-full md:min-h-[calc(100vh-4rem)]"
        }
      >
        {children}
      </main>
      <Footer />
      <MobileBottomNav />
      <WhatsAppFloat />
    </div>
  );
}
