"use client";

import type { ProtelBrand } from "@/types";
import type { Messages } from "@/lib/i18n/get-messages";
import { ProtelClientPanel } from "@/components/protel/ProtelClientPanel";
import { MarketingHomeSectionTag } from "./MarketingHomeSectionTag";

export function MarketingHomeSocialClientsPanel({
  brands,
  messages,
}: {
  brands: ProtelBrand[];
  messages: Messages;
}) {
  const copy = messages.home.socialClients;

  return (
    <ProtelClientPanel
      brands={brands}
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
