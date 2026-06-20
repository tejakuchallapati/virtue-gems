"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import {
  Clock,
  Gift,
  Mail,
  MapPin,
  MessageCircle,
  Package,
  Phone,
  Ruler,
  Shield,
  Sparkles,
  Truck,
} from "lucide-react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { apiFetch } from "@/lib/api-client";
import { whatsAppContactUrl } from "@/lib/whatsapp";
import {
  DELIVERY_NOTICE,
  DELIVERY_REGION_LABEL,
  DELIVERY_TIMELINE,
} from "@/lib/delivery";

type FormState = "idle" | "loading" | "success" | "error";

const CONTACT_EMAIL = "virtuegems777@gmail.com";
const CONTACT_PHONE = "+91 73961 78039";
const INSTAGRAM_URL = "https://www.instagram.com/virtue_gems/";
const INSTAGRAM_HANDLE = "@virtue_gems";

const contactChannels = [
  {
    icon: MessageCircle,
    title: "WhatsApp",
    detail: CONTACT_PHONE,
    note: "For any enquiries — orders, sizing, or custom requests",
    href: whatsAppContactUrl,
    external: true,
    primary: true,
  },
  {
    icon: Mail,
    title: "Email",
    detail: CONTACT_EMAIL,
    note: "For detailed enquiries & invoices",
    href: `mailto:${CONTACT_EMAIL}`,
    external: false,
    primary: false,
  },
  {
    icon: Phone,
    title: "Call / WhatsApp",
    detail: CONTACT_PHONE,
    note: "Mon–Sat, 10 AM – 8 PM IST",
    href: `tel:+917396178039`,
    external: false,
    primary: false,
  },
];

const helpTopics = [
  {
    icon: Package,
    title: "Orders & Delivery",
    text: "Track your order, change address, or ask about dispatch timelines.",
  },
  {
    icon: Ruler,
    title: "Sizing & Product Info",
    text: "Ring/bracelet sizes, product photos, or help choosing the right piece.",
  },
  {
    icon: Sparkles,
    title: "Custom & Gifting",
    text: "Festive gifting, letter-packed orders, or bulk purchases for events.",
  },
  {
    icon: Gift,
    title: "Rewards & Points",
    text: "Check loyalty balance, redeem rewards, or points after your order.",
    href: "/rewards",
  },
  {
    icon: Shield,
    title: "Returns & Refunds",
    text: "Exchange, return policy, and mandatory unboxing video requirements.",
    href: "/refunds",
  },
  {
    icon: Truck,
    title: "Regional Delivery",
    text: `${DELIVERY_NOTICE} Secure, gift-ready packaging on every order.`,
  },
];

const businessInfo = [
  { icon: Clock, label: "Response time", value: "Within 2–4 hours on WhatsApp" },
  { icon: Truck, label: "Delivery", value: `${DELIVERY_REGION_LABEL} · ${DELIVERY_TIMELINE}` },
  {
    icon: MapPin,
    label: "Service area",
    value: "Andhra Pradesh & Telangana (expanding soon)",
  },
  { icon: Gift, label: "Packaging", value: "Premium letter-packed gift boxes" },
];

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

