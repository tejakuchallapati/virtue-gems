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
    <div className="relative w-full max-w-full overflow-x-clip">
      <GoogleAnalytics />
      <Suspense fallback={null}>
        <AnalyticsPageViews />
      </Suspense>
      <LoadingScreen />
      {isHome && <LandingNavbar />}
      {!isHome && <DesktopNavbar />}
      {!isHome && <MobileHeader />}
      <main
        className={
          isHome
            ? "min-h-dvh w-full overflow-x-clip"
            : "min-h-[calc(100dvh-3rem)] w-full overflow-x-clip md:min-h-[calc(100vh-4rem)]"
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
