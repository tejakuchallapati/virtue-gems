import {
  CARD_SURFACE,
  PAGE_CONTENT_SHELL,
  PAGE_GRADIENT_SHELL,
  PRODUCT_GRID,
  PRODUCT_IMAGE_FRAME,
} from "@/lib/ui-classes";
import { cn } from "@/lib/utils";

export function CartLoadingSkeleton() {
  return (
    <div className={PAGE_GRADIENT_SHELL} aria-busy="true" aria-label="Loading cart">
      <div className={PAGE_CONTENT_SHELL}>
        <div className="h-4 w-28 animate-pulse rounded bg-light-muted/60" />
        <div className="mt-4 h-8 w-48 animate-pulse rounded-lg bg-light-muted/60" />
        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className={cn("flex gap-4 p-4", CARD_SURFACE)}
              >
                <div className={cn("h-24 w-24 shrink-0 animate-pulse rounded-xl", PRODUCT_IMAGE_FRAME)} />
                <div className="flex flex-1 flex-col justify-between gap-3 py-1">
                  <div className="h-4 w-2/3 animate-pulse rounded bg-light-muted/50" />
                  <div className="h-4 w-20 animate-pulse rounded bg-light-muted/40" />
                  <div className="h-10 w-32 animate-pulse rounded-xl bg-light-muted/40" />
                </div>
              </div>
            ))}
          </div>
          <div className={cn("h-64 animate-pulse p-6", CARD_SURFACE)} />
        </div>
      </div>
    </div>
  );
}

export function WishlistLoadingSkeleton() {
  return (
    <div className={PAGE_GRADIENT_SHELL} aria-busy="true" aria-label="Loading wishlist">
      <div className={PAGE_CONTENT_SHELL}>
        <div className="h-4 w-28 animate-pulse rounded bg-light-muted/60" />
        <div className="mt-4 h-8 w-44 animate-pulse rounded-lg bg-light-muted/60" />
        <div className={`mt-8 ${PRODUCT_GRID}`}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-2xl bg-white ring-1 ring-light-muted/60"
            >
              <div className={`aspect-square animate-pulse ${PRODUCT_IMAGE_FRAME}`} />
              <div className="space-y-2 border-t border-light-muted/50 p-3">
                <div className="h-4 w-3/4 animate-pulse rounded bg-light-muted/50" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-light-muted/40" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function CheckoutLoadingSkeleton() {
  return (
    <div className={PAGE_GRADIENT_SHELL} aria-busy="true" aria-label="Loading checkout">
      <div className={PAGE_CONTENT_SHELL}>
        <div className="h-4 w-36 animate-pulse rounded bg-light-muted/60" />
        <div className="mt-4 h-8 w-40 animate-pulse rounded-lg bg-light-muted/60" />
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className={cn("h-80 animate-pulse space-y-4 p-5", CARD_SURFACE)}>
            <div className="h-10 w-full rounded-xl bg-light-muted/40" />
            <div className="h-10 w-full rounded-xl bg-light-muted/40" />
            <div className="h-24 w-full rounded-xl bg-light-muted/40" />
          </div>
          <div className={cn("h-56 animate-pulse p-5", CARD_SURFACE)} />
        </div>
      </div>
    </div>
  );
}
