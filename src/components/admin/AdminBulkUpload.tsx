"use client";

import { useMemo, useRef, useState, type InputHTMLAttributes } from "react";
import Image from "next/image";
import { FolderUp, Trash2, X } from "lucide-react";
import { apiFetch } from "@/lib/api-client";
import { uploadProductImages } from "@/lib/product-upload";
import { PRODUCT_CATEGORIES, CATEGORY_LABELS } from "@/lib/product-constants";
import type { ProductCategory } from "@/types";
import { ADMIN_INPUT } from "@/lib/ui-classes";

type BulkRow = {
  id: string;
  file: File;
  previewUrl: string;
  name: string;
  price: string;
  category: ProductCategory;
  stock: string;
};

function cleanNameFromFile(filename: string): string {
  const base = filename.replace(/\.[^.]+$/, "");
  // Camera codes like LS208240 stay as-is; otherwise title-case words
  if (/^[A-Z]{1,3}\d+$/i.test(base)) return "";
  return base
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

const inputClass = ADMIN_INPUT;

type Props = {
  open: boolean;
  onClose: () => void;
  onDone: () => void;
};

export function AdminBulkUpload({ open, onClose, onDone }: Props) {
  const folderRef = useRef<HTMLInputElement>(null);
  const multiRef = useRef<HTMLInputElement>(null);
  const csvRef = useRef<HTMLInputElement>(null);
  const [rows, setRows] = useState<BulkRow[]>([]);
  const [defaultPrice, setDefaultPrice] = useState("899");
  const [defaultCategory, setDefaultCategory] =
    useState<ProductCategory>("necklaces");
  const [defaultStock, setDefaultStock] = useState("10");
  const [groupAsOne, setGroupAsOne] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [csvHint, setCsvHint] = useState("");

  const readyCount = useMemo(
    () => {
      if (groupAsOne) {
        return rows.length > 0 && groupName.trim() && Number(defaultPrice) > 0
          ? 1
          : 0;
      }
      return rows.filter((r) => r.name.trim() && Number(r.price) > 0).length;
    },
    [rows, groupAsOne, groupName, defaultPrice],
  );

  if (!open) return null;

  function clearRows() {
    rows.forEach((r) => URL.revokeObjectURL(r.previewUrl));
    setRows([]);
  }

  function close() {
    clearRows();
    setError(null);
    setProgress("");
    setCsvHint("");
    setGroupAsOne(false);
    setGroupName("");
    onClose();
  }

  function onPickFolder(files: FileList | null) {
    if (!files?.length) return;
    setError(null);

    const images = Array.from(files).filter((f) =>
      /^image\//i.test(f.type) || /\.(jpe?g|png|webp|heic|heif)$/i.test(f.name),
    );

    if (images.length === 0) {
      setError("No photos found in that folder.");
      return;
    }
    if (images.length > 40) {
      setError("Select up to 40 photos at a time.");
      return;
    }

    clearRows();
    const nextRows = images.map((file, i) => ({
        id: `${file.name}-${i}-${file.size}`,
        file,
        previewUrl: URL.createObjectURL(file),
        name: cleanNameFromFile(file.name),
        price: defaultPrice,
        category: defaultCategory,
        stock: defaultStock,
      }));
    setRows(nextRows);
    if (!groupName) {
      setGroupName(nextRows.find((row) => row.name)?.name ?? "");
    }
  }

  function applyDefaultsToEmpty() {
    setRows((prev) =>
      prev.map((r) => ({
        ...r,
        price: r.price.trim() ? r.price : defaultPrice,
        category: r.category || defaultCategory,
        stock: r.stock.trim() ? r.stock : defaultStock,
      })),
    );
  }

  function updateRow(id: string, patch: Partial<BulkRow>) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  function removeRow(id: string) {
    setRows((prev) => {
      const row = prev.find((r) => r.id === id);
      if (row) URL.revokeObjectURL(row.previewUrl);
      return prev.filter((r) => r.id !== id);
    });
  }

  /** CSV: filename,name,price,category (header optional) */
  async function onCsvFile(file: File | null) {
    if (!file) return;
    const text = await file.text();
    applyCsv(text);
  }

  function applyCsv(text: string) {
    const lines = text
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);
    if (lines.length === 0) {
      setError("CSV is empty.");
      return;
    }

    const map = new Map<
      string,
      { name?: string; price?: string; category?: ProductCategory }
    >();

    for (const line of lines) {
      if (/^filename\s*,/i.test(line) || /^file\s*,/i.test(line)) continue;
      const parts = line.split(",").map((p) => p.trim().replace(/^"|"$/g, ""));
      if (parts.length < 2) continue;
      const [filename, name, price, category] = parts;
      const key = filename.toLowerCase();
      const cat =
        category &&
        PRODUCT_CATEGORIES.includes(category as ProductCategory)
          ? (category as ProductCategory)
          : undefined;
      map.set(key, {
        name: name || undefined,
        price: price || undefined,
        category: cat,
      });
      // also match basename without path
      const base = filename.split(/[/\\]/).pop()?.toLowerCase();
      if (base) map.set(base, map.get(key)!);
    }

    let matched = 0;
    setRows((prev) =>
      prev.map((r) => {
        const hit =
          map.get(r.file.name.toLowerCase()) ||
          map.get(r.file.name.split(/[/\\]/).pop()!.toLowerCase());
        if (!hit) return r;
        matched += 1;
        return {
          ...r,
          name: hit.name ?? r.name,
          price: hit.price ?? r.price,
          category: hit.category ?? r.category,
        };
      }),
    );
    setCsvHint(
      matched
        ? `CSV applied to ${matched} photo(s).`
        : "CSV loaded but no filenames matched your photos.",
    );
  }

  async function uploadFiles(files: File[]): Promise<string[]> {
    const urls: string[] = [];
    const chunkSize = 5;
    for (let i = 0; i < files.length; i += chunkSize) {
      const chunk = files.slice(i, i + chunkSize);
      const uploaded = await uploadProductImages(chunk, (message) =>
        setProgress(
          `${message} (batch ${i + 1}–${Math.min(i + chunkSize, files.length)} of ${files.length})`,
        ),
      );
      urls.push(...uploaded);
    }
    return urls;
  }

  async function createAll() {
    setBusy(true);
    setError(null);
    setProgress("");

    const valid = groupAsOne
      ? rows
      : rows.filter((r) => r.name.trim() && Number(r.price) > 0);
    if (valid.length === 0) {
      setError("Fill name and price for at least one product.");
      setBusy(false);
      return;
    }
    if (groupAsOne && (!groupName.trim() || Number(defaultPrice) <= 0)) {
      setError("Enter the grouped product name and a valid price.");
      setBusy(false);
      return;
    }
    if (groupAsOne && rows.length > 8) {
      setError("One product can have up to 8 photos. Remove the extras first.");
      setBusy(false);
      return;
    }

    try {
      const imageUrls = await uploadFiles(valid.map((r) => r.file));
      setProgress(
        groupAsOne
          ? "Creating one product with all photos…"
          : `Creating ${valid.length} products…`,
      );

      const payload = groupAsOne
        ? [
            {
              name: groupName.trim(),
              description: groupName.trim(),
              price: Number(defaultPrice),
              images: imageUrls,
              category: defaultCategory,
              tags: ["new"],
              stock: Math.max(
                0,
                Math.floor(Number(defaultStock) || 0),
              ),
            },
          ]
        : valid.map((r, i) => ({
            name: r.name.trim(),
            description: r.name.trim(),
            price: Number(r.price),
            images: [imageUrls[i]],
            category: r.category,
            tags: ["new"],
            stock: Math.max(0, Math.floor(Number(r.stock) || 0)),
          }));

      const res = await apiFetch<{
        createdCount?: number;
        errors?: { index: number; name?: string; error: string }[];
      }>("/api/admin/products/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products: payload }),
      });

      if (!res.ok) {
        setError(res.error);
        setBusy(false);
        return;
      }

      const partial = res.data.errors?.length
        ? ` Created ${res.data.createdCount}. Some failed: ${res.data.errors
            .map((e) => e.name || `#${e.index + 1}`)
            .join(", ")}.`
        : ` Created ${res.data.createdCount} products.`;

      setProgress(partial);
      clearRows();
      onDone();
      setTimeout(() => close(), 800);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bulk upload failed.");
    }

    setBusy(false);
  }

  return (
    <div className="safe-bottom fixed inset-0 z-[70] flex items-end justify-center overflow-hidden overscroll-none bg-black/60 p-3 sm:items-center sm:p-4">
      <div className="flex max-h-[92dvh] w-full max-w-3xl flex-col overflow-hidden overscroll-contain rounded-2xl bg-dark ring-1 ring-light/15">
        <div className="flex items-center justify-between border-b border-light/10 px-4 py-3 sm:px-5">
          <div>
            <h2 className="text-lg font-semibold text-light">Bulk upload</h2>
            <p className="text-xs text-light/50">
              Select a folder of JPG photos, then set name &amp; price for each.
            </p>
          </div>
          <button
            type="button"
            onClick={close}
            className="rounded-lg p-1 text-light/50 hover:text-light"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-3 overflow-y-auto px-4 py-4 sm:px-5">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={() => folderRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-xl bg-gold px-4 py-2.5 text-sm font-semibold text-dark disabled:opacity-50"
            >
              <FolderUp className="h-4 w-4" />
              Choose photo folder
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => multiRef.current?.click()}
              className="rounded-xl border border-light/15 px-4 py-2.5 text-sm text-light/80 hover:border-gold/40 hover:text-gold disabled:opacity-40"
            >
              Or pick many photos
            </button>
            <button
              type="button"
              disabled={busy || rows.length === 0}
              onClick={() => csvRef.current?.click()}
              className="rounded-xl border border-light/15 px-4 py-2.5 text-sm text-light/80 hover:border-gold/40 hover:text-gold disabled:opacity-40"
            >
              Optional: match CSV
            </button>
            <input
              ref={folderRef}
              type="file"
              accept="image/jpeg,image/jpg,.jpg,.jpeg,.JPG,.JPEG,image/*"
              multiple
              className="hidden"
              {...({
                webkitdirectory: "",
                directory: "",
              } as InputHTMLAttributes<HTMLInputElement>)}
              onChange={(e) => onPickFolder(e.target.files)}
            />
            <input
              ref={multiRef}
              type="file"
              accept="image/jpeg,image/jpg,.jpg,.jpeg,.JPG,.JPEG,image/*"
              multiple
              className="hidden"
              onChange={(e) => onPickFolder(e.target.files)}
            />
            <input
              ref={csvRef}
              type="file"
              accept=".csv,text/csv,text/plain"
              className="hidden"
              onChange={(e) => void onCsvFile(e.target.files?.[0] ?? null)}
            />
          </div>

          <p className="text-[11px] text-light/40">
            CSV format (optional):{" "}
            <code className="text-gold/70">filename,name,price,category</code>
            <br />
            Example:{" "}
            <code className="text-gold/70">
              LS208240.JPG,Pearl Necklace,899,necklaces
            </code>
          </p>

          <div className="rounded-xl border border-gold/20 bg-gold/5 p-3">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={groupAsOne}
                onChange={(e) => setGroupAsOne(e.target.checked)}
                className="mt-1 h-4 w-4 accent-gold"
              />
              <span>
                <span className="block text-sm font-medium text-gold">
                  These photos belong to one product
                </span>
                <span className="mt-0.5 block text-xs text-light/50">
                  Creates one catalog item and uses every selected photo in its
                  product gallery.
                </span>
              </span>
            </label>
            {groupAsOne && (
              <label className="mt-3 block text-xs text-light/60">
                Product name
                <input
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="e.g. Royal Antique Bridal Necklace"
                  className={`${inputClass} mt-1`}
                />
              </label>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <label className="text-xs text-light/50">
              {groupAsOne ? "Product price" : "Default price"}
              <input
                value={defaultPrice}
                onChange={(e) => setDefaultPrice(e.target.value)}
                className={`${inputClass} mt-1`}
              />
            </label>
            <label className="text-xs text-light/50">
              {groupAsOne ? "Product stock" : "Default stock"}
              <input
                value={defaultStock}
                onChange={(e) => setDefaultStock(e.target.value)}
                className={`${inputClass} mt-1`}
              />
            </label>
            <label className="text-xs text-light/50 sm:col-span-2">
              {groupAsOne ? "Product category" : "Default category"}
              <select
                value={defaultCategory}
                onChange={(e) =>
                  setDefaultCategory(e.target.value as ProductCategory)
                }
                className={`${inputClass} mt-1`}
              >
                {PRODUCT_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {CATEGORY_LABELS[c]}
                  </option>
                ))}
              </select>
            </label>
          </div>
          {rows.length > 0 && (
            <button
              type="button"
              onClick={applyDefaultsToEmpty}
              className="text-xs text-gold hover:underline"
            >
              Apply defaults to empty price/stock fields
            </button>
          )}

          {csvHint && (
            <p className="text-xs text-green-400">{csvHint}</p>
          )}

          {rows.length === 0 ? (
            <div className="rounded-xl border border-dashed border-light/15 px-4 py-10 text-center text-sm text-light/45">
              Choose a folder (or multi-select photos) to begin.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl ring-1 ring-light/10">
              <table
                className={`w-full text-left text-sm ${groupAsOne ? "" : "min-w-[640px]"}`}
              >
                <thead>
                  <tr className="border-b border-light/10 text-xs text-light/45">
                    <th className="p-2">Photo</th>
                    {!groupAsOne && <th className="p-2">Name</th>}
                    {!groupAsOne && <th className="p-2">Price ₹</th>}
                    {!groupAsOne && <th className="p-2">Category</th>}
                    {!groupAsOne && <th className="p-2">Stock</th>}
                    <th className="p-2" />
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id} className="border-b border-light/5">
                      <td className="p-2">
                        <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-dark-soft">
                          <Image
                            src={r.previewUrl}
                            alt=""
                            fill
                            sizes="48px"
                            unoptimized
                            className="object-cover"
                          />
                        </div>
                        <p className="mt-1 max-w-[88px] truncate text-[10px] text-light/35">
                          {r.file.name}
                        </p>
                      </td>
                      {!groupAsOne && <td className="p-2">
                        <input
                          value={r.name}
                          onChange={(e) =>
                            updateRow(r.id, { name: e.target.value })
                          }
                          placeholder="Product name"
                          className={inputClass}
                        />
                      </td>}
                      {!groupAsOne && <td className="p-2">
                        <input
                          type="number"
                          min={0}
                          value={r.price}
                          onChange={(e) =>
                            updateRow(r.id, { price: e.target.value })
                          }
                          className={inputClass}
                        />
                      </td>}
                      {!groupAsOne && <td className="p-2">
                        <select
                          value={r.category}
                          onChange={(e) =>
                            updateRow(r.id, {
                              category: e.target.value as ProductCategory,
                            })
                          }
                          className={inputClass}
                        >
                          {PRODUCT_CATEGORIES.map((c) => (
                            <option key={c} value={c}>
                              {CATEGORY_LABELS[c]}
                            </option>
                          ))}
                        </select>
                      </td>}
                      {!groupAsOne && <td className="p-2">
                        <input
                          type="number"
                          min={0}
                          value={r.stock}
                          onChange={(e) =>
                            updateRow(r.id, { stock: e.target.value })
                          }
                          className={inputClass}
                        />
                      </td>}
                      <td className="p-2">
                        <button
                          type="button"
                          onClick={() => removeRow(r.id)}
                          className="rounded-lg p-2 text-light/40 hover:bg-red-500/15 hover:text-red-400"
                          aria-label="Remove"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {progress && (
            <p className="text-xs text-gold">{progress}</p>
          )}
          {error && <p className="text-sm text-red-400">{error}</p>}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-light/10 px-4 py-3 sm:px-5">
          <p className="text-xs text-light/45">
            {rows.length} photo(s) ·{" "}
            {groupAsOne
              ? readyCount
                ? "ready to create 1 product gallery"
                : "add a product name and price"
              : `${readyCount} ready (name + price)`}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={close}
              className="rounded-xl px-4 py-2 text-sm text-light/60 hover:text-light"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={busy || readyCount === 0}
              onClick={() => void createAll()}
              className="rounded-xl bg-gold px-4 py-2 text-sm font-semibold text-dark disabled:opacity-50"
            >
              {busy
                ? "Working…"
                : `Create ${readyCount} ${readyCount === 1 ? "product" : "products"}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
