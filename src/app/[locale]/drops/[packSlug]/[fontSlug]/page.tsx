import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DEFAULT_SITE_SETTINGS, getSettings } from "@/lib/queries";
import { getDropFontPublic } from "@/lib/drops-queries";
import { resolveDropPackForLocale, resolveDropFontForLocale } from "@/lib/drops-locale";
import { MarketingSiteNav } from "@/components/public/MarketingSiteNav";
import { MarketingPageShell } from "@/components/public/MarketingPageShell";
import { SiteFooter } from "@/components/public/SiteFooter";
import { DropFontPageClient } from "@/components/public/drops/DropFontPageClient";
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
  params: Promise<{ locale: Locale; packSlug: string; fontSlug: string }>;
}): Promise<Metadata> {
  const { locale, packSlug, fontSlug } = await params;
  const ctx = await getDropFontPublic(packSlug, fontSlug);
  if (!ctx) return { title: "Drops" };
  const font = resolveDropFontForLocale(ctx.font, locale);
  const title = `${font.name} — ${t(getMessages(locale), "drops.metaTitle")}`;
  const description = font.aciklama.slice(0, 160);
  const path = `/drops/${packSlug}/${fontSlug}`;
  const alternates = buildLocaleAlternates(path, locale);
  return {
    title,
    description,
    alternates,
    openGraph: { title, description, url: alternates.canonical },
  };
}

export default async function DropFontPage({
  params,
}: {
  params: Promise<{ locale: Locale; packSlug: string; fontSlug: string }>;
}) {
  const { locale, packSlug, fontSlug } = await params;
  const ctx = await getDropFontPublic(packSlug, fontSlug);
  if (!ctx) notFound();

  const [settings] = await Promise.all([
    getSettings().catch(() => DEFAULT_SITE_SETTINGS),
  ]);
  const messages = getMessages(locale);
  const pack = {
    ...resolveDropPackForLocale(ctx.pack, locale),
    fonts: ctx.pack.fonts.map((f) => resolveDropFontForLocale(f, locale)),
  };
  const font = resolveDropFontForLocale(ctx.font, locale);
  const dropsTitle = t(messages, "drops.metaTitle");

  return (
    <MarketingPageShell className="flex min-h-screen flex-col">
      <JsonLd
        data={[
          buildBreadcrumbSchema([
            { name: messages.footer.home, path: withLocale("/", locale) },
            { name: dropsTitle, path: withLocale("/drops", locale) },
            {
              name: font.name,
              path: withLocale(`/drops/${packSlug}/${fontSlug}`, locale),
            },
          ]),
        ]}
      />
      <MarketingSiteNav settings={settings} locale={locale} messages={messages} />
      <main className="works-shell-inner drops-shell drops-specimen-shell flex-1" lang={locale}>
        <DropFontPageClient
          pack={pack}
          font={font}
          locale={locale}
          messages={messages}
          settings={settings}
        />
      </main>
      <SiteFooter settings={settings} locale={locale} messages={messages} />
    </MarketingPageShell>
  );
}
