import type { Metadata } from "next";
import { LegalHeading, LegalPage, LegalPoints } from "@/components/ui/LegalPage";
import { buildPageMetadata } from "@/lib/seo";
import { DELIVERY_CHARGES_NOTICE, DELIVERY_REGION_LABEL } from "@/lib/delivery";

export const metadata: Metadata = buildPageMetadata({
  title: "Terms & Conditions",
  description:
    "Terms for shopping at Virtue Gems — orders, pricing, delivery, and site usage.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <LegalPage title="Terms & Conditions">
      <p>
        <strong>Last updated:</strong> September 2026
      </p>
      <p>
        By accessing and using the Virtue Gems website, you agree to these Terms and Conditions.
        Please read them carefully before placing an order.
      </p>

      <LegalHeading>Products &amp; Pricing</LegalHeading>
      <LegalPoints
        items={[
          "All products are subject to availability",
          "Prices are listed in INR and may change without notice",
          "Product images are representative; slight variations may occur due to handcrafted jewellery",
          "We reserve the right to correct pricing or listing errors before confirmation",
        ]}
      />

      <LegalHeading>Orders</LegalHeading>
      <LegalPoints
        items={[
          "Orders are placed on the website and confirmed on WhatsApp",
          "An order is confirmed only after we acknowledge availability and agree delivery terms",
          "No card payment is taken on the website at this time",
          "Payment is completed via UPI or bank transfer after confirmation",
        ]}
      />

      <LegalHeading>Delivery</LegalHeading>
      <LegalPoints
        items={[
          `We currently deliver to ${DELIVERY_REGION_LABEL}`,
          DELIVERY_CHARGES_NOTICE,
          "Delivery timelines are shared on WhatsApp after dispatch",
          "Please provide a complete and accurate delivery address",
        ]}
      />

      <LegalHeading>Intellectual Property</LegalHeading>
      <LegalPoints
        items={[
          "All content, designs, and branding on this website belong to Virtue Gems",
          "You may not copy, reproduce, or reuse our materials without permission",
          "Product photos and descriptions are protected and for shopping use only",
        ]}
      />

      <LegalHeading>Limitation of Liability</LegalHeading>
      <LegalPoints
        items={[
          "Virtue Gems is not liable for indirect or consequential damages from use of the site or products, to the extent permitted by law",
          "Our responsibility for any order is limited to the amount paid for that order",
          "Please review product details carefully before confirming on WhatsApp",
        ]}
      />

      <LegalHeading>Governing Law</LegalHeading>
      <LegalPoints
        items={[
          "These terms are governed by the laws of India",
          "Disputes will be subject to the jurisdiction of courts in Hyderabad, Telangana",
        ]}
      />

      <LegalHeading>Contact</LegalHeading>
      <LegalPoints
        items={[
          <>
            WhatsApp: <strong>+91 73961 78039</strong>
          </>,
          <>
            Email: <strong>virtuegems777@gmail.com</strong>
          </>,
        ]}
      />
    </LegalPage>
  );
}
