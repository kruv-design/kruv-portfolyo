import type { Project } from "@/types";
import { projectAwardsBySlug } from "@/lib/project-awards";

export function ProjectAwardBadges({ project }: { project: Project }) {
  const awards = projectAwardsBySlug(project.slug);
  if (awards.length === 0) return null;

  return (
    <div className="project-award-stack" aria-label="Behance ödülleri">
      {awards.map((award) => (
        <span
          key={`${project.slug}-${award.key}`}
          className="project-award-item"
          tabIndex={0}
        >
          <img
            className="project-award-badge"
            src={award.badgeSrc}
            width={58}
            height={99}
            alt={`${award.key.toUpperCase()} ödül rozeti`}
            loading="lazy"
            decoding="async"
          />
          <span className="project-award-tooltip" role="tooltip">
            {award.tooltip}
          </span>
        </span>
      ))}
    </div>
  );
}

