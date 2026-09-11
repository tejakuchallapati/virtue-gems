"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { apiFetch } from "@/lib/api-client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { ADMIN_SHELL_BG } from "@/lib/ui-classes";

export default function AdminLoginPage() {
  const router = useRouter();
  const useSupabase = isSupabaseConfigured();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setNotice("");
    try {
      if (useSupabase) {
        const supabase = createSupabaseBrowserClient();
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (signInError) {
          setError(signInError.message);
          return;
        }
        router.replace("/admin");
        router.refresh();
        return;
      }

      if (!otpSent) {
        const res = await apiFetch("/api/admin/otp/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.trim() }),
        });
        if (!res.ok) {
          setError(res.error);
          return;
        }
        setOtpSent(true);
        setNotice(`OTP sent to ${email.trim()}. It expires in 10 minutes.`);
        return;
      }

      const res = await apiFetch("/api/admin/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), otp }),
      });
      if (!res.ok) {
        setError(res.error);
        return;
      }
      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Could not reach the login service. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  async function resendOtp() {
    setLoading(true);
    setError("");
    setNotice("");
    setOtp("");
    try {
      const res = await apiFetch("/api/admin/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setNotice("A new OTP was sent. The previous code is no longer valid.");
    } catch {
      setError("Could not resend the OTP. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className={`relative flex min-h-dvh items-center justify-center overflow-hidden px-4 ${ADMIN_SHELL_BG}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.12),transparent_50%)]" />
      <div className="relative w-full max-w-md">
        <div className="mb-7 text-center">
          <div className="relative mx-auto mb-3 h-14 w-36">
            <Image
              src="/logo-vg.png"
              alt="Virtue Gems"
              fill
              sizes="144px"
              className="object-contain"
              priority
            />
          </div>
          <p className="text-xs uppercase tracking-[0.35em] text-gold/80">
            Admin &amp; Manager Portal
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-white">
            Secure <span className="text-gold">CRM Access</span>
          </h1>
          <p className="mt-2 text-xs text-white/45">
            One login page — your role (Admin or Manager) controls what you can
            access.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gold/20 bg-[#12101a]/95 shadow-[0_0_40px_rgba(212,175,55,0.08)]">
          <div className="flex items-center justify-center gap-2 border-b border-gold/10 bg-gold/5 px-6 py-3 text-xs text-gold">
            <ShieldCheck className="h-4 w-4" />
            {useSupabase
              ? "Persistent Supabase account"
              : "Local email OTP fallback"}
          </div>
          <form onSubmit={handleSubmit} className="space-y-5 p-6 sm:p-8">
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 flex items-center gap-2 text-sm text-white/70"
              >
                <Mail className="h-4 w-4 text-gold" />
                Work email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                disabled={!useSupabase && otpSent}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-base text-white outline-none focus:border-gold disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            {useSupabase ? (
              <div>
                <label
                  htmlFor="password"
                  className="mb-1.5 flex items-center gap-2 text-sm text-white/70"
                >
                  <LockKeyhole className="h-4 w-4 text-gold" />
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-base text-white outline-none focus:border-gold"
                />
              </div>
            ) : otpSent ? (
              <div>
                <label
                  htmlFor="otp"
                  className="mb-1.5 block text-sm text-white/70"
                >
                  6-digit OTP
                </label>
                <input
                  id="otp"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  required
                  autoFocus
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, ""))
                  }
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-center text-2xl tracking-[0.45em] text-white outline-none focus:border-gold"
                />
              </div>
            ) : null}

            {error && (
              <p role="alert" className="text-sm text-red-400">
                {error}
              </p>
            )}
            {notice && (
              <p role="status" className="rounded-lg bg-gold/10 px-3 py-2 text-sm text-gold">
                {notice}
              </p>
            )}
            <button
              type="submit"
              disabled={loading || (!useSupabase && otpSent && otp.length !== 6)}
              className="min-h-12 w-full rounded-xl bg-gradient-to-r from-gold to-gold-light px-4 font-semibold text-dark disabled:opacity-60"
            >
              {loading
                ? useSupabase
                  ? "Signing in…"
                  : otpSent
                    ? "Verifying…"
                    : "Sending OTP…"
                : useSupabase
                  ? "Sign in"
                  : otpSent
                    ? "Verify and sign in"
                    : "Send OTP"}
            </button>
            {!useSupabase && otpSent && (
              <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => void resendOtp()}
                  className="text-gold/85 underline-offset-4 hover:text-gold hover:underline disabled:opacity-50"
                >
                  Resend OTP
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => {
                    setOtpSent(false);
                    setOtp("");
                    setError("");
                    setNotice("");
                  }}
                  className="text-white/55 underline-offset-4 hover:text-white hover:underline disabled:opacity-50"
                >
                  Use another email
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
