import { Suspense } from "react";
import type { Metadata } from "next";
import { DEFAULT_SITE_SETTINGS, getProjects, getSettings } from "@/lib/queries";
import { MarketingSiteNav } from "@/components/public/MarketingSiteNav";
import { MarketingPageShell } from "@/components/public/MarketingPageShell";
import { PortfolioGrid } from "@/components/public/PortfolioGrid";
import { getMessages } from "@/lib/i18n/get-messages";

export const revalidate = 60;

const messages = getMessages("tr");

export const metadata: Metadata = {
  title: messages.works.metaTitle,
  description: messages.works.metaDescription,
  openGraph: {
    title: messages.works.metaTitle,
    description: messages.works.metaDescription,
    images: [{ url: "/og/og-works-tr.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: messages.works.metaTitle,
    description: messages.works.metaDescription,
    images: ["/og/og-works-tr.png"],
  },
};

/** CMS Works — anasayfa ile aynı nav; hero yok, doğrudan proje ızgarası. */
export default async function WorksPage() {
  const locale = "tr";
  const messages = getMessages(locale);
  const [projects, settings] = await Promise.all([
    getProjects().catch(() => []),
    getSettings().catch(() => DEFAULT_SITE_SETTINGS),
  ]);

  return (
    <MarketingPageShell className="flex min-h-screen flex-col">
      <MarketingSiteNav settings={settings} locale={locale} messages={messages} />
      <Suspense fallback={null}>
        <PortfolioGrid
          projects={projects}
          settings={settings}
          locale={locale}
          messages={messages}
        />
      </Suspense>
    </MarketingPageShell>
  );
}
