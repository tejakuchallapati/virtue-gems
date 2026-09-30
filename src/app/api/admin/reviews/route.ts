import { revalidatePath } from "next/cache";
import { getCurrentAdmin } from "@/lib/admin-auth";
import { apiFail, apiOk, parseJsonBody } from "@/lib/api-server";
import { deleteReview, setReviewStatus } from "@/lib/reviews";
import type { StoreReviewStatus } from "@/types";

const STATUSES: StoreReviewStatus[] = ["pending", "approved", "rejected"];

export async function PATCH(request: Request) {
  if (!(await getCurrentAdmin())) return apiFail("Unauthorized.", 401);
  const parsed = await parseJsonBody<Record<string, unknown>>(request);
  if ("error" in parsed) return parsed.error;

  const id = typeof parsed.data.id === "string" ? parsed.data.id : "";
  const status = parsed.data.status as StoreReviewStatus;
  if (!id || !STATUSES.includes(status)) return apiFail("Review and status are required.", 400);

  try {
    await setReviewStatus(id, status);
    revalidatePath("/");
    return apiOk({ id, status });
  } catch (error) {
    console.error("Review status error:", error);
    return apiFail("Could not update the review.", 500);
  }
}

export async function DELETE(request: Request) {
  if (!(await getCurrentAdmin())) return apiFail("Unauthorized.", 401);
  const id = new URL(request.url).searchParams.get("id") ?? "";
  if (!id) return apiFail("Review id required.", 400);

  try {
    await deleteReview(id);
    revalidatePath("/");
    return apiOk({ id });
  } catch (error) {
    console.error("Review delete error:", error);
    return apiFail("Could not delete the review.", 500);
  }
}
