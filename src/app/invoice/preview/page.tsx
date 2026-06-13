import Link from "next/link";
import { OrderInvoice } from "@/components/invoice/OrderInvoice";
import { InvoiceActions } from "@/components/invoice/InvoiceActions";
import type { Order } from "@/types";

const sampleOrder: Order = {
  id: "ORD-SAMPLE-001",
  customerName: "Priya Sharma",
  phone: "+91 98765 43210",
  address: "42, MG Road, Flat 3B",
  city: "Hyderabad",
  state: "Telangana",
  pincode: "500001",
  items: [
    {
      productId: "vg-001",
      name: "Pearl Charm Layer Necklace",
      quantity: 1,
      price: 899,
    },
    {
      productId: "vg-002",
      name: "Crystal Floral Short Necklace",
      quantity: 1,
      price: 749,
    },
  ],
  total: 1648,
  status: "pending",
  createdAt: new Date().toISOString(),
};

export default function InvoicePreviewPage() {
  return (
    <div className="min-h-screen bg-light-muted/40 px-4 py-8 print:bg-white print:p-0">
      <p className="mb-6 text-center text-sm text-dark/60 print:hidden">
        Sample invoice preview —{" "}
        <Link href="/shop" className="text-gold-dark hover:underline">
          place a real order
        </Link>
      </p>

      <OrderInvoice order={sampleOrder} className="print:shadow-none print:ring-0" />

      <div className="mt-6">
        <InvoiceActions order={sampleOrder} />
      </div>
    </div>
  );
}
