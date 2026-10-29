"use client";

import type { ProtelBrand } from "@/types";
import type { Messages } from "@/lib/i18n/get-messages";
import { ProtelClientPanel } from "@/components/protel/ProtelClientPanel";
import { MarketingHomeSectionTag } from "./MarketingHomeSectionTag";

function localizeBrandVideoTitles(
  brands: ProtelBrand[],
  videoTitles: Messages["home"]["socialClients"]["videoTitles"] | undefined,
): ProtelBrand[] {
  if (!videoTitles) return brands;
  return brands.map((brand) => {
    const titles = videoTitles[brand.slug as keyof typeof videoTitles];
    if (!titles) return brand;
    return {
      ...brand,
      video1Title: titles.video1 || brand.video1Title,
      video2Title: titles.video2 || brand.video2Title,
    };
  });
}

export function MarketingHomeSocialClientsPanel({
  brands,
  messages,
}: {
  brands: ProtelBrand[];
  messages: Messages;
}) {
  const copy = messages.home.socialClients;
  const localizedBrands = localizeBrandVideoTitles(brands, copy.videoTitles);

  return (
    <ProtelClientPanel
      brands={localizedBrands}
      sectionClassName="home-social-clients__panel"
      tabListAriaLabel={copy.tabListLabel}
      instagramVisitLabel={(brandName) =>
        copy.instagramVisit.replace("{brand}", brandName)
      }
      heading={
        <header className="home-social-clients__header">
          <MarketingHomeSectionTag>
            <span id="protel-clients-heading">{copy.tagLabel}</span>
          </MarketingHomeSectionTag>
        </header>
      }
    />
  );
}
