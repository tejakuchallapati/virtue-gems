"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Check, Star, Trash2, X } from "lucide-react";
import { apiFetch } from "@/lib/api-client";
import { cn, formatDate } from "@/lib/utils";
import type { StoreReview, StoreReviewStatus } from "@/types";

const TABS: { value: StoreReviewStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Hidden" },
];

export function AdminReviews({
  initialReviews,
  setupRequired,
}: {
  initialReviews: StoreReview[];
  setupRequired: boolean;
}) {
  const [reviews, setReviews] = useState(initialReviews);
  const [tab, setTab] = useState<StoreReviewStatus>("pending");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const counts = useMemo(() => {
    const c: Record<StoreReviewStatus, number> = { pending: 0, approved: 0, rejected: 0 };
    reviews.forEach((r) => (c[r.status] += 1));
    return c;
  }, [reviews]);

  const visible = reviews.filter((r) => r.status === tab);

  async function updateStatus(id: string, status: StoreReviewStatus) {
    setBusyId(id);
    setError("");
    const res = await apiFetch("/api/admin/reviews", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    setBusyId(null);
    if (!res.ok) return setError(res.error);
    setReviews((current) => current.map((r) => (r.id === id ? { ...r, status } : r)));
  }

  async function remove(id: string) {
    if (!window.confirm("Delete this review and its photos permanently?")) return;
    setBusyId(id);
    setError("");
    const res = await apiFetch(`/api/admin/reviews?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    setBusyId(null);
    if (!res.ok) return setError(res.error);
    setReviews((current) => current.filter((r) => r.id !== id));
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-light">Customer Reviews</h1>
      <p className="mt-1 text-sm text-light/50">
        Reviews submitted on the website. Approved reviews appear on the home page.
      </p>

      {setupRequired && (
        <div className="mt-5 rounded-xl border border-amber-400/25 bg-amber-400/10 p-4 text-sm text-amber-200">
          Run <code className="rounded bg-black/30 px-1">supabase/migrations/002_store_reviews.sql</code> in
          the Supabase SQL Editor to start collecting reviews.
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => setTab(t.value)}
            className={cn(
              "inline-flex min-h-11 items-center gap-2 rounded-xl px-4 text-sm transition",
              tab === t.value
                ? "bg-gold/15 text-gold ring-1 ring-gold/30"
                : "bg-dark-soft text-light/60 hover:text-light",
            )}
          >
            {t.label}
            <span className="rounded-full bg-black/30 px-2 py-0.5 text-xs">{counts[t.value]}</span>
          </button>
        ))}
      </div>

      {error && (
        <p role="alert" className="mt-4 rounded-xl bg-red-500/15 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      )}

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {visible.length === 0 && (
          <p className="rounded-2xl bg-dark-soft p-6 text-sm text-light/45 ring-1 ring-light/10">
            No {TABS.find((t) => t.value === tab)?.label.toLowerCase()} reviews.
          </p>
        )}
        {visible.map((review) => (
          <article key={review.id} className="min-w-0 rounded-2xl bg-dark-soft p-4 ring-1 ring-light/10 sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="font-semibold text-light">
                  {review.authorName}
                  {review.city && <span className="font-normal text-light/45"> · {review.city}</span>}
                </p>
                <p className="mt-0.5 text-xs text-light/40">{formatDate(review.createdAt)}</p>
              </div>
              <div className="flex gap-0.5" aria-label={`${review.rating} out of 5 stars`}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn("h-4 w-4", i < review.rating ? "fill-gold text-gold" : "text-light/20")}
                  />
                ))}
              </div>
            </div>

            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-light/75">{review.comment}</p>

            {review.photos.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {review.photos.map((src, i) => (
                  <a
                    key={src}
                    href={src}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative h-20 w-20 overflow-hidden rounded-xl ring-1 ring-light/15"
                  >
                    <Image src={src} alt={`Photo ${i + 1} from ${review.authorName}`} fill sizes="80px" className="object-cover" />
                  </a>
                ))}
              </div>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              {review.status !== "approved" && (
                <button
                  type="button"
                  disabled={busyId === review.id}
                  onClick={() => updateStatus(review.id, "approved")}
                  className="inline-flex min-h-10 items-center gap-1.5 rounded-xl bg-emerald-500/15 px-3 text-sm text-emerald-300 transition hover:bg-emerald-500/25 disabled:opacity-50"
                >
                  <Check className="h-4 w-4" /> Approve
                </button>
              )}
              {review.status !== "rejected" && (
                <button
                  type="button"
                  disabled={busyId === review.id}
                  onClick={() => updateStatus(review.id, "rejected")}
                  className="inline-flex min-h-10 items-center gap-1.5 rounded-xl bg-white/5 px-3 text-sm text-light/65 transition hover:bg-white/10 disabled:opacity-50"
                >
                  <X className="h-4 w-4" /> Hide
                </button>
              )}
              <button
                type="button"
                disabled={busyId === review.id}
                onClick={() => remove(review.id)}
                className="inline-flex min-h-10 items-center gap-1.5 rounded-xl px-3 text-sm text-red-300/80 transition hover:bg-red-500/15 disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" /> Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
