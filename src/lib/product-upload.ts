"use client";

const CLOUD_MAX_BYTES = 40 * 1024 * 1024;

/**
 * Admin photo upload — always goes through the server API so Supabase Storage
 * uses the service role (reliable for bulk upload + new API keys).
 */
export async function uploadProductImages(
  files: File[],
  onProgress?: (message: string) => void,
): Promise<string[]> {
  if (files.length === 0) return [];

  for (const file of files) {
    if (file.size > CLOUD_MAX_BYTES) {
      throw new Error(
        `“${file.name}” is over 40 MB. Export a smaller JPG or WebP first.`,
      );
    }
  }

  onProgress?.(
    files.length === 1
      ? "Uploading photo…"
      : `Uploading ${files.length} photos…`,
  );

  const body = new FormData();
  files.forEach((file) => body.append("files", file));

  const response = await fetch("/api/admin/products/upload", {
    method: "POST",
    body,
    signal: AbortSignal.timeout(Math.max(60_000, files.length * 20_000)),
  });
  const data = (await response.json()) as {
    success?: boolean;
    error?: string;
    urls?: string[];
    data?: { urls?: string[] };
  };

  const urls = data.urls ?? data.data?.urls;
  if (!response.ok || !urls?.length) {
    throw new Error(data.error || "Photo upload failed.");
  }
  return urls;
}
