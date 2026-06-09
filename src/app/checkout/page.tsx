"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { useStore } from "@/context/StoreProvider";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { formatPrice } from "@/lib/utils";
import { buildOrderMessage, getWhatsAppUrl } from "@/lib/whatsapp";
import type { CheckoutForm } from "@/types";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartTotal, clearCart } = useStore();
  const [loading, setLoading] = useState(false);

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-dark/60">Your cart is empty.</p>
        <Link href="/shop" className="mt-4 inline-block text-gold underline">
          Go to Shop
        </Link>
      </div>
    );
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const form: CheckoutForm = {
      customerName: formData.get("customerName") as string,
      phone: formData.get("phone") as string,
      address: formData.get("address") as string,
      city: formData.get("city") as string,
      state: formData.get("state") as string,
      pincode: formData.get("pincode") as string,
    };

    try {
      await fetch("/api/orders", {
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
          total: cartTotal,
        }),
      });
    } catch {
      // Continue to WhatsApp even if order save fails
    }

    const message = buildOrderMessage(form, cart, cartTotal);
    clearCart();
    window.open(getWhatsAppUrl(message), "_blank");
    router.push("/shop");
    setLoading(false);
  }

  const inputClass =
    "w-full rounded-xl border border-light-muted bg-white px-4 py-3 text-base outline-none focus:border-gold focus:ring-2 focus:ring-gold/20";

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
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
          <p className="text-sm text-dark/60">
            No payment required. Place your order via WhatsApp and we&apos;ll confirm
            availability.
          </p>

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
              <input id="state" name="state" required className={inputClass} />
            </div>
          </div>
          <div>
            <label htmlFor="pincode" className="mb-1 block text-sm font-medium">
              Pincode *
            </label>
            <input id="pincode" name="pincode" required className={inputClass} />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3.5 text-sm font-semibold text-white transition hover:bg-[#1fb855] disabled:opacity-60"
          >
            <MessageCircle className="h-5 w-5" />
            {loading ? "Processing..." : "Place Order via WhatsApp"}
          </button>
        </form>

        <div className="rounded-2xl bg-white p-6 ring-1 ring-light-muted/60 lg:sticky lg:top-20 lg:self-start">
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
          <div className="mt-4 border-t border-light-muted pt-4">
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span className="text-gold-dark">{formatPrice(cartTotal)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
