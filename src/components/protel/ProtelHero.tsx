import type { ProtelPitchSettings } from "@/types";
import { ProtelSectionHeading } from "./ProtelSectionHeading";

function splitHeroTitle(title: string) {
  const lines = title
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length <= 1) {
    return { main: lines[0] ?? "", accent: "" };
  }

  return {
    main: lines.slice(0, -1).join(" "),
    accent: lines[lines.length - 1] ?? "",
  };
}

function splitHeroIntro(intro: string) {
  const parts = intro
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean);

  return {
    lead: parts[0] ?? "",
    body: parts.slice(1).join("\n\n"),
  };
}

export function ProtelHero({ settings }: { settings: ProtelPitchSettings }) {
  const { main, accent } = splitHeroTitle(settings.heroTitle);
  const { lead, body } = splitHeroIntro(settings.heroIntro);

  return (
    <header className="protel-hero">
      <div className="protel-hero__intro-block">
        <ProtelSectionHeading label="UI/UX ANİMASYON PROJELERİ" />
        <div className="protel-hero__title-wrap">
          <h1 className="protel-hero__title">
            {main ? <span className="protel-hero__title-line">{main}</span> : null}
            {accent ? (
              <span className="protel-hero__title-line protel-hero__title-line--accent">
                {accent}
              </span>
            ) : null}
          </h1>
          <div className="protel-hero__copy">
            {lead ? <p className="protel-hero__lead">{lead}</p> : null}
            {body ? <p className="protel-hero__body">{body}</p> : null}
          </div>
        </div>
      </div>
    </header>
  );
}
