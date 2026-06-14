import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getOrderById } from "@/lib/orders";
import { OrderInvoice } from "@/components/invoice/OrderInvoice";
import { InvoiceActions } from "@/components/invoice/InvoiceActions";
import { InvoicePointsNotice } from "@/components/loyalty/InvoicePointsNotice";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function InvoicePage({ params }: Props) {
  const { id } = await params;
  const order = getOrderById(id);

  if (!order) notFound();

  return (
    <div className="min-h-screen bg-light-muted/40 px-4 py-8 print:bg-white print:p-0">
      <div className="mb-6 text-center print:hidden">
        <Link href="/shop" className="text-sm text-gold-dark hover:underline">
          ← Continue shopping
        </Link>
      </div>

      <Suspense fallback={null}>
        <InvoicePointsNotice
          customerName={order.customerName}
          customerPhone={order.phone}
        />
      </Suspense>

      <OrderInvoice order={order} className="print:shadow-none print:ring-0" />

      <div className="mt-6">
        <InvoiceActions order={order} />
      </div>
    </div>
  );
}
