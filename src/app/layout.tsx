import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { StoreProvider } from "@/context/StoreProvider";
import { LoyaltyProvider } from "@/context/LoyaltyProvider";
import { SiteShell } from "@/components/layout/SiteShell";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Virtue Gems | Premium Handcrafted Jewellery",
    template: "%s | Virtue Gems",
  },
  description:
    "Discover exquisite gold and diamond jewellery at Virtue Gems. Mobile-first luxury shopping with WhatsApp checkout.",
  keywords: ["jewellery", "gold", "diamonds", "rings", "necklaces", "Virtue Gems"],
  openGraph: {
    title: "Virtue Gems | Premium Handcrafted Jewellery",
    description: "Luxury jewellery crafted for every occasion.",
    type: "website",
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
            <SiteShell>{children}</SiteShell>
          </LoyaltyProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
