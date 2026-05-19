import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/types";
import { projectCover } from "@/lib/project-images";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";

/**
 * Homepage `featured-work-*` kartları ile aynı yapı: görsel üstte, meta altta (hover overlay yok).
 */
export function PortfolioCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const cover = projectCover(project);
  const categoryLabel =
    project.etiketler?.length > 0
      ? project.etiketler.join(", ")
      : project.kategori;

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="pw-card group"
      style={{ animationDelay: `${index * 0.055}s` }}
      aria-label={project.baslik}
    >
      <div className="pw-card-media">
        {cover ? (
          <div className="pw-card-media-crop">
            <Image
              src={cover}
              alt={project.baslik}
              fill
              sizes="(max-width: 699px) 100vw, 50vw"
              className="pw-card-media-img object-cover object-center"
              placeholder="empty"
              priority={index < 2}
            />
          </div>
        ) : (
          <div className="pw-card-media-crop">
            <ImagePlaceholder
              label={String(index + 1).padStart(2, "0")}
              color={project.renk}
              className="h-full min-h-0 w-full"
            />
          </div>
        )}
      </div>
      <div className="pw-card-meta">
        <h2 className="pw-card-title">{project.baslik}</h2>
        {categoryLabel ? <p className="pw-card-category">{categoryLabel}</p> : null}
      </div>
    </Link>
  );
}
