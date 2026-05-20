import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getAdjacentProjects,
  getProjectBySlug,
  getProjects,
  getSettings,
} from "@/lib/queries";
import { ProjectDetail } from "@/components/public/ProjectDetail";
import { SiteFooter } from "@/components/public/SiteFooter";
import { MarketingSiteNav } from "@/components/public/MarketingSiteNav";
import { env } from "@/lib/env";

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
  const description =
    project.aciklama?.slice(0, 160) ||
    `${project.kategori} projesi · ${project.musteri || "Kruv"}`;
  const canonical = `${env.SITE_URL}/projects/${project.slug}`;
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
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const [{ prev, next }, settings] = await Promise.all([
    getAdjacentProjects(project.slug),
    getSettings(),
  ]);

  // JSON-LD structured data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.baslik,
    description: project.aciklama || undefined,
    url: `${env.SITE_URL}/projects/${project.slug}`,
    image: project.kapak || undefined,
    keywords: project.etiketler?.join(", ") || undefined,
    dateCreated: project.yil || undefined,
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
        <MarketingSiteNav settings={settings} />
        <div className="flex flex-1 flex-col">
          <div className="works-shell-inner project-detail-shell">
            <ProjectDetail
              project={project}
              prevSlug={prev?.slug ?? null}
              nextSlug={next?.slug ?? null}
              nextProject={next}
            />
          </div>
          <SiteFooter settings={settings} />
        </div>
      </div>
    </>
  );
}
