import { PRODUCT_IMAGE_FRAME } from "@/lib/ui-classes";

export function ProductLoadingSkeleton() {
  return (
    <div className="page-mobile-safe mx-auto max-w-7xl px-4 py-6 pb-28 sm:px-6 sm:py-10 sm:pb-10 lg:px-8">
      <div className="h-4 w-48 animate-pulse rounded bg-light-muted/60" />

      <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div>
          <div className={`aspect-square animate-pulse ${PRODUCT_IMAGE_FRAME}`} />
          <div className="mt-3 flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className={`h-16 w-16 shrink-0 animate-pulse rounded-xl ${PRODUCT_IMAGE_FRAME}`}
              />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="h-8 w-4/5 animate-pulse rounded-lg bg-light-muted/60" />
          <div className="h-5 w-32 animate-pulse rounded bg-light-muted/40" />
          <div className="h-10 w-40 animate-pulse rounded-lg bg-light-muted/50" />
          <div className="space-y-2 pt-2">
            <div className="h-4 w-full animate-pulse rounded bg-light-muted/30" />
            <div className="h-4 w-full animate-pulse rounded bg-light-muted/30" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-light-muted/30" />
          </div>
          <div className="flex gap-3 pt-4">
            <div className="h-12 flex-1 animate-pulse rounded-xl bg-light-muted/50" />
            <div className="h-12 w-12 animate-pulse rounded-xl bg-light-muted/40" />
          </div>
        </div>
      </div>
    </div>
  );
}
