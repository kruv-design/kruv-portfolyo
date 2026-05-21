import Link from "next/link";
import type { Project } from "@/types";
import { projectCover } from "@/lib/project-images";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { ProjectDetailImage } from "./ProjectDetailImage";

type ProjectEndCtaProps = {
  nextProject: Project | null;
  contactHref?: string;
  worksHref?: string;
};

function projectCategoryLabel(project: Project): string | null {
  if (project.etiketler?.length) {
    return project.etiketler.join(", ");
  }
  return project.kategori?.trim() || null;
}

/** Proje detay sonu — sol contact, sağ next/works, altta tüm projeler linki. */
export function ProjectEndCta({
  nextProject,
  contactHref = "/contact",
  worksHref = "/works",
}: ProjectEndCtaProps) {
  const navEyebrowId = "project-end-nav-heading";

  return (
    <section
      className="project-end-cta"
      aria-labelledby="project-end-contact-heading"
    >
      <div className="project-end-cta__grid">
        <div className="project-end-cta__col project-end-cta__col--contact">
          <h2 id="project-end-contact-heading" className="h3 project-end-cta__contact-heading">
            Got an idea worth building?
          </h2>
          <Link href={contactHref} className="btn btn-fill">
            Contact us
          </Link>
        </div>

        <div className="project-end-cta__col project-end-cta__col--nav">
          <p id={navEyebrowId} className="b3 project-end-cta__nav-eyebrow">
            {nextProject ? "next" : "all work"}
          </p>
          {nextProject ? (
            <ProjectEndNextCard
              project={nextProject}
              labelledBy={navEyebrowId}
            />
          ) : (
            <ProjectEndWorksCard href={worksHref} labelledBy={navEyebrowId} />
          )}
        </div>
      </div>

      <footer className="project-end-cta__footer">
        <Link href={worksHref} className="btn btn-line project-end-cta__all">
          See all our projects
        </Link>
      </footer>
    </section>
  );
}

function ProjectEndNextCard({
  project,
  labelledBy,
}: {
  project: Project;
  labelledBy: string;
}) {
  const cover = projectCover(project);
  const categoryLabel = projectCategoryLabel(project);

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="project-end-cta__next-card group"
      aria-labelledby={labelledBy}
      aria-label={`Next project: ${project.baslik}`}
    >
      <div className="project-end-cta__next-media">
        {cover ? (
          <ProjectDetailImage src={cover} alt="" variant="cover" sizes="(max-width: 767px) 80vw, 50vw" />
        ) : (
          <ImagePlaceholder
            label={project.baslik[0] ?? "•"}
            color={project.renk}
            className="project-detail-cover__placeholder"
          />
        )}
      </div>
      <div className="project-end-cta__next-meta">
        <h3 className="pw-card-title">{project.baslik}</h3>
        {categoryLabel ? <p className="pw-card-category">{categoryLabel}</p> : null}
      </div>
    </Link>
  );
}

function ProjectEndWorksCard({
  href,
  labelledBy,
}: {
  href: string;
  labelledBy: string;
}) {
  return (
    <Link
      href={href}
      className="project-end-cta__works-card group"
      aria-labelledby={labelledBy}
    >
      <div className="project-end-cta__works-inner">
        <h3 className="pw-card-title">View all work</h3>
        <p className="pw-card-category">Explore the full portfolio</p>
      </div>
    </Link>
  );
}
