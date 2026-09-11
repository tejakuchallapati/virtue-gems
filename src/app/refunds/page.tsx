import type { Metadata } from "next";
import { LegalHeading, LegalPage, LegalPoints } from "@/components/ui/LegalPage";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Refund & Return Policy",
  description:
    "Virtue Gems return rules including mandatory unboxing video proof for refunds and damaged-item claims.",
  path: "/refunds",
  keywords: ["jewellery return policy", "unboxing video refund", "Virtue Gems refunds"],
});

export default function RefundsPage() {
  return (
    <LegalPage title="Refund & Return Policy">
      <p>
        <strong>Last updated:</strong> September 2026
      </p>
      <p>
        At Virtue Gems, customer satisfaction matters. Please review our return and refund policy
        below before placing an order.
      </p>

      <LegalHeading>Mandatory Unboxing Video</LegalHeading>
      <p>
        Record a continuous video while opening your parcel. Start before the outer seal is broken,
        show the shipping label, and keep recording through the full unboxing.
      </p>
      <p>
        <strong>
          Without this video, no return or refund is accepted — including for damaged items.
        </strong>
      </p>
      <LegalPoints
        items={[
          "Start recording before opening the outer packaging",
          "Show the sealed parcel, shipping label, and order details clearly",
          "Record the full unboxing without cuts, pauses, or edits",
          "Show the product and any damage immediately as the package is opened",
        ]}
      />

      <LegalHeading>Return Eligibility</LegalHeading>
      <LegalPoints
        items={[
          "Returns within 7 days of delivery for unused items in original packaging",
          "Items must include the invoice",
          "Custom-made or engraved pieces are non-returnable",
        ]}
      />

      <LegalHeading>Exchanges</LegalHeading>
      <LegalPoints
        items={[
          "Size exchanges on rings and bracelets within 15 days of purchase",
          "Exchanges are subject to stock availability",
          "Contact us on WhatsApp with your order ID to start an exchange",
        ]}
      />

      <LegalHeading>Damaged Items</LegalHeading>
      <LegalPoints
        items={[
          "Report damage within 48 hours on WhatsApp",
          "Share your order ID, clear photos, and the mandatory unboxing video",
          "If approved, we arrange a replacement or refund",
        ]}
      />

      <LegalHeading>Refund Process</LegalHeading>
      <LegalPoints
        items={[
          "Returned items are inspected after we receive them",
          "Approved refunds are processed within 7–10 business days",
          "Refunds are issued via UPI or bank transfer",
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
          "Include your order details and unboxing video with every return request",
        ]}
      />
    </LegalPage>
  );
}
