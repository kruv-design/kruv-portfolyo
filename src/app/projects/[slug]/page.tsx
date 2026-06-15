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
import { SITE_CANONICAL_URL } from "@/lib/site";
import { getMessages } from "@/lib/i18n/get-messages";
import { JsonLd } from "@/components/seo/JsonLd";
import { GlobalOrganizationJsonLd } from "@/components/seo/GlobalOrganizationJsonLd";
import { projectMetaDescription } from "@/lib/seo/project-meta-description";
import {
  buildBreadcrumbSchema,
  buildCreativeWorkSchema,
} from "@/lib/seo/structured-data";
import { withLocale } from "@/lib/i18n/path";
import { t } from "@/lib/i18n/t";

export const revalidate = 60;
/**
 * `dynamicParams = true` lets any slug not pre-rendered fall back to ISR on
 * first request — which means we don't need to reach the DB at build time.
 * If `generateStaticParams()` fails (e.g. DB down during build) the page
 * still works at runtime.
 */
export const dynamicParams = true;

type Params = { slug: string };

export async function generateStaticParams() {
  try {
    const all = await getProjects();
    return all.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Bulunamadı" };

  const title = project.baslik;
  const description = projectMetaDescription(project, "tr");
  const canonical = `${SITE_CANONICAL_URL}/projects/${project.slug}`;
  const img = project.kapak || undefined;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
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

export default async function ProjectPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const locale = "tr";
  const messages = getMessages(locale);
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const [allProjects, { prev, next }, nextBanner, settings] = await Promise.all([
    getProjects(),
    getAdjacentProjects(project.slug),
    getNextProjectForDetail(project.slug),
    getSettings(),
  ]);

  const projectDescription = projectMetaDescription(project, locale);
  const worksTitle = t(messages, "works.metaTitle");

  return (
    <>
      <GlobalOrganizationJsonLd locale={locale} />
      <JsonLd
        data={[
          buildBreadcrumbSchema([
            { name: messages.footer.home, path: withLocale("/", locale) },
            { name: worksTitle, path: withLocale("/works", locale) },
            {
              name: project.baslik,
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
          style={{ background: "var(--bg)", color: "var(--ink)", minHeight: "100vh" }}
        >
          <MarketingKruvStyles />
          <MarketingSiteNav settings={settings} locale={locale} messages={messages} />
          <div className="flex flex-1 flex-col">
            <div className="works-shell-inner project-detail-shell">
              <ProjectDetail
                project={project}
                prevSlug={prev?.slug ?? null}
                nextSlug={next?.slug ?? null}
                nextProject={nextBanner}
                allProjects={allProjects}
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
