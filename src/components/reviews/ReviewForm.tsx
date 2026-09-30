"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Camera, CheckCircle2, Loader2, Star, X } from "lucide-react";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { apiFetch } from "@/lib/api-client";
import { REVIEW_LIMITS } from "@/lib/reviews-shared";
import { cn } from "@/lib/utils";

type PickedPhoto = { file: File; preview: string };

/** Downscale on-device so phone photos fit the upload limit; falls back to the original file. */
async function compressPhoto(file: File): Promise<File> {
  try {
    const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
    const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.85),
    );
    if (!blob) return file;
    return new File([blob], `${file.name.replace(/\.[^.]+$/, "")}.jpg`, { type: "image/jpeg" });
  } catch {
    return file;
  }
}

const inputClass =
  "w-full rounded-xl border border-light-muted bg-white px-3.5 py-3 text-base text-dark outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/20 sm:text-sm";

export function ReviewForm({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [photos, setPhotos] = useState<PickedPhoto[]>([]);
  const [processing, setProcessing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const photosRef = useRef<PickedPhoto[]>([]);

  useBodyScrollLock(true);

  useEffect(() => {
    photosRef.current = photos;
  }, [photos]);

  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      photosRef.current.forEach((p) => URL.revokeObjectURL(p.preview));
      previousFocus?.focus();
    };
  }, [onClose]);

  async function addPhotos(list: FileList | null) {
    if (!list?.length) return;
    setError("");
    const room = REVIEW_LIMITS.maxPhotos - photos.length;
    const picked = Array.from(list).filter((f) => f.type.startsWith("image/")).slice(0, room);
    if (list.length > room) {
      setError(`You can add up to ${REVIEW_LIMITS.maxPhotos} photos.`);
    }
    setProcessing(true);
    const compressed = await Promise.all(picked.map(compressPhoto));
    setProcessing(false);
    const ok = compressed.filter((f) => f.size <= REVIEW_LIMITS.maxPhotoBytes);
    if (ok.length < compressed.length) {
      setError("Some photos were too large to add. Try a JPG or PNG photo.");
    }
    setPhotos((prev) => [...prev, ...ok.map((file) => ({ file, preview: URL.createObjectURL(file) }))]);
    if (fileRef.current) fileRef.current.value = "";
  }

  function removePhoto(index: number) {
    setPhotos((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    if (!name.trim()) return setError("Please enter your name.");
    if (!rating) return setError("Please choose a star rating.");
    if (comment.trim().length < REVIEW_LIMITS.commentMin) {
      return setError(`Please write at least ${REVIEW_LIMITS.commentMin} characters.`);
    }
    const totalBytes = photos.reduce((sum, p) => sum + p.file.size, 0);
    if (totalBytes > REVIEW_LIMITS.maxTotalBytes) {
      return setError("Photos are too large together. Please remove one and try again.");
    }

    const body = new FormData(e.currentTarget);
    body.set("rating", String(rating));
    body.delete("photos");
    photos.forEach((p) => body.append("photos", p.file, p.file.name));

    setSubmitting(true);
    const result = await apiFetch("/api/reviews", { method: "POST", body, timeoutMs: 45_000 });
    setSubmitting(false);
    if (!result.ok) return setError(result.error);
    setDone(true);
  }

  const shownRating = hoverRating || rating;

  return (
    <div className="fixed inset-0 z-[120] flex items-end justify-center sm:items-center sm:p-6">
      <motion.button
        type="button"
        aria-label="Close review form"
        tabIndex={-1}
        onClick={onClose}
        className="absolute inset-0 bg-[#10061c]/70 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="review-form-title"
        data-lenis-prevent
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="safe-bottom relative max-h-[92dvh] w-full overflow-y-auto overscroll-contain rounded-t-3xl bg-[#faf6ee] p-5 shadow-2xl sm:max-w-lg sm:rounded-3xl sm:p-7"
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full text-dark/50 transition hover:bg-dark/5 hover:text-dark"
        >
          <X className="h-5 w-5" />
        </button>

        {done ? (
          <div className="py-8 text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-gold-dark" />
            <h2 id="review-form-title" className="mt-4 text-xl font-semibold text-dark">
              Thank you for your review!
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-dark/65">
              It will appear on our website once our team has checked it.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-dark px-6 text-sm font-semibold text-gold transition hover:bg-gold hover:text-dark"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={submit} noValidate className="space-y-4">
            <div className="pr-10">
              <p className="text-[11px] tracking-[0.18em] text-gold-dark uppercase">Share your experience</p>
              <h2 id="review-form-title" className="mt-1 text-xl font-semibold text-dark sm:text-2xl">
                Write a review
              </h2>
            </div>

            <div>
              <p className="mb-1.5 text-sm font-medium text-dark">Your rating</p>
              <div className="flex gap-1" role="radiogroup" aria-label="Star rating" onMouseLeave={() => setHoverRating(0)}>
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    role="radio"
                    aria-checked={rating === value}
                    aria-label={`${value} star${value > 1 ? "s" : ""}`}
                    onClick={() => setRating(value)}
                    onMouseEnter={() => setHoverRating(value)}
                    className="flex h-11 w-11 items-center justify-center rounded-full transition active:scale-90"
                  >
                    <Star
                      className={cn(
                        "h-7 w-7 transition",
                        value <= shownRating ? "fill-gold text-gold" : "text-dark/25",
                      )}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-dark">Name</span>
                <input
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={REVIEW_LIMITS.nameMax}
                  autoComplete="name"
                  required
                  className={inputClass}
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-dark">
                  City <span className="font-normal text-dark/45">(optional)</span>
                </span>
                <input
                  name="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  maxLength={REVIEW_LIMITS.cityMax}
                  autoComplete="address-level2"
                  className={inputClass}
                />
              </label>
            </div>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-dark">Your review</span>
              <textarea
                name="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                maxLength={REVIEW_LIMITS.commentMax}
                rows={4}
                required
                placeholder="How did you like your jewellery, packaging and delivery?"
                className={cn(inputClass, "resize-none")}
              />
              <span className="mt-1 block text-right text-[11px] text-dark/40">
                {comment.length}/{REVIEW_LIMITS.commentMax}
              </span>
            </label>

            {/* Honeypot for bots — hidden from people and assistive tech */}
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden
              className="absolute -left-[9999px] h-0 w-0 opacity-0"
            />

            <div>
              <p className="mb-1.5 text-sm font-medium text-dark">
                Photos <span className="font-normal text-dark/45">(optional, up to {REVIEW_LIMITS.maxPhotos})</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {photos.map((photo, i) => (
                  <div key={photo.preview} className="relative h-20 w-20 overflow-hidden rounded-xl ring-1 ring-gold/25">
                    {/* eslint-disable-next-line @next/next/no-img-element -- local blob preview */}
                    <img src={photo.preview} alt={`Selected photo ${i + 1}`} className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removePhoto(i)}
                      aria-label={`Remove photo ${i + 1}`}
                      className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-dark/75 text-light"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
                {photos.length < REVIEW_LIMITS.maxPhotos && (
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    disabled={processing}
                    className="flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-gold/50 bg-white/70 text-[11px] font-medium text-gold-dark transition hover:bg-gold/10 disabled:opacity-60"
                  >
                    {processing ? <Loader2 className="h-5 w-5 animate-spin" /> : <Camera className="h-5 w-5" />}
                    Add photo
                  </button>
                )}
              </div>
              <input
                ref={fileRef}
                type="file"
                name="photos"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => addPhotos(e.target.files)}
              />
            </div>

            {error && (
              <p role="alert" className="rounded-xl bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting || processing}
              className="scroll-clear-mobile-nav flex min-h-12 w-full touch-manipulation items-center justify-center gap-2 rounded-xl bg-dark py-3.5 text-sm font-semibold text-gold transition hover:bg-gold hover:text-dark active:scale-[0.99] disabled:opacity-60"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {submitting ? "Sending…" : "Submit review"}
            </button>
            <p className="text-center text-[11px] text-dark/45">
              Reviews are checked by our team before they appear on the site.
            </p>
          </form>
        )}
      </motion.div>
    </div>
  );
}
