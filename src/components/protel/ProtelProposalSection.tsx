import type { ProtelPitchSettings } from "@/types";
import { ProtelSectionHeading } from "./ProtelSectionHeading";
import { ProtelVideoEmbed } from "./ProtelVideoEmbed";

export function ProtelProposalSection({ settings }: { settings: ProtelPitchSettings }) {
  const price = settings.proposalPrice.trim();

  return (
    <section className="protel-section protel-section--proposal" aria-labelledby="protel-proposal">
      <ProtelSectionHeading label="TEKLİF" />
      <div className="protel-proposal">
        <div className="protel-proposal__divider" aria-hidden="true" />
        <div className="protel-proposal__row">
          <h2 id="protel-proposal" className="protel-proposal__title">
            {settings.proposalTitle || "Demo Projesi"}
          </h2>
          {price ? <span className="protel-proposal__price">{price}</span> : null}
        </div>
        {settings.proposalVideoUrl ? (
          <div className="protel-proposal__video">
            <ProtelVideoEmbed
              title={settings.proposalTitle}
              videoUrl={settings.proposalVideoUrl}
              aspectRatio={settings.proposalVideoAspect}
              framed
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}
