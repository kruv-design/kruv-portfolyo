"use client";

import Link from "next/link";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { ContactPayloadInput } from "@/lib/validators";
import type { Locale } from "@/lib/i18n/config";
import type { Messages } from "@/lib/i18n/get-messages";
import { track } from "@/lib/analytics/track";
import { withLocale } from "@/lib/i18n/path";
import { t } from "@/lib/i18n/t";
import { KruvStarIcon } from "./KruvStarIcon";

const INITIAL: ContactPayloadInput = {
  name: "",
  email: "",
  message: "",
};

/** Tek-sayfa iletişim formu (Figma 3765:11022) — ad / e-posta / mesaj. */
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
  const [values, setValues] = useState<ContactPayloadInput>(INITIAL);
  const [hp, setHp] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    let s = sessionStorage.getItem("kruv-contact-session");
    if (!s) {
      s = crypto.randomUUID();
      sessionStorage.setItem("kruv-contact-session", s);
    }
    setSessionId(s);
  }, []);

  const snapshot = useMemo(() => JSON.stringify(values), [values]);

  const isFormReady = useMemo(() => {
    const name = values.name.trim();
    const email = values.email.trim();
    const message = values.message.trim();
    return (
      name.length >= 2 &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
      message.length > 0
    );
  }, [values]);

  useEffect(() => {
    if (!sessionId || done) return;
    const timer = window.setTimeout(async () => {
      try {
        await fetch("/api/contact-partial", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId, payload: values }),
        });
      } catch {
        /* sessiz taslak */
      }
    }, 2200);
    return () => window.clearTimeout(timer);
  }, [snapshot, sessionId, done, values]);

  const latestRef = useRef({ values });
  latestRef.current = { values };

  useEffect(() => {
    const onLeave = () => {
      if (!sessionId || done) return;
      const { values: v } = latestRef.current;
      const body = JSON.stringify({ sessionId, payload: v });
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

  async function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!formRef.current?.reportValidity()) return;
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
      track("contact_form_submit");
      setDone(true);
      sessionStorage.removeItem("kruv-contact-session");
    } catch {
      setFormError(t(messages, "contact.networkError"));
    } finally {
      setSubmitting(false);
    }
  }

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
          <h2 className="contact-form-success-title h2">
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
        <p className="contact-form-eyebrow">
          <span aria-hidden="true" className="contact-form-eyebrow-icon">
            <KruvStarIcon size={24} />
          </span>
          <span className="contact-form-eyebrow-text">
            {t(messages, "contact.eyebrow")}
          </span>
        </p>
        <h1 className="contact-form-title">
          {t(messages, "contact.title")}
        </h1>
      </header>

      <form
        ref={formRef}
        className="contact-form contact-form--card"
        onSubmit={onSubmit}
        noValidate
      >
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

        <div className="contact-form-fields">
          <div className="contact-form-field">
            <label htmlFor={`${formId}-name`} className="contact-form-label">
              {t(messages, "contact.nameLabel")}
            </label>
            <input
              id={`${formId}-name`}
              className="contact-form-input contact-form-input--pill"
              type="text"
              autoComplete="name"
              value={values.name}
              onChange={(e) => patch("name", e.target.value)}
              placeholder={t(messages, "contact.namePlaceholder")}
              minLength={2}
              required
            />
          </div>

          <div className="contact-form-field">
            <label htmlFor={`${formId}-email`} className="contact-form-label">
              {t(messages, "contact.emailLabel")}
            </label>
            <input
              id={`${formId}-email`}
              className="contact-form-input contact-form-input--pill"
              type="email"
              autoComplete="email"
              inputMode="email"
              value={values.email}
              onChange={(e) => patch("email", e.target.value)}
              placeholder={t(messages, "contact.emailPlaceholder")}
              required
            />
          </div>

          <div className="contact-form-field">
            <label htmlFor={`${formId}-message`} className="contact-form-label">
              {t(messages, "contact.messageLabel")}
            </label>
            <textarea
              id={`${formId}-message`}
              className="contact-form-input contact-form-input--area"
              rows={4}
              value={values.message}
              onChange={(e) => patch("message", e.target.value)}
              placeholder={t(messages, "contact.messagePlaceholder")}
              required
            />
          </div>
        </div>

        {formError ? (
          <p className="contact-form-error b2" role="alert">
            {formError}
          </p>
        ) : null}

        <button
          type="submit"
          className={`contact-form-btn contact-form-btn--block${isFormReady ? " contact-form-btn--ready" : ""}`}
          disabled={submitting || !sessionId}
        >
          {submitting ? t(messages, "contact.submitting") : t(messages, "contact.submit")}
        </button>
      </form>
    </div>
  );
}
