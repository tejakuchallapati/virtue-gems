import type { Metadata } from "next";
import { LegalPage } from "@/components/ui/LegalPage";

export const metadata: Metadata = {
  title: "Refund & Return Policy",
};

export default function RefundsPage() {
  return (
    <LegalPage title="Refund & Return Policy">
      <p><strong>Last updated:</strong> June 2026</p>
      <p>
        At Virtue Gems, customer satisfaction is our priority. Please review our return and refund policy below.
      </p>
      <h2 className="text-lg font-semibold text-dark">Return Eligibility</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li>Returns accepted within 7 days of delivery for unused items in original packaging</li>
        <li>Custom-made or engraved pieces are non-returnable</li>
        <li>Items must be accompanied by original invoice and hallmarked certification</li>
      </ul>
      <h2 className="text-lg font-semibold text-dark">Refund Process</h2>
      <p>
        Once we receive and inspect the returned item, refunds are processed within 7–10 business days to the original payment method. For WhatsApp orders, refunds are arranged via bank transfer or UPI.
      </p>
      <h2 className="text-lg font-semibold text-dark">Exchanges</h2>
      <p>
        We offer free size exchanges on rings and bracelets within 15 days of purchase, subject to stock availability.
      </p>
      <h2 className="text-lg font-semibold text-dark">Damaged Items</h2>
      <p>
        If you receive a damaged product, contact us within 48 hours with photos. We will arrange a replacement or full refund at no extra cost.
      </p>
      <h2 className="text-lg font-semibold text-dark">Contact</h2>
      <p>
        For returns or refunds, WhatsApp us or email virtuegems777@gmail.com with your order details.
      </p>
    </LegalPage>
  );
}
