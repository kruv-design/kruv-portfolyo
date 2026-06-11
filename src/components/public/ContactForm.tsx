"use client";

import Link from "next/link";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { ContactPayloadInput } from "@/lib/validators";
import type { Locale } from "@/lib/i18n/config";
import type { Messages } from "@/lib/i18n/get-messages";
import { withLocale } from "@/lib/i18n/path";
import { t } from "@/lib/i18n/t";

const INITIAL: ContactPayloadInput = {
  name: "",
  email: "",
  company: "",
  phone: "",
  projectType: "",
  budget: "",
  timeline: "",
  message: "",
  referrer: "",
};

export function ContactForm({
  locale,
  messages,
}: {
  locale: Locale;
  messages: Messages;
}) {
  const formId = useId();
  const hpId = `${formId}-hp`;
  const [sessionId, setSessionId] = useState("");
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<ContactPayloadInput>(INITIAL);
  const [hp, setHp] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    let s = sessionStorage.getItem("kruv-contact-session");
    if (!s) {
      s = crypto.randomUUID();
      sessionStorage.setItem("kruv-contact-session", s);
    }
    setSessionId(s);
  }, []);

  const snapshot = useMemo(() => JSON.stringify({ values, step }), [values, step]);

  useEffect(() => {
    if (!sessionId || done) return;
    const t = window.setTimeout(async () => {
      try {
        await fetch("/api/contact-partial", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId, step, payload: values }),
        });
      } catch {
        /* sessiz taslak — kullanıcıya gösterme */
      }
    }, 2200);
    return () => window.clearTimeout(t);
  }, [snapshot, sessionId, done, values, step]);

  const latestRef = useRef({ values, step });
  latestRef.current = { values, step };

  useEffect(() => {
    const onLeave = () => {
      if (!sessionId || done) return;
      const { values: v, step: st } = latestRef.current;
      const body = JSON.stringify({ sessionId, step: st, payload: v });
      navigator.sendBeacon(
        "/api/contact-partial",
        new Blob([body], { type: "application/json" }),
      );
    };
    window.addEventListener("pagehide", onLeave);
    return () => window.removeEventListener("pagehide", onLeave);
  }, [sessionId, done]);

  function patch<K extends keyof ContactPayloadInput>(key: K, v: ContactPayloadInput[K]) {
    setValues((prev) => ({ ...prev, [key]: v }));
    setFormError(null);
  }

  const stepViewportRef = useRef<HTMLDivElement>(null);

  function currentStepFieldsValid() {
    const panel = stepViewportRef.current?.querySelector(".contact-form-step-panel");
    if (!panel) return true;
    const fields = panel.querySelectorAll<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >("input:not([type='hidden']), select, textarea");
    for (const field of fields) {
      if (!field.reportValidity()) return false;
    }
    return true;
  }

  function goNext() {
    if (!currentStepFieldsValid()) return;
    setStep((s) => Math.min(totalSteps - 1, s + 1));
  }

  function goBack() {
    setStep((s) => Math.max(0, s - 1));
  }

  useEffect(() => {
    const panel = stepViewportRef.current?.querySelector<HTMLElement>(
      ".contact-form-step-panel",
    );
    const first = panel?.querySelector<HTMLElement>(
      "input:not([type='hidden']), select, textarea",
    );
    first?.focus({ preventScroll: true });
  }, [step]);

  async function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!currentStepFieldsValid()) return;
    if (!sessionId) return;
    setSubmitting(true);
    setFormError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, hp, payload: values, locale }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok) {
        setFormError(data.error ?? t(messages, "contact.submitFailed"));
        return;
      }
      setDone(true);
      sessionStorage.removeItem("kruv-contact-session");
    } catch {
      setFormError(t(messages, "contact.networkError"));
    } finally {
      setSubmitting(false);
    }
  }

  const stepTitles = (messages.contact.stepTitles ?? []) as string[];
  const totalSteps = stepTitles.length || 3;
  const progress = ((step + 1) / totalSteps) * 100;

  if (done) {
    return (
      <div className="contact-form-shell" lang={locale}>
        <div
          className="contact-form-success"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          <span className="contact-form-success-mark" aria-hidden="true">
            ✓
          </span>
          <p className="contact-form-success-eyebrow b3">
            {t(messages, "contact.eyebrow")}
          </p>
          <h2 className="contact-form-success-title h3">
            {t(messages, "contact.successTitle")}
          </h2>
          <p className="contact-form-success-body b1">
            {t(messages, "contact.successBodyPrefix")}{" "}
            <Link href={withLocale("/works", locale)} className="contact-form-inline-link">
              {t(messages, "contact.successBodyLink")}
            </Link>{" "}
            {t(messages, "contact.successBodySuffix")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="contact-form-shell" lang={locale}>
      <header className="contact-form-header">
        <p className="contact-form-eyebrow b3">
          {t(messages, "contact.eyebrow")}
        </p>
        <h1 className="contact-form-title h2">
          {t(messages, "contact.title")}
        </h1>
        <p className="contact-form-lead b1">
          {t(messages, "contact.lead")}
        </p>
      </header>

      <div className="contact-form-progress-wrap" aria-live="polite" aria-atomic="true">
        <div className="contact-form-progress-track" aria-hidden="true">
          <div className="contact-form-progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <p
          id={`${formId}-step-label`}
          className="contact-form-progress-label b2"
        >
          {t(messages, "contact.step")} {step + 1} / {totalSteps} — {stepTitles[step]}
        </p>
      </div>

      <form className="contact-form" onSubmit={onSubmit} noValidate>
        <label htmlFor={hpId} className="sr-only">
          {t(messages, "contact.honeypotLabel")}
        </label>
        <input
          id={hpId}
          type="text"
          name="companyWebsite"
          value={hp}
          onChange={(e) => setHp(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          className="contact-form-honeypot"
          aria-hidden="true"
        />

        <div ref={stepViewportRef} className="contact-form-step-viewport">
          <div
            key={step}
            className="contact-form-step contact-form-step-panel"
            role="group"
            aria-labelledby={`${formId}-step-label`}
          >
            {step === 0 ? (
              <div className="contact-form-field">
                <label htmlFor={`${formId}-name`} className="contact-form-label b2">
                  {t(messages, "contact.nameLabel")} <span className="contact-form-req">*</span>
                </label>
                <input
                  id={`${formId}-name`}
                  className="contact-form-input"
                  type="text"
                  autoComplete="name"
                  value={values.name}
                  onChange={(e) => patch("name", e.target.value)}
                  placeholder={t(messages, "contact.namePlaceholder")}
                  minLength={2}
                  required
                />
              </div>
            ) : null}

            {step === 1 ? (
              <div className="contact-form-field">
                <label htmlFor={`${formId}-email`} className="contact-form-label b2">
                  {t(messages, "contact.emailLabel")} <span className="contact-form-req">*</span>
                </label>
                <input
                  id={`${formId}-email`}
                  className="contact-form-input"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  value={values.email}
                  onChange={(e) => patch("email", e.target.value)}
                  placeholder={t(messages, "contact.emailPlaceholder")}
                  required
                />
              </div>
            ) : null}

            {step === 2 ? (
              <div className="contact-form-field">
                <label htmlFor={`${formId}-message`} className="contact-form-label b2">
                  {t(messages, "contact.messageLabel")} <span className="contact-form-req">*</span>
                </label>
                <textarea
                  id={`${formId}-message`}
                  className="contact-form-input contact-form-textarea"
                  rows={6}
                  value={values.message}
                  onChange={(e) => patch("message", e.target.value)}
                  placeholder={t(messages, "contact.messagePlaceholder")}
                  required
                />
              </div>
            ) : null}
          </div>
        </div>

        {formError ? (
          <p className="contact-form-error b2" role="alert">
            {formError}
          </p>
        ) : null}

        <div className="contact-form-actions">
          {step > 0 ? (
            <button type="button" className="contact-form-btn contact-form-btn--ghost" onClick={goBack}>
              {t(messages, "contact.back")}
            </button>
          ) : (
            <span />
          )}
          {step < totalSteps - 1 ? (
            <button type="button" className="contact-form-btn contact-form-btn--primary" onClick={goNext}>
              {t(messages, "contact.continue")}
            </button>
          ) : (
            <button
              type="submit"
              className="contact-form-btn contact-form-btn--primary"
              disabled={submitting || !sessionId}
            >
              {submitting ? t(messages, "contact.submitting") : t(messages, "contact.submit")}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
