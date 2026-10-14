import { Suspense, cache } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getOrderByIdSafe } from "@/lib/orders";
import { OrderInvoice } from "@/components/invoice/OrderInvoice";
import { InvoiceActions } from "@/components/invoice/InvoiceActions";
import { InvoicePointsNotice } from "@/components/loyalty/InvoicePointsNotice";
import { LOYALTY_ENABLED } from "@/lib/features";
import { formatPrice } from "@/lib/utils";

type Props = {
  params: Promise<{ id: string }>;
};

const loadOrder = cache(getOrderByIdSafe);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const order = await loadOrder(id);
  const title = `Virtue Gems · Order ${id}`;
  const itemCount = order?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
  const description = order
    ? `${itemCount} item${itemCount === 1 ? "" : "s"} · Total ${formatPrice(order.total)} · Order request, pending confirmation`
    : "Virtue Gems order invoice";

  return {
    title: { absolute: title },
    description,
    robots: { index: false, follow: false },
    openGraph: { title, description, type: "website", siteName: "Virtue Gems" },
  };
}

export default async function InvoicePage({ params }: Props) {
  const { id } = await params;
  const order = await loadOrder(id);

  if (!order) notFound();

  return (
    <div className="min-h-screen bg-[#f3eee4] px-4 py-8 pb-[calc(6.5rem+env(safe-area-inset-bottom))] print:bg-white print:p-0 md:pb-8">
      <div className="mb-6 text-center print:hidden">
        <Link href="/shop" className="text-sm text-gold-dark hover:underline">
          ← Continue shopping
        </Link>
        <p className="mt-2 text-xs text-dark/50">
          Professional invoice — tap Save PDF to download
        </p>
      </div>

      {LOYALTY_ENABLED && (
        <Suspense fallback={null}>
          <InvoicePointsNotice
            customerName={order.customerName}
            customerPhone={order.phone}
          />
        </Suspense>
      )}

      <OrderInvoice order={order} className="print:shadow-none" />

      <div className="mt-6">
        <InvoiceActions order={order} />
      </div>
    </div>
  );
}
