import type { ProtelPitchSettings } from "@/types";
import { ProtelSectionHeading } from "./ProtelSectionHeading";
import { ProtelVideoEmbed } from "./ProtelVideoEmbed";

const PROPOSAL_NOTE =
  "İlk demo video, ürününüzü tanımamız ve çalışma biçimimizi deneyimlemeniz için tarafımızdan hazırlanır. Herhangi bir ücret talep etmiyoruz.";

export function ProtelProposalSection({ settings }: { settings: ProtelPitchSettings }) {
  const title = settings.proposalTitle.trim() || "Demo";
  const price = settings.proposalPrice.trim() || "0.000 ₺";

  return (
    <section className="protel-section protel-section--proposal" aria-labelledby="protel-proposal">
      <ProtelSectionHeading label="TEKLİF" />
      <div className="protel-proposal">
        <div className="protel-proposal__divider" aria-hidden="true" />
        <div className="protel-proposal__row">
          <div className="protel-proposal__heading">
            <h2 id="protel-proposal" className="protel-proposal__title">
              {title}
            </h2>
            <p className="protel-proposal__note">{PROPOSAL_NOTE}</p>
          </div>
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