export default function ContactPage() {
  const [status, setStatus] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const result = await apiFetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          subject: formData.get("subject"),
          message: formData.get("message"),
        }),
      });

      if (!result.ok) throw new Error(result.error);
      setStatus("success");
      form.reset();
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to send message.",
      );
    }
  }

  const inputClass =
    "w-full rounded-xl border border-light-muted bg-white px-4 py-3 text-base outline-none focus:border-gold focus:ring-2 focus:ring-gold/20";

  return (
    <div className="page-mobile-safe mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Contact" }]} />

      {/* Hero */}
      <ScrollReveal className="relative mb-10 overflow-hidden rounded-3xl bg-gradient-to-br from-[#1a0a2e] via-[#2d1450] to-[#1a0a2e] px-6 py-10 text-center sm:px-10 sm:py-14">
        <p className="text-xs tracking-[0.25em] text-gold uppercase">Get in Touch</p>
        <h1 className="mt-3 text-2xl font-semibold text-light sm:text-4xl">
          We&apos;re Here to Help You Shine
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-light/70 sm:text-base">
          Questions about an order, sizing, custom gifting, or rewards?{" "}
          <span className="text-gold">For any enquiries, message us on WhatsApp</span> for the
          quickest reply — or send a message below. We currently deliver to{" "}
          <span className="text-gold">{DELIVERY_REGION_LABEL}</span>.
        </p>
        <a
          href={whatsAppContactUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-dark transition hover:bg-gold-light"
        >
          <MessageCircle className="h-4 w-4" />
          Chat on WhatsApp
        </a>
      </ScrollReveal>

      {/* Contact channels */}
      <div className="mb-12 grid gap-4 sm:grid-cols-3">
        {contactChannels.map((channel, i) => {
          const Icon = channel.icon;
          return (
            <ScrollReveal key={channel.title} delay={i * 0.06}>
              <a
                href={channel.href}
                target={channel.external ? "_blank" : undefined}
                rel={channel.external ? "noopener noreferrer" : undefined}
                className={`block h-full rounded-2xl p-5 transition hover:shadow-md ${
                  channel.primary
                    ? "bg-gradient-to-br from-[#1a0a2e] to-[#2d1450] text-light ring-1 ring-gold/30"
                    : "bg-white text-dark ring-1 ring-light-muted/60 hover:ring-gold/30"
                }`}
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full ${
                    channel.primary ? "bg-gold/15 text-gold" : "bg-gold/10 text-gold-dark"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="mt-4 font-semibold">{channel.title}</h2>
                <p
                  className={`mt-1 text-sm font-medium ${
                    channel.primary ? "text-gold" : "text-gold-dark"
                  }`}
                >
                  {channel.detail}
                </p>
                <p
                  className={`mt-2 text-xs ${
                    channel.primary ? "text-light/60" : "text-dark/55"
                  }`}
                >
                  {channel.note}
                </p>
              </a>
            </ScrollReveal>
          );
        })}
      </div>

      {/* Instagram + business info */}
      <div className="mb-12 grid gap-6 lg:grid-cols-2">
        <ScrollReveal>
          <div className="h-full rounded-2xl bg-white p-6 ring-1 ring-light-muted/60 sm:p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/10 text-gold-dark">
                <InstagramIcon className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-semibold text-dark">Follow Us</h2>
                <p className="text-sm text-dark/60">Latest designs & new arrivals</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-dark/70">
              See our newest collections, customer favourites, and festive drops on Instagram.
            </p>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-gold-dark hover:underline"
            >
              {INSTAGRAM_HANDLE} →
            </a>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.08}>
          <div className="h-full rounded-2xl bg-light p-6 ring-1 ring-light-muted/60 sm:p-8">
            <h2 className="font-semibold text-dark">Good to Know</h2>
            <ul className="mt-4 space-y-4">
              {businessInfo.map(({ icon: Icon, label, value }) => (
                <li key={label} className="flex gap-3">
                  <Icon className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-dark/45">
                      {label}
                    </p>
                    <p className="text-sm text-dark/75">{value}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </ScrollReveal>
      </div>

      {/* How we can help */}
      <ScrollReveal className="mb-10">
        <h2 className="text-center text-xl font-semibold text-dark sm:text-2xl">
          How Can We Help?
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-center text-sm text-dark/60">
          Common topics our customers ask about — tap a link or message us directly.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {helpTopics.map((topic, i) => {
            const Icon = topic.icon;
            const content = (
              <>
                <Icon className="h-5 w-5 text-gold" />
                <h3 className="mt-3 font-semibold text-dark">{topic.title}</h3>
                <p className="mt-1 text-sm text-dark/60">{topic.text}</p>
              </>
            );

            return (
              <ScrollReveal key={topic.title} delay={i * 0.05}>
                {topic.href ? (
                  <Link
                    href={topic.href}
                    className="block h-full rounded-2xl bg-white p-5 ring-1 ring-light-muted/60 transition hover:ring-gold/30"
                  >
                    {content}
                  </Link>
                ) : (
                  <div className="h-full rounded-2xl bg-white p-5 ring-1 ring-light-muted/60">
                    {content}
                  </div>
                )}
              </ScrollReveal>
            );
          })}
        </div>
      </ScrollReveal>

      {/* Form */}
      <div className="grid gap-10 lg:grid-cols-5">
        <ScrollReveal className="lg:col-span-2">
          <h2 className="text-xl font-semibold text-dark sm:text-2xl">Send a Message</h2>
          <p className="mt-2 text-sm text-dark/60">
            Prefer email? Fill in the form and we&apos;ll get back to you within 1–2 business days.
          </p>
          <ul className="mt-6 space-y-3 text-sm text-dark/65">
            <li>· Include your order ID if you already placed an order</li>
            <li>· For urgent orders, WhatsApp is recommended</li>
            <li>· Attach product names or links when asking about availability</li>
          </ul>
          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <Link href="/shop" className="font-medium text-gold-dark hover:underline">
              Browse Shop →
            </Link>
            <Link href="/rewards" className="font-medium text-gold-dark hover:underline">
              Rewards & Points →
            </Link>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1} className="lg:col-span-3">
          {status === "success" ? (
            <div className="rounded-2xl bg-white p-8 text-center ring-1 ring-gold/30">
              <p className="text-lg font-medium text-gold-dark">Message sent!</p>
              <p className="mt-2 text-sm text-dark/60">
                Thank you for reaching out. We&apos;ll reply to your email soon.
              </p>
              <button
                type="button"
                onClick={() => setStatus("idle")}
                className="mt-4 text-sm text-gold underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="space-y-4 rounded-2xl bg-white p-6 ring-1 ring-light-muted/60 sm:p-8"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="mb-1 block text-sm font-medium">
                    Name *
                  </label>
                  <input id="name" name="name" required className={inputClass} />
                </div>
                <div>
                  <label htmlFor="phone" className="mb-1 block text-sm font-medium">
                    Phone
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="mb-1 block text-sm font-medium">
                  Email *
                </label>
                <input id="email" name="email" type="email" required className={inputClass} />
              </div>
              <div>
                <label htmlFor="subject" className="mb-1 block text-sm font-medium">
                  Subject
                </label>
                <select id="subject" name="subject" className={inputClass} defaultValue="">
                  <option value="">Select a topic</option>
                  <option value="Order enquiry">Order enquiry</option>
                  <option value="Product & sizing">Product & sizing</option>
                  <option value="Custom / bulk order">Custom / bulk order</option>
                  <option value="Rewards & points">Rewards & points</option>
                  <option value="Return or refund">Return or refund</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label htmlFor="message" className="mb-1 block text-sm font-medium">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  placeholder="Tell us how we can help..."
                  className={`${inputClass} resize-none`}
                />
              </div>
              {status === "error" && (
                <p className="text-sm text-red-600">{errorMessage}</p>
              )}
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full rounded-xl bg-dark py-3.5 text-sm font-semibold text-gold transition hover:bg-gold hover:text-dark disabled:opacity-60"
              >
                {status === "loading" ? "Sending..." : "Send Message"}
              </button>
            </form>
          )}
        </ScrollReveal>
      </div>
    </div>
  );
}
