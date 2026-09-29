/** Limits shared by the review form (client) and the submit API (server). */
export const REVIEW_LIMITS = {
  nameMax: 80,
  cityMax: 80,
  commentMin: 10,
  commentMax: 1500,
  maxPhotos: 4,
  /** Per photo after client-side compression; keeps the whole request under hosting body limits. */
  maxPhotoBytes: 3 * 1024 * 1024,
  maxTotalBytes: 4 * 1024 * 1024,
} as const;

export function googleReviewUrl(): string | undefined {
  const url = process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL;
  return url?.startsWith("https://") ? url : undefined;
}
