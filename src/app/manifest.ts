import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  const siteUrl = getSiteUrl();

  return {
    name: "Virtue Gems",
    short_name: "Virtue Gems",
    description:
      "Premium handcrafted jewellery with WhatsApp checkout and delivery across AP & Telangana.",
    start_url: "/",
    display: "standalone",
    background_color: "#1a0a2e",
    theme_color: "#1a0a2e",
    lang: "en-IN",
    icons: [
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon",
        sizes: "32x32",
        type: "image/png",
        purpose: "any",
      },
    ],
    id: siteUrl,
  };
}
