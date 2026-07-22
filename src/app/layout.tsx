import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { StoreProvider } from "@/context/StoreProvider";
import { LoyaltyProvider } from "@/context/LoyaltyProvider";
import { SiteShell } from "@/components/layout/SiteShell";
import { ErrorBoundary } from "@/components/layout/ErrorBoundary";
import { getSiteUrl } from "@/lib/site";
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
    default: "Virtue Gems | Premium Handcrafted Jewellery",
    template: "%s | Virtue Gems",
  },
  description:
    "Discover exquisite gold and diamond jewellery at Virtue Gems. Mobile-first luxury shopping with WhatsApp checkout.",
  keywords: ["jewellery", "gold", "diamonds", "rings", "necklaces", "Virtue Gems"],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Virtue Gems | Premium Handcrafted Jewellery",
    description: "Luxury jewellery crafted for every occasion.",
    type: "website",
    url: siteUrl,
    siteName: "Virtue Gems",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Virtue Gems | Premium Handcrafted Jewellery",
    description: "Luxury jewellery crafted for every occasion.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
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
