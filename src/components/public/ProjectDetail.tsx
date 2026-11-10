"use client";

import { ScrollToTopLink } from "./ScrollToTopLink";
import type { Project } from "@/types";
import { projectIntroForLocale, projectTitleForLocale } from "@/lib/project-locale";
import { ggPizzaSocialVideoSlots, projectCover, projectGallerySlots } from "@/lib/project-images";
import type { Locale } from "@/lib/i18n/config";
import type { Messages } from "@/lib/i18n/get-messages";
import { withLocale } from "@/lib/i18n/path";
import { t } from "@/lib/i18n/t";
import { useMemo, useState } from "react";
import { Lightbox, type LightboxItem } from "./Lightbox";
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
  const gallerySlots = projectGallerySlots(project);
  /** Fotoğraf portfolyosu: galeri genişliğinde, doğal oran (Figma), croplama yok. */
  const photoFit = true;
  const title = projectTitleForLocale(project, locale);
  const intro = projectIntroForLocale(project, locale);
  const cmsVideoSlots = gallerySlots.filter((s) => s.videoSrc);
  const imageSlots = gallerySlots.filter((s) => !s.videoSrc);
  const socialVideos =
    project.slug === "gg-pizza" ? ggPizzaSocialVideoSlots() : [];
  const videoSlots =
    socialVideos.length > 0
      ? socialVideos
      : cmsVideoSlots.map((s) => ({
          key: s.key,
          posterSrc: s.posterSrc,
          videoSrc: s.videoSrc!,
        }));
  const showVideoGrid = videoSlots.length >= 2;
  /**
   * GG Pizza: eski “OUR SOCIAL MEDIA VIDEOS” kolajı (galeri 1) kalkar;
   * hospitality tarzı 4’lü video grid + kalan görseller.
   */
  const galleryForList = socialVideos.length > 0
    ? imageSlots.slice(1)
    : showVideoGrid
      ? imageSlots
      : gallerySlots;

  const lightboxItems: LightboxItem[] = useMemo(() => {
    const items: LightboxItem[] = [];
    if (cover) {
      items.push({ src: cover, alt: title });
    }
    for (const slot of galleryForList) {
      if (!slot.posterSrc) continue;
      // cover ile aynı URL ise tekrar etme
      if (cover && slot.posterSrc === cover) continue;
      items.push({
        src: slot.posterSrc,
        alt: `${title} — ${slot.key}`,
      });
    }
    return items;
  }, [cover, galleryForList, title]);

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightboxAt = (src: string) => {
    const i = lightboxItems.findIndex((item) => item.src === src);
    if (i >= 0) setLightboxIndex(i);
  };

  return (
    <>
      <div className="project-detail-cover animate-fadeUp">
        <ProjectDetailMedia
          posterSrc={cover ?? ""}
          videoSrc={null}
          alt={title}
          priority
          variant="cover"
          photoFit={photoFit}
          placeholderLabel={project.baslik[0] ?? "•"}
          placeholderColor={project.renk}
          onLightboxOpen={cover ? () => openLightboxAt(cover) : undefined}
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
                      className="b3 rounded-full px-2.5 py-0.5 font-medium"
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

        {(showVideoGrid || galleryForList.length > 0) && (
          <div className="project-detail-gallery-wrap animate-fadeUp">
            {showVideoGrid ? (
              <div
                className={`project-detail-video-pair${
                  videoSlots.length >= 4
                    ? " project-detail-video-pair--quad"
                    : videoSlots.length >= 3
                      ? " project-detail-video-pair--grid"
                      : ""
                }`}
                role="group"
                aria-label={`${title} — videolar`}
              >
                {videoSlots.map((slot, i) => (
                  <figure key={slot.key} className="project-detail-video-pair__item">
                    <ProjectDetailMedia
                      posterSrc={slot.posterSrc}
                      videoSrc={slot.videoSrc}
                      alt={`${title} — video ${i + 1}`}
                      variant="gallery"
                    />
                  </figure>
                ))}
              </div>
            ) : null}
            {galleryForList.length > 0 ? (
              <div className="project-detail-gallery">
                {galleryForList.map(({ key, posterSrc, videoSrc }, i) => (
                  <figure key={key} className="project-detail-gallery__item">
                    <ProjectDetailMedia
                      posterSrc={posterSrc}
                      videoSrc={videoSrc}
                      alt={`${title} — galeri görseli ${i + 1}`}
                      variant="gallery"
                      photoFit={photoFit}
                      onLightboxOpen={
                        posterSrc && !videoSrc
                          ? () => openLightboxAt(posterSrc)
                          : undefined
                      }
                    />
                  </figure>
                ))}
              </div>
            ) : null}
          </div>
        )}

        {project.bolumler && project.bolumler.length > 0 && (
          <div className="project-detail-copy animate-fadeUp">
            <div className="flex flex-col gap-8">
              {project.bolumler.map((b, i) => (
                <section key={i}>
                  {b.baslik && <h2 className="h4 mb-2">{b.baslik}</h2>}
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

      <LetsTalkMarquee
        locale={locale}
        messages={messages}
        headingId="project-lets-talk-heading"
      />

      <Lightbox
        items={lightboxItems}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onChangeIndex={setLightboxIndex}
        closeLabel={t(messages, "project.lightboxClose", "Kapat")}
        prevLabel={t(messages, "project.lightboxPrev", "Önceki görsel")}
        nextLabel={t(messages, "project.lightboxNext", "Sonraki görsel")}
      />
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
    <ScrollToTopLink
      href={withLocale(`/projects/${slug}`, locale)}
      className="project-detail-nav-arrow"
      aria-label={
        label === "←"
          ? t(messages, "project.previousProject", "Previous project")
          : t(messages, "project.nextProject", "Next project")
      }
    >
      {label}
    </ScrollToTopLink>
  );
}
