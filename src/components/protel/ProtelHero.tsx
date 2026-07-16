import type { ProtelPitchSettings } from "@/types";
import { ProtelSectionHeading } from "./ProtelSectionHeading";

function splitHeroTitle(title: string) {
  const lines = title
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length <= 1) {
    return { leadLines: lines, accentLine: "" };
  }

  return {
    leadLines: lines.slice(0, -1),
    accentLine: lines[lines.length - 1] ?? "",
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
  const { leadLines, accentLine } = splitHeroTitle(settings.heroTitle);
  const { lead, body } = splitHeroIntro(settings.heroIntro);

  return (
    <header className="protel-hero">
      <div className="protel-hero__intro-block">
        <ProtelSectionHeading label="UI ANİMASYON VİDEOLARI" />
        <div className="protel-hero__row">
          <h1 className="protel-hero__title">
            {leadLines.map((line) => (
              <span key={line} className="protel-hero__title-line">
                {line}
              </span>
            ))}
            {accentLine ? (
              <span className="protel-hero__title-line protel-hero__title-line--accent">
                {accentLine}
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
