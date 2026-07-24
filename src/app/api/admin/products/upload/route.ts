import { mkdirSync } from "fs";
import path from "path";
import sharp from "sharp";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { apiFail, apiOk } from "@/lib/api-server";

export const runtime = "nodejs";

const MAX_FILES = 40;
/** Accept large camera exports — we still save a high-quality web master after upload. */
const MAX_BYTES = 500 * 1024 * 1024; // 500MB per file
const ALLOWED = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
]);

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return apiFail("Unauthorized.", 401);
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return apiFail("Invalid upload.", 400);
  }

  const files = form
    .getAll("files")
    .filter((f): f is File => typeof File !== "undefined" && f instanceof File);

  if (files.length === 0) {
    return apiFail("Choose at least one photo.", 400);
  }
  if (files.length > MAX_FILES) {
    return apiFail(`Upload up to ${MAX_FILES} photos at a time.`, 400);
  }

  const uploadDir = path.join(process.cwd(), "public", "products");
  mkdirSync(uploadDir, { recursive: true });

  const urls: string[] = [];

  try {
    for (const file of files) {
      if (file.size > MAX_BYTES) {
        return apiFail(
          `“${file.name}” is too large (max 500MB).`,
          400,
        );
      }
      const type = (file.type || "").toLowerCase();
      const extOk = /\.(jpe?g|png|webp|heic|heif)$/i.test(file.name);
      if (type && !ALLOWED.has(type) && !type.startsWith("image/") && !extOk) {
        return apiFail(`“${file.name}” is not a supported image.`, 400);
      }
      if (!type && !extOk) {
        return apiFail(`“${file.name}” is not a supported image.`, 400);
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const stamp = Date.now().toString(36);
      const rand = Math.random().toString(36).slice(2, 7);
      const filename = `upload-${stamp}-${rand}.jpg`;
      const outPath = path.join(uploadDir, filename);

      // High-quality web master: keep detail for zoom, limit only extreme megapixel files.
      await sharp(buffer)
        .rotate()
        .resize({
          width: 3200,
          height: 3200,
          fit: "inside",
          withoutEnlargement: true,
        })
        .jpeg({
          quality: 95,
          mozjpeg: true,
          chromaSubsampling: "4:4:4",
        })
        .toFile(outPath);

      urls.push(`/products/${filename}`);
    }
  } catch (error) {
    console.error("Product image upload error:", error);
    return apiFail("Could not process one of the photos. Try JPG or PNG.", 500);
  }

  return apiOk({ urls });
}
