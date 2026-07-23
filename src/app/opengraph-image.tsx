import { ImageResponse } from "next/og";

export const alt = "Virtue Gems — Premium Handcrafted Jewellery";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Default Open Graph / Twitter share image for Google & social previews. */
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1a0a2e 0%, #2d1450 55%, #1a0a2e 100%)",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 28,
            letterSpacing: 8,
            color: "#d4af37",
            textTransform: "uppercase",
            marginBottom: 16,
          }}
        >
          Premium Handcrafted Jewellery
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 84,
            fontWeight: 700,
            color: "#faf6ee",
            letterSpacing: 4,
          }}
        >
          VIRTUE <span style={{ color: "#d4af37", marginLeft: 16 }}>GEMS</span>
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 26,
            color: "rgba(250,246,238,0.75)",
          }}
        >
          Hyderabad · AP & Telangana · Shop on WhatsApp
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 40,
            fontSize: 22,
            color: "#d4af37",
          }}
        >
          virtuegems.com
        </div>
      </div>
    ),
    { ...size },
  );
}
