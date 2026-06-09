import type { Metadata } from "next";
import { LegalPage } from "@/components/ui/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy">
      <p><strong>Last updated:</strong> June 2026</p>
      <p>
        Virtue Gems (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) respects your privacy. This policy explains how we collect, use, and protect your personal information when you use our website.
      </p>
      <h2 className="text-lg font-semibold text-dark">Information We Collect</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li>Name, email, phone number, and address when you place an order or contact us</li>
        <li>Order history and product preferences</li>
        <li>Device and browsing data via cookies for site improvement</li>
      </ul>
      <h2 className="text-lg font-semibold text-dark">How We Use Your Information</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li>Process and fulfil orders via WhatsApp</li>
        <li>Respond to enquiries and provide customer support</li>
        <li>Send order updates and promotional communications (with consent)</li>
        <li>Improve our website and services</li>
      </ul>
      <h2 className="text-lg font-semibold text-dark">Data Security</h2>
      <p>
        We implement appropriate security measures to protect your personal data. We do not sell your information to third parties.
      </p>
      <h2 className="text-lg font-semibold text-dark">Contact</h2>
      <p>
        For privacy-related questions, email us at virtuegems777@gmail.com.
      </p>
    </LegalPage>
  );
}
