import { Suspense } from "react";
import type { Metadata } from "next";
import { DEFAULT_SITE_SETTINGS, getProjects, getSettings } from "@/lib/queries";
import { MarketingSiteNav } from "@/components/public/MarketingSiteNav";
import { MarketingPageShell } from "@/components/public/MarketingPageShell";
import { PortfolioGrid } from "@/components/public/PortfolioGrid";
import { getMessages } from "@/lib/i18n/get-messages";
import type { Locale } from "@/lib/i18n/config";
import { env } from "@/lib/env";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    alternates: {
      canonical: `${env.SITE_URL}/${locale}/works`,
      languages: {
        "tr-TR": `${env.SITE_URL}/tr/works`,
        en: `${env.SITE_URL}/en/works`,
      },
    },
  };
}

export default async function WorksPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const [projects, settings] = await Promise.all([
    getProjects().catch(() => []),
    getSettings().catch(() => DEFAULT_SITE_SETTINGS),
  ]);
  const messages = getMessages(locale);

  return (
    <MarketingPageShell className="flex min-h-screen flex-col">
      <MarketingSiteNav settings={settings} locale={locale} messages={messages} />
      <Suspense fallback={null}>
        <PortfolioGrid projects={projects} settings={settings} />
      </Suspense>
    </MarketingPageShell>
  );
}
