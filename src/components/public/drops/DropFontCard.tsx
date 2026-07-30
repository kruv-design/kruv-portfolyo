"use client";

import Link from "next/link";
import type { DropFont } from "@/types";
import type { Locale } from "@/lib/i18n/config";
import { withLocale } from "@/lib/i18n/path";
import { publicCldImageUrlBest } from "@/lib/cld-public";
import { resolveDropCardHeroPublicId } from "@/lib/drops-card-hero-assets";
import { resolveDropImageUrl } from "@/lib/drops-specimen-assets";

type Props = {
  packSlug: string;
  font: DropFont;
  locale: Locale;
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
  return publicCldImageUrlBest(publicId) || resolveDropImageUrl(publicId);
}

export function DropFontCard({
  packSlug,
  font,
  locale,
  labels,
  onDownload,
}: Props) {
  const hero = resolveHeroUrl(font);
  const detailHref = withLocale(`/drops/${packSlug}/${font.slug}`, locale);

  return (
    <article className={`drops-font-card drops-font-card--${font.slug}`}>
      <Link
        href={detailHref}
        className="drops-font-card__media"
        style={hero ? { backgroundImage: `url(${hero})` } : undefined}
        aria-label={`${font.name} — ${labels.details}`}
      />

      <div className="drops-font-card__footer">
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
    </article>
  );
}
