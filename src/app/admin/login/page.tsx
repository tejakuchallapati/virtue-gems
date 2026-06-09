"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const password = new FormData(e.currentTarget).get("password") as string;
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/admin");
    } else {
      setError("Invalid password");
    }
    setLoading(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-dark px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl bg-dark-soft p-8 ring-1 ring-gold/20"
      >
        <h1 className="text-center text-xl font-bold tracking-widest text-light">
          VIRTUE <span className="text-gold">ADMIN</span>
        </h1>
        <p className="mt-2 text-center text-sm text-light/50">
          Sign in to manage your store
        </p>
        <div className="mt-6">
          <label htmlFor="password" className="mb-1 block text-sm text-light/70">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="w-full rounded-xl border border-light/10 bg-dark px-4 py-3 text-light outline-none focus:border-gold"
          />
        </div>
        {error && (
          <p className="mt-2 text-sm text-red-400">{error}</p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-xl bg-gold py-3 text-sm font-semibold text-dark hover:bg-gold-light disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}
