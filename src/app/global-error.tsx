"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Virtue Gems] Global error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-light px-6">
        <div className="max-w-md text-center">
          <h1 className="text-xl font-semibold text-dark">Virtue Gems</h1>
          <p className="mt-3 text-sm text-dark/60">
            We hit an unexpected issue. Please try again — nothing has been lost from your
            device.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            className="mt-6 min-h-11 rounded-xl bg-gold px-6 py-2.5 text-sm font-semibold text-dark"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
