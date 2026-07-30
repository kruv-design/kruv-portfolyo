"use client";

import Link from "next/link";
import type { DropFont } from "@/types";
import type { Locale } from "@/lib/i18n/config";
import { withLocale } from "@/lib/i18n/path";
import { publicCldImageUrl } from "@/lib/cld-public";
import { dropFontFamily } from "@/lib/drops-font-assets";
import { dropHeroImage } from "@/lib/drops-hero-assets";
import { DropFontFace } from "./DropFontFace";

type Props = {
  packSlug: string;
  font: DropFont;
  locale: Locale;
  previewText: string;
  labels: {
    download: string;
    details: string;
  };
  onDownload: () => void;
};

function resolveHeroUrl(font: DropFont): string {
  const fallback = dropHeroImage(font.slug);
  if (!font.hero_image) return fallback;
  if (font.hero_image.startsWith("/")) return font.hero_image;
  if (font.hero_image.startsWith("http")) {
    if (font.hero_image.includes("unsplash.com") && fallback) return fallback;
    return font.hero_image;
  }
  const cld = publicCldImageUrl(font.hero_image, { w: 1600, h: 900, crop: "fill" });
  return cld || fallback;
}

export function DropFontCard({
  packSlug,
  font,
  locale,
  previewText,
  labels,
  onDownload,
}: Props) {
  const hero = resolveHeroUrl(font);
  const detailHref = withLocale(`/drops/${packSlug}/${font.slug}`, locale);

  return (
    <article
      className={`drops-font-card drops-font-card--${font.slug}`}
      style={{ ["--font-drop-active" as string]: dropFontFamily(font.slug) }}
    >
      {font.font_preview_url ? (
        <DropFontFace slug={font.slug} previewUrl={font.font_preview_url} />
      ) : null}
      <div
        className="drops-font-card__media"
        style={hero ? { backgroundImage: `url(${hero})` } : undefined}
      >
        <Link
          href={detailHref}
          className="drops-font-card__hit"
          aria-label={`${font.name} — ${labels.details}`}
        />
        <div className="drops-font-card__overlay" aria-hidden />
        <p
          className={`drops-font-card__preview drops-drop-type drops-font-card__preview--${font.slug}`}
          style={{ fontFamily: dropFontFamily(font.slug) }}
        >
          {previewText}
        </p>
        <div className="drops-font-card__actions">
          <button
            type="button"
            className="drops-font-card__btn drops-font-card__btn--ghost"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDownload();
            }}
          >
            {labels.download}
          </button>
          <span className="drops-font-card__btn drops-font-card__btn--primary" aria-hidden>
            {labels.details}
          </span>
        </div>
      </div>
    </article>
  );
}
