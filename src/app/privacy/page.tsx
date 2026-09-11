import type { Metadata } from "next";
import { LegalHeading, LegalPage, LegalPoints } from "@/components/ui/LegalPage";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Privacy Policy",
  description:
    "How Virtue Gems collects and protects your personal information for orders and contact forms.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy">
      <p>
        <strong>Last updated:</strong> September 2026
      </p>
      <p>
        Virtue Gems (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) respects your privacy. This
        policy explains how we collect, use, and protect your personal information when you use our
        website.
      </p>

      <LegalHeading>Information We Collect</LegalHeading>
      <LegalPoints
        items={[
          "Name, email, phone number, and address when you place an order or contact us",
          "Order history and product preferences",
          "Device and browsing data via cookies, used to improve the site",
          "WhatsApp messages shared for order confirmation and support",
        ]}
      />

      <LegalHeading>How We Use Your Information</LegalHeading>
      <LegalPoints
        items={[
          "Process and fulfil orders",
          "Respond to enquiries and provide customer support",
          "Send order updates and promotional messages (with your consent)",
          "Improve our website and services",
          "Prevent fraud and keep accounts secure",
        ]}
      />

      <LegalHeading>Data Sharing</LegalHeading>
      <LegalPoints
        items={[
          "We do not sell your personal information to third parties",
          "Delivery partners receive only what is needed to ship your order",
          "Payment confirmation may be shared securely for UPI or bank transfer verification",
          "We may disclose data if required by law or to protect our rights",
        ]}
      />

      <LegalHeading>Data Security</LegalHeading>
      <LegalPoints
        items={[
          "We use appropriate technical and organisational security measures",
          "Access to customer data is limited to authorised team members",
          "You should keep your WhatsApp and email credentials secure",
        ]}
      />

      <LegalHeading>Your Choices</LegalHeading>
      <LegalPoints
        items={[
          "Request a copy of the personal data we hold about you",
          "Ask us to update or correct inaccurate details",
          "Opt out of promotional messages at any time",
          "Request deletion of data where we are not required to keep it for orders or law",
        ]}
      />

      <LegalHeading>Contact</LegalHeading>
      <LegalPoints
        items={[
          <>
            Email privacy questions to <strong>virtuegems777@gmail.com</strong>
          </>,
          <>
            WhatsApp support: <strong>+91 73961 78039</strong>
          </>,
        ]}
      />
    </LegalPage>
  );
}
