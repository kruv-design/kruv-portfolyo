"use client";

import { useCallback, useEffect, useState } from "react";
import { track } from "@/lib/analytics/track";
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

const LOCAL_TESTER_DEFAULT =
  "A tribute to the designer's handwriting. Tasarımcının defterinden geldi, kusurlu kalsın. Samimi, ours — still from the hand.";

const LOCAL_TESTER_SAMPLES = [
  "a tribute to el yazısı",
  "kusurlu, samimi, ours",
  "from the hand, defterden",
];

const COVE_TESTER_DEFAULT =
  "Born from pebbles, held by denge. Doğa sakin, form soft. Simple and cool — a quiet balance.";

const COVE_TESTER_SAMPLES = [
  "doğa ve denge",
  "born from pebbles, still cool",
  "sakin form, in balance",
];

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

  useEffect(() => {
    track("drop_font_view", { pack: pack.slug, font: font.slug, source: "detail" });
  }, [pack.slug, font.slug]);

  const testerDefault =
    font.slug === "local"
      ? LOCAL_TESTER_DEFAULT
      : font.slug === "cove"
        ? COVE_TESTER_DEFAULT
        : font.tester_default_text.trim() || font.preview_text.trim() || font.name;

  const testerSamples =
    font.slug === "local"
      ? LOCAL_TESTER_SAMPLES
      : font.slug === "cove"
        ? COVE_TESTER_SAMPLES
        : locale === "tr"
          ? [font.preview_text, "Paylaşmaya değer markalar"]
          : [font.preview_text, "Brands worth sharing"];

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
            onClick={() => {
              track("drop_download_open", {
                pack: pack.slug,
                font: font.slug,
                source: "detail",
                action: "download",
              });
              openDownload({
                packSlug: pack.slug,
                fontSlug: font.slug,
                type: "font",
                label: t(messages, "drops.downloadFont"),
                source: "detail",
              });
            }}
          >
            {t(messages, "drops.downloadFont")}
          </button>
          {pack.pack_zip_url ? (
            <button
              type="button"
              className="drops-specimen-intro__cta drops-specimen-intro__cta--secondary"
              onClick={() => {
                track("drop_download_open", {
                  pack: pack.slug,
                  font: font.slug,
                  source: "detail",
                  action: "pack",
                });
                openDownload({
                  packSlug: pack.slug,
                  type: "pack",
                  label: t(messages, "drops.downloadPack"),
                  source: "detail",
                });
              }}
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
        samplePhrases={testerSamples}
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
