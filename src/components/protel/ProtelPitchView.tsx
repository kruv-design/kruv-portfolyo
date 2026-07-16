"use client";

import { useState } from "react";
import type { ProtelPitch } from "@/types";
import { ProtelBrandLogo } from "./ProtelBrandLogo";
import { ProtelClientPanel } from "./ProtelClientPanel";
import { ProtelProcessSteps } from "./ProtelProcessSteps";
import { ProtelVideoEmbed, ProtelVideoStack } from "./ProtelVideoEmbed";

type TabId = "samples" | "clients" | "proposal";

const TABS: Array<{ id: TabId; label: string }> = [
  { id: "samples", label: "Örnek videolar" },
  { id: "clients", label: "Müşteriler" },
  { id: "proposal", label: "Teklif" },
];

export function ProtelPitchView({ pitch }: { pitch: ProtelPitch }) {
  const [tab, setTab] = useState<TabId>("samples");
  const { settings, brands } = pitch;

  return (
    <div className="protel-pitch">
      <ProtelBrandLogo />

      <header className="protel-pitch__hero">
        <h1 className="h1 protel-pitch__title">{settings.heroTitle}</h1>
        {settings.heroIntro ? (
          <p className="b1 protel-pitch__intro">{settings.heroIntro}</p>
        ) : null}
      </header>

      <div className="protel-tabs">
        <div className="protel-tabs__list" role="tablist" aria-label="İçerik">
          {TABS.map((item) => {
            const selected = tab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={selected}
                className={`protel-tabs__btn${selected ? " is-active" : ""}`}
                onClick={() => setTab(item.id)}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="protel-tabs__panel" role="tabpanel">
          {tab === "samples" ? (
            <ProtelVideoStack items={settings.sampleVideos} />
          ) : null}
          {tab === "clients" ? <ProtelClientPanel brands={brands} /> : null}
          {tab === "proposal" ? (
            <div className="protel-proposal">
              <h2 className="h2 protel-proposal__title">{settings.proposalTitle}</h2>
              <ProtelVideoEmbed
                title={settings.proposalTitle}
                videoUrl={settings.proposalVideoUrl}
                aspectRatio={settings.proposalVideoAspect}
              />
            </div>
          ) : null}
        </div>
      </div>

      <ProtelProcessSteps steps={settings.processSteps} />
    </div>
  );
}
