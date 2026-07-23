import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/** Browser tab favicon — gold VG on deep purple. */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1a0a2e",
          borderRadius: 6,
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: 16,
          fontWeight: 700,
          color: "#d4af37",
          letterSpacing: -1,
        }}
      >
        VG
      </div>
    ),
    { ...size },
  );
}
