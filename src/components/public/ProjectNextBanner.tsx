import { ScrollToTopLink } from "./ScrollToTopLink";
import type { Project } from "@/types";
import { projectCover } from "@/lib/project-images";
import { projectListPosition, projectMetaSubtitle } from "@/lib/next-project";
import type { Locale } from "@/lib/i18n/config";
import type { Messages } from "@/lib/i18n/get-messages";
import { withLocale } from "@/lib/i18n/path";
import { t } from "@/lib/i18n/t";
import { ProjectDetailImage } from "./ProjectDetailImage";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";

type ProjectNextBannerProps = {
  current: Project;
  nextProject: Project;
  allProjects: Project[];
  locale: Locale;
  messages: Messages;
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
  locale,
  messages,
}: ProjectNextBannerProps) {
  const cover = projectCover(nextProject);
  const { index, total } = projectListPosition(current, allProjects);
  const progressPct = total > 0 ? Math.round((index / total) * 100) : 0;
  const meta = projectMetaSubtitle(nextProject);
  const href = withLocale(`/projects/${nextProject.slug}`, locale);
  const ariaLabel = `${t(messages, "project.nextProject", "Next project")}: ${nextProject.baslik}`;

  return (
    <section
      className="project-next-banner-wrap"
      aria-labelledby="project-next-banner-heading"
    >
      <ScrollToTopLink
        href={href}
        className="project-next-banner"
        aria-label={ariaLabel}
      >
        <div className="project-next-banner__grid">
          <div className="project-next-banner__meta">
            <p className="section-tag project-next-banner__eyebrow project-next-banner__eyebrow--desktop">
              <span aria-hidden="true">↘ </span>
              {t(messages, "project.nextProject", "Next project")}
            </p>
            <p className="b2 project-next-banner__eyebrow project-next-banner__eyebrow--mobile">
              {formatIndex(index, total)}
              <span className="project-next-banner__eyebrow-sep"> — </span>
              {t(messages, "project.nextProject", "Next project")}
            </p>

            <h2 id="project-next-banner-heading" className="card-meta-title project-next-banner__title">
              {nextProject.baslik}
            </h2>

            {meta ? (
              <p className="card-meta-category project-next-banner__subtitle">{meta}</p>
            ) : null}

            <div className="project-next-banner__progress" aria-hidden="true">
              <span className="b2 project-next-banner__progress-label">
                {formatIndex(index, total)}
              </span>
              <span className="project-next-banner__progress-track">
                <span
                  className="project-next-banner__progress-fill"
                  style={{ width: `${progressPct}%` }}
                />
              </span>
            </div>

            <span
              className="marketing-navbar-cta project-next-banner__cta-btn"
              aria-hidden="true"
            >
              {t(messages, "project.view", "View")}
              <span className="project-next-banner__cta-arrow" aria-hidden="true">
                →
              </span>
            </span>
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
          </div>
        </div>
      </ScrollToTopLink>
    </section>
  );
}
