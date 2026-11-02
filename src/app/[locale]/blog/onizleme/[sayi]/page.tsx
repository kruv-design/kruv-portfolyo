import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DEFAULT_SITE_SETTINGS, getSettings } from "@/lib/queries";
import { formatBlogDate } from "@/lib/blog-date";
import { resolveBlogPostForLocale } from "@/lib/blog-locale";
import { issueToPreviewPost, readHaftalikIssue } from "@/lib/haftalik";
import { MarketingSiteNav } from "@/components/public/MarketingSiteNav";
import { MarketingPageShell } from "@/components/public/MarketingPageShell";
import { SiteFooter } from "@/components/public/SiteFooter";
import { BlogArticle } from "@/components/public/BlogArticle";
import { getMessages } from "@/lib/i18n/get-messages";
import type { Locale } from "@/lib/i18n/config";

export const dynamic = "force-dynamic";

type Params = { sayi: string; locale: Locale };

function previewAcik(): boolean {
  return process.env.VERCEL_ENV !== "production";
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { sayi } = await params;
  const issue = previewAcik() ? readHaftalikIssue(sayi) : null;
  return {
    title: issue ? issue.post.baslik : "Önizleme",
    robots: { index: false, follow: false },
  };
}

export default async function HaftalikOnizlemePage({
  params,
}: {
  params: Promise<Params>;
}) {
  if (!previewAcik()) notFound();

  const { sayi, locale } = await params;
  const issue = readHaftalikIssue(sayi);
  if (!issue) notFound();

  const settings = await getSettings().catch(() => DEFAULT_SITE_SETTINGS);
  const messages = getMessages(locale);
  const post = issueToPreviewPost(issue);
  const localized = resolveBlogPostForLocale(post, locale);

  return (
    <MarketingPageShell className="flex min-h-screen flex-col">
      <MarketingSiteNav settings={settings} locale={locale} messages={messages} />
      <main className="works-shell-inner blog-shell flex-1" lang={locale}>
        <BlogArticle
          post={localized}
          dateLabel={formatBlogDate(post.created_at, locale)}
        />
      </main>
      <SiteFooter settings={settings} locale={locale} messages={messages} />
    </MarketingPageShell>
  );
}
