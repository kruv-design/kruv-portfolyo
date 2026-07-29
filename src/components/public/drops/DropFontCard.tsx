"use client";

import Link from "next/link";
import type { DropFont } from "@/types";
import type { Locale } from "@/lib/i18n/config";
import { withLocale } from "@/lib/i18n/path";
import { publicCldImageUrl } from "@/lib/cld-public";
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

export function DropFontCard({
  packSlug,
  font,
  locale,
  previewText,
  labels,
  onDownload,
}: Props) {
  const hero = font.hero_image.startsWith("http")
    ? font.hero_image
    : font.hero_image
      ? publicCldImageUrl(font.hero_image, { w: 1600, h: 900, crop: "fill" })
      : "";

  return (
    <article className="drops-font-card">
      {font.font_preview_url ? (
        <DropFontFace slug={font.slug} previewUrl={font.font_preview_url} />
      ) : null}
      <div
        className="drops-font-card__media"
        style={hero ? { backgroundImage: `url(${hero})` } : undefined}
      >
        <div className="drops-font-card__overlay" aria-hidden />
        <p className="drops-font-card__preview drops-drop-type">{previewText}</p>
        <div className="drops-font-card__actions">
          <button type="button" className="drops-font-card__btn drops-font-card__btn--ghost" onClick={onDownload}>
            {labels.download}
          </button>
          <Link
            href={withLocale(`/drops/${packSlug}/${font.slug}`, locale)}
            className="drops-font-card__btn drops-font-card__btn--primary"
          >
            {labels.details}
          </Link>
        </div>
      </div>
    </article>
  );
}
