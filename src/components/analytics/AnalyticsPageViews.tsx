"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { getGaMeasurementId, trackPageView } from "@/lib/analytics";

/**
 * Sends a GA4 page_view on App Router navigations.
 * Initial load is also tracked here (script uses send_page_view: false).
 */
export function AnalyticsPageViews() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!getGaMeasurementId()) return;
    if (pathname.startsWith("/admin")) return;

    const query = searchParams.toString();
    const path = query ? `${pathname}?${query}` : pathname;
    trackPageView(path);
  }, [pathname, searchParams]);

  return null;
}
