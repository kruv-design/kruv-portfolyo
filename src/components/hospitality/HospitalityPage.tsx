"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import type { Messages } from "@/lib/i18n/get-messages";
import { withLocale } from "@/lib/i18n/path";
import { t } from "@/lib/i18n/t";
import {
  HOSPITALITY_GALLERY,
  type HospitalityFilter,
} from "@/lib/hospitality-gallery";
import { MarketingHomeSectionTag } from "@/components/public/MarketingHomeSectionTag";
import { MarketingHomeKayanYazi } from "@/components/public/MarketingHomeKayanYazi";
import { ContactForm } from "@/components/public/ContactForm";
import { ContactSocials } from "@/components/public/ContactSocials";
import type { SiteSettings } from "@/types";

const FILTERS: HospitalityFilter[] = ["opera", "gg-pizza", "borden"];

export function HospitalityPage({
  locale,
  messages,
  settings,
}: {
  locale: Locale;
  messages: Messages;
  settings: SiteSettings;
}) {
  const copy = messages.hospitality;
  const [filter, setFilter] = useState<HospitalityFilter>("opera");
  const [feedbackIndex, setFeedbackIndex] = useState(0);

  const items = useMemo(
    () => HOSPITALITY_GALLERY.filter((item) => item.filter === filter),
    [filter],
  );

  const feedback = copy.feedback.items;
  const feedbackSafe = feedback[feedbackIndex % Math.max(feedback.length, 1)];

  function shiftFeedback(delta: number) {
    if (feedback.length === 0) return;
    setFeedbackIndex((i) => (i + delta + feedback.length) % feedback.length);
  }

  const filterLabels: Record<HospitalityFilter, string> = {
    opera: copy.filters.opera,
    "gg-pizza": copy.filters.ggPizza,
    borden: copy.filters.borden,
  };

  return (
    <div className="hosp-page">
      <section className="hosp-section hosp-hero" aria-labelledby="hosp-hero-title">
        <MarketingHomeSectionTag className="hosp-hero__tag">
          {copy.hero.tag}
        </MarketingHomeSectionTag>
        <h1 id="hosp-hero-title" className="h1 hosp-hero__title">
          <span className="hosp-hero__title-line">{copy.hero.titleBefore}</span>
          <span className="hosp-hero__title-accent">{copy.hero.titleAccent}</span>
        </h1>
        <p className="hosp-hero__lead">{copy.hero.lead}</p>

        <div className="hosp-filters" role="tablist" aria-label={copy.filters.aria}>
          {FILTERS.map((key) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={filter === key}
              className={`hosp-filter${filter === key ? " is-active" : ""}`}
              onClick={() => setFilter(key)}
            >
              {filterLabels[key]}
            </button>
          ))}
        </div>

        <div className="hosp-gallery">
          {items.map((item) => (
            <figure key={item.id} className="hosp-gallery__item">
              <Image
                src={item.src}
                alt={locale === "en" ? item.altEn : item.altTr}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
              />
            </figure>
          ))}
        </div>
      </section>

      <div className="hosp-marquee">
        <MarketingHomeKayanYazi
          locale={locale}
          messages={
            {
              ...messages,
              home: {
                ...messages.home,
                kayanYazi: {
                  ariaLabel: copy.marquee.aria,
                  phrases: copy.marquee.phrases,
                },
              },
            } as Messages
          }
        />
      </div>

      <section className="hosp-section hosp-services" aria-label={copy.services.tag}>
        <MarketingHomeSectionTag>{copy.services.tag}</MarketingHomeSectionTag>
        <div className="hosp-services__grid">
          {copy.services.items.map((item) => (
            <article key={item.title} className="hosp-service">
              <h3 className="h4 hosp-service__title">{item.title}</h3>
              <p className="b1 hosp-service__body">{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="hosp-section" aria-label={copy.feedback.tag}>
        <div className="hosp-feedback__head">
          <MarketingHomeSectionTag>{copy.feedback.tag}</MarketingHomeSectionTag>
          <div className="hosp-feedback__nav">
            <button
              type="button"
              className="hosp-feedback__btn"
              aria-label={copy.feedback.prev}
              onClick={() => shiftFeedback(-1)}
            >
              ←
            </button>
            <button
              type="button"
              className="hosp-feedback__btn"
              aria-label={copy.feedback.next}
              onClick={() => shiftFeedback(1)}
            >
              →
            </button>
          </div>
        </div>
        <div className="hosp-feedback__track">
          {copy.feedback.items.map((item, i) => {
            const videoSrc =
              "video" in item && typeof item.video === "string"
                ? item.video.trim()
                : "";
            return (
              <article
                key={`${item.name}-${i}`}
                className="hosp-feedback__card"
                data-active={i === feedbackIndex ? "true" : undefined}
              >
                <div className="hosp-feedback__media">
                  {videoSrc ? (
                    <video
                      className="hosp-feedback__video"
                      src={videoSrc}
                      poster={`${videoSrc.replace(
                        /\/upload\//,
                        "/upload/so_0,f_jpg,q_auto/",
                      ).replace(/\.mp4$/i, ".jpg")}`}
                      controls
                      playsInline
                      preload="metadata"
                      aria-label={`${item.name} — ${item.role}`}
                    />
                  ) : null}
                </div>
                <div className="hosp-feedback__meta">
                  <p className="hosp-feedback__name">{item.name}</p>
                  <p className="hosp-feedback__role">{item.role}</p>
                </div>
              </article>
            );
          })}
        </div>
        {feedbackSafe ? (
          <p className="sr-only">
            {feedbackSafe.name} — {feedbackSafe.role}
          </p>
        ) : null}
      </section>

      <section className="hosp-section" aria-label={copy.process.tag}>
        <div className="hosp-process__head">
          <MarketingHomeSectionTag>{copy.process.tag}</MarketingHomeSectionTag>
          <p className="hosp-process__duration">{copy.process.duration}</p>
        </div>
        <div className="hosp-process__grid">
          {copy.process.steps.map((step) => (
            <article key={step.pct} className="hosp-process__step">
              <h3 className="h4 hosp-process__title">{step.title}</h3>
              <p className="b1 hosp-process__body">{step.body}</p>
              <div className="hosp-process__meter">
                <div className="hosp-process__pct">{step.pct}</div>
                <div
                  className="hosp-process__bar"
                  style={{ width: `${step.bar}%` }}
                  aria-hidden="true"
                />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="hosp-growth" aria-labelledby="hosp-growth-title">
        <div className="hosp-growth__inner">
          <div>
            <p className="hosp-growth__eyebrow">{copy.growth.tag}</p>
            <h2 id="hosp-growth-title" className="h2 hosp-growth__title">
              {copy.growth.title}
            </h2>
            <p className="hosp-growth__body">{copy.growth.body}</p>
            <Link href={withLocale("/works", locale)} className="hosp-growth__cta">
              {copy.growth.cta}
            </Link>
          </div>
          <div className="hosp-growth__stat">
            <p className="hosp-growth__stat-label">{copy.growth.statLabel}</p>
            <p className="hosp-growth__stat-value">{copy.growth.stat}</p>
            <p className="hosp-growth__organic">{copy.growth.organic}</p>
          </div>
        </div>
      </section>

      <section className="hosp-section" aria-labelledby="hosp-contact-title">
        <MarketingHomeSectionTag>{copy.contact.tag}</MarketingHomeSectionTag>
        <h2 id="hosp-contact-title" className="h2" style={{ marginTop: "var(--space-4)" }}>
          {copy.contact.title}
        </h2>
        <div className="hosp-contact__grid">
          <div>
            {copy.contact.lead ? (
              <p className="b1" style={{ color: "var(--ink-soft)", maxWidth: "36ch" }}>
                {copy.contact.lead}
              </p>
            ) : null}
            <a
              href={t(messages, "contact.details.whatsappUrl")}
              className="hosp-contact__whatsapp"
              target="_blank"
              rel="noreferrer"
            >
              {copy.contact.whatsapp}
            </a>
            <div style={{ marginTop: "var(--space-8)" }}>
              <ContactSocials settings={settings} messages={messages} />
            </div>
          </div>
          <ContactForm locale={locale} messages={messages} />
        </div>
      </section>
    </div>
  );
}
