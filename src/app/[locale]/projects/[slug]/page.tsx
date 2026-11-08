import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getAdjacentProjects,
  getNextProjectForDetail,
  getProjectBySlug,
  getProjects,
  getSettings,
} from "@/lib/queries";
import { ProjectDetail } from "@/components/public/ProjectDetail";
import { ProjectDetailPageFrame } from "@/components/public/ProjectDetailPageFrame";
import { SiteFooter } from "@/components/public/SiteFooter";
import { MarketingKruvStyles } from "@/components/public/MarketingKruvStyles";
import { MarketingSiteNav } from "@/components/public/MarketingSiteNav";
import { buildLocaleAlternates } from "@/lib/seo/locale-alternates";
import type { Locale } from "@/lib/i18n/config";
import { LOCALES } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/get-messages";
import { projectTitleForLocale, resolveProjectForLocale } from "@/lib/project-locale";
import { JsonLd } from "@/components/seo/JsonLd";
import { projectMetaDescription } from "@/lib/seo/project-meta-description";
import {
  buildBreadcrumbSchema,
  buildCreativeWorkSchema,
} from "@/lib/seo/structured-data";
import { withLocale } from "@/lib/i18n/path";
import { t } from "@/lib/i18n/t";

export const revalidate = 60;
export const dynamicParams = true;
/** Her istekte Supabase’ten güncel title/description okunur (EN/TR). */
export const dynamic = "force-dynamic";

type Params = { slug: string; locale: Locale };

export async function generateStaticParams() {
  try {
    const all = await getProjects();
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
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Not found" };

  const title = projectTitleForLocale(project, locale);
  const description = projectMetaDescription(project, locale);
  const img = project.kapak || undefined;
  const alternates = buildLocaleAlternates(`/projects/${project.slug}`, locale);

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

export default async function LocalizedProjectPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug, locale } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const [allProjects, { prev, next }, nextBanner, settings] = await Promise.all([
    getProjects(),
    getAdjacentProjects(project.slug),
    getNextProjectForDetail(project.slug),
    getSettings(),
  ]);
  const messages = getMessages(locale);
  const localized = resolveProjectForLocale(project, locale);
  const localizedNext = nextBanner
    ? resolveProjectForLocale(nextBanner, locale)
    : null;
  const localizedAll = allProjects.map((p) =>
    resolveProjectForLocale(p, locale),
  );

  const projectTitle = projectTitleForLocale(project, locale);
  const projectDescription = projectMetaDescription(project, locale);
  const worksTitle = t(messages, "works.metaTitle");

  return (
    <>
      <JsonLd
        data={[
          buildBreadcrumbSchema([
            { name: messages.footer.home, path: withLocale("/", locale) },
            { name: worksTitle, path: withLocale("/works", locale) },
            {
              name: projectTitle,
              path: withLocale(`/projects/${project.slug}`, locale),
            },
          ]),
          buildCreativeWorkSchema({
            project,
            locale,
            description: projectDescription,
          }),
        ]}
      />
      <ProjectDetailPageFrame slug={project.slug}>
        <div
          className="project-detail-page flex min-h-screen flex-col"
          lang={locale}
          style={{ background: "var(--bg)", color: "var(--ink)", minHeight: "100vh" }}
        >
          <MarketingKruvStyles />
          <MarketingSiteNav settings={settings} locale={locale} messages={messages} />
          <div className="flex flex-1 flex-col">
            <div className="works-shell-inner project-detail-shell">
              <ProjectDetail
                project={localized}
                prevSlug={prev?.slug ?? null}
                nextSlug={next?.slug ?? null}
                nextProject={localizedNext}
                allProjects={localizedAll}
                locale={locale}
                messages={messages}
              />
            </div>
            <SiteFooter settings={settings} locale={locale} messages={messages} />
          </div>
        </div>
      </ProjectDetailPageFrame>
    </>
  );
}
