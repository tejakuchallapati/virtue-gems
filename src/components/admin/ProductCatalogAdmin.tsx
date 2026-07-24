"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  FolderUp,
  ImagePlus,
  Pencil,
  Plus,
  RotateCcw,
  Trash2,
  X,
} from "lucide-react";
import { apiFetch } from "@/lib/api-client";
import { AdminBulkUpload } from "@/components/admin/AdminBulkUpload";
import {
  CATEGORY_LABELS,
  PRODUCT_CATEGORIES,
  PRODUCT_TAGS,
} from "@/lib/product-constants";
import { formatPrice } from "@/lib/utils";
import type { Product, ProductCategory, ProductTag } from "@/types";

type AdminProduct = Product & { active?: boolean };

const LOW_STOCK_THRESHOLD = 5;

type FormState = {
  name: string;
  description: string;
  longDescription: string;
  price: string;
  originalPrice: string;
  imageUrls: string[];
  category: ProductCategory;
  tags: ProductTag[];
  stock: string;
  slug: string;
};

const emptyForm = (): FormState => ({
  name: "",
  description: "",
  longDescription: "",
  price: "",
  originalPrice: "",
  imageUrls: [],
  category: "necklaces",
  tags: [],
  stock: "10",
  slug: "",
});

function productToForm(p: AdminProduct): FormState {
  return {
    name: p.name,
    description: p.description,
    longDescription: p.longDescription,
    price: String(p.price),
    originalPrice: p.originalPrice != null ? String(p.originalPrice) : "",
    imageUrls: [...p.images],
    category: p.category,
    tags: [...p.tags],
    stock: String(p.stock),
    slug: p.slug,
  };
}

const inputClass =
  "w-full rounded-xl border border-light/10 bg-[#0f0a1a] px-3.5 py-2.5 text-sm text-light outline-none focus:border-gold/40";

