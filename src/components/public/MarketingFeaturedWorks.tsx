import Image from "next/image";
import type { Locale } from "@/lib/i18n/config";
import type { Messages } from "@/lib/i18n/get-messages";
import { withLocale } from "@/lib/i18n/path";
import {
  featuredWorkTagsFromProject,
  sortProjectsForFeatured,
} from "@/lib/featured-work-tags";
import { resolveProjectForLocale } from "@/lib/project-locale";
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
          const localized = resolveProjectForLocale(project, locale);
          const cover = projectCover(localized);
          const href = withLocale(`/projects/${project.slug}`, locale);
          const tags = featuredWorkTagsFromProject(project);
          const category = categoryLabel(localized);
          const mediaClass = cover
            ? "featured-work-media featured-work-media--photo"
            : `featured-work-media featured-work-media-${index + 1}`;

          return (
            <article
              key={project.id}
              className="featured-work-card"
              {...(tags ? { "data-work-tags": tags } : {})}
            >
              <a
                className="featured-work-hit"
                href={href}
                aria-label={`${copy.seeProject} — ${localized.baslik}`}
              />
              <div className={mediaClass} aria-hidden="true">
                {cover ? (
                  <Image
                    src={cover}
                    alt=""
                    width={0}
                    height={0}
                    sizes="(max-width: 899px) 100vw, 80vw"
                    className="featured-work-media-img"
                  />
                ) : null}
              </div>
              <div className="featured-work-meta">
                <h4 className="featured-work-title">{localized.baslik}</h4>
                {category ? (
                  <p className="featured-work-category">{category}</p>
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
