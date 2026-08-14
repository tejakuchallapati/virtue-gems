"use client";

import { isSupabaseConfigured, getProductImageBucket } from "./supabase/config";
import { createSupabaseBrowserClient } from "./supabase/browser";

const CLOUD_MAX_BYTES = 15 * 1024 * 1024;

function safeExtension(file: File) {
  const ext = file.name.split(".").pop()?.toLowerCase();
  if (ext === "png" || ext === "webp") return ext;
  return "jpg";
}

export async function uploadProductImages(
  files: File[],
  onProgress?: (message: string) => void,
): Promise<string[]> {
  if (!isSupabaseConfigured()) {
    const body = new FormData();
    files.forEach((file) => body.append("files", file));
    const response = await fetch("/api/admin/products/upload", {
      method: "POST",
      body,
    });
    const data = (await response.json()) as {
      success?: boolean;
      error?: string;
      urls?: string[];
    };
    if (!response.ok || !data.success || !data.urls?.length) {
      throw new Error(data.error || "Photo upload failed.");
    }
    return data.urls;
  }

  const supabase = createSupabaseBrowserClient();
  const bucket = getProductImageBucket();
  const urls: string[] = [];

  for (let index = 0; index < files.length; index += 1) {
    const file = files[index];
    if (file.size > CLOUD_MAX_BYTES) {
      throw new Error(
        `“${file.name}” is over 15 MB. Export a smaller JPG or WebP first.`,
      );
    }
    if (!["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type)) {
      throw new Error(
        `“${file.name}” is not supported in cloud upload. Use JPG, PNG or WebP.`,
      );
    }

    onProgress?.(`Uploading photo ${index + 1} of ${files.length}…`);
    const path = `catalog/${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}.${safeExtension(file)}`;
    const { error } = await supabase.storage.from(bucket).upload(path, file, {
      cacheControl: "31536000",
      contentType: file.type,
      upsert: false,
    });
    if (error) throw new Error(error.message);
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    urls.push(data.publicUrl);
  }

  return urls;
}
