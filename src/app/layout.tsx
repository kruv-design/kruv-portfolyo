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
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAFAFA" },
    { media: "(prefers-color-scheme: dark)", color: "#0E0E0E" },
  ],
  width: "device-width",
  initialScale: 1,
};

// Pre-paint theme bootstrap: read user's saved choice from localStorage
// and set [data-theme] before React hydrates, preventing a flash.
// If no saved choice, we leave the attribute unset so CSS
// `prefers-color-scheme` media query takes over.
const themeBootstrap = `(function(){try{var t=localStorage.getItem('kruv-theme');if(t==='light'||t==='dark'){document.documentElement.setAttribute('data-theme',t);}}catch(e){}})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="tr"
      className={`${body.variable} ${display.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
