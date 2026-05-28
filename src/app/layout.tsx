import type { Metadata, Viewport } from "next";
import { DM_Mono } from "next/font/google";
import { env } from "@/lib/env";
import { switzer } from "@/lib/fonts/switzer";
import "./globals.css";

const mono = DM_Mono({
  subsets: ["latin", "latin-ext"],
  variable: "--font-mono",
  display: "swap",
  weight: ["300", "400", "500"],
});

function metadataBaseUrl(): URL {
  try {
    return new URL(env.SITE_URL);
  } catch {
    return new URL("http://localhost:3000");
  }
}

export const metadata: Metadata = {
  metadataBase: metadataBaseUrl(),
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
  alternates: {
    languages: {
      "tr-TR": `${env.SITE_URL}/tr/works`,
      en: `${env.SITE_URL}/en/works`,
    },
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
      className={`${switzer.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
        <link rel="stylesheet" href="/site-nav.css" />
        <link rel="stylesheet" href="/site-nav-shared.css" />
      </head>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
