import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { StoreProvider } from "@/context/StoreProvider";
import { LoyaltyProvider } from "@/context/LoyaltyProvider";
import { SiteShell } from "@/components/layout/SiteShell";
import { ErrorBoundary } from "@/components/layout/ErrorBoundary";
import { getSiteUrl } from "@/lib/site";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_KEYWORDS,
  getVerificationMetadata,
  SITE_NAME,
} from "@/lib/seo";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${SITE_NAME} | Premium Handcrafted Jewellery Hyderabad`,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  keywords: DEFAULT_KEYWORDS,
  authors: [{ name: SITE_NAME, url: siteUrl }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "shopping",
  applicationName: SITE_NAME,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${SITE_NAME} | Premium Handcrafted Jewellery`,
    description: DEFAULT_DESCRIPTION,
    type: "website",
    url: siteUrl,
    siteName: SITE_NAME,
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Premium Handcrafted Jewellery`,
    description: DEFAULT_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [{ url: "/logo-with-text.png", type: "image/png" }],
    apple: [{ url: "/logo-with-text.png" }],
  },
  verification: getVerificationMetadata(),
  other: {
    "geo.region": "IN-TG",
    "geo.placename": "Hyderabad",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-IN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <StoreProvider>
          <LoyaltyProvider>
            <ErrorBoundary>
              <SiteShell>{children}</SiteShell>
            </ErrorBoundary>
          </LoyaltyProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
