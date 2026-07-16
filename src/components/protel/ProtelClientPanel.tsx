"use client";

import { useState } from "react";
import type { ProtelBrand } from "@/types";
import { ProtelSectionHeading } from "./ProtelSectionHeading";
import { ProtelVideoEmbed } from "./ProtelVideoEmbed";

export function ProtelClientPanel({ brands }: { brands: ProtelBrand[] }) {
  const [activeId, setActiveId] = useState(brands[0]?.id ?? "");

  const active = brands.find((b) => b.id === activeId) ?? brands[0];
  if (!active) {
    return <p className="protel-pitch__empty">Marka bulunamadı.</p>;
  }

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
                className={`protel-clients__btn${selected ? " is-active" : ""}`}
                onClick={() => setActiveId(brand.id)}
              >
                {brand.name}
              </button>
            );
          })}
        </div>

        <div className="protel-clients__videos" role="tabpanel">
          {videos.map((video, index) => (
            <div key={`${active.id}-${index}`} className="protel-clients__video">
              <ProtelVideoEmbed
                title={video.title}
                videoUrl={video.videoUrl}
                aspectRatio={video.aspectRatio}
                framed
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
