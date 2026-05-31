import Link from "next/link";
import type { Project } from "@/types";
import { projectIntroForLocale, projectTitleForLocale } from "@/lib/project-locale";
import { projectCover, projectCoverVideo, projectGallerySlots } from "@/lib/project-images";
import type { Locale } from "@/lib/i18n/config";
import type { Messages } from "@/lib/i18n/get-messages";
import { withLocale } from "@/lib/i18n/path";
import { t } from "@/lib/i18n/t";
import { ProjectDetailMedia } from "./ProjectDetailMedia";
import { LetsTalkMarquee } from "./LetsTalkMarquee";
import { ProjectNextBanner } from "./ProjectNextBanner";

export function ProjectDetail({
  project,
  prevSlug,
  nextSlug,
  nextProject,
  allProjects,
  locale,
  messages,
}: {
  project: Project;
  prevSlug: string | null;
  nextSlug: string | null;
  nextProject: Project | null;
  allProjects: Project[];
  locale: Locale;
  messages: Messages;
}) {
  const cover = projectCover(project);
  const coverVideo = projectCoverVideo(project);
  const gallerySlots = projectGallerySlots(project);
  const title = projectTitleForLocale(project, locale);
  const intro = projectIntroForLocale(project, locale);

  return (
    <>
      <div className="project-detail-cover animate-fadeUp">
        <ProjectDetailMedia
          posterSrc={cover ?? ""}
          videoSrc={coverVideo}
          alt={title}
          priority
          variant="cover"
          placeholderLabel={project.baslik[0] ?? "•"}
          placeholderColor={project.renk}
        />
        <div className="project-detail-toolbar">
          <div className="project-detail-nav-arrows">
            <NavArrow slug={prevSlug} label="←" locale={locale} messages={messages} />
            <NavArrow slug={nextSlug} label="→" locale={locale} messages={messages} />
          </div>
        </div>
      </div>

      <div className="project-detail-body">
        <header className="project-detail-intro animate-fadeUp">
          <h1 className="h1" style={{ color: "var(--ink)" }}>
            {title}
          </h1>
          {intro ? <p className="b1 mt-6">{intro}</p> : null}
        </header>

        <aside className="project-detail-aside animate-fadeUp">
          <div className="project-detail-aside-card">
            <MetaRow label={t(messages, "project.category", "Category")} value={project.kategori} />
            {project.link?.trim() ? (
              <MetaLinkRow href={project.link.trim()} messages={messages} />
            ) : null}
            {project.etiketler?.length > 0 && (
              <div
                className="flex flex-col gap-1 py-4"
                style={{ borderTop: "1px solid var(--border)" }}
              >
                <span className="b3" style={{ color: "var(--ink-faint)" }}>
                  {t(messages, "project.tags", "Tags")}
                </span>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {project.etiketler.map((t) => (
                    <span
                      key={t}
                      className="b3 rounded-full px-2.5 py-0.5 lowercase font-medium"
                      style={{
                        background: "var(--accent-soft)",
                        color: "var(--accent)",
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>

        {gallerySlots.length > 0 && (
          <div className="project-detail-gallery-wrap animate-fadeUp">
            <div className="project-detail-gallery">
              {gallerySlots.map(({ key, posterSrc, videoSrc }) => (
                <figure key={key} className="project-detail-gallery__item">
                  <ProjectDetailMedia
                    posterSrc={posterSrc}
                    videoSrc={videoSrc}
                    alt=""
                    variant="gallery"
                  />
                </figure>
              ))}
            </div>
          </div>
        )}

        {project.bolumler && project.bolumler.length > 0 && (
          <div className="project-detail-copy animate-fadeUp">
            <div className="flex flex-col gap-8">
              {project.bolumler.map((b, i) => (
                <section key={i}>
                  {b.baslik && <h2 className="h4 mb-2 lowercase">{b.baslik}</h2>}
                  {b.metin && (
                    <p className="b1 whitespace-pre-wrap" style={{ color: "var(--b1-color)" }}>
                      {b.metin}
                    </p>
                  )}
                </section>
              ))}
            </div>
          </div>
        )}
      </div>

      {nextProject ? (
        <ProjectNextBanner
          current={project}
          nextProject={nextProject}
          allProjects={allProjects}
          locale={locale}
          messages={messages}
        />
      ) : null}

      <LetsTalkMarquee headingId="project-lets-talk-heading" />
    </>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="flex flex-col gap-1 py-4 first:pt-0 last:border-b-0"
      style={{ borderBottom: "1px solid var(--border)" }}
    >
      <span className="b3" style={{ color: "var(--ink-faint)" }}>
        {label}
      </span>
      <span className="b1" style={{ color: "var(--ink)" }}>
        {value}
      </span>
    </div>
  );
}

function projectLinkHref(raw: string): string {
  const t = raw.trim();
  if (!t) return "";
  return /^https?:\/\//i.test(t) ? t : `https://${t}`;
}

function projectLinkLabel(raw: string): string {
  try {
    const host = new URL(projectLinkHref(raw)).hostname.replace(/^www\./i, "");
    return host || raw;
  } catch {
    return raw;
  }
}

function MetaLinkRow({
  href,
  messages,
}: {
  href: string;
  messages: Messages;
}) {
  const url = projectLinkHref(href);
  return (
    <div
      className="flex flex-col gap-1 py-4"
      style={{ borderBottom: "1px solid var(--border)" }}
    >
      <span className="b3" style={{ color: "var(--ink-faint)" }}>
        {t(messages, "project.link", "Link")}
      </span>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="b1 break-all underline-offset-2 hover:underline"
        style={{ color: "var(--accent)" }}
      >
        {projectLinkLabel(href)}
      </a>
    </div>
  );
}

function NavArrow({
  slug,
  label,
  locale,
  messages,
}: {
  slug: string | null;
  label: string;
  locale: Locale;
  messages: Messages;
}) {
  if (!slug) {
    return (
      <span
        aria-hidden="true"
        className="project-detail-nav-arrow is-disabled"
      >
        {label}
      </span>
    );
  }
  return (
    <Link
      href={withLocale(`/projects/${slug}`, locale)}
      className="project-detail-nav-arrow"
      aria-label={
        label === "←"
          ? t(messages, "project.previousProject", "Previous project")
          : t(messages, "project.nextProject", "Next project")
      }
    >
      {label}
    </Link>
  );
}
