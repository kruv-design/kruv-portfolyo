"use client";

import Link from "next/link";
import type { DropFont } from "@/types";
import type { Locale } from "@/lib/i18n/config";
import { withLocale } from "@/lib/i18n/path";
import { resolveDropCardHeroPublicId } from "@/lib/drops-card-hero-assets";
import { publicCldCardImageSrcSet, publicCldCardImageUrl } from "@/lib/cld-public";
import { dropFontFamily, normalizeDropFontText } from "@/lib/drops-font-assets";
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
  const publicId = resolveDropCardHeroPublicId(font);
  if (!publicId) return "";
  if (publicId.startsWith("http")) return publicId;
  if (publicId.startsWith("/")) return publicId;
  return publicCldCardImageUrl(publicId);
}

function resolveHeroSrcSet(font: DropFont): string {
  const publicId = resolveDropCardHeroPublicId(font);
  if (!publicId || publicId.startsWith("http") || publicId.startsWith("/")) return "";
  return publicCldCardImageSrcSet(publicId);
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
  const heroSrcSet = resolveHeroSrcSet(font);
  const detailHref = withLocale(`/drops/${packSlug}/${font.slug}`, locale);
  const previewLines = normalizeDropFontText(previewText, font.slug, locale)
    .split(/\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <article
      className={`drops-font-card drops-font-card--${font.slug}`}
      style={{ ["--font-drop-active" as string]: dropFontFamily(font.slug) }}
    >
      {font.font_preview_url ? (
        <DropFontFace slug={font.slug} previewUrl={font.font_preview_url} />
      ) : null}

      <div className="drops-font-card__media">
        {hero ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className="drops-font-card__bg"
            src={hero}
            srcSet={heroSrcSet || undefined}
            alt=""
            aria-hidden
            decoding="async"
          />
        ) : null}
        <Link href={detailHref} className="drops-font-card__hit" aria-label={`${font.name} — ${labels.details}`} />
        <div className="drops-font-card__overlay" aria-hidden />
        <div
          className={`drops-font-card__preview drops-drop-type drops-font-card__preview--${font.slug}`}
          style={{ fontFamily: dropFontFamily(font.slug) }}
        >
          {previewLines.map((line, index) => (
            <p key={`${font.slug}-preview-${index}`} className="drops-font-card__preview-line">
              {line}
            </p>
          ))}
        </div>
        <div className="drops-font-card__actions">
          <button
            type="button"
            className="drops-font-card__btn drops-font-card__btn--ghost"
            onClick={onDownload}
          >
            {labels.download}
          </button>
          <Link href={detailHref} className="drops-font-card__btn drops-font-card__btn--primary">
            {labels.details}
          </Link>
        </div>
      </div>
    </article>
  );
}
