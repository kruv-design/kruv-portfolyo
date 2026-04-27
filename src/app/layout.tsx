import type { Metadata, Viewport } from "next";
import { Bebas_Neue, DM_Mono, Outfit } from "next/font/google";
import { env } from "@/lib/env";
import "./globals.css";

const body = Outfit({
  subsets: ["latin", "latin-ext"],
  variable: "--font-body",
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

const display = Bebas_Neue({
  subsets: ["latin", "latin-ext"],
  variable: "--font-display",
  display: "swap",
  weight: "400",
});

const mono = DM_Mono({
  subsets: ["latin", "latin-ext"],
  variable: "--font-mono",
  display: "swap",
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(env.SITE_URL),
  title: {
    default: "kruv. — portfolyo",
    template: "%s · kruv.",
  },
  description: "Seçilmiş projeler ve çalışmalar.",
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: "kruv.",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0E0E0E",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="tr"
      className={`${body.variable} ${display.variable} ${mono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
