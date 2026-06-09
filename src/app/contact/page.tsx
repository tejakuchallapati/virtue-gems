"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

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

      if (!response.ok) {
        throw new Error(data.error ?? "Something went wrong.");
      }

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
    <div className="min-h-full bg-[#faf8f5]">
      <header className="border-b border-[#e8e0d4] bg-white px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-lg items-center justify-between">
          <Link href="/" className="text-lg font-semibold tracking-wide text-[#8b6914]">
            Virtue Gems
          </Link>
          <span className="text-sm text-[#6b5b4f]">Contact</span>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 py-8 sm:px-6 sm:py-12">
        <h1 className="text-2xl font-semibold text-[#1a1a1a] sm:text-3xl">
          Get in touch
        </h1>
        <p className="mt-2 text-[#6b5b4f]">
          Questions about our jewellery? Send us a message and we&apos;ll reply
          soon.
        </p>

        {status === "success" ? (
          <div
            className="mt-8 rounded-2xl border border-[#d4af37]/40 bg-white p-6 text-center"
            role="status"
          >
            <p className="text-lg font-medium text-[#8b6914]">Message sent!</p>
            <p className="mt-2 text-sm text-[#6b5b4f]">
              Thank you. We&apos;ll get back to you at your email address.
            </p>
            <button
              type="button"
              onClick={() => setStatus("idle")}
              className="mt-4 text-sm font-medium text-[#8b6914] underline"
            >
              Send another message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label htmlFor="name" className="mb-1 block text-sm font-medium text-[#1a1a1a]">
                Name *
              </label>
              <input
                id="name"
                name="name"
                required
                autoComplete="name"
                className="w-full rounded-xl border border-[#e8e0d4] bg-white px-4 py-3 text-base outline-none focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20"
                placeholder="Your name"
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium text-[#1a1a1a]">
                Email *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="w-full rounded-xl border border-[#e8e0d4] bg-white px-4 py-3 text-base outline-none focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="phone" className="mb-1 block text-sm font-medium text-[#1a1a1a]">
                Phone
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                className="w-full rounded-xl border border-[#e8e0d4] bg-white px-4 py-3 text-base outline-none focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20"
                placeholder="+91 ..."
              />
            </div>

            <div>
              <label htmlFor="subject" className="mb-1 block text-sm font-medium text-[#1a1a1a]">
                Subject
              </label>
              <input
                id="subject"
                name="subject"
                className="w-full rounded-xl border border-[#e8e0d4] bg-white px-4 py-3 text-base outline-none focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20"
                placeholder="Product enquiry, custom order..."
              />
            </div>

            <div>
              <label htmlFor="message" className="mb-1 block text-sm font-medium text-[#1a1a1a]">
                Message *
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                className="w-full resize-none rounded-xl border border-[#e8e0d4] bg-white px-4 py-3 text-base outline-none focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20"
                placeholder="How can we help you?"
              />
            </div>

            {status === "error" && (
              <p className="text-sm text-red-600" role="alert">
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full rounded-xl bg-[#8b6914] px-4 py-3.5 text-base font-medium text-white transition hover:bg-[#6d5210] disabled:opacity-60"
            >
              {status === "loading" ? "Sending..." : "Send message"}
            </button>
          </form>
        )}

        <p className="mt-8 text-center text-sm text-[#6b5b4f]">
          <Link href="/" className="text-[#8b6914] underline">
            Back to home
          </Link>
        </p>
      </main>
    </div>
  );
}
