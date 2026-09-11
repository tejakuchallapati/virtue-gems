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
  const isInvoice = pathname.startsWith("/invoice");

  return (
    <div className="relative w-full min-w-0 max-w-full overflow-x-clip">
      <GoogleAnalytics />
      <Suspense fallback={null}>
        <AnalyticsPageViews />
      </Suspense>
      {isHome && <LoadingScreen />}
      <div className="print:hidden">
        {isHome && <LandingNavbar />}
        {!isHome && <DesktopNavbar />}
        {!isHome && <MobileHeader />}
      </div>
      <main
        id="main-content"
        tabIndex={-1}
        className={
          isHome
            ? "min-h-dvh w-full min-w-0 max-w-full"
            : "min-h-[calc(100dvh-3rem)] w-full min-w-0 max-w-full pt-0 md:min-h-[calc(100vh-4rem)] md:pt-[4.75rem]"
        }
      >
        {children}
      </main>
      {!isInvoice && <Footer />}
      {!isInvoice && <MobileBottomNav />}
      {!isInvoice && <WhatsAppFloat />}
    </div>
  );
}
