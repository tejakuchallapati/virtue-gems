import Image from "next/image";
import type { Order } from "@/types";
import { formatPrice, formatDate } from "@/lib/utils";

type OrderInvoiceProps = {
  order: Order;
  className?: string;
};

export function OrderInvoice({ order, className = "" }: OrderInvoiceProps) {
  const subtotal = order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <article
      className={`mx-auto w-full max-w-[560px] overflow-hidden bg-white text-[#1a1a1a] text-xs shadow-lg ring-1 ring-black/5 ${className}`}
    >
      {/* Header bar */}
      <div className="relative bg-gold px-4 pb-3 pt-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Image
              src="/logo-transparent.png"
              alt="Virtue Gems"
              width={32}
              height={32}
              className="h-7 w-7 object-contain"
            />
            <div>
              <p className="text-[10px] font-bold tracking-[0.18em] text-dark">VIRTUE GEMS</p>
              <p className="text-[8px] tracking-wider text-dark/70">Luxury Jewellery</p>
            </div>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-dark">INVOICE</h1>
        </div>
      </div>

      {/* Meta row */}
      <div className="grid gap-3 px-4 py-4 sm:grid-cols-2">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-wider text-dark/50">Invoice to:</p>
          <p className="mt-1 text-sm font-semibold text-dark">{order.customerName}</p>
          <p className="mt-0.5 text-[11px] leading-snug text-dark/70">{order.address}</p>
          <p className="text-[11px] text-dark/70">
            {order.city}, {order.state} — {order.pincode}
          </p>
          <p className="text-[11px] text-dark/70">Phone: {order.phone}</p>
        </div>
        <div className="sm:text-right">
          <p className="text-[11px] text-dark/70">
            <span className="font-semibold text-dark">Invoice#</span> {order.id}
          </p>
          <p className="mt-0.5 text-[11px] text-dark/70">
            <span className="font-semibold text-dark">Date</span>{" "}
            {formatDate(order.createdAt)}
          </p>
          <p className="mt-0.5 text-[11px] capitalize text-dark/70">
            <span className="font-semibold text-dark">Status</span> {order.status}
          </p>
        </div>
      </div>

      {/* Items table */}
      <div className="px-4">
        <table className="w-full border-collapse text-[11px]">
          <thead>
            <tr className="bg-[#1a0a2e] text-left text-white">
              <th className="px-2 py-1.5 font-semibold">SL.</th>
              <th className="px-2 py-1.5 font-semibold">Item</th>
              <th className="px-2 py-1.5 text-right font-semibold">Price</th>
              <th className="px-2 py-1.5 text-center font-semibold">Qty</th>
              <th className="px-2 py-1.5 text-right font-semibold">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, i) => (
              <tr key={`${item.productId}-${i}`} className="border-b border-gray-100">
                <td className="px-2 py-2 text-dark/60">{i + 1}</td>
                <td className="px-2 py-2 font-medium text-dark">{item.name}</td>
                <td className="px-2 py-2 text-right text-dark/80">
                  {formatPrice(item.price)}
                </td>
                <td className="px-2 py-2 text-center text-dark/80">{item.quantity}</td>
                <td className="px-2 py-2 text-right font-medium text-dark">
                  {formatPrice(item.price * item.quantity)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end px-4 py-4">
        <div className="w-full max-w-[200px] space-y-1 text-[11px]">
          <div className="flex justify-between text-dark/70">
            <span>Sub Total:</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-dark/70">
            <span>Tax:</span>
            <span>0.00%</span>
          </div>
          <div className="mt-1.5 flex items-center justify-between bg-gold px-3 py-2 font-bold text-dark">
            <span>Total:</span>
            <span className="text-sm">{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="grid gap-4 border-t border-gray-100 px-4 py-4 sm:grid-cols-2">
        <div>
          <p className="text-[11px] font-semibold text-dark">Thank you for your business</p>
          <p className="mt-2 text-[9px] font-bold uppercase tracking-wider text-dark/50">
            Terms &amp; Conditions
          </p>
          <p className="mt-0.5 text-[9px] leading-relaxed text-dark/60">
            Record a video while opening your parcel. No return or refund without unboxing video
            proof — even for damaged items.
          </p>
          <p className="mt-2 text-[9px] font-bold uppercase tracking-wider text-dark/50">
            Payment Info
          </p>
          <p className="mt-0.5 text-[9px] leading-relaxed text-dark/60">
            UPI / Bank transfer on WhatsApp · +91 73961 78039
          </p>
        </div>
        <div className="sm:text-right">
          <p className="text-[11px] font-semibold text-dark">Authorised Sign</p>
          <div className="mt-4 border-b border-dark/30 sm:ml-auto sm:w-32" />
          <p className="mt-1 text-[9px] text-dark/50">Virtue Gems</p>
        </div>
      </div>

      <div className="bg-gold px-4 py-1.5 text-center text-[9px] font-medium text-dark/80">
        +91 73961 78039 | Hyderabad | virtue-gems.vercel.app
      </div>
    </article>
  );
}
