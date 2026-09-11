import Image from "next/image";
import type { Order } from "@/types";
import { formatPrice, formatDate, cn } from "@/lib/utils";
import { getSiteHost } from "@/lib/site";
import { DELIVERY_CHARGES_NOTICE, DELIVERY_REGION_LABEL } from "@/lib/delivery";

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
      className={cn(
        "invoice-sheet mx-auto w-full max-w-[210mm] overflow-hidden bg-white text-[#111] shadow-[0_8px_40px_rgba(26,10,46,0.12)] ring-1 ring-black/8",
        className,
      )}
    >
      {/* Letterhead */}
      <header className="border-b-2 border-[#1a0a2e] px-6 pb-5 pt-6 sm:px-8 sm:pt-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <Image
              src="/logo-transparent.png"
              alt="Virtue Gems"
              width={48}
              height={48}
              className="h-11 w-11 object-contain"
              priority
            />
            <div>
              <p className="text-base font-bold tracking-[0.2em] text-[#1a0a2e]">
                VIRTUE GEMS
              </p>
              <p className="mt-0.5 text-[11px] text-[#1a0a2e]/65">
                Premium handcrafted jewellery
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold tracking-tight text-[#1a0a2e] sm:text-3xl">
              TAX INVOICE
            </p>
            <p className="mt-1 text-[11px] text-[#1a0a2e]/60">
              Order request · Pending confirmation
            </p>
          </div>
        </div>
      </header>

      {/* Meta */}
      <section className="grid gap-6 border-b border-[#1a0a2e]/10 px-6 py-5 sm:grid-cols-2 sm:px-8">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#c4a035]">
            Bill to
          </p>
          <p className="mt-2 text-sm font-semibold text-[#1a0a2e]">
            {order.customerName}
          </p>
          <p className="mt-1 text-[12px] leading-relaxed text-[#1a0a2e]/75">
            {order.address}
            <br />
            {order.city}, {order.state} — {order.pincode}
            <br />
            Phone: {order.phone}
          </p>
        </div>
        <div className="sm:text-right">
          <dl className="space-y-1.5 text-[12px]">
            <div className="flex justify-between gap-4 sm:justify-end">
              <dt className="font-semibold text-[#1a0a2e]">Invoice No.</dt>
              <dd className="font-mono text-[#1a0a2e]/80">{order.id}</dd>
            </div>
            <div className="flex justify-between gap-4 sm:justify-end">
              <dt className="font-semibold text-[#1a0a2e]">Date</dt>
              <dd className="text-[#1a0a2e]/80">{formatDate(order.createdAt)}</dd>
            </div>
            <div className="flex justify-between gap-4 sm:justify-end">
              <dt className="font-semibold text-[#1a0a2e]">Status</dt>
              <dd className="capitalize text-[#1a0a2e]/80">{order.status}</dd>
            </div>
            <div className="flex justify-between gap-4 sm:justify-end">
              <dt className="font-semibold text-[#1a0a2e]">Payment</dt>
              <dd className="text-[#1a0a2e]/80">UPI / Bank via WhatsApp</dd>
            </div>
          </dl>
        </div>
      </section>

      {/* Line items */}
      <section className="px-6 py-5 sm:px-8">
        <table className="w-full border-collapse text-[12px]">
          <thead>
            <tr className="bg-[#1a0a2e] text-left text-white">
              <th className="px-3 py-2.5 font-semibold">#</th>
              <th className="px-3 py-2.5 font-semibold">Description</th>
              <th className="px-3 py-2.5 text-right font-semibold">Rate</th>
              <th className="px-3 py-2.5 text-center font-semibold">Qty</th>
              <th className="px-3 py-2.5 text-right font-semibold">Amount</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, i) => (
              <tr
                key={`${item.productId}-${i}`}
                className="border-b border-[#1a0a2e]/10"
              >
                <td className="px-3 py-3 text-[#1a0a2e]/55">{i + 1}</td>
                <td className="min-w-0 px-3 py-3 font-medium text-[#1a0a2e]">
                  {item.name}
                </td>
                <td className="px-3 py-3 text-right text-[#1a0a2e]/80">
                  {formatPrice(item.price)}
                </td>
                <td className="px-3 py-3 text-center text-[#1a0a2e]/80">
                  {item.quantity}
                </td>
                <td className="px-3 py-3 text-right font-semibold text-[#1a0a2e]">
                  {formatPrice(item.price * item.quantity)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-5 flex justify-end">
          <div className="w-full max-w-[240px] space-y-2 text-[12px]">
            <div className="flex justify-between text-[#1a0a2e]/70">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-[#1a0a2e]/70">
              <span>Delivery</span>
              <span className="text-right text-[11px]">
                Confirmed for address
              </span>
            </div>
            <div className="flex items-center justify-between bg-[#d4af37] px-3 py-2.5 font-bold text-[#1a0a2e]">
              <span>Grand Total</span>
              <span className="text-base">{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Notes */}
      <section className="grid gap-5 border-t border-[#1a0a2e]/10 px-6 py-5 sm:grid-cols-2 sm:px-8">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#c4a035]">
            Delivery
          </p>
          <p className="mt-2 text-[11px] leading-relaxed text-[#1a0a2e]/70">
            Service area: {DELIVERY_REGION_LABEL}. {DELIVERY_CHARGES_NOTICE}
          </p>
          <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#c4a035]">
            Returns
          </p>
          <p className="mt-2 text-[11px] leading-relaxed text-[#1a0a2e]/70">
            Record a continuous unboxing video. Without video proof, returns and
            refunds cannot be processed.
          </p>
        </div>
        <div className="sm:text-right">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#c4a035]">
            Authorised signatory
          </p>
          <div className="mt-8 border-b border-[#1a0a2e]/25 sm:ml-auto sm:w-40" />
          <p className="mt-2 text-[11px] font-medium text-[#1a0a2e]">Virtue Gems</p>
          <p className="mt-1 text-[11px] text-[#1a0a2e]/55">+91 73961 78039</p>
        </div>
      </section>

      <footer className="bg-[#1a0a2e] px-6 py-2.5 text-center text-[10px] text-white/70 sm:px-8">
        Thank you for shopping with Virtue Gems · {getSiteHost()} · WhatsApp +91
        73961 78039
      </footer>
    </article>
  );
}
