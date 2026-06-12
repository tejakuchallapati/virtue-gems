import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const input = path.join(root, "public/logo.png");
const output = path.join(root, "public/logo-transparent.png");

// Purple tones baked into logo assets
const PURPLE_TARGETS = [
  { r: 26, g: 10, b: 46 }, // #1a0a2e
  { r: 15, g: 23, b: 42 }, // #0f172a
  { r: 30, g: 15, b: 55 },
  { r: 20, g: 8, b: 38 },
];

function colorDistance(r, g, b, target) {
  return Math.sqrt(
    (r - target.r) ** 2 + (g - target.g) ** 2 + (b - target.b) ** 2,
  );
}

function isBackground(r, g, b, a) {
  if (a < 20) return true;
  // Dark purple / near-black backgrounds
  if (r < 55 && g < 45 && b < 75) {
    return PURPLE_TARGETS.some((t) => colorDistance(r, g, b, t) < 55);
  }
  return false;
}

const image = sharp(input);
const { data, info } = await image.ensureAlpha().raw().toBuffer({ resolveWithObject: true });

for (let i = 0; i < data.length; i += 4) {
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];
  const a = data[i + 3];
  if (isBackground(r, g, b, a)) {
    data[i + 3] = 0;
  }
}

await sharp(data, {
  raw: { width: info.width, height: info.height, channels: 4 },
})
  .png()
  .toFile(output);

console.log(`Wrote ${output}`);
