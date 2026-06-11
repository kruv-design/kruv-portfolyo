import type { Locale } from "@/lib/i18n/config";
import type { Messages } from "@/lib/i18n/get-messages";
import { projectCtaHref } from "@/lib/contact-cta";
import { t } from "@/lib/i18n/t";
import { ProjectCtaLink } from "./ProjectCtaLink";

type LetsTalkMarqueeProps = {
  locale?: Locale;
  messages?: Messages;
  contactHref?: string;
  headingId?: string;
};

function MarqueeGroup({
  headingId,
  contactHref,
  line1,
  line2,
  cta,
  hidden,
}: {
  headingId?: string;
  contactHref: string;
  line1: string;
  line2: string;
  cta: string;
  hidden?: boolean;
}) {
  const heading = (
    <>
      <span className="lets-talk-heading-line1">{line1}</span>
      <span className="lets-talk-heading-line2">
        <strong>{line2}</strong>
      </span>
    </>
  );

  return (
    <div className="lets-talk-marquee-group" aria-hidden={hidden || undefined}>
      {headingId && !hidden ? (
        <h2 id={headingId} className="lets-talk-heading h2">
          {heading}
        </h2>
      ) : (
        <span className="lets-talk-heading h2">{heading}</span>
      )}
      <ProjectCtaLink
        href={contactHref}
        className="cta-ghost lets-talk-cta"
        tabIndex={hidden ? -1 : undefined}
      >
        {cta}
      </ProjectCtaLink>
    </div>
  );
}

/** Anasayfa ile aynı mor kayan bant CTA (`kruv.html` .lets-talk). */
export function LetsTalkMarquee({
  locale = "en",
  messages,
  contactHref,
  headingId = "lets-talk-heading",
}: LetsTalkMarqueeProps) {
  const href = contactHref ?? projectCtaHref(locale);
  const line1 = messages
    ? t(messages, "home.letsTalk.line1", "got a brand ")
    : "got a brand ";
  const line2 = messages
    ? t(messages, "home.letsTalk.line2", "worth building?")
    : "worth building?";
  const cta = messages
    ? t(messages, "home.letsTalk.cta", "Start a project")
    : "Start a project";

  return (
    <section className="lets-talk" lang={locale} aria-labelledby={headingId}>
      <div className="lets-talk-marquee-bleed">
        <div className="lets-talk-marquee">
          <div className="lets-talk-marquee-track">
            <MarqueeGroup
              headingId={headingId}
              contactHref={href}
              line1={line1}
              line2={line2}
              cta={cta}
            />
            <MarqueeGroup
              contactHref={href}
              line1={line1}
              line2={line2}
              cta={cta}
              hidden
            />
            <MarqueeGroup
              contactHref={href}
              line1={line1}
              line2={line2}
              cta={cta}
              hidden
            />
            <MarqueeGroup
              contactHref={href}
              line1={line1}
              line2={line2}
              cta={cta}
              hidden
            />
          </div>
        </div>
      </div>
    </section>
  );
}
