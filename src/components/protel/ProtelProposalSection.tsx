import type { ProtelPitchSettings } from "@/types";
import { ProtelSectionHeading } from "./ProtelSectionHeading";
import { ProtelVideoEmbed } from "./ProtelVideoEmbed";

export function ProtelProposalSection({ settings }: { settings: ProtelPitchSettings }) {
  const title = settings.proposalTitle.trim() || "Demo";
  const price = settings.proposalPrice.trim() || "0.000 ₺";

  return (
    <section className="protel-section protel-section--proposal" aria-labelledby="protel-proposal">
      <ProtelSectionHeading label="TEKLİF" />
      <div className="protel-proposal">
        <div className="protel-proposal__divider" aria-hidden="true" />
        <div className="protel-proposal__row">
          <h2 id="protel-proposal" className="protel-proposal__title">
            {title}
          </h2>
          <span className="protel-proposal__price">{price}</span>
        </div>
        {settings.proposalVideoUrl ? (
          <div className="protel-proposal__video">
            <ProtelVideoEmbed
              title={title}
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
