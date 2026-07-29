"use client";

import Link from "next/link";
import type { DropFont } from "@/types";
import type { Locale } from "@/lib/i18n/config";
import { withLocale } from "@/lib/i18n/path";

type Props = {
  packSlug: string;
  fonts: DropFont[];
  activeSlug: string;
  locale: Locale;
};

export function DropPackSwitcher({ packSlug, fonts, activeSlug, locale }: Props) {
  return (
    <div className="drops-pack-switcher" role="tablist" aria-label="Fonts">
      {fonts.map((font) => {
        const active = font.slug === activeSlug;
        return (
          <Link
            key={font.id}
            href={withLocale(`/drops/${packSlug}/${font.slug}`, locale)}
            className={`drops-pack-switcher__pill${active ? " is-active" : ""}`}
            role="tab"
            aria-selected={active}
          >
            {font.name}
          </Link>
        );
      })}
    </div>
  );
}
