import type { Metadata } from "next";
import { DEFAULT_SITE_SETTINGS, getSettings } from "@/lib/queries";
import { getDropPacksPublic } from "@/lib/drops-queries";
import { resolveDropPackForLocale, resolveDropFontForLocale } from "@/lib/drops-locale";
import { MarketingSiteNav } from "@/components/public/MarketingSiteNav";
import { MarketingPageShell } from "@/components/public/MarketingPageShell";
import { SiteFooter } from "@/components/public/SiteFooter";
import { DropsIndexClient } from "@/components/public/drops/DropsIndexClient";
import { getMessages } from "@/lib/i18n/get-messages";
import { t } from "@/lib/i18n/t";
import type { Locale } from "@/lib/i18n/config";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildLocaleAlternates } from "@/lib/seo/locale-alternates";
import { withLocale } from "@/lib/i18n/path";
import { buildBreadcrumbSchema } from "@/lib/seo/structured-data";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const messages = getMessages(locale);
  const title = t(messages, "drops.metaTitle");
  const description = t(messages, "drops.metaDescription");
  const alternates = buildLocaleAlternates("/drops", locale);

  return {
    title,
    description,
    alternates,
    openGraph: {
      title,
      description,
      url: alternates.canonical,
      locale: locale === "tr" ? "tr_TR" : "en_US",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function DropsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const [packsRaw, settings] = await Promise.all([
    getDropPacksPublic(),
    getSettings().catch(() => DEFAULT_SITE_SETTINGS),
  ]);
  const messages = getMessages(locale);
  const packs = packsRaw.map((pack) => ({
    ...resolveDropPackForLocale(pack, locale),
    fonts: pack.fonts.map((f) => resolveDropFontForLocale(f, locale)),
  }));
  const dropsTitle = t(messages, "drops.metaTitle");

  return (
    <MarketingPageShell className="marketing-page-shell--drops flex min-h-screen flex-col">
      <JsonLd
        data={[
          buildBreadcrumbSchema([
            { name: messages.footer.home, path: withLocale("/", locale) },
            { name: dropsTitle, path: withLocale("/drops", locale) },
          ]),
        ]}
      />
      <MarketingSiteNav settings={settings} locale={locale} messages={messages} />
      <main className="works-shell-inner drops-shell flex-1" lang={locale}>
        <DropsIndexClient
          packs={packs}
          locale={locale}
          messages={messages}
          settings={settings}
        />
      </main>
      <SiteFooter settings={settings} locale={locale} messages={messages} />
    </MarketingPageShell>
  );
}
