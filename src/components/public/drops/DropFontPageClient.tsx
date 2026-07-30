"use client";

import { useCallback, useState } from "react";
import type { DropFont, DropPackWithFonts } from "@/types";
import type { Locale } from "@/lib/i18n/config";
import type { Messages } from "@/lib/i18n/get-messages";
import type { SiteSettings } from "@/types";
import { t } from "@/lib/i18n/t";
import { DropFontFace } from "./DropFontFace";
import { dropFontFamily, normalizeDropFontText } from "@/lib/drops-font-assets";
import { DropPackSwitcher } from "./DropPackSwitcher";
import { DropFontTester } from "./DropFontTester";
import { DropSpecimenImages } from "./DropSpecimenImages";
import { DownloadModal, type DownloadRequest } from "./DownloadModal";

type Props = {
  pack: DropPackWithFonts;
  font: DropFont;
  locale: Locale;
  messages: Messages;
  settings: SiteSettings;
};

export function DropFontPageClient({
  pack,
  font,
  locale,
  messages,
  settings,
}: Props) {
  const [downloadReq, setDownloadReq] = useState<DownloadRequest | null>(null);
  const openDownload = useCallback((req: DownloadRequest) => setDownloadReq(req), []);
  const closeDownload = useCallback(() => setDownloadReq(null), []);

  const testerDefault =
    font.tester_default_text.trim() || font.preview_text.trim() || font.name;

  return (
    <div
      className={`drops-font-scope drops-font-scope--${font.slug}`}
      style={{ ["--font-drop-active" as string]: dropFontFamily(font.slug) }}
    >
      <DropFontFace slug={font.slug} previewUrl={font.font_preview_url} />

      <header className="drops-specimen-header">
        <p className="drops-specimen-header__pack">
          <span className="drops-specimen-header__pack-accent">{pack.baslik.split(" ")[0]}</span>
          {pack.baslik.includes(" ") ? (
            <span className="drops-specimen-header__pack-muted">
              {" "}
              {pack.baslik.slice(pack.baslik.indexOf(" "))}
            </span>
          ) : null}
        </p>
        <DropPackSwitcher
          packSlug={pack.slug}
          fonts={pack.fonts}
          activeSlug={font.slug}
          locale={locale}
        />
      </header>

      <section className="drops-specimen-intro">
        <div className="drops-specimen-intro__copy">
          <h1 className="drops-specimen-intro__name">
            {normalizeDropFontText(font.name, font.slug, locale)}
          </h1>
          <p className="drops-specimen-intro__desc">{font.aciklama}</p>
        </div>
        <div className="drops-specimen-intro__cta-wrap">
          <button
            type="button"
            className="drops-specimen-intro__cta"
            onClick={() =>
              openDownload({
                packSlug: pack.slug,
                fontSlug: font.slug,
                type: "font",
                label: t(messages, "drops.downloadFont"),
              })
            }
          >
            {t(messages, "drops.downloadFont")}
          </button>
          {pack.pack_zip_url ? (
            <button
              type="button"
              className="drops-specimen-intro__cta drops-specimen-intro__cta--secondary"
              onClick={() =>
                openDownload({
                  packSlug: pack.slug,
                  type: "pack",
                  label: t(messages, "drops.downloadPack"),
                })
              }
            >
              {t(messages, "drops.downloadPack")}
            </button>
          ) : null}
        </div>
      </section>

      <DropSpecimenImages
        slug={font.slug}
        variant="hero"
        locale={locale}
        blocks={font.specimen_blocks}
      />

      <DropFontTester
        fontSlug={font.slug}
        locale={locale}
        defaultText={testerDefault}
        placeholder={font.tester_placeholder || testerDefault}
        samplePhrases={
          locale === "tr"
            ? [font.preview_text, "Paylaşmaya değer markalar"]
            : [font.preview_text, "Brands worth sharing"]
        }
        labels={{
          input: t(messages, "drops.testerInput"),
          size: t(messages, "drops.testerSize"),
          decrease: t(messages, "drops.testerDecrease"),
          increase: t(messages, "drops.testerIncrease"),
        }}
      />

      <DropSpecimenImages
        slug={font.slug}
        variant="gallery"
        locale={locale}
        blocks={font.specimen_blocks}
      />

      <DownloadModal
        open={downloadReq !== null}
        request={downloadReq}
        locale={locale}
        settings={settings}
        messages={messages}
        copy={{
          eyebrow: t(messages, "drops.modalEyebrow"),
          title: t(messages, "drops.modalTitle"),
          nameLabel: t(messages, "drops.nameLabel"),
          emailLabel: t(messages, "drops.emailLabel"),
          namePlaceholder: t(messages, "drops.namePlaceholder"),
          emailPlaceholder: t(messages, "drops.emailPlaceholder"),
          submit: t(messages, "drops.downloadFont"),
          submitting: t(messages, "drops.submitting"),
          error: t(messages, "drops.submitFailed"),
          fileMissing: t(messages, "drops.fileMissing"),
        }}
        onClose={closeDownload}
      />
    </div>
  );
}
