import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Contact Virtue Gems — WhatsApp Jewellery Orders",
  description:
    "Contact Virtue Gems on WhatsApp or email for jewellery orders, custom requests, and delivery across Hyderabad, Andhra Pradesh & Telangana.",
  path: "/contact",
  keywords: [
    "contact Virtue Gems",
    "jewellery WhatsApp Hyderabad",
    "buy jewellery WhatsApp India",
  ],
});

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
