import sharp from "sharp";
import { apiFail, apiOk, checkRateLimit, clientIp } from "@/lib/api-server";
import { createPendingReview, removeReviewPhotos, uploadReviewPhoto } from "@/lib/reviews";
import { REVIEW_LIMITS } from "@/lib/reviews-shared";
import { isSupabaseAdminConfigured } from "@/lib/supabase/config";

export const runtime = "nodejs";

function text(form: FormData, key: string) {
  const value = form.get(key);
  return typeof value === "string" ? value.trim() : "";
}

/** Re-encode every upload: strips EXIF/GPS, normalises orientation, caps dimensions. */
async function toWebJpeg(buffer: Buffer) {
  return sharp(buffer)
    .rotate()
    .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 84, mozjpeg: true })
    .toBuffer();
}

export async function POST(request: Request) {
  const limited = checkRateLimit(`review:${clientIp(request)}`, 5, 10 * 60_000);
  if (limited) return limited;

  if (!isSupabaseAdminConfigured()) {
    return apiFail("Reviews are not available right now. Please try again later.", 503);
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return apiFail("Could not read your review. Please try again.", 400);
  }

  // Honeypot — real visitors never see or fill this field.
  if (text(form, "website")) return apiOk({ received: true });

  const authorName = text(form, "name");
  const city = text(form, "city");
  const comment = text(form, "comment");
  const rating = Number(text(form, "rating"));

  if (!authorName || authorName.length > REVIEW_LIMITS.nameMax) {
    return apiFail("Please enter your name.", 400);
  }
  if (city.length > REVIEW_LIMITS.cityMax) {
    return apiFail("City name is too long.", 400);
  }
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return apiFail("Please choose a star rating.", 400);
  }
  if (comment.length < REVIEW_LIMITS.commentMin || comment.length > REVIEW_LIMITS.commentMax) {
    return apiFail(
      `Your review should be between ${REVIEW_LIMITS.commentMin} and ${REVIEW_LIMITS.commentMax} characters.`,
      400,
    );
  }

  const files = form
    .getAll("photos")
    .filter((f): f is File => typeof File !== "undefined" && f instanceof File && f.size > 0);
  if (files.length > REVIEW_LIMITS.maxPhotos) {
    return apiFail(`You can add up to ${REVIEW_LIMITS.maxPhotos} photos.`, 400);
  }
  const totalBytes = files.reduce((sum, f) => sum + f.size, 0);
  if (totalBytes > REVIEW_LIMITS.maxTotalBytes) {
    return apiFail("Photos are too large. Please choose smaller photos.", 400);
  }
  for (const file of files) {
    if (file.size > REVIEW_LIMITS.maxPhotoBytes || !(file.type || "").startsWith("image/")) {
      return apiFail(`“${file.name}” is not a supported photo.`, 400);
    }
  }

  const photos: string[] = [];
  try {
    for (const file of files) {
      const jpeg = await toWebJpeg(Buffer.from(await file.arrayBuffer()));
      photos.push(await uploadReviewPhoto(jpeg));
    }
    await createPendingReview({
      authorName,
      city: city || undefined,
      rating,
      comment,
      photos,
    });
  } catch (error) {
    console.error("Review submit error:", error);
    await removeReviewPhotos(photos);
    return apiFail("Could not save your review. Please try again.", 500);
  }

  return apiOk({ received: true }, 201);
}
