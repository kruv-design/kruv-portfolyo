import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DEFAULT_SITE_SETTINGS, getSettings } from "@/lib/queries";
import { getBlogPostBySlug, getBlogPosts } from "@/lib/blog-queries";
import {
  blogIntroForLocale,
  blogTitleForLocale,
  resolveBlogPostForLocale,
} from "@/lib/blog-locale";
import { MarketingSiteNav } from "@/components/public/MarketingSiteNav";
import { MarketingPageShell } from "@/components/public/MarketingPageShell";
import { SiteFooter } from "@/components/public/SiteFooter";
import { BlogArticle } from "@/components/public/BlogArticle";
import { getMessages } from "@/lib/i18n/get-messages";
import { t } from "@/lib/i18n/t";
import type { Locale } from "@/lib/i18n/config";
import { LOCALES } from "@/lib/i18n/config";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildLocaleAlternates } from "@/lib/seo/locale-alternates";
import { withLocale } from "@/lib/i18n/path";
import { buildBlogPostingSchema, buildBreadcrumbSchema } from "@/lib/seo/structured-data";

export const revalidate = 60;
export const dynamicParams = true;
/** Her istekte Supabase'ten güncel içerik okunur (EN/TR). */
export const dynamic = "force-dynamic";

type Params = { slug: string; locale: Locale };

export async function generateStaticParams() {
  try {
    const all = await getBlogPosts();
    return LOCALES.flatMap((locale) => all.map((p) => ({ slug: p.slug, locale })));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return { title: "Not found" };

  const title = blogTitleForLocale(post, locale);
  const description = blogIntroForLocale(post, locale).slice(0, 160);
  const img = post.kapak || undefined;
  const alternates = buildLocaleAlternates(`/blog/${post.slug}`, locale);

  return {
    title,
    description,
    alternates,
    openGraph: {
      title,
      description,
      url: alternates.canonical,
      type: "article",
      images: img ? [{ url: img }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: img ? [img] : undefined,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug, locale } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post || !post.yayinda) notFound();

  const settings = await getSettings().catch(() => DEFAULT_SITE_SETTINGS);
  const messages = getMessages(locale);
  const localized = resolveBlogPostForLocale(post, locale);
  const blogTitle = t(messages, "blog.metaTitle");

  return (
    <MarketingPageShell className="flex min-h-screen flex-col">
      <JsonLd
        data={[
          buildBreadcrumbSchema([
            { name: messages.footer.home, path: withLocale("/", locale) },
            { name: blogTitle, path: withLocale("/blog", locale) },
            {
              name: localized.baslik,
              path: withLocale(`/blog/${post.slug}`, locale),
            },
          ]),
          buildBlogPostingSchema({ post, locale }),
        ]}
      />
      <MarketingSiteNav settings={settings} locale={locale} messages={messages} />
      <main className="works-shell-inner blog-shell flex-1" lang={locale}>
        <BlogArticle post={localized} />
      </main>
      <SiteFooter settings={settings} locale={locale} messages={messages} />
    </MarketingPageShell>
  );
}
