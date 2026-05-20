import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/types";
import { projectCover } from "@/lib/project-images";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";

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
            <Image
              src={cover}
              alt=""
              fill
              sizes="(max-width: 699px) 100vw, (min-width: 900px) 58vw, 90vw"
              className="object-cover object-center transition-transform duration-[400ms] group-hover:scale-[1.02]"
            />
          ) : (
            <ImagePlaceholder
              label={project.baslik[0] ?? "•"}
              color={project.renk}
              className="h-full min-h-0 w-full"
            />
          )}
        </div>
        <span className="sr-only">{project.baslik}</span>
      </Link>
    </section>
  );
}
