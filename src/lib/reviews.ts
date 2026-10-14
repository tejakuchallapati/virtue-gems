import "server-only";

import type { StoreReview, StoreReviewStatus } from "@/types";
import { getProductImageBucket, isSupabaseAdminConfigured } from "@/lib/supabase/config";

type ReviewRow = {
  id: string;
  author_name: string;
  city: string | null;
  rating: number;
  comment: string;
  photos: string[] | null;
  status: StoreReviewStatus;
  created_at: string;
  product_id?: string | null;
};

const BASE_COLUMNS = "id,author_name,city,rating,comment,photos,status,created_at";
const COLUMNS = `${BASE_COLUMNS},product_id`;

function mapReview(row: ReviewRow): StoreReview {
  return {
    id: row.id,
    authorName: row.author_name,
    city: row.city ?? undefined,
    rating: row.rating,
    comment: row.comment,
    photos: row.photos ?? [],
    status: row.status,
    createdAt: row.created_at,
    productId: row.product_id ?? undefined,
  };
}

/** Table not created yet (migration 002 not run) — Postgres or PostgREST schema-cache code. */
function isMissingTable(error: { code?: string } | null) {
  return error?.code === "42P01" || error?.code === "PGRST205";
}

/** product_id column not added yet (migration 003 not run). */
function isMissingProductColumn(error: { code?: string } | null) {
  return error?.code === "42703" || error?.code === "PGRST204";
}

type QueryResult = { data: unknown; error: { code?: string } | null };

/** Run with product_id; if migration 003 is missing, retry with the original columns. */
async function withProductColumn(run: (columns: string) => PromiseLike<QueryResult>) {
  const first = await run(COLUMNS);
  if (!isMissingProductColumn(first.error)) return first;
  return run(BASE_COLUMNS);
}

async function client() {
  const { createSupabaseAdminClient } = await import("@/lib/supabase/admin");
  return createSupabaseAdminClient();
}

/** Approved reviews, optionally for one product. Never throws — callers just show fewer reviews. */
export async function listApprovedReviews(
  limit = 12,
  productId?: string,
): Promise<StoreReview[]> {
  if (!isSupabaseAdminConfigured()) return [];
  try {
    const supabase = await client();
    const { data, error } = productId
      ? await supabase
          .from("store_reviews")
          .select(COLUMNS)
          .eq("status", "approved")
          .eq("product_id", productId)
          .order("created_at", { ascending: false })
          .limit(limit)
      : await withProductColumn((columns) =>
          supabase
            .from("store_reviews")
            .select(columns)
            .eq("status", "approved")
            .order("created_at", { ascending: false })
            .limit(limit),
        );
    if (error) {
      if (!isMissingTable(error) && !isMissingProductColumn(error)) {
        console.error("Approved reviews error:", error);
      }
      return [];
    }
    return (data as ReviewRow[]).map(mapReview);
  } catch (error) {
    console.error("Approved reviews error:", error);
    return [];
  }
}

/** Reviews awaiting moderation; 0 when reviews are not set up. Never throws. */
export async function countPendingReviews(): Promise<number> {
  if (!isSupabaseAdminConfigured()) return 0;
  try {
    const supabase = await client();
    const { count, error } = await supabase
      .from("store_reviews")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending");
    if (error) {
      if (!isMissingTable(error)) console.error("Pending reviews count error:", error);
      return 0;
    }
    return count ?? 0;
  } catch (error) {
    console.error("Pending reviews count error:", error);
    return 0;
  }
}

export async function listReviewsForAdmin(): Promise<{
  reviews: StoreReview[];
  setupRequired: boolean;
}> {
  if (!isSupabaseAdminConfigured()) return { reviews: [], setupRequired: true };
  const supabase = await client();
  const { data, error } = await withProductColumn((columns) =>
    supabase
      .from("store_reviews")
      .select(columns)
      .order("created_at", { ascending: false })
      .limit(500),
  );
  if (error) {
    if (isMissingTable(error)) return { reviews: [], setupRequired: true };
    throw error;
  }
  return { reviews: (data as ReviewRow[]).map(mapReview), setupRequired: false };
}

export async function createPendingReview(input: {
  authorName: string;
  city?: string;
  rating: number;
  comment: string;
  photos: string[];
  productId?: string;
}): Promise<void> {
  const supabase = await client();
  const row: Record<string, unknown> = {
    author_name: input.authorName,
    city: input.city ?? null,
    rating: input.rating,
    comment: input.comment,
    photos: input.photos,
    status: "pending",
  };
  let { error } = await supabase
    .from("store_reviews")
    .insert(input.productId ? { ...row, product_id: input.productId } : row);
  if (input.productId && isMissingProductColumn(error)) {
    ({ error } = await supabase.from("store_reviews").insert(row));
  }
  if (error) throw error;
}

export async function setReviewStatus(id: string, status: StoreReviewStatus): Promise<void> {
  const supabase = await client();
  const { error } = await supabase
    .from("store_reviews")
    .update({ status, reviewed_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
}

export async function deleteReview(id: string): Promise<void> {
  const supabase = await client();
  const { data, error } = await supabase
    .from("store_reviews")
    .delete()
    .eq("id", id)
    .select("photos")
    .maybeSingle();
  if (error) throw error;
  await removeReviewPhotos((data?.photos as string[] | undefined) ?? []);
}

/** Upload one processed JPEG and return its public URL. */
export async function uploadReviewPhoto(jpeg: Buffer): Promise<string> {
  const supabase = await client();
  const bucket = getProductImageBucket();
  const stamp = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 8);
  const storagePath = `reviews/${new Date().toISOString().slice(0, 7)}/review-${stamp}-${rand}.jpg`;
  const { error } = await supabase.storage.from(bucket).upload(storagePath, jpeg, {
    contentType: "image/jpeg",
    cacheControl: "31536000",
    upsert: false,
  });
  if (error) throw error;
  return supabase.storage.from(bucket).getPublicUrl(storagePath).data.publicUrl;
}

export async function removeReviewPhotos(urls: string[]): Promise<void> {
  if (urls.length === 0) return;
  const bucket = getProductImageBucket();
  const marker = `/storage/v1/object/public/${bucket}/`;
  const paths = urls
    .map((url) => (url.includes(marker) ? decodeURIComponent(url.split(marker)[1]) : null))
    .filter((p): p is string => Boolean(p?.startsWith("reviews/")));
  if (paths.length === 0) return;
  try {
    const supabase = await client();
    await supabase.storage.from(bucket).remove(paths);
  } catch (error) {
    console.error("Review photo cleanup error:", error);
  }
}
