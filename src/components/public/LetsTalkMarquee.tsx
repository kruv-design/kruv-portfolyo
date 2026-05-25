import Link from "next/link";

type LetsTalkMarqueeProps = {
  contactHref?: string;
  headingId?: string;
};

function MarqueeGroup({
  headingId,
  contactHref,
  hidden,
}: {
  headingId?: string;
  contactHref: string;
  hidden?: boolean;
}) {
  const heading = (
    <>
      <span className="lets-talk-heading-line1">Got a brand</span>
      <span className="lets-talk-heading-line2">
        <em>worth building?</em>
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
      <Link
        href={contactHref}
        className="cta-ghost lets-talk-cta"
        tabIndex={hidden ? -1 : undefined}
      >
        Start a project
      </Link>
    </div>
  );
}

/** Anasayfa ile aynı mor kayan bant CTA (`kruv.html` .lets-talk). */
export function LetsTalkMarquee({
  contactHref = "/contact",
  headingId = "lets-talk-heading",
}: LetsTalkMarqueeProps) {
  return (
    <section className="lets-talk" lang="en" aria-labelledby={headingId}>
      <div className="lets-talk-marquee-bleed">
        <div className="lets-talk-marquee">
          <div className="lets-talk-marquee-track">
            <MarqueeGroup headingId={headingId} contactHref={contactHref} />
            <MarqueeGroup contactHref={contactHref} hidden />
            <MarqueeGroup contactHref={contactHref} hidden />
            <MarqueeGroup contactHref={contactHref} hidden />
          </div>
        </div>
      </div>
    </section>
  );
}
