import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/** Prevent sticky /_next caches in development (immutable headers broke HMR). */
export function middleware(request: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.next();
  }

  if (!request.nextUrl.pathname.startsWith("/_next")) {
    return NextResponse.next();
  }

  const response = NextResponse.next();
  response.headers.set("Cache-Control", "no-store, must-revalidate");
  return response;
}

export const config = {
  matcher: "/_next/:path*",
};
