"use client";

import { useCallback, useState } from "react";
import type { DropPackWithFonts } from "@/types";
import type { Locale } from "@/lib/i18n/config";
import type { Messages } from "@/lib/i18n/get-messages";
import type { SiteSettings } from "@/types";
import { t } from "@/lib/i18n/t";
import { KruvStarIcon } from "@/components/public/KruvStarIcon";
import { DropFontCard } from "./DropFontCard";
import { DownloadModal, type DownloadRequest } from "./DownloadModal";

type Props = {
  packs: DropPackWithFonts[];
  locale: Locale;
  messages: Messages;
  settings: SiteSettings;
};

export function DropsIndexClient({ packs, locale, messages, settings }: Props) {
  const [downloadReq, setDownloadReq] = useState<DownloadRequest | null>(null);

  const openDownload = useCallback((req: DownloadRequest) => {
    setDownloadReq(req);
  }, []);

  const closeDownload = useCallback(() => setDownloadReq(null), []);

  return (
    <>
      <header className="drops-hero">
        <div className="drops-hero__row">
          <h1 className="drops-hero__title">{t(messages, "drops.title")}</h1>
          <p className="drops-hero__lead">{t(messages, "drops.lead")}</p>
        </div>
        <div className="drops-hero__scroll" aria-hidden>
          <span className="drops-hero__scroll-icon">↓</span>
        </div>
      </header>

      {packs.map((pack) => (
        <section key={pack.id} className="drops-pack-section">
          <p className="drops-pack-section__tag section-tag">
            <KruvStarIcon className="drops-pack-section__tag-icon" size={24} />
            <span>{pack.baslik}</span>
          </p>
          <div className="drops-pack-section__cards">
            {pack.fonts.map((font) => (
              <DropFontCard
                key={font.id}
                packSlug={pack.slug}
                font={font}
                locale={locale}
                labels={{
                  download: t(messages, "drops.downloadFont"),
                  details: t(messages, "drops.viewDetails"),
                }}
                onDownload={() =>
                  openDownload({
                    packSlug: pack.slug,
                    fontSlug: font.slug,
                    type: "font",
                    label: t(messages, "drops.downloadFont"),
                  })
                }
              />
            ))}
          </div>
        </section>
      ))}

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
    </>
  );
}
