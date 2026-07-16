"use client";

import { useState } from "react";
import type { ProtelBrand } from "@/types";
import { ProtelVideoStack } from "./ProtelVideoEmbed";

export function ProtelClientPanel({ brands }: { brands: ProtelBrand[] }) {
  const [activeId, setActiveId] = useState(brands[0]?.id ?? "");

  const active = brands.find((b) => b.id === activeId) ?? brands[0];
  if (!active) {
    return <p className="b1 protel-pitch__empty">Marka bulunamadı.</p>;
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
    <div className="protel-clients">
      <div className="protel-clients__picker" role="tablist" aria-label="Müşteriler">
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

      <div className="protel-clients__detail" role="tabpanel">
        <h3 className="h3 protel-clients__name">{active.name}</h3>

        {active.metrics.length > 0 ? (
          <div className="protel-clients__metrics">
            <p className="h4 protel-clients__label">Metrikler</p>
            <dl className="protel-metrics">
              {active.metrics.map((m) => (
                <div key={`${m.label}-${m.value}`} className="protel-metrics__row">
                  <dt className="b2">{m.label}</dt>
                  <dd className="b1">{m.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        ) : null}

        {active.socialAccounts.length > 0 ? (
          <div className="protel-clients__social">
            <p className="h4 protel-clients__label">Sosyal medya</p>
            <ul className="protel-social">
              {active.socialAccounts.map((s) => (
                <li key={`${s.platform}-${s.handle}`} className="protel-social__item">
                  <span className="b2 protel-social__platform">{s.platform}</span>
                  {s.url ? (
                    <a
                      href={s.url}
                      className="b1 protel-social__handle"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {s.handle || s.url}
                    </a>
                  ) : (
                    <span className="b1 protel-social__handle">{s.handle}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="protel-clients__videos">
          <p className="h4 protel-clients__label">Videolar</p>
          <ProtelVideoStack items={videos} />
        </div>
      </div>
    </div>
  );
}
