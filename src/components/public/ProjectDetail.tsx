"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import type { Project } from "@/types";
import { Lightbox } from "./Lightbox";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { projectCover, projectGallerySlots } from "@/lib/project-images";

export function ProjectDetail({
  project,
  prevSlug,
  nextSlug,
}: {
  project: Project;
  prevSlug: string | null;
  nextSlug: string | null;
}) {
  const [lightbox, setLightbox] = useState<string | null>(null);

  const cover = projectCover(project);
  const gallerySlots = projectGallerySlots(project);

  return (
    <>
      <div className="project-detail-toolbar">
        <Link href="/works" className="project-detail-back">
          ← Tüm projeler
        </Link>
        <div className="project-detail-nav-arrows">
          <NavArrow slug={prevSlug} label="←" />
          <NavArrow slug={nextSlug} label="→" />
        </div>
      </div>

      <div className="project-detail-hero">
        {cover ? (
          <Image
            src={cover}
            alt={project.baslik}
            width={1920}
            height={960}
            className="h-full w-full object-cover"
            priority
            sizes="90vw"
          />
        ) : (
          <ImagePlaceholder label={project.baslik[0] ?? "•"} color={project.renk} fontSize="5rem" />
        )}
      </div>

      <div className="project-detail-layout">
        <div className="project-detail-main animate-fadeUp">
          <div className="b3 mb-4" style={{ color: "var(--accent)" }}>
            {project.kategori}
          </div>
          <h1 className="h1 mb-7">{project.baslik}</h1>

          <div className="flex flex-col gap-8">
            {project.bolumler?.map((b, i) => (
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

          {gallerySlots.length > 0 && (
            <div className="project-detail-gallery">
              {gallerySlots.map(({ key, src }) => (
                <button
                  key={key}
                  type="button"
                  className={
                    key === "galeri_2"
                      ? "project-detail-gallery__item project-detail-gallery__item--kunya-align"
                      : "project-detail-gallery__item"
                  }
                  onClick={() => setLightbox(src)}
                >
                  <Image
                    src={src}
                    alt=""
                    width={1920}
                    height={1080}
                    sizes={
                      key === "galeri_2"
                        ? "(min-width: 900px) 28rem, 90vw"
                        : "90vw"
                    }
                    className="h-full w-full object-cover transition-transform duration-[400ms] hover:scale-[1.02]"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <aside className="project-detail-aside animate-fadeUp">
          <div className="project-detail-aside-card">
            <MetaRow label="Kategori" value={project.kategori} />
            <MetaRow label="Müşteri" value={project.musteri || "—"} />
            <MetaRow label="Yıl" value={project.yil || "—"} />
            <MetaRow label="Süre" value={project.sure || "—"} />
            {project.etiketler?.length > 0 && (
              <div className="flex flex-col gap-1 py-4" style={{ borderTop: "1px solid var(--border)" }}>
                <span className="b3" style={{ color: "var(--ink-faint)" }}>
                  Etiketler
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
      </div>

      <Lightbox src={lightbox} onClose={() => setLightbox(null)} />
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

function NavArrow({ slug, label }: { slug: string | null; label: string }) {
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
      href={`/projects/${slug}`}
      className="project-detail-nav-arrow"
      aria-label={label === "←" ? "Önceki proje" : "Sonraki proje"}
    >
      {label}
    </Link>
  );
}