export function AdminCatalogManager({
  initialProducts,
}: {
  initialProducts: AdminProduct[];
}) {
  const [products, setProducts] = useState(initialProducts);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<ProductCategory | "all">(
    "all",
  );
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [preview, setPreview] = useState<AdminProduct | null>(null);
  const [previewIndex, setPreviewIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open && !bulkOpen && !preview) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open, bulkOpen, preview]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      if (categoryFilter !== "all" && p.category !== categoryFilter) return false;
      if (lowStockOnly && p.stock >= LOW_STOCK_THRESHOLD) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q)
      );
    });
  }, [products, query, categoryFilter, lowStockOnly]);

  const liveProducts = useMemo(
    () => filtered.filter((p) => p.active !== false),
    [filtered],
  );

  const deletedProducts = useMemo(
    () => filtered.filter((p) => p.active === false),
    [filtered],
  );

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm());
    setError(null);
    setOpen(true);
  }

  function openEdit(p: AdminProduct) {
    setEditingId(p.id);
    setForm(productToForm(p));
    setError(null);
    setOpen(true);
  }

  function toggleTag(tag: ProductTag) {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  }

  function removeImage(url: string) {
    setForm((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((u) => u !== url),
    }));
  }

  /** First image is the shop cover / list thumbnail. */
  function setAsCover(url: string) {
    setForm((prev) => {
      if (prev.imageUrls[0] === url) return prev;
      return {
        ...prev,
        imageUrls: [url, ...prev.imageUrls.filter((u) => u !== url)],
      };
    });
  }

  async function refresh() {
    const res = await apiFetch<{ products?: AdminProduct[] }>("/api/admin/products");
    if (res.ok && res.data.products) {
      setProducts(res.data.products);
    }
  }

  async function onPickPhotos(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError(null);

    const body = new FormData();
    Array.from(files)
      .slice(0, 6)
      .forEach((file) => body.append("files", file));

    try {
      const res = await fetch("/api/admin/products/upload", {
        method: "POST",
        body,
      });
      const data = (await res.json()) as {
        success?: boolean;
        error?: string;
        urls?: string[];
      };

      if (!res.ok || !data.success || !data.urls?.length) {
        setError(data.error || "Photo upload failed.");
        setUploading(false);
        return;
      }

      setForm((prev) => ({
        ...prev,
        // New uploads become the main cover photo (first in list)
        imageUrls: [...data.urls!, ...prev.imageUrls].slice(0, 8),
      }));
      setPreviewIndex(0);
    } catch {
      setError("Photo upload failed. Check your connection.");
    }

    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function saveProduct() {
    setSaving(true);
    setError(null);

    if (form.imageUrls.length === 0) {
      setError("Add at least one product photo.");
      setSaving(false);
      return;
    }

    const price = Number(form.price);
    const stock = Number(form.stock);
    const originalPrice = form.originalPrice.trim()
      ? Number(form.originalPrice)
      : null;

    const body = {
      name: form.name,
      description: form.description,
      longDescription: form.longDescription || undefined,
      price,
      originalPrice,
      images: form.imageUrls,
      category: form.category,
      tags: form.tags,
      stock,
      slug: form.slug || undefined,
      active: true,
    };

    const res = editingId
      ? await apiFetch<{ product?: AdminProduct }>(`/api/admin/products/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        })
      : await apiFetch<{ product?: AdminProduct }>("/api/admin/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

    setSaving(false);

    if (!res.ok) {
      setError(res.error);
      return;
    }

    setOpen(false);
    await refresh();
  }

  async function removeProduct(id: string, name: string) {
    if (!window.confirm(`Move "${name}" to Soft delete? It will be hidden from the shop.`))
      return;
    const res = await apiFetch(`/api/admin/products/${id}`, { method: "DELETE" });
    if (!res.ok) {
      setError(res.error);
      return;
    }
    await refresh();
  }

  async function restoreProduct(id: string) {
    const res = await apiFetch<{ product?: AdminProduct }>(
      `/api/admin/products/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify({ active: true }),
      },
    );
    if (!res.ok) {
      setError(res.error);
      return;
    }
    await refresh();
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-light">Products</h1>
          <p className="mt-1 text-sm text-light/50">
            Add full product details and upload photos from your phone or computer.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setBulkOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-gold/40 bg-gold/10 px-4 py-2.5 text-sm font-semibold text-gold transition hover:bg-gold/20"
          >
            <FolderUp className="h-4 w-4" />
            Bulk upload
          </button>
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-xl bg-gold px-4 py-2.5 text-sm font-semibold text-dark transition hover:bg-gold/90"
          >
            <Plus className="h-4 w-4" />
            Add product
          </button>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products…"
          className="w-full max-w-md rounded-xl border border-light/10 bg-dark px-4 py-2.5 text-sm text-light outline-none focus:border-gold/40"
        />
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setCategoryFilter("all")}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
              categoryFilter === "all"
                ? "bg-gold text-dark"
                : "bg-light/10 text-light/70 hover:bg-light/15 hover:text-light"
            }`}
          >
            All
          </button>
          {PRODUCT_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium capitalize transition ${
                categoryFilter === cat
                  ? "bg-gold text-dark"
                  : "bg-light/10 text-light/70 hover:bg-light/15 hover:text-light"
              }`}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setLowStockOnly((v) => !v)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
              lowStockOnly
                ? "bg-red-500/90 text-white"
                : "bg-light/10 text-light/70 hover:bg-light/15 hover:text-light"
            }`}
          >
            Low stock (&lt;{LOW_STOCK_THRESHOLD})
          </button>
        </div>
      </div>

      {error && !open && (
        <p className="mt-3 text-sm text-red-400">{error}</p>
      )}

      <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {liveProducts.map((p) => (
          <div
            key={p.id}
            className="overflow-hidden rounded-2xl bg-dark-soft ring-1 ring-light/10"
          >
            <button
              type="button"
              onClick={() => {
                setPreview(p);
                setPreviewIndex(0);
              }}
              className="block w-full text-left"
            >
              <div className="relative aspect-square w-full bg-[#1a0a2e]">
                {p.images[0] ? (
                  <Image
                    src={p.images[0]}
                    alt={p.name}
                    fill
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    className="object-cover"
                  />
                ) : (
                  <span className="flex h-full items-center justify-center text-sm text-light/30">
                    No photo
                  </span>
                )}
              </div>
            </button>
            <div className="space-y-2 p-3">
              <div>
                <p className="line-clamp-2 text-sm font-medium text-light">{p.name}</p>
                <p className="mt-0.5 text-xs text-gold">{formatPrice(p.price)}</p>
                <p className="mt-1 text-[10px] text-light/40">
                  {p.id} · stock{" "}
                  <span
                    className={
                      p.stock < LOW_STOCK_THRESHOLD
                        ? "font-medium text-red-400"
                        : undefined
                    }
                  >
                    {p.stock}
                  </span>
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => openEdit(p)}
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-light/10 px-2 py-1.5 text-xs font-medium text-light/80 hover:bg-light/15 hover:text-gold"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => void removeProduct(p.id, p.name)}
                  className="inline-flex items-center justify-center rounded-xl bg-light/10 px-2 py-1.5 text-light/70 hover:bg-red-500/20 hover:text-red-400"
                  aria-label={`Soft delete ${p.name}`}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {liveProducts.length === 0 && (
        <p className="mt-8 text-center text-sm text-light/40">
          {query.trim()
            ? "No live products match your search."
            : "No live products yet."}
        </p>
      )}

      <section className="mt-12 border-t border-light/10 pt-8">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-light">Soft delete</h2>
          <p className="mt-1 text-sm text-light/45">
            Hidden from the shop. Restore anytime to make them live again.
          </p>
        </div>

        {deletedProducts.length === 0 ? (
          <p className="text-sm text-light/35">No soft-deleted products.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {deletedProducts.map((p) => (
              <div
                key={p.id}
                className="overflow-hidden rounded-2xl bg-dark-soft/70 ring-1 ring-light/10 opacity-90"
              >
                <button
                  type="button"
                  onClick={() => {
                    setPreview(p);
                    setPreviewIndex(0);
                  }}
                  className="block w-full text-left"
                >
                  <div className="relative aspect-square w-full bg-[#1a0a2e]">
                    {p.images[0] ? (
                      <Image
                        src={p.images[0]}
                        alt={p.name}
                        fill
                        sizes="(max-width: 1024px) 50vw, 25vw"
                        className="object-cover grayscale-[30%]"
                      />
                    ) : (
                      <span className="flex h-full items-center justify-center text-sm text-light/30">
                        No photo
                      </span>
                    )}
                    <span className="absolute left-2 top-2 rounded-full bg-red-500/90 px-2 py-0.5 text-[10px] font-medium text-white">
                      Deleted
                    </span>
                  </div>
                </button>
                <div className="space-y-2 p-3">
                  <div>
                    <p className="line-clamp-2 text-sm font-medium text-light/80">
                      {p.name}
                    </p>
                    <p className="mt-0.5 text-xs text-gold/80">
                      {formatPrice(p.price)}
                    </p>
                    <p className="mt-1 text-[10px] text-light/35">{p.id}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => void restoreProduct(p.id)}
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-green-500/15 px-2 py-1.5 text-xs font-medium text-green-400 hover:bg-green-500/25"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      Restore
                    </button>
                    <button
                      type="button"
                      onClick={() => openEdit(p)}
                      className="inline-flex items-center justify-center rounded-xl bg-light/10 px-2 py-1.5 text-light/70 hover:bg-light/15 hover:text-gold"
                      aria-label={`Edit ${p.name}`}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center overflow-hidden overscroll-none bg-black/60 p-4 sm:items-center">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto overscroll-contain rounded-2xl bg-dark p-5 ring-1 ring-light/15">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-light">
                {editingId ? "Edit product" : "Add product"}
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-1 text-light/50 hover:text-light"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <Field label="Name">
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={inputClass}
                />
              </Field>
              <Field label="Short description">
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  rows={2}
                  className={inputClass}
                />
              </Field>
              <Field label="Long description (optional)">
                <textarea
                  value={form.longDescription}
                  onChange={(e) =>
                    setForm({ ...form, longDescription: e.target.value })
                  }
                  rows={3}
                  className={inputClass}
                />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Price (₹)">
                  <input
                    type="number"
                    min={0}
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className={inputClass}
                  />
                </Field>
                <Field label="Original price (optional)">
                  <input
                    type="number"
                    min={0}
                    value={form.originalPrice}
                    onChange={(e) =>
                      setForm({ ...form, originalPrice: e.target.value })
                    }
                    className={inputClass}
                  />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Stock">
                  <input
                    type="number"
                    min={0}
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    className={inputClass}
                  />
                </Field>
                <Field label="Category">
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        category: e.target.value as ProductCategory,
                      })
                    }
                    className={inputClass}
                  >
                    {PRODUCT_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <div>
                <p className="mb-2 text-xs text-light/50">
                  Photos — first photo is the main cover on the shop
                </p>
                <div className="flex flex-wrap gap-2">
                  {form.imageUrls.map((url, index) => (
                    <div
                      key={url}
                      className={`relative h-24 w-24 overflow-hidden rounded-xl ring-2 ${
                        index === 0 ? "ring-gold" : "ring-light/15"
                      }`}
                    >
                      <Image
                        src={url}
                        alt=""
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                      {index === 0 ? (
                        <span className="absolute bottom-1 left-1 rounded bg-gold px-1.5 py-0.5 text-[9px] font-bold text-dark">
                          MAIN
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setAsCover(url)}
                          className="absolute bottom-1 left-1 rounded bg-black/75 px-1.5 py-0.5 text-[9px] font-medium text-white hover:bg-gold hover:text-dark"
                        >
                          Set main
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(url)}
                        className="absolute right-1 top-1 rounded-full bg-black/70 p-1 text-white"
                        aria-label="Remove photo"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    disabled={uploading || form.imageUrls.length >= 8}
                    onClick={() => fileInputRef.current?.click()}
                    className="flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-gold/40 bg-gold/5 text-gold transition hover:bg-gold/10 disabled:opacity-50"
                  >
                    <ImagePlus className="h-5 w-5" />
                    <span className="text-[10px] font-medium">
                      {uploading ? "Uploading…" : "Add"}
                    </span>
                  </button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/heic,image/*,.jpg,.JPG,.jpeg,.JPEG"
                  multiple
                  className="hidden"
                  onChange={(e) => void onPickPhotos(e.target.files)}
                />
                <p className="mt-2 text-[11px] text-light/40">
                  New photos become the main cover. Tap <strong>Set main</strong> on
                  another photo, or ✕ to remove the old one. Then Save.
                </p>
              </div>
              <Field label="URL slug (optional)">
                <input
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="auto from name"
                  className={inputClass}
                />
              </Field>
              <div>
                <p className="mb-2 text-xs text-light/50">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {PRODUCT_TAGS.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`rounded-full px-3 py-1 text-xs ${
                        form.tags.includes(tag)
                          ? "bg-gold text-dark"
                          : "bg-light/10 text-light/60"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-2 text-sm text-light/60 hover:text-light"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={saving || uploading}
                onClick={() => void saveProduct()}
                className="rounded-xl bg-gold px-4 py-2 text-sm font-semibold text-dark disabled:opacity-50"
              >
                {saving ? "Saving…" : editingId ? "Save changes" : "Create product"}
              </button>
            </div>
          </div>
        </div>
      )}
      {preview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overscroll-none bg-black/90 p-3 sm:p-6"
          onClick={() => setPreview(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`${preview.name} photo`}
        >
          <div
            className="relative my-auto w-full max-w-5xl rounded-2xl bg-dark p-3 ring-1 ring-light/15 sm:p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <p className="text-lg font-semibold text-light">{preview.name}</p>
                <p className="text-sm text-light/45">
                  {formatPrice(preview.price)} · {preview.category}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPreview(null)}
                className="rounded-lg p-1 text-light/50 hover:text-light"
                aria-label="Close"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="relative mx-auto h-[min(75vh,720px)] w-full overflow-hidden rounded-xl bg-[#12081f]">
              {preview.images[previewIndex] ? (
                <Image
                  src={preview.images[previewIndex]}
                  alt={preview.name}
                  fill
                  sizes="100vw"
                  className="object-contain"
                  priority
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-light/40">
                  No photo
                </div>
              )}
            </div>

            {preview.images.length > 1 && (
              <div className="mt-4 flex flex-wrap justify-center gap-3">
                {preview.images.map((url, i) => (
                  <button
                    key={url}
                    type="button"
                    onClick={() => setPreviewIndex(i)}
                    className={`relative h-20 w-20 overflow-hidden rounded-xl ring-2 sm:h-24 sm:w-24 ${
                      i === previewIndex ? "ring-gold" : "ring-white/15"
                    }`}
                  >
                    <Image
                      src={url}
                      alt=""
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                    {i === 0 && (
                      <span className="absolute bottom-0 left-0 right-0 bg-gold/90 text-center text-[9px] font-bold text-dark">
                        MAIN
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}

            <div className="mt-4 flex flex-wrap justify-end gap-2">
              {previewIndex > 0 && preview.images[previewIndex] && (
                <button
                  type="button"
                  onClick={() => {
                    const url = preview.images[previewIndex];
                    const nextImages = [
                      url,
                      ...preview.images.filter((u) => u !== url),
                    ];
                    void (async () => {
                      const res = await apiFetch<{ product?: AdminProduct }>(
                        `/api/admin/products/${preview.id}`,
                        {
                          method: "PATCH",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ images: nextImages }),
                        },
                      );
                      if (res.ok && res.data.product) {
                        setPreview({ ...preview, images: nextImages });
                        setPreviewIndex(0);
                        await refresh();
                      }
                    })();
                  }}
                  className="rounded-xl border border-gold/40 px-4 py-2 text-sm font-medium text-gold"
                >
                  Set as main photo
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setPreview(null);
                  openEdit(preview);
                }}
                className="rounded-xl bg-gold px-4 py-2 text-sm font-semibold text-dark"
              >
                Edit product
              </button>
            </div>          </div>
        </div>
      )}

      <AdminBulkUpload
        open={bulkOpen}
        onClose={() => setBulkOpen(false)}
        onDone={() => {
          void refresh();
        }}
      />
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs text-light/50">{label}</span>
      {children}
    </label>
  );
}
