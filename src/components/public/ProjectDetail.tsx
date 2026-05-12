"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import type { Project } from "@/types";
import { Lightbox } from "./Lightbox";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";

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

  const gallery = (project.gorseller || []).filter(Boolean);

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
        {project.gorsel ? (
          <Image
            src={project.gorsel}
            alt={project.baslik}
            width={1920}
            height={960}
            className="h-full w-full object-cover"
            priority
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
          {project.aciklama && (
            <p
              className="b1 mb-10 pl-5"
              style={{
                color: "var(--b1-color)",
                borderLeft: "2px solid var(--accent)",
              }}
            >
              {project.aciklama}
            </p>
          )}

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

          {gallery.length > 0 && (
            <div className="project-detail-gallery">
              {gallery.map((src, i) => (
                <button
                  key={src + i}
                  type="button"
                  onClick={() => setLightbox(src)}
                >
                  <Image
                    src={src}
                    alt=""
                    width={600}
                    height={450}
                    className="h-full w-full object-cover transition-transform duration-[400ms] hover:scale-[1.04]"
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
            <MetaRow label="Rol" value={project.rol || "—"} />
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
