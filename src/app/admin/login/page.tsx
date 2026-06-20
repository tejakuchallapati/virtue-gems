"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ShieldCheck, ArrowRight, KeyRound } from "lucide-react";
import { apiFetch } from "@/lib/api-client";

type Step = "email" | "otp";

export default function AdminLoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSendOtp(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await apiFetch("/api/admin/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStep("otp");
        setSent(true);
      } else {
        setError(res.error);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await apiFetch("/api/admin/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      if (res.ok) {
        router.push("/admin");
      } else {
        setError(res.error);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0a0612] px-4">
      {/* Background accents */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.12),transparent_50%)]" />
      <motion.div
        className="pointer-events-none absolute -left-32 top-20 h-64 w-64 rounded-full border border-gold/20"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        {/* Admin brand header */}
        <div className="mb-8 text-center">
          <div className="relative mx-auto mb-4 h-16 w-16">
            <Image
              src="/logo.png"
              alt="Virtue Gems"
              fill
              className="object-contain"
            />
          </div>
          <p className="text-xs tracking-[0.35em] text-gold/80 uppercase">
            Admin Portal
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-white">
            Secure <span className="text-gold">Access</span>
          </h1>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gold/20 bg-[#12101a]/90 shadow-[0_0_40px_rgba(212,175,55,0.08)]">
          <div className="border-b border-gold/10 bg-gradient-to-r from-gold/10 via-transparent to-gold/10 px-6 py-3">
            <div className="flex items-center justify-center gap-2 text-xs text-gold/90">
              <ShieldCheck className="h-4 w-4" />
              OTP-based authentication
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <AnimatePresence mode="wait">
              {step === "email" ? (
                <motion.form
                  key="email"
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 16 }}
                  onSubmit={handleSendOtp}
                  className="space-y-5"
                >
                  <p className="text-sm text-white/50">
                    Enter your authorized admin email. We&apos;ll send a 6-digit OTP.
                  </p>
                  <div>
                    <label htmlFor="email" className="mb-1.5 flex items-center gap-2 text-sm text-white/70">
                      <Mail className="h-4 w-4 text-gold" />
                      Admin Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="virtuegems777@gmail.com"
                      className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-gold focus:ring-1 focus:ring-gold/30"
                    />
                  </div>
                  {error && <p className="text-sm text-red-400">{error}</p>}
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-gold to-gold-light py-3.5 text-sm font-semibold text-dark transition hover:opacity-90 disabled:opacity-60"
                  >
                    {loading ? "Sending OTP..." : "Send OTP"}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </motion.form>
              ) : (
                <motion.form
                  key="otp"
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 16 }}
                  onSubmit={handleVerifyOtp}
                  className="space-y-5"
                >
                  {sent && (
                    <p className="rounded-lg bg-gold/10 px-3 py-2 text-center text-sm text-gold">
                      OTP sent to {email}
                    </p>
                  )}
                  <div>
                    <label htmlFor="otp" className="mb-1.5 flex items-center gap-2 text-sm text-white/70">
                      <KeyRound className="h-4 w-4 text-gold" />
                      6-Digit OTP
                    </label>
                    <input
                      id="otp"
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]{6}"
                      maxLength={6}
                      required
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                      placeholder="000000"
                      className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-center text-2xl tracking-[0.5em] text-white outline-none transition focus:border-gold focus:ring-1 focus:ring-gold/30"
                    />
                  </div>
                  {error && <p className="text-sm text-red-400">{error}</p>}
                  <button
                    type="submit"
                    disabled={loading || otp.length !== 6}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-gold to-gold-light py-3.5 text-sm font-semibold text-dark transition hover:opacity-90 disabled:opacity-60"
                  >
                    {loading ? "Verifying..." : "Verify & Sign In"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setStep("email");
                      setOtp("");
                      setError("");
                    }}
                    className="w-full text-sm text-white/40 transition hover:text-gold"
                  >
                    ← Use a different email
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
