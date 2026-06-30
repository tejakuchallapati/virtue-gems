"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useStore } from "@/context/StoreProvider";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatPrice } from "@/lib/utils";
import { CARD_SURFACE, PAGE_SHELL, PRODUCT_IMAGE_FIT, PRODUCT_IMAGE_FRAME } from "@/lib/ui-classes";
import { DELIVERY_SHORT } from "@/lib/delivery";

export default function CartPage() {
  const { cart, cartTotal, updateQuantity, removeFromCart } = useStore();

  if (cart.length === 0) {
    return (
      <EmptyState
        icon={ShoppingBag}
        title="Your cart is empty"
        description="Discover our exquisite collections."
        actionLabel="Browse Shop"
        actionHref="/shop"
      />
    );
  }

  return (
    <div className={PAGE_SHELL}>
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Cart" }]} />
      <h1 className="mb-6 text-2xl font-semibold text-dark sm:text-3xl">
        Shopping Cart
      </h1>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {cart.map((item, i) => (
            <ScrollReveal key={item.product.id} delay={i * 0.05}>
              <div className={`flex gap-4 p-4 ${CARD_SURFACE}`}>
                <Link
                  href={`/product/${item.product.slug}`}
                  className={`h-24 w-24 shrink-0 rounded-xl sm:h-28 sm:w-28 ${PRODUCT_IMAGE_FRAME}`}
                >
                  <Image
                    src={item.product.images[0]}
                    alt={item.product.name}
                    fill
                    sizes="112px"
                    className={PRODUCT_IMAGE_FIT}
                  />
                </Link>
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <Link
                      href={`/product/${item.product.slug}`}
                      className="font-medium text-dark hover:text-gold"
                    >
                      {item.product.name}
                    </Link>
                    <p className="mt-1 text-sm font-semibold text-gold-dark">
                      {formatPrice(item.product.price)}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center rounded-lg border border-light-muted">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            item.product.id,
                            item.quantity - 1,
                          )
                        }
                        className="px-2.5 py-1.5"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            item.product.id,
                            item.quantity + 1,
                          )
                        }
                        className="px-2.5 py-1.5"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-dark/40 hover:text-red-500"
                      aria-label="Remove"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className={`sticky top-20 p-6 ${CARD_SURFACE}`}>
            <h2 className="text-lg font-semibold text-dark">Order Summary</h2>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between text-dark/70">
                <span>Subtotal</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-dark/70">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <p className="text-[11px] text-dark/45">{DELIVERY_SHORT}</p>
              <div className="border-t border-light-muted pt-2">
                <div className="flex justify-between text-base font-semibold text-dark">
                  <span>Total</span>
                  <span className="text-gold-dark">{formatPrice(cartTotal)}</span>
                </div>
              </div>
            </div>
            <Link
              href="/checkout"
              className="mt-6 block w-full rounded-xl bg-dark py-3.5 text-center text-sm font-semibold text-gold transition hover:bg-gold hover:text-dark"
            >
              Proceed to Checkout
            </Link>
            <Link
              href="/shop"
              className="mt-3 block text-center text-sm text-gold hover:underline"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
