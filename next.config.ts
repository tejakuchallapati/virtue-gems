import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  poweredByHeader: false,
  compress: true,
  serverExternalPackages: ["better-sqlite3"],
  images: {
    qualities: [75, 100],
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "scontent.cdninstagram.com",
      },
    ],
  },
  async headers() {
    // Do not set immutable Cache-Control on /_next in production config —
    // Next already fingerprints hashed chunks. In development, force no-store
    // so Turbopack HMR is not blocked by sticky browser caches.
    const isProd = process.env.NODE_ENV === "production";
    return [
      ...(isProd
        ? []
        : [
            {
              source: "/_next/:path*",
              headers: [
                {
                  key: "Cache-Control",
                  value: "no-store, must-revalidate",
                },
              ],
            },
          ]),
      {
        source: "/(.*\\.(?:png|jpg|jpeg|webp|avif|svg|ico|woff2?))",
        headers: [
          {
            key: "Cache-Control",
            value: isProd
              ? "public, max-age=31536000, immutable"
              : "no-store",
          },
        ],
      },
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
