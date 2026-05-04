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
      <header
        className="flex items-center justify-between gap-4 px-[4vw] py-7"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <Link
          href="/works"
          className="b2 inline-flex items-center gap-2 rounded-full px-4 py-1.5 transition-colors"
          style={{
            border: "1px solid var(--border)",
            color: "var(--b2-color)",
          }}
        >
          ← Tüm projeler
        </Link>
        <div className="flex items-center gap-2">
          <NavArrow slug={prevSlug} label="←" />
          <NavArrow slug={nextSlug} label="→" />
        </div>
      </header>

      <div
        className="w-full overflow-hidden"
        style={{
          aspectRatio: "16 / 7",
          background: "var(--surface)",
        }}
      >
        {project.gorsel ? (
          <Image
            src={project.gorsel}
            alt={project.baslik}
            width={1920}
            height={840}
            className="h-full w-full object-cover"
            priority
          />
        ) : (
          <ImagePlaceholder label={project.baslik[0] ?? "•"} color={project.renk} fontSize="5rem" />
        )}
      </div>

      <div
        className="mx-auto grid max-w-[1200px] gap-20 px-[4vw] pb-20 pt-16 md:grid-cols-[1fr_340px]"
      >
        <div className="animate-fadeUp">
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
                {b.baslik && (
                  <h2 className="h4 mb-2 normal-case">{b.baslik}</h2>
                )}
                {b.metin && (
                  <p className="b1 whitespace-pre-wrap" style={{ color: "var(--b1-color)" }}>
                    {b.metin}
                  </p>
                )}
              </section>
            ))}
          </div>

          {gallery.length > 0 && (
            <div
              className="mt-12 grid gap-[3px]"
              style={{
                gridTemplateColumns:
                  "repeat(auto-fill, minmax(240px, 1fr))",
              }}
            >
              {gallery.map((src, i) => (
                <button
                  key={src + i}
                  type="button"
                  className="overflow-hidden"
                  style={{ aspectRatio: "4 / 3", cursor: "zoom-in" }}
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

        <aside className="animate-fadeUp">
          <div
            className="sticky top-8 rounded-lg p-8"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
            }}
          >
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
                      className="rounded-full px-2.5 py-0.5 b3 normal-case font-medium"
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
  const base =
    "flex h-9 w-9 items-center justify-center rounded-full text-base transition-colors";
  if (!slug) {
    return (
      <span
        aria-hidden="true"
        className={base}
        style={{
          border: "1px solid var(--border)",
          color: "var(--ink-soft)",
          opacity: 0.3,
          pointerEvents: "none",
        }}
      >
        {label}
      </span>
    );
  }
  return (
    <Link
      href={`/projects/${slug}`}
      className={base}
      style={{
        border: "1px solid var(--border)",
        color: "var(--ink-soft)",
      }}
      aria-label={label === "←" ? "Önceki proje" : "Sonraki proje"}
    >
      {label}
    </Link>
  );
}
