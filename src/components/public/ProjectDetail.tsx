import Link from "next/link";
import type { Project } from "@/types";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { projectCover, projectGallerySlots } from "@/lib/project-images";
import { ProjectDetailImage } from "./ProjectDetailImage";
import { LetsTalkMarquee } from "./LetsTalkMarquee";
import { ProjectNextBanner } from "./ProjectNextBanner";

export function ProjectDetail({
  project,
  prevSlug,
  nextSlug,
  nextProject,
  allProjects,
}: {
  project: Project;
  prevSlug: string | null;
  nextSlug: string | null;
  nextProject: Project | null;
  allProjects: Project[];
}) {
  const cover = projectCover(project);
  const gallerySlots = projectGallerySlots(project);

  return (
    <>
      <div className="project-detail-cover animate-fadeUp">
        {cover ? (
          <ProjectDetailImage
            src={cover}
            alt={project.baslik}
            priority
            variant="cover"
          />
        ) : (
          <ImagePlaceholder
            label={project.baslik[0] ?? "•"}
            color={project.renk}
            fontSize="5rem"
            className="project-detail-cover__placeholder"
          />
        )}
        <div className="project-detail-toolbar">
          <div className="project-detail-nav-arrows">
            <NavArrow slug={prevSlug} label="←" />
            <NavArrow slug={nextSlug} label="→" />
          </div>
        </div>
      </div>

      <div className="project-detail-body">
        <header className="project-detail-intro animate-fadeUp">
          <h1 className="h1" style={{ color: "var(--ink)" }}>
            {project.baslik}
          </h1>
          {project.aciklama?.trim() ? (
            <p className="b1 mt-6">
              {project.aciklama.trim()}
            </p>
          ) : null}
        </header>

        <aside className="project-detail-aside animate-fadeUp">
          <div className="project-detail-aside-card">
            <MetaRow label="Kategori" value={project.kategori} />
            <MetaRow label="Müşteri" value={project.musteri || "—"} />
            <MetaRow label="Yıl" value={project.yil || "—"} />
            <MetaRow label="Süre" value={project.sure || "—"} />
            {project.link?.trim() ? (
              <MetaLinkRow href={project.link.trim()} />
            ) : null}
            {project.etiketler?.length > 0 && (
              <div
                className="flex flex-col gap-1 py-4"
                style={{ borderTop: "1px solid var(--border)" }}
              >
                <span className="b3" style={{ color: "var(--ink-faint)" }}>
                  Etiketler
                </span>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {project.etiketler.map((t) => (
                    <span
                      key={t}
                      className="b3 rounded-full px-2.5 py-0.5 lowercase font-medium"
                      style={{
                        background: "var(--accent-soft)",
                        color: "var(--accent)",
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>

        {gallerySlots.length > 0 && (
          <div className="project-detail-gallery-wrap animate-fadeUp">
            <div className="project-detail-gallery">
              {gallerySlots.map(({ key, src }) => (
                <figure key={key} className="project-detail-gallery__item">
                  <ProjectDetailImage src={src} alt="" />
                </figure>
              ))}
            </div>
          </div>
        )}

        {project.bolumler && project.bolumler.length > 0 && (
          <div className="project-detail-copy animate-fadeUp">
            <div className="flex flex-col gap-8">
              {project.bolumler.map((b, i) => (
                <section key={i}>
                  {b.baslik && <h2 className="h4 mb-2 lowercase">{b.baslik}</h2>}
                  {b.metin && (
                    <p className="b1 whitespace-pre-wrap" style={{ color: "var(--b1-color)" }}>
                      {b.metin}
                    </p>
                  )}
                </section>
              ))}
            </div>
          </div>
        )}
      </div>

      {nextProject ? (
        <ProjectNextBanner
          current={project}
          nextProject={nextProject}
          allProjects={allProjects}
        />
      ) : null}

      <LetsTalkMarquee headingId="project-lets-talk-heading" />
    </>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="flex flex-col gap-1 py-4 first:pt-0 last:border-b-0"
      style={{ borderBottom: "1px solid var(--border)" }}
    >
      <span className="b3" style={{ color: "var(--ink-faint)" }}>
        {label}
      </span>
      <span className="b1" style={{ color: "var(--ink)" }}>
        {value}
      </span>
    </div>
  );
}

function projectLinkHref(raw: string): string {
  const t = raw.trim();
  if (!t) return "";
  return /^https?:\/\//i.test(t) ? t : `https://${t}`;
}

function projectLinkLabel(raw: string): string {
  try {
    const host = new URL(projectLinkHref(raw)).hostname.replace(/^www\./i, "");
    return host || raw;
  } catch {
    return raw;
  }
}

function MetaLinkRow({ href }: { href: string }) {
  const url = projectLinkHref(href);
  return (
    <div
      className="flex flex-col gap-1 py-4"
      style={{ borderBottom: "1px solid var(--border)" }}
    >
      <span className="b3" style={{ color: "var(--ink-faint)" }}>
        Link
      </span>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="b1 break-all underline-offset-2 hover:underline"
        style={{ color: "var(--accent)" }}
      >
        {projectLinkLabel(href)}
      </a>
    </div>
  );
}

function NavArrow({ slug, label }: { slug: string | null; label: string }) {
  if (!slug) {
    return (
      <span
        aria-hidden="true"
        className="project-detail-nav-arrow is-disabled"
      >
        {label}
      </span>
    );
  }
  return (
    <Link
      href={`/projects/${slug}`}
      className="project-detail-nav-arrow"
      aria-label={label === "←" ? "Önceki proje" : "Sonraki proje"}
    >
      {label}
    </Link>
  );
}
