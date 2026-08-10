/** Google Analytics 4 helpers — no-ops when Measurement ID is unset. */

export function getGaMeasurementId(): string | undefined {
  const id = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();
  if (!id || !id.startsWith("G-")) return undefined;
  return id;
}

type GtagFn = (...args: unknown[]) => void;

function gtag(...args: unknown[]) {
  if (typeof window === "undefined") return;
  const w = window as Window & { gtag?: GtagFn; dataLayer?: unknown[] };
  w.dataLayer = w.dataLayer || [];
  if (typeof w.gtag === "function") {
    w.gtag(...args);
  } else {
    // Queue until the GA script defines gtag
    w.dataLayer.push(args);
  }
}

export function trackPageView(path: string) {
  const id = getGaMeasurementId();
  if (!id) return;
  gtag("config", id, {
    page_path: path,
  });
}

export function trackEvent(
  name: string,
  params?: Record<string, string | number | boolean | undefined>,
) {
  const id = getGaMeasurementId();
  if (!id) return;

  const cleaned: Record<string, string | number | boolean> = {};
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) cleaned[key] = value;
    }
  }

  gtag("event", name, cleaned);
}

/** GA4 ecommerce-style item payload (no PII). */
export function productAnalyticsItem(product: {
  id: string;
  name: string;
  category?: string;
  price: number;
}) {
  return {
    item_id: product.id,
    item_name: product.name,
    item_category: product.category,
    price: product.price,
  };
}
