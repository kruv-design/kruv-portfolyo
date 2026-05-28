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
import { SiteFooter } from "@/components/public/SiteFooter";
import { MarketingKruvStyles } from "@/components/public/MarketingKruvStyles";
import { MarketingSiteNav } from "@/components/public/MarketingSiteNav";
import { env } from "@/lib/env";
import type { Locale } from "@/lib/i18n/config";
import { LOCALES } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/get-messages";

export const revalidate = 60;
export const dynamicParams = true;

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

  const title = project.baslik;
  const description = project.aciklama?.slice(0, 160) || `${project.kategori} project · Kruv`;
  const canonical = `${env.SITE_URL}/${locale}/projects/${project.slug}`;
  const img = project.kapak || undefined;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        "tr-TR": `${env.SITE_URL}/tr/projects/${project.slug}`,
        en: `${env.SITE_URL}/en/projects/${project.slug}`,
      },
    },
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.baslik,
    description: project.aciklama || undefined,
    url: `${env.SITE_URL}/${locale}/projects/${project.slug}`,
    image: project.kapak || undefined,
    keywords: project.etiketler?.join(", ") || undefined,
    creator: { "@type": "Organization", name: settings.siteAdi },
    about: project.kategori,
  };

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
          <SiteFooter settings={settings} />
        </div>
      </div>
    </>
  );
}
