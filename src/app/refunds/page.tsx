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
      <h2 className="text-lg font-semibold text-dark">Mandatory Unboxing Video</h2>
      <p>
        <strong>
          To be eligible for any return or refund — including for damaged products — you must record a
          continuous unboxing video while opening the parcel.
        </strong>
      </p>
      <ul className="list-disc pl-5 space-y-1">
        <li>Start recording before opening the outer packaging</li>
        <li>Show the sealed parcel, shipping label, and order details clearly</li>
        <li>Record the full unboxing without cuts, pauses, or edits</li>
        <li>Show the product and any damage immediately as the package is opened</li>
      </ul>
      <p>
        <strong>
          Without this unboxing video proof, return or refund requests will not be accepted — even if
          the product is damaged.
        </strong>
      </p>
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
        If you receive a damaged product, contact us within 48 hours on WhatsApp with your order
        details, clear photos, and the mandatory unboxing video recorded while opening the parcel.
      </p>
      <p>
        We will review the video proof and, if approved, arrange a replacement or full refund at no
        extra cost. Requests for damaged items without unboxing video proof cannot be processed for
        return or refund.
      </p>
      <h2 className="text-lg font-semibold text-dark">Contact</h2>
      <p>
        For returns or refunds, WhatsApp us at +91 73961 78039 or email virtuegems777@gmail.com with
        your order details and unboxing video.
      </p>
    </LegalPage>
  );
}
