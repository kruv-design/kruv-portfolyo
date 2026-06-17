import type { Metadata, Viewport } from "next";
import { DM_Mono } from "next/font/google";
import { Analytics } from "@/components/analytics/Analytics";
import { env } from "@/lib/env";
import { BRAND_NAME } from "@/lib/brand";
import { SITE_CANONICAL_URL } from "@/lib/site";
import { switzer } from "@/lib/fonts/switzer";
import { ENABLE_THEME_TOGGLE, FORCED_THEME } from "@/lib/theme/flags";
import "./globals.css";

const mono = DM_Mono({
  subsets: ["latin", "latin-ext"],
  variable: "--font-mono",
  display: "swap",
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CANONICAL_URL),
  title: {
    default: `${BRAND_NAME} — portfolyo`,
    template: `%s · ${BRAND_NAME}`,
  },
  description: "Kimlikten içeriğe, her strateji sosyal medyada nasıl görüneceği düşünülerek kurulur.",
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: BRAND_NAME,
    description: "Kimlikten içeriğe, her strateji sosyal medyada nasıl görüneceği düşünülerek kurulur.",
    images: [{ url: "/og/og-default.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    description: "Kimlikten içeriğe, her strateji sosyal medyada nasıl görüneceği düşünülerek kurulur.",
    images: ["/og/og-default.png"],
  },
  alternates: {
    languages: {
      "tr-TR": `${SITE_CANONICAL_URL}/tr/works`,
      en: `${SITE_CANONICAL_URL}/en/works`,
    },
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#FAFAFA",
  width: "device-width",
  initialScale: 1,
};

// Pre-paint theme bootstrap: read user's saved choice from localStorage
// and set [data-theme] before React hydrates, preventing a flash.
// If no saved choice, we leave the attribute unset so CSS
// `prefers-color-scheme` media query takes over.
const themeBootstrap = `(function(){try{var t=localStorage.getItem('kruv-theme');if(t==='light'||t==='dark'){document.documentElement.setAttribute('data-theme',t);}}catch(e){}})();`;
const scrollRestorationBootstrap = `(function(){try{if('scrollRestoration' in history){history.scrollRestoration='manual';}}catch(e){}})();`;

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
      data-theme={ENABLE_THEME_TOGGLE ? undefined : FORCED_THEME}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: scrollRestorationBootstrap }} />
        {ENABLE_THEME_TOGGLE ? (
          <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
        ) : null}
        <link
          rel="preload"
          href="/fonts/switzer/Switzer-Variable.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link rel="stylesheet" href="/fonts/switzer/switzer.css" />
        <link rel="stylesheet" href="/site-nav.css" />
        <link rel="stylesheet" href="/site-nav-shared.css" />
      </head>
      <body className={`${switzer.className} min-h-screen`}>
        {children}
        <Analytics gaId={env.GA_MEASUREMENT_ID} clarityId={env.CLARITY_PROJECT_ID} />
      </body>
    </html>
  );
}
