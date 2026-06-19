"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import {
  Camera,
  Download,
  Move,
  RefreshCw,
  RotateCw,
  Upload,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  getDefaultPlacements,
  loadImage,
  TRY_ON_HINTS,
  type OverlayPlacement,
} from "@/lib/try-on";
import { detectJewelleryPlacements } from "@/lib/face-placement";
import type { Product } from "@/types";

type VirtualTryOnProps = {
  product: Product;
  compact?: boolean;
};

function clampPercent(value: number) {
  return Math.min(88, Math.max(0, value));
}

export function VirtualTryOn({ product, compact = false }: VirtualTryOnProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [placements, setPlacements] = useState<OverlayPlacement[]>(() =>
    getDefaultPlacements(product.category),
  );
  const [activeOverlay, setActiveOverlay] = useState(placements[0]?.id ?? "");
  const [saving, setSaving] = useState(false);
  const [fitting, setFitting] = useState(false);
  const [fitMessage, setFitMessage] = useState<string | null>(null);

  const active = placements.find((p) => p.id === activeOverlay) ?? placements[0];

  async function handlePhotoUpload(file: File | null) {
    if (!file) return;
    if (!file.type.startsWith("image/")) return;

    const url = URL.createObjectURL(file);
    setPhotoUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return url;
    });

    setFitting(true);
    setFitMessage("Detecting face and placing jewellery...");

    const defaults = getDefaultPlacements(product.category);
    setPlacements(defaults);
    setActiveOverlay(defaults[0]?.id ?? "");

    try {
      const auto = await detectJewelleryPlacements(url, product.category);
      setPlacements(auto);
      setActiveOverlay(auto[0]?.id ?? "");
      setFitMessage("Placed on you automatically. Drag to fine-tune if needed.");
    } catch {
      setFitMessage("Could not detect face — adjust the jewellery manually.");
    } finally {
      setFitting(false);
    }
  }

  function updateActive(patch: Partial<OverlayPlacement>) {
    if (!active) return;
    setPlacements((prev) =>
      prev.map((p) => (p.id === active.id ? { ...p, ...patch } : p)),
    );
  }

  async function resetPlacement() {
    if (!photoUrl) {
      const defaults = getDefaultPlacements(product.category);
      setPlacements(defaults);
      setActiveOverlay(defaults[0]?.id ?? "");
      return;
    }

    setFitting(true);
    setFitMessage("Re-detecting face...");
    try {
      const auto = await detectJewelleryPlacements(photoUrl, product.category);
      setPlacements(auto);
      setActiveOverlay(auto[0]?.id ?? "");
      setFitMessage("Re-positioned on your photo.");
    } finally {
      setFitting(false);
    }
  }

  const handleDragEnd = useCallback(
    (placementId: string, offsetX: number, offsetY: number) => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      setPlacements((prev) =>
        prev.map((p) => {
          if (p.id !== placementId) return p;
          return {
            ...p,
            xPercent: clampPercent(p.xPercent + (offsetX / rect.width) * 100),
            yPercent: clampPercent(p.yPercent + (offsetY / rect.height) * 100),
          };
        }),
      );
    },
    [],
  );

  const capturePreview = useCallback(async () => {
    if (!photoUrl || !containerRef.current) return;
    setSaving(true);

    try {
      const rect = containerRef.current.getBoundingClientRect();
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(rect.width * 2);
      canvas.height = Math.round(rect.height * 2);
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.scale(2, 2);

      const photo = await loadImage(photoUrl);
      ctx.drawImage(photo, 0, 0, rect.width, rect.height);

      const jewel = await loadImage(product.images[0]);

      for (const placement of placements) {
        const base = Math.min(rect.width, rect.height) * placement.scale;
        const aspect = jewel.width / jewel.height;
        const w = aspect >= 1 ? base : base * aspect;
        const h = aspect >= 1 ? base / aspect : base;
        const x = (placement.xPercent / 100) * rect.width;
        const y = (placement.yPercent / 100) * rect.height;

        ctx.save();
        ctx.translate(x + w / 2, y + h / 2);
        ctx.rotate((placement.rotation * Math.PI) / 180);
        ctx.drawImage(jewel, -w / 2, -h / 2, w, h);
        ctx.restore();
      }

      const link = document.createElement("a");
      link.download = `virtue-gems-tryon-${product.slug}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } finally {
      setSaving(false);
    }
  }, [photoUrl, placements, product.images, product.slug]);

  return (
    <div
      className={`rounded-2xl bg-white ring-1 ring-light-muted/60 ${
        compact ? "p-4 sm:p-5" : "p-5 sm:p-6"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Camera className="h-5 w-5 text-gold" />
            <h2 className="text-lg font-semibold text-dark">Virtual Try-On</h2>
          </div>
          <p className="mt-1 text-sm text-dark/60">
            Upload your photo and preview how{" "}
            <span className="font-medium text-dark">{product.name}</span> looks on
            you.
          </p>
        </div>
        {!photoUrl && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-xl bg-dark px-4 py-2.5 text-sm font-semibold text-gold transition hover:bg-gold hover:text-dark"
          >
            <Upload className="h-4 w-4" />
            Upload photo
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="user"
        className="hidden"
        onChange={(e) => handlePhotoUpload(e.target.files?.[0] ?? null)}
      />

      {!photoUrl ? (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="mt-5 flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gold/35 bg-gold/5 px-6 py-12 text-center transition hover:border-gold/55 hover:bg-gold/10"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gold/15">
            <Upload className="h-6 w-6 text-gold-dark" />
          </div>
          <p className="mt-4 text-sm font-medium text-dark">
            Tap to upload a selfie or portrait
          </p>
          <p className="mt-1 text-xs text-dark/50">
            Front-facing photos work best · JPG or PNG
          </p>
        </button>
      ) : (
        <>
          <div
            ref={containerRef}
            className="relative mt-5 aspect-[3/4] w-full max-h-[min(70vh,520px)] overflow-hidden rounded-2xl bg-[#1a0a2e] sm:mx-auto sm:max-w-md"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photoUrl}
              alt="Your photo"
              className="h-full w-full object-cover"
              draggable={false}
            />

            {fitting && (
              <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-dark/60 backdrop-blur-[2px]">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
                <p className="mt-3 px-4 text-center text-sm font-medium text-white">
                  {fitMessage ?? "Placing jewellery on you..."}
                </p>
              </div>
            )}

            {placements.map((placement) => {
              const isActive = placement.id === activeOverlay;
              const size = `${placement.scale * 100}%`;

              return (
                <motion.div
                  key={placement.id}
                  drag
                  dragMomentum={false}
                  dragElastic={0}
                  dragConstraints={containerRef}
                  onDragEnd={(_, info) => handleDragEnd(placement.id, info.offset.x, info.offset.y)}
                  onPointerDown={() => setActiveOverlay(placement.id)}
                  animate={{ x: 0, y: 0 }}
                  transition={{ duration: 0 }}
                  style={{
                    left: `${placement.xPercent}%`,
                    top: `${placement.yPercent}%`,
                    width: size,
                    rotate: placement.rotation,
                  }}
                  className={`absolute cursor-grab touch-none active:cursor-grabbing ${
                    isActive ? "z-20 ring-2 ring-gold ring-offset-2 ring-offset-transparent" : "z-10"
                  }`}
                >
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    width={200}
                    height={200}
                    className="h-auto w-full object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.45)]"
                    draggable={false}
                  />
                </motion.div>
              );
            })}
          </div>

          <p className="mt-3 flex items-center gap-1.5 text-xs text-dark/50">
            <Move className="h-3.5 w-3.5 shrink-0" />
            {fitMessage && !fitting ? fitMessage : TRY_ON_HINTS[product.category]}
          </p>

          {placements.length > 1 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {placements.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setActiveOverlay(p.id)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                    p.id === activeOverlay
                      ? "bg-gold text-dark"
                      : "bg-light text-dark/60 hover:bg-gold/15"
                  }`}
                >
                  {p.id.includes("left") ? "Left ear" : p.id.includes("right") ? "Right ear" : "Piece"}
                </button>
              ))}
            </div>
          )}

          {active && (
            <div className="mt-4 grid gap-3 rounded-xl bg-light p-4 sm:grid-cols-2">
              <label className="block text-xs font-medium text-dark/60">
                Size
                <div className="mt-1 flex items-center gap-2">
                  <ZoomOut className="h-4 w-4 text-dark/40" />
                  <input
                    type="range"
                    min={0.08}
                    max={0.9}
                    step={0.01}
                    value={active.scale}
                    onChange={(e) => updateActive({ scale: Number(e.target.value) })}
                    className="flex-1 accent-gold"
                  />
                  <ZoomIn className="h-4 w-4 text-dark/40" />
                </div>
              </label>
              <label className="block text-xs font-medium text-dark/60">
                Rotate
                <div className="mt-1 flex items-center gap-2">
                  <RotateCw className="h-4 w-4 text-dark/40" />
                  <input
                    type="range"
                    min={-45}
                    max={45}
                    step={1}
                    value={active.rotation}
                    onChange={(e) => updateActive({ rotation: Number(e.target.value) })}
                    className="flex-1 accent-gold"
                  />
                </div>
              </label>
            </div>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-xl border border-light-muted px-4 py-2.5 text-sm font-medium text-dark transition hover:border-gold"
            >
              <Upload className="h-4 w-4" />
              Change photo
            </button>
            <button
              type="button"
              onClick={resetPlacement}
              className="inline-flex items-center gap-2 rounded-xl border border-light-muted px-4 py-2.5 text-sm font-medium text-dark transition hover:border-gold"
            >
              <RefreshCw className="h-4 w-4" />
              Reset position
            </button>
            <button
              type="button"
              onClick={capturePreview}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-gold px-4 py-2.5 text-sm font-semibold text-dark transition hover:bg-gold-light disabled:opacity-60"
            >
              <Download className="h-4 w-4" />
              {saving ? "Saving..." : "Save preview"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
