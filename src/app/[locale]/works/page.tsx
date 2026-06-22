import { Suspense } from "react";
import type { Metadata } from "next";
import { DEFAULT_SITE_SETTINGS, getProjects, getSettings } from "@/lib/queries";
import { MarketingSiteNav } from "@/components/public/MarketingSiteNav";
import { MarketingPageShell } from "@/components/public/MarketingPageShell";
import { PortfolioGrid } from "@/components/public/PortfolioGrid";
import { getMessages } from "@/lib/i18n/get-messages";
import { t } from "@/lib/i18n/t";
import type { Locale } from "@/lib/i18n/config";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildLocaleAlternates } from "@/lib/seo/locale-alternates";
import { withLocale } from "@/lib/i18n/path";
import { buildBreadcrumbSchema, buildPortfolioItemListSchema } from "@/lib/seo/structured-data";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const messages = getMessages(locale);
  const title = t(messages, "works.metaTitle");
  const description = t(messages, "works.metaDescription");

  const alternates = buildLocaleAlternates("/works", locale);

  return {
    title,
    description,
    alternates,
    openGraph: {
      title,
      description,
      url: alternates.canonical,
      locale: locale === "tr" ? "tr_TR" : "en_US",
      images: [
        {
          url: `/og/og-works-${locale}.png`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`/og/og-works-${locale}.png`],
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
  const worksTitle = t(messages, "works.metaTitle");

  return (
    <MarketingPageShell className="flex min-h-screen flex-col">
      <JsonLd
        data={[
          buildBreadcrumbSchema([
            { name: messages.footer.home, path: withLocale("/", locale) },
            { name: worksTitle, path: withLocale("/works", locale) },
          ]),
          buildPortfolioItemListSchema({ projects, locale }),
        ]}
      />
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
