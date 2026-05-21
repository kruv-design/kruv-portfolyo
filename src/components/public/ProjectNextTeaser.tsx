import Link from "next/link";
import type { Project } from "@/types";
import { projectCover } from "@/lib/project-images";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { ProjectDetailImage } from "./ProjectDetailImage";

/** Proje detay altı — kısa “next” + sonraki proje kapağı. */
export function ProjectNextTeaser({ project }: { project: Project }) {
  const cover = projectCover(project);

  return (
    <section className="project-detail-next animate-fadeUp" aria-labelledby="project-next-heading">
      <p id="project-next-heading" className="b3 project-detail-next__eyebrow">
        next
      </p>
      <Link
        href={`/projects/${project.slug}`}
        className="project-detail-next__link group"
        aria-label={`Next project: ${project.baslik}`}
      >
        <div className="project-detail-next__media">
          {cover ? (
            <ProjectDetailImage
              src={cover}
              alt=""
              sizes="(max-width: 699px) 100vw, (min-width: 900px) 58vw, 90vw"
            />
          ) : (
            <ImagePlaceholder
              label={project.baslik[0] ?? "•"}
              color={project.renk}
              className="project-detail-cover__placeholder"
            />
          )}
        </div>
        <span className="sr-only">{project.baslik}</span>
      </Link>
    </section>
  );
}
