"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import {
  Clock,
  Gift,
  IndianRupee,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Truck,
} from "lucide-react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { SectionDivider } from "@/components/ui/PageSection";
import { apiFetch } from "@/lib/api-client";
import { PAGE_CONTENT_SHELL, PAGE_GRADIENT_SHELL } from "@/lib/ui-classes";
import { whatsAppContactUrl } from "@/lib/whatsapp";
import {
  DELIVERY_CHARGES_NOTICE,
  DELIVERY_REGION_LABEL,
  DELIVERY_TIMELINE,
} from "@/lib/delivery";
import { LOYALTY_ENABLED } from "@/lib/features";

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
  },
  {
    icon: Mail,
    title: "Email",
    detail: CONTACT_EMAIL,
    note: "For detailed enquiries & invoices",
    href: `mailto:${CONTACT_EMAIL}`,
    external: false,
  },
  {
    icon: Phone,
    title: "Call / WhatsApp",
    detail: CONTACT_PHONE,
    note: "Mon–Sat, 10 AM – 8 PM IST",
    href: `tel:+917396178039`,
    external: false,
  },
];

const businessInfo = [
  { icon: Clock, label: "Response time", value: "Within 2–4 hours on WhatsApp" },
  {
    icon: Truck,
    label: "Delivery",
    value: `${DELIVERY_REGION_LABEL} · ${DELIVERY_TIMELINE}`,
  },
  {
    icon: IndianRupee,
    label: "Delivery charges",
    value: DELIVERY_CHARGES_NOTICE,
  },
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

const fieldClass =
  "w-full rounded-xl border border-gold/25 bg-white px-3.5 py-3 text-base text-dark outline-none transition placeholder:text-dark/35 focus:border-gold focus:ring-2 focus:ring-gold/20";

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

  return (
    <div className={PAGE_GRADIENT_SHELL}>
      <div className={PAGE_CONTENT_SHELL}>
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Contact" }]} />

        <ScrollReveal className="mb-10 max-w-3xl sm:mb-12">
          <p className="text-[11px] font-semibold tracking-[0.18em] text-gold-dark uppercase sm:text-xs">
            Get in touch
          </p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-dark sm:text-4xl">
            We&apos;re here to help you shine
          </h1>
          <p className="mt-4 text-sm leading-relaxed tracking-wide text-dark/70 sm:text-base">
            Questions about an order, sizing, or custom gifting?{" "}
            <strong className="font-bold text-dark">Message us on WhatsApp</strong> for the
            quickest reply — or send a message below. We currently deliver to{" "}
            <strong className="font-bold text-dark">{DELIVERY_REGION_LABEL}</strong>.
          </p>
          <a
            href={whatsAppContactUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-bold tracking-wide text-[#128C7E] hover:underline"
          >
            <MessageCircle className="h-4 w-4" />
            Chat on WhatsApp
          </a>
        </ScrollReveal>

        {/* Reach us + Good to know — aligned two-column */}
        <section className="mb-12 grid items-start gap-10 border-t border-gold/15 pt-10 lg:mb-14 lg:grid-cols-2 lg:gap-14">
          <ScrollReveal>
            <h2 className="text-xl font-extrabold tracking-tight text-dark sm:text-2xl">
              Reach us
            </h2>
            <ul className="mt-7 space-y-7">
              {contactChannels.map((channel) => {
                const Icon = channel.icon;
                return (
                  <li key={channel.title} className="grid grid-cols-[auto_1fr] gap-x-4">
                    <Icon className="mt-0.5 h-5 w-5 text-gold-dark" />
                    <div className="min-w-0">
                      <p className="font-extrabold tracking-wide text-dark">{channel.title}</p>
                      <a
                        href={channel.href}
                        target={channel.external ? "_blank" : undefined}
                        rel={channel.external ? "noopener noreferrer" : undefined}
                        className="mt-1.5 inline-block break-words text-sm font-semibold tracking-wide text-gold-dark hover:underline sm:text-base"
                      >
                        {channel.detail}
                      </a>
                      <p className="mt-1.5 text-sm tracking-wide text-dark/60">{channel.note}</p>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="mt-8 border-t border-gold/15 pt-7">
              <div className="flex items-center gap-2">
                <InstagramIcon className="h-5 w-5 text-gold-dark" />
                <h3 className="text-lg font-extrabold tracking-wide text-dark">Follow us</h3>
              </div>
              <p className="mt-2 text-sm tracking-wide text-dark/65">
                Latest designs, customer favourites, and festive drops on Instagram.
              </p>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex text-sm font-bold tracking-wide text-gold-dark hover:underline"
              >
                {INSTAGRAM_HANDLE} →
              </a>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.05}>
            <h2 className="text-xl font-extrabold tracking-tight text-dark sm:text-2xl">
              Good to know
            </h2>
            <dl className="mt-7 space-y-5">
              {businessInfo.map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="grid grid-cols-[auto_1fr] gap-x-3 rounded-xl border border-gold/15 bg-white/60 px-3.5 py-3"
                >
                  <Icon className="mt-0.5 h-4 w-4 shrink-0 text-gold-dark" />
                  <div>
                    <dt className="font-extrabold tracking-wide text-dark">{label}</dt>
                    <dd className="mt-1 text-sm leading-relaxed tracking-wide text-dark/65">
                      {value}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>
          </ScrollReveal>
        </section>

        {/* Message form */}
        <section className="grid items-start gap-8 border-t border-gold/15 pt-10 lg:grid-cols-5 lg:gap-12">
          <ScrollReveal className="lg:col-span-2">
            <h2 className="text-xl font-extrabold tracking-tight text-dark sm:text-2xl">
              Send a message
            </h2>
            <p className="mt-3 text-sm leading-relaxed tracking-wide text-dark/60">
              Prefer email? Fill in the form and we&apos;ll get back to you within 1–2 business
              days.
            </p>
            <ul className="mt-6 space-y-2.5 text-sm tracking-wide text-dark/65">
              <li>
                Include your <strong className="font-bold text-dark">order ID</strong> if you
                already placed an order
              </li>
              <li>
                For urgent orders, <strong className="font-bold text-dark">WhatsApp</strong> is
                recommended
              </li>
              <li>Attach product names or links when asking about availability</li>
            </ul>
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm">
              <Link
                href="/shop"
                className="font-bold tracking-wide text-gold-dark hover:underline"
              >
                Browse Shop →
              </Link>
              {LOYALTY_ENABLED && (
                <Link
                  href="/rewards"
                  className="font-bold tracking-wide text-gold-dark hover:underline"
                >
                  Rewards &amp; Points →
                </Link>
              )}
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.06} className="lg:col-span-3">
            {status === "success" ? (
              <div className="rounded-2xl border border-gold/30 bg-white px-5 py-6">
                <p className="text-lg font-extrabold text-dark">Message sent!</p>
                <p className="mt-2 text-sm tracking-wide text-dark/60">
                  Thank you for reaching out. We&apos;ll reply to your email soon.
                </p>
                <button
                  type="button"
                  onClick={() => setStatus("idle")}
                  className="mt-4 text-sm font-semibold text-gold-dark underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="space-y-4 rounded-2xl border border-gold/20 bg-white p-5 shadow-sm sm:p-6"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-1.5 block text-sm font-bold tracking-wide text-dark"
                    >
                      Name *
                    </label>
                    <input id="name" name="name" required className={fieldClass} />
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="mb-1.5 block text-sm font-bold tracking-wide text-dark"
                    >
                      Phone
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      className={fieldClass}
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="mb-1.5 block text-sm font-bold tracking-wide text-dark"
                  >
                    Email *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className={fieldClass}
                  />
                </div>
                <div>
                  <label
                    htmlFor="subject"
                    className="mb-1.5 block text-sm font-bold tracking-wide text-dark"
                  >
                    Subject
                  </label>
                  <select id="subject" name="subject" className={fieldClass} defaultValue="">
                    <option value="">Select a topic</option>
                    <option value="Order enquiry">Order enquiry</option>
                    <option value="Product & sizing">Product & sizing</option>
                    <option value="Custom / bulk order">Custom / bulk order</option>
                    {LOYALTY_ENABLED && (
                      <option value="Rewards & points">Rewards & points</option>
                    )}
                    <option value="Return or refund">Return or refund</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="mb-1.5 block text-sm font-bold tracking-wide text-dark"
                  >
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    placeholder="Tell us how we can help..."
                    className={`${fieldClass} resize-none`}
                  />
                </div>
                {status === "error" && (
                  <p className="text-sm text-red-600">{errorMessage}</p>
                )}
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-dark px-6 text-sm font-semibold text-gold transition hover:bg-gold hover:text-dark disabled:opacity-60 sm:w-auto"
                >
                  {status === "loading" ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </ScrollReveal>
        </section>
      </div>
      <SectionDivider />
    </div>
  );
}
