import type { CSSProperties } from "react";
import type { Locale } from "@/lib/i18n/config";
import type { Messages } from "@/lib/i18n/get-messages";
import { withLocale } from "@/lib/i18n/path";
import {
  featuredWorkTagsFromProject,
  sortProjectsForFeatured,
} from "@/lib/featured-work-tags";
import { projectCover } from "@/lib/project-images";
import type { Project } from "@/types";

const FEATURED_COUNT = 5;

function categoryLabel(project: Project): string {
  if (project.etiketler?.length) return project.etiketler.join(", ");
  return project.kategori || "";
}

/** Anasayfa öne çıkan projeler — Supabase/CMS, sunucu tarafı. */
export function MarketingFeaturedWorks({
  projects,
  locale,
  messages,
}: {
  projects: Project[];
  locale: Locale;
  messages: Messages;
}) {
  const copy = messages.home.featuredWorks;
  const top = sortProjectsForFeatured(projects).slice(0, FEATURED_COUNT);

  return (
    <section className="scene-section">
      <div className="scene-label" lang={locale}>
        <span className="scene-section-tag">{copy.tag}</span>
        <h3 className="scene-section-title">{copy.title}</h3>
      </div>

      <div
        className="featured-works"
        id="works"
        lang={locale}
        aria-label={copy.ariaLabel}
      >
        {top.map((project, index) => {
          const cover = projectCover(project);
          const href = withLocale(`/projects/${project.slug}`, locale);
          const tags = featuredWorkTagsFromProject(project);
          const mediaClass = cover
            ? "featured-work-media"
            : `featured-work-media featured-work-media-${index + 1}`;

          const mediaStyle: CSSProperties | undefined = cover
            ? ({
                "--featured-cover": `url("${cover.replace(/"/g, '\\"')}")`,
              } as CSSProperties)
            : undefined;

          return (
            <article
              key={project.id}
              className="featured-work-card"
              {...(tags ? { "data-work-tags": tags } : {})}
            >
              <a
                className="featured-work-hit"
                href={href}
                aria-label={`${copy.seeProject} — ${project.baslik}`}
              />
              <div
                className={mediaClass}
                style={mediaStyle}
                aria-hidden="true"
              />
              <div className="featured-work-meta">
                <h4 className="featured-work-title">{project.baslik}</h4>
                {categoryLabel(project) ? (
                  <p className="featured-work-category">{categoryLabel(project)}</p>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>
      <p
        className="featured-work-cursor-hint"
        id="featuredWorkCursorHint"
        aria-hidden="true"
      >
        {copy.seeProject}
      </p>
    </section>
  );
}
