"use client";

import { useState } from "react";
import type { ProtelBrand, ProtelSocialAccount } from "@/types";
import { ProtelSectionHeading } from "./ProtelSectionHeading";
import { ProtelVideoEmbed } from "./ProtelVideoEmbed";

function isInstagramAccount(account: ProtelSocialAccount): boolean {
  return (
    account.platform.trim().toLowerCase() === "instagram" &&
    Boolean(account.url.trim())
  );
}

function instagramVisitLabel(brandName: string) {
  return `${brandName} instagramını ziyaret et`;
}

function ProtelInstagramIcon() {
  return (
    <svg
      className="protel-clients__instagram-icon"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.5 3h9A4.5 4.5 0 0 1 21 7.5v9a4.5 4.5 0 0 1-4.5 4.5h-9A4.5 4.5 0 0 1 3 16.5v-9A4.5 4.5 0 0 1 7.5 3Zm0 2A2.5 2.5 0 0 0 5 7.5v9A2.5 2.5 0 0 0 7.5 19h9a2.5 2.5 0 0 0 2.5-2.5v-9A2.5 2.5 0 0 0 16.5 5h-9Zm9.75 1.25a1 1 0 1 1 0 2 1 1 0 0 1 0-2ZM12 8.5A3.5 3.5 0 1 1 8.5 12 3.5 3.5 0 0 1 12 8.5Z"
      />
    </svg>
  );
}

export function ProtelClientPanel({ brands }: { brands: ProtelBrand[] }) {
  const [activeId, setActiveId] = useState(brands[0]?.id ?? "");

  const active = brands.find((b) => b.id === activeId) ?? brands[0];
  if (!active) {
    return <p className="protel-pitch__empty">Marka bulunamadı.</p>;
  }

  const instagramAccounts = active.socialAccounts.filter(isInstagramAccount);

  const videos = [
    {
      title: active.video1Title || `${active.name} — Video 1`,
      videoUrl: active.video1Url,
      aspectRatio: active.video1Aspect,
    },
    {
      title: active.video2Title || `${active.name} — Video 2`,
      videoUrl: active.video2Url,
      aspectRatio: active.video2Aspect,
    },
  ];

  return (
    <section className="protel-section protel-section--clients" aria-labelledby="protel-clients">
      <ProtelSectionHeading
        label="AKTİF OLARAK YÖNETTİĞİMİZ SOSYAL MEDYA HESAPLARIMIZ"
      />

      <div className="protel-clients">
        <div
          id="protel-clients"
          className="protel-clients__picker"
          role="tablist"
          aria-label="Müşteriler"
        >
          {brands.map((brand) => {
            const selected = brand.id === active.id;
            return (
              <button
                key={brand.id}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls={`protel-clients-panel-${brand.id}`}
                className={`protel-clients__btn${selected ? " is-active" : ""}`}
                onClick={() => setActiveId(brand.id)}
              >
                {brand.name}
              </button>
            );
          })}
        </div>

        {instagramAccounts.length > 0 ? (
          <div
            id={`protel-clients-panel-${active.id}`}
            className="protel-clients__socials"
            role="tabpanel"
            aria-label={`${active.name} Instagram hesapları`}
          >
            {instagramAccounts.map((account) => (
              <a
                key={account.url}
                href={account.url.trim()}
                target="_blank"
                rel="noopener noreferrer"
                className="protel-clients__instagram-link"
              >
                <ProtelInstagramIcon />
                <span>{instagramVisitLabel(active.name)}</span>
              </a>
            ))}
          </div>
        ) : null}

        <div className="protel-clients__videos">
          {videos.map((video, index) => (
            <div key={`${active.id}-${index}`} className="protel-clients__video">
              <ProtelVideoEmbed
                title={video.title}
                videoUrl={video.videoUrl}
                aspectRatio={video.aspectRatio}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
