"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MessageCircle, Sparkles, ShoppingBag } from "lucide-react";
import { useStore } from "@/context/StoreProvider";
import { useLoyalty } from "@/context/LoyaltyProvider";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { EmptyState } from "@/components/ui/EmptyState";
import { SectionDivider } from "@/components/ui/PageSection";
import { formatPrice } from "@/lib/utils";
import { CARD_SURFACE, PAGE_SHELL } from "@/lib/ui-classes";
import { apiFetch } from "@/lib/api-client";
import { buildOrderMessage, getWhatsAppUrl } from "@/lib/whatsapp";
import { calculateDiscount, calculatePointsEarned } from "@/lib/loyalty";
import { UnboxingVideoNotice } from "@/components/ui/UnboxingVideoNotice";
import { DELIVERY_NOTICE, DELIVERY_REGION_LABEL, DELIVERY_STATES } from "@/lib/delivery";
import { CHECKOUT_PAYMENT_NOTICE, COD_POLICY, ONLINE_PAYMENT_COMING_SOON, PAYMENT_METHODS_SUMMARY } from "@/lib/payments";
import type { CheckoutForm } from "@/types";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartTotal, clearCart } = useStore();
  const { activeRedemption, completeOrder, loadAccount } = useLoyalty();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const discount = calculateDiscount(cartTotal, activeRedemption);
  const finalTotal = Math.max(0, cartTotal - discount);
  const pointsToEarn = calculatePointsEarned(finalTotal);

  if (cart.length === 0) {
    return (
      <EmptyState
        icon={ShoppingBag}
        title="Your cart is empty"
        description="Add items before checkout."
        actionLabel="Go to Shop"
        actionHref="/shop"
      />
    );
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const form: CheckoutForm = {
      customerName: (formData.get("customerName") as string).trim(),
      phone: (formData.get("phone") as string).trim(),
      address: (formData.get("address") as string).trim(),
      city: (formData.get("city") as string).trim(),
      state: formData.get("state") as string,
      pincode: (formData.get("pincode") as string).trim(),
    };

    try {
      await loadAccount(form.phone);

      const redemptionSnapshot = activeRedemption;

      const orderRes = await apiFetch<{ order?: { id: string } }>("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items: cart.map((c) => ({
            productId: c.product.id,
            name: c.product.name,
            quantity: c.quantity,
            price: c.product.price,
          })),
          total: finalTotal,
        }),
      });

      if (!orderRes.ok || !orderRes.data.order?.id) {
        setError(orderRes.ok ? "Could not save your order. Please try again." : orderRes.error);
        return;
      }

      const orderId = orderRes.data.order.id;
      const invoiceUrl = `${window.location.origin}/invoice/${orderId}`;

      const { earned, balanceAfter, redemption } = await completeOrder(
        form.phone,
        form.customerName,
        finalTotal,
      );

      const message = buildOrderMessage(form, cart, finalTotal, orderId, invoiceUrl, {
        discount,
        redemption: redemption ?? redemptionSnapshot,
        pointsEarned: earned,
        pointsBalance: balanceAfter,
      });

      clearCart();
      window.open(getWhatsAppUrl(message), "_blank");

      router.push(`/invoice/${orderId}?earned=${earned}&balance=${balanceAfter}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-light-muted bg-white px-4 py-3 text-base outline-none focus:border-gold focus:ring-2 focus:ring-gold/20";

  return (
    <div className="page-mobile-safe min-h-screen bg-gradient-to-b from-[#faf6ee] via-light to-white">
      <div className={PAGE_SHELL}>
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Cart", href: "/cart" },
          { label: "Checkout" },
        ]}
      />
      <h1 className="mb-6 text-2xl font-semibold text-dark sm:text-3xl">Checkout</h1>

      <div className="grid gap-8 lg:grid-cols-2">
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-sm text-dark/60">{CHECKOUT_PAYMENT_NOTICE}</p>

          <div className="rounded-xl border border-gold/30 bg-gold/10 px-4 py-3 text-xs text-dark/80">
            <p className="font-medium text-gold-dark">Online payment coming soon</p>
            <p className="mt-1">{ONLINE_PAYMENT_COMING_SOON}</p>
          </div>

          <div className="rounded-xl border border-[#25D366]/30 bg-[#25D366]/5 p-4 text-xs text-dark/80">
            <p className="font-medium text-dark">How payment works</p>
            <ol className="mt-2 list-decimal space-y-1 pl-4">
              <li>Place order — opens WhatsApp with your bill</li>
              <li>We confirm availability (usually within 2–4 hours)</li>
              <li>Pay via {PAYMENT_METHODS_SUMMARY.toLowerCase()}</li>
              <li>Send payment screenshot on WhatsApp</li>
              <li>We ship and share tracking</li>
            </ol>
            <p className="mt-2 text-dark/70">{COD_POLICY}</p>
          </div>

          <div className="rounded-xl border border-gold/30 bg-gold/10 p-3 text-xs text-dark/80">
            <p className="font-medium text-dark">Delivery: {DELIVERY_REGION_LABEL}</p>
            <p className="mt-1">{DELIVERY_NOTICE}</p>
          </div>

          <div className="rounded-xl border border-gold/30 bg-gold/10 p-3 text-xs text-dark">
            <div className="flex items-center gap-1.5 font-medium">
              <Sparkles className="h-3.5 w-3.5 text-gold-dark" />
              Earn {pointsToEarn} pts on this order
            </div>
            <p className="mt-1 text-dark/70">
              {activeRedemption ? (
                <>
                  Reward applied: <strong>{activeRedemption.title}</strong>
                </>
              ) : (
                <>
                  Have points?{" "}
                  <Link href="/rewards" className="font-medium text-gold-dark underline">
                    Redeem a reward
                  </Link>{" "}
                  before checkout.
                </>
              )}
            </p>
          </div>

          <div>
            <label htmlFor="customerName" className="mb-1 block text-sm font-medium">
              Full Name *
            </label>
            <input id="customerName" name="customerName" required className={inputClass} />
          </div>
          <div>
            <label htmlFor="phone" className="mb-1 block text-sm font-medium">
              Phone Number *
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              placeholder="+91 ..."
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="address" className="mb-1 block text-sm font-medium">
              Address *
            </label>
            <textarea
              id="address"
              name="address"
              required
              rows={3}
              className={`${inputClass} resize-none`}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="city" className="mb-1 block text-sm font-medium">
                City *
              </label>
              <input id="city" name="city" required className={inputClass} />
            </div>
            <div>
              <label htmlFor="state" className="mb-1 block text-sm font-medium">
                State *
              </label>
              <select id="state" name="state" required className={inputClass} defaultValue="">
                <option value="" disabled>
                  Select state
                </option>
                {DELIVERY_STATES.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="pincode" className="mb-1 block text-sm font-medium">
              Pincode *
            </label>
            <input id="pincode" name="pincode" required className={inputClass} />
          </div>

          <UnboxingVideoNotice />

          {error && (
            <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3.5 text-sm font-semibold text-white transition hover:bg-[#1fb855] disabled:opacity-60"
          >
            <MessageCircle className="h-5 w-5" />
            {loading ? "Processing..." : "Place Order via WhatsApp"}
          </button>
        </form>

        <div className={`p-6 lg:sticky lg:top-20 lg:self-start ${CARD_SURFACE}`}>
          <h2 className="text-lg font-semibold text-dark">Your Order</h2>
          <ul className="mt-4 space-y-3">
            {cart.map((item) => (
              <li key={item.product.id} className="flex justify-between text-sm">
                <span className="text-dark/70">
                  {item.product.name} × {item.quantity}
                </span>
                <span className="font-medium">
                  {formatPrice(item.product.price * item.quantity)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-2 border-t border-light-muted pt-4 text-sm">
            <div className="flex justify-between text-dark/70">
              <span>Subtotal</span>
              <span>{formatPrice(cartTotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-green-700">
                <span>Reward discount</span>
                <span>-{formatPrice(discount)}</span>
              </div>
            )}
            {activeRedemption?.type === "free_item" && (
              <div className="flex justify-between text-gold-dark">
                <span>Free reward</span>
                <span>{activeRedemption.freeItemLabel}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span className="text-gold-dark">{formatPrice(finalTotal)}</span>
            </div>
            <p className="text-[11px] text-dark/50">+{pointsToEarn} pts after order</p>
          </div>
        </div>
      </div>
      </div>
      <SectionDivider />
    </div>
  );
}
