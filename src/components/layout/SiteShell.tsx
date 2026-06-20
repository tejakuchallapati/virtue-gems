"use client";

import dynamic from "next/dynamic";
import { DesktopNavbar } from "./DesktopNavbar";
import { LandingNavbar } from "./LandingNavbar";
import { MobileHeader } from "./MobileHeader";
import { MobileBottomNav } from "./MobileBottomNav";
import { Footer } from "./Footer";
import { WhatsAppFloat } from "./WhatsAppFloat";
import { PageTransition } from "./PageTransition";
import { usePathname } from "next/navigation";

const LoadingScreen = dynamic(
  () => import("./LoadingScreen").then((m) => m.LoadingScreen),
  { ssr: false },
);

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) return <>{children}</>;

  const isHome = pathname === "/";

  return (
    <>
      <LoadingScreen />
      {isHome && <LandingNavbar />}
      {!isHome && <DesktopNavbar />}
      {!isHome && <MobileHeader />}
      <PageTransition key={pathname}>
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
      <MobileBottomNav />
      <WhatsAppFloat />
    </>
  );
}
