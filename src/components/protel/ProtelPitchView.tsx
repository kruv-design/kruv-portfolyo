"use client";

import type { ProtelPitch } from "@/types";
import { ProtelBrandLogo } from "./ProtelBrandLogo";
import { ProtelClientPanel } from "./ProtelClientPanel";
import { ProtelHero } from "./ProtelHero";
import { ProtelProcessSteps } from "./ProtelProcessSteps";
import { ProtelProposalSection } from "./ProtelProposalSection";
import { ProtelSampleBento } from "./ProtelSampleBento";

export function ProtelPitchView({ pitch }: { pitch: ProtelPitch }) {
  const { settings, brands } = pitch;

  return (
    <div className="protel-pitch">
      <div className="protel-pitch__stack">
        <ProtelBrandLogo />
        <ProtelHero settings={settings} />
        <section className="protel-section protel-section--samples">
          <ProtelSampleBento items={settings.sampleVideos} />
        </section>
        <ProtelClientPanel brands={brands} />
        <ProtelProcessSteps
          steps={settings.processSteps}
          duration={settings.processDuration || "2/3 HAFTA"}
        />
        <ProtelProposalSection settings={settings} />
      </div>
    </div>
  );
}
