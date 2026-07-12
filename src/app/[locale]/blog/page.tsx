import type { Metadata } from "next";
import { DEFAULT_SITE_SETTINGS, getSettings } from "@/lib/queries";
import { getBlogPosts } from "@/lib/blog-queries";
import { resolveBlogPostForLocale } from "@/lib/blog-locale";
import { MarketingSiteNav } from "@/components/public/MarketingSiteNav";
import { MarketingPageShell } from "@/components/public/MarketingPageShell";
import { SiteFooter } from "@/components/public/SiteFooter";
import { BlogCard } from "@/components/public/BlogCard";
import { KruvStarIcon } from "@/components/public/KruvStarIcon";
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
  const title = t(messages, "blog.metaTitle");
  const description = t(messages, "blog.metaDescription");

  const alternates = buildLocaleAlternates("/blog", locale);

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
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const [posts, settings] = await Promise.all([
    getBlogPosts().catch(() => []),
    getSettings().catch(() => DEFAULT_SITE_SETTINGS),
  ]);
  const messages = getMessages(locale);
  const blogTitle = t(messages, "blog.metaTitle");
  const localizedPosts = posts.map((p) => resolveBlogPostForLocale(p, locale));

  return (
    <MarketingPageShell className="flex min-h-screen flex-col">
      <JsonLd
        data={[
          buildBreadcrumbSchema([
            { name: messages.footer.home, path: withLocale("/", locale) },
            { name: blogTitle, path: withLocale("/blog", locale) },
          ]),
        ]}
      />
      <MarketingSiteNav settings={settings} locale={locale} messages={messages} />
      <main className="works-shell-inner blog-shell flex-1" lang={locale}>
        <p className="section-tag blog-section-tag">
          <KruvStarIcon className="blog-section-tag__icon" size={24} />
          <span>{t(messages, "blog.eyebrow")}</span>
        </p>
        {localizedPosts.length > 0 ? (
          <div className="blog-grid">
            {localizedPosts.map((post, i) => (
              <BlogCard key={post.id} post={post} index={i} locale={locale} />
            ))}
          </div>
        ) : (
          <p className="b1 blog-empty">{t(messages, "blog.empty")}</p>
        )}
      </main>
      <SiteFooter settings={settings} locale={locale} messages={messages} />
    </MarketingPageShell>
  );
}
