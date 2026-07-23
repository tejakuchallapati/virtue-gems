import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Apple touch icon — gold VG on deep purple. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(145deg, #2d1450 0%, #1a0a2e 100%)",
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: 88,
          fontWeight: 700,
          color: "#d4af37",
          letterSpacing: -4,
        }}
      >
        VG
      </div>
    ),
    { ...size },
  );
}
