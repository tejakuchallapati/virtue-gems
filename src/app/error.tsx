"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Virtue Gems] Page error:", error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center px-6 py-16 text-center">
      <h1 className="text-xl font-semibold text-dark">Page could not load</h1>
      <p className="mt-2 text-sm text-dark/60">
        This is temporary. Refresh or go back to continue shopping.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="min-h-11 rounded-xl bg-gold px-5 py-2.5 text-sm font-semibold text-dark"
        >
          Try again
        </button>
        <a
          href="/"
          className="inline-flex min-h-11 items-center rounded-xl border border-light-muted px-5 py-2.5 text-sm font-medium text-dark"
        >
          Go home
        </a>
      </div>
    </div>
  );
}
