export function ShopLoadingSkeleton() {
  return (
    <div className="page-mobile-safe min-h-screen bg-gradient-to-b from-[#faf6ee] via-light to-white">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
        <div className="h-4 w-32 animate-pulse rounded bg-light-muted/60" />
        <div className="mt-4 h-8 w-56 animate-pulse rounded-lg bg-light-muted/60 sm:h-10 sm:w-72" />
        <div className="mt-3 h-4 w-full max-w-md animate-pulse rounded bg-light-muted/40" />

        <div className="mt-6 flex gap-2 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-9 w-24 shrink-0 animate-pulse rounded-full bg-light-muted/50"
            />
          ))}
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-2xl bg-white ring-1 ring-light-muted/60"
            >
              <div className="aspect-square animate-pulse bg-light-muted/40" />
              <div className="space-y-2 p-3">
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
