import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/site-config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.title,
    short_name: "Golden Edge",
    description: siteConfig.description,
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#070707",
    theme_color: "#b4975a",
    orientation: "portrait",
    icons: [
      {
        src: "/pwa-icon-192.png",
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: "/pwa-icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any"
      },
      {
        src: "/pwa-icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable"
      }
    ],
    categories: ["sports", "news", "entertainment"],
    shortcuts: [
      {
        name: "VGK Updates",
        short_name: "VGK",
        description: "Open the live Golden Knights dashboard.",
        url: "/vgk-updates",
        icons: [{ src: "/pwa-icon-192.png", sizes: "192x192" }]
      },
      {
        name: "Articles",
        short_name: "Articles",
        description: "Read the latest Golden Edge articles.",
        url: "/articles",
        icons: [{ src: "/pwa-icon-192.png", sizes: "192x192" }]
      }
    ]
  };
}
