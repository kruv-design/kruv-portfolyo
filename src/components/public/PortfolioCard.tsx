"use client";

import Link from "next/link";
import Image from "next/image";
import type { Locale } from "@/lib/i18n/config";
import { withLocale } from "@/lib/i18n/path";
import { track } from "@/lib/analytics/track";
import type { Project } from "@/types";
import { projectCover } from "@/lib/project-images";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { ProjectAwardBadges } from "./ProjectAwardBadges";

/**
 * Homepage `featured-work-*` kartları ile aynı yapı: görsel üstte, meta altta (hover overlay yok).
 * Kapak görseli kendi en-boy oranında — sabit kutu + cover kırpma yok.
 */
export function PortfolioCard({
  project,
  index,
  locale,
}: {
  project: Project;
  index: number;
  locale: Locale;
}) {
  const cover = projectCover(project);
  const categoryLabel =
    project.etiketler?.length > 0
      ? project.etiketler.join(", ")
      : project.kategori;

  return (
    <Link
      href={withLocale(`/projects/${project.slug}`, locale)}
      className="pw-card group"
      style={{ animationDelay: `${index * 0.055}s` }}
      aria-label={project.baslik}
      onClick={() => track("project_click", { slug: project.slug })}
    >
      <ProjectAwardBadges project={project} locale={locale} />
      <div className="pw-card-media">
        {cover ? (
          <Image
            src={cover}
            alt={project.baslik}
            width={0}
            height={0}
            sizes="(max-width: 639px) 100vw, (max-width: 899px) 50vw, 33vw"
            className="pw-card-media-img"
            placeholder="empty"
            priority={index < 2}
          />
        ) : (
          <ImagePlaceholder
            label={String(index + 1).padStart(2, "0")}
            color={project.renk}
            className="pw-card-media-placeholder"
          />
        )}
      </div>
      <div className="pw-card-meta">
        <h2 className="pw-card-title">{project.baslik}</h2>
        {categoryLabel ? <p className="pw-card-category">{categoryLabel}</p> : null}
      </div>
    </Link>
  );
}
