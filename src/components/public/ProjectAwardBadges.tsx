import type { Locale } from "@/lib/i18n/config";
import type { Project } from "@/types";
import {
  AWARD_STACK_ARIA,
  awardBadgeAlt,
  projectAwardsBySlug,
} from "@/lib/project-awards";

export function ProjectAwardBadges({
  project,
  locale,
}: {
  project: Project;
  locale: Locale;
}) {
  const awards = projectAwardsBySlug(project.slug, locale);
  if (awards.length === 0) return null;

  return (
    <div className="project-award-stack" aria-label={AWARD_STACK_ARIA[locale]}>
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
            alt={awardBadgeAlt(award.key, locale)}
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
