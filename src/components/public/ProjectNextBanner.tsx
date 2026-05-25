import Link from "next/link";
import type { Project } from "@/types";
import { projectCover } from "@/lib/project-images";
import { projectListPosition, projectMetaSubtitle } from "@/lib/next-project";
import { ProjectDetailImage } from "./ProjectDetailImage";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";

type ProjectNextBannerProps = {
  current: Project;
  nextProject: Project;
  allProjects: Project[];
};

function formatIndex(index: number, total: number): string {
  const pad = String(total).length;
  return `${String(index).padStart(pad, "0")} / ${total}`;
}

/** Proje detay sonu — tek odaklı sonraki proje banner'ı (footer öncesi). */
export function ProjectNextBanner({
  current,
  nextProject,
  allProjects,
}: ProjectNextBannerProps) {
  const cover = projectCover(nextProject);
  const { index, total } = projectListPosition(current, allProjects);
  const progressPct = total > 0 ? Math.round((index / total) * 100) : 0;
  const meta = projectMetaSubtitle(nextProject);
  const href = `/projects/${nextProject.slug}`;
  const ariaLabel = `Sonraki projeye git: ${nextProject.baslik}`;

  return (
    <section
      className="project-next-banner-wrap"
      aria-labelledby="project-next-banner-heading"
    >
      <Link href={href} className="project-next-banner" aria-label={ariaLabel}>
        <div className="project-next-banner__grid">
          <div className="project-next-banner__meta">
            <p className="project-next-banner__eyebrow project-next-banner__eyebrow--desktop">
              <span aria-hidden="true">↘ </span>
              Sonraki proje
            </p>
            <p className="project-next-banner__eyebrow project-next-banner__eyebrow--mobile">
              {formatIndex(index, total)}
              <span className="project-next-banner__eyebrow-sep"> — </span>
              Sonraki proje
            </p>

            <h2 id="project-next-banner-heading" className="project-next-banner__title">
              {nextProject.baslik}
            </h2>

            {meta ? (
              <p className="b2 project-next-banner__subtitle">{meta}</p>
            ) : null}

            <div className="project-next-banner__progress" aria-hidden="true">
              <span className="project-next-banner__progress-label">
                {formatIndex(index, total)}
              </span>
              <span className="project-next-banner__progress-track">
                <span
                  className="project-next-banner__progress-fill"
                  style={{ width: `${progressPct}%` }}
                />
              </span>
            </div>

            <p className="project-next-banner__cta project-next-banner__cta--desktop">
              <span>Görüntüle</span>
              <span className="project-next-banner__cta-arrow" aria-hidden="true">
                →
              </span>
            </p>

            <div className="project-next-banner__cta-row project-next-banner__cta-row--mobile">
              <span>Projeyi gör</span>
              <span className="project-next-banner__cta-arrow" aria-hidden="true">
                →
              </span>
            </div>

            <p className="project-next-banner__scroll-hint" aria-hidden="true">
              ↑ Yukarı kaydır
            </p>
          </div>

          <div className="project-next-banner__media">
            {cover ? (
              <ProjectDetailImage
                src={cover}
                alt={nextProject.baslik}
                variant="cover"
                sizes="(max-width: 767px) 100vw, 55vw"
              />
            ) : (
              <ImagePlaceholder
                label={nextProject.baslik[0] ?? "•"}
                color={nextProject.renk}
                className="project-next-banner__placeholder"
              />
            )}
            <span className="project-next-banner__badge" aria-hidden="true">
              Sonraki →
            </span>
          </div>
        </div>
      </Link>
    </section>
  );
}
