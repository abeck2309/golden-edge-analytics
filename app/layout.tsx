import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { PwaServiceWorker } from "@/components/pwa-service-worker";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SplashScreen } from "@/components/splash-screen";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
  applicationName: "Golden Edge Analytics",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Golden Edge"
  },
  formatDetection: {
    telephone: false
  },
  icons: {
    icon: [
      { url: "/favicon-32.png?v=2", sizes: "32x32", type: "image/png" },
      { url: "/favicon-192.png?v=2", sizes: "192x192", type: "image/png" }
    ],
    shortcut: "/favicon-32.png?v=2",
    apple: "/pwa-icon-180.png"
  },
  other: {
    "mobile-web-app-capable": "yes"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <a
          href="#main-content"
          className="sr-only z-50 rounded-md bg-gold px-4 py-2 font-semibold text-ink focus:not-sr-only focus:absolute focus:left-4 focus:top-4"
        >
          Skip to main content
        </a>
        <div className="min-h-screen bg-hero-glow">
          <SiteHeader />
          <main id="main-content">{children}</main>
          <SiteFooter />
        </div>
        <Analytics />
        <PwaServiceWorker />
        <SplashScreen />
      </body>
    </html>
  );
}
