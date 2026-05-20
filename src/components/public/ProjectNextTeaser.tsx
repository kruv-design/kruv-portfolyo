import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/types";
import { projectCover } from "@/lib/project-images";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";

export function ProjectNextTeaser({ project }: { project: Project }) {
  const cover = projectCover(project);
  const categoryLabel =
    project.etiketler?.length > 0
      ? project.etiketler.join(", ")
      : project.kategori;

  return (
    <section className="project-detail-next animate-fadeUp" aria-labelledby="project-next-heading">
      <p id="project-next-heading" className="b3 project-detail-next__eyebrow">
        Sonraki proje
      </p>
      <Link
        href={`/projects/${project.slug}`}
        className="project-detail-next__link group"
        aria-label={`Sonraki proje: ${project.baslik}`}
      >
        <div className="project-detail-next__media">
          {cover ? (
            <Image
              src={cover}
              alt=""
              width={1920}
              height={1080}
              sizes="(min-width: 900px) 58vw, 90vw"
              className="h-full w-full object-cover transition-transform duration-[400ms] group-hover:scale-[1.02]"
            />
          ) : (
            <ImagePlaceholder
              label={project.baslik[0] ?? "•"}
              color={project.renk}
              className="h-full min-h-0 w-full"
            />
          )}
        </div>
        <div className="project-detail-next__meta">
          <span className="project-detail-next__arrow" aria-hidden="true">
            →
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="h3 project-detail-next__title">{project.baslik}</h2>
            {categoryLabel ? (
              <p className="b2 project-detail-next__category">{categoryLabel}</p>
            ) : null}
          </div>
        </div>
      </Link>
    </section>
  );
}
