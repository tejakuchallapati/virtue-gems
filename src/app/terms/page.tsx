import type { Metadata } from "next";
import { LegalPage } from "@/components/ui/LegalPage";

export const metadata: Metadata = {
  title: "Terms & Conditions",
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms & Conditions">
      <p><strong>Last updated:</strong> June 2026</p>
      <p>
        By accessing and using the Virtue Gems website, you agree to these Terms and Conditions. Please read them carefully.
      </p>
      <h2 className="text-lg font-semibold text-dark">Products & Pricing</h2>
      <p>
        All products are subject to availability. Prices are listed in INR and may change without notice. Product images are representative; slight variations may occur due to handcrafted nature.
      </p>
      <h2 className="text-lg font-semibold text-dark">Orders</h2>
      <p>
        Orders are placed via WhatsApp checkout. An order is confirmed only after we acknowledge availability and agree on delivery terms via WhatsApp.
      </p>
      <h2 className="text-lg font-semibold text-dark">Delivery</h2>
      <p>
        We currently deliver only to Andhra Pradesh and Telangana. Orders outside these states cannot be fulfilled at this time. Additional regions will be added as our production capacity grows.
      </p>
      <h2 className="text-lg font-semibold text-dark">Intellectual Property</h2>
      <p>
        All content, designs, and branding on this website are the property of Virtue Gems and may not be reproduced without permission.
      </p>
      <h2 className="text-lg font-semibold text-dark">Limitation of Liability</h2>
      <p>
        Virtue Gems shall not be liable for indirect or consequential damages arising from use of our website or products, to the extent permitted by law.
      </p>
      <h2 className="text-lg font-semibold text-dark">Governing Law</h2>
      <p>
        These terms are governed by the laws of India. Disputes shall be subject to the jurisdiction of Indian courts.
      </p>
    </LegalPage>
  );
}
