import { ABOUT_US_EN, ABOUT_US_TR } from "@/content/about";

export function AboutSection() {
  return (
    <section
      id="about"
      className="about-section border-t px-[4vw]"
      aria-labelledby="about-heading"
    >
      <div className="about-section__inner mx-auto max-w-6xl">
        <header className="about-section__intro">
          <span className="about-section__eyebrow b3">About us</span>
          <h2 id="about-heading" className="about-section__title h3">
            Who we are
          </h2>
        </header>
        <p className="about-section__body b1" lang="en">
          {ABOUT_US_EN}
        </p>
        <p className="about-section__body about-section__body--tr b1" lang="tr">
          {ABOUT_US_TR}
        </p>
      </div>
    </section>
  );
}
