"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { whatsAppContactUrl } from "@/lib/whatsapp";

type FormState = "idle" | "loading" | "success" | "error";

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
      const response = await fetch("/api/contact", {
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

      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Something went wrong.");
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
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Contact" }]} />

      <div className="grid gap-10 lg:grid-cols-2">
        <ScrollReveal>
          <h1 className="text-2xl font-semibold text-dark sm:text-3xl">Contact Us</h1>
          <p className="mt-2 text-dark/60">
            We&apos;d love to hear from you. Reach out for custom orders, sizing, or any questions.
          </p>

          <div className="mt-8 space-y-4">
            <a href="mailto:virtuegems777@gmail.com" className="flex items-center gap-3 text-sm text-dark/70 hover:text-gold">
              <Mail className="h-5 w-5 text-gold" />
              virtuegems777@gmail.com
            </a>
            <a href={whatsAppContactUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-dark/70 hover:text-gold">
              <Phone className="h-5 w-5 text-gold" />
              WhatsApp Us
            </a>
            <p className="flex items-center gap-3 text-sm text-dark/70">
              <MapPin className="h-5 w-5 text-gold" />
              India — Pan India Delivery
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          {status === "success" ? (
            <div className="rounded-2xl bg-white p-8 text-center ring-1 ring-gold/30">
              <p className="text-lg font-medium text-gold-dark">Message sent!</p>
              <p className="mt-2 text-sm text-dark/60">We&apos;ll reply soon.</p>
              <button type="button" onClick={() => setStatus("idle")} className="mt-4 text-sm text-gold underline">
                Send another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl bg-white p-6 ring-1 ring-light-muted/60 sm:p-8">
              <div>
                <label htmlFor="name" className="mb-1 block text-sm font-medium">Name *</label>
                <input id="name" name="name" required className={inputClass} />
              </div>
              <div>
                <label htmlFor="email" className="mb-1 block text-sm font-medium">Email *</label>
                <input id="email" name="email" type="email" required className={inputClass} />
              </div>
              <div>
                <label htmlFor="phone" className="mb-1 block text-sm font-medium">Phone</label>
                <input id="phone" name="phone" type="tel" className={inputClass} />
              </div>
              <div>
                <label htmlFor="subject" className="mb-1 block text-sm font-medium">Subject</label>
                <input id="subject" name="subject" className={inputClass} />
              </div>
              <div>
                <label htmlFor="message" className="mb-1 block text-sm font-medium">Message *</label>
                <textarea id="message" name="message" required rows={4} className={`${inputClass} resize-none`} />
              </div>
              {status === "error" && <p className="text-sm text-red-600">{errorMessage}</p>}
              <button type="submit" disabled={status === "loading"} className="w-full rounded-xl bg-dark py-3.5 text-sm font-semibold text-gold hover:bg-gold hover:text-dark disabled:opacity-60">
                {status === "loading" ? "Sending..." : "Send Message"}
              </button>
            </form>
          )}
        </ScrollReveal>
      </div>
    </div>
  );
}
