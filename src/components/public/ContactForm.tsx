"use client";

import Link from "next/link";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import {
  CONTACT_FOCUS_OPTIONS,
  CONTACT_STEP_TITLES,
  CONTACT_TOTAL_STEPS,
} from "@/lib/contact-form-config";
import type { ContactPayloadInput } from "@/lib/validators";

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

export function ContactForm() {
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
    setStep((s) => Math.min(CONTACT_TOTAL_STEPS - 1, s + 1));
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
        body: JSON.stringify({ sessionId, hp, payload: values }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok) {
        setFormError(data.error ?? "Gönderim başarısız. Biraz sonra tekrar deneyin.");
        return;
      }
      setDone(true);
      sessionStorage.removeItem("kruv-contact-session");
    } catch {
      setFormError("Ağ hatası. Bağlantınızı kontrol edip tekrar deneyin.");
    } finally {
      setSubmitting(false);
    }
  }

  const progress = ((step + 1) / CONTACT_TOTAL_STEPS) * 100;

  if (done) {
    return (
      <div className="contact-form-shell" lang="tr">
        <div className="contact-form-success" role="status">
          <p className="contact-form-success-title h3" style={{ color: "var(--ink)" }}>
            Mesajınız iletildi.
          </p>
          <p className="contact-form-success-body b1" style={{ color: "var(--b1-color)" }}>
            Size en kısa zamanda ulaşacağız. Bu arada projelerimize göz atmak isterseniz{" "}
            <Link href="/works" className="contact-form-inline-link">
              Work
            </Link>{" "}
            sayfasına gidebilirsiniz.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="contact-form-shell" lang="tr">
      <header className="contact-form-header">
        <p className="contact-form-eyebrow b3" style={{ color: "var(--ink-faint)" }}>
          İletişim
        </p>
        <h1 className="contact-form-title h2" style={{ color: "var(--ink)" }}>
          Birlikte üretelim
        </h1>
        <p className="contact-form-lead b1" style={{ color: "var(--b1-color)" }}>
          Üç kısa adım: iletişim bilgileriniz, markanız ve mesajınız.
        </p>
      </header>

      <div className="contact-form-progress-wrap" aria-live="polite" aria-atomic="true">
        <div className="contact-form-progress-track" aria-hidden="true">
          <div className="contact-form-progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <p
          id={`${formId}-step-label`}
          className="contact-form-progress-label b2"
          style={{ color: "var(--ink-faint)" }}
        >
          Adım {step + 1} / {CONTACT_TOTAL_STEPS} — {CONTACT_STEP_TITLES[step]}
        </p>
      </div>

      <form className="contact-form" onSubmit={onSubmit} noValidate>
        <label htmlFor={hpId} className="sr-only">
          Web siteniz (boş bırakın)
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
              <>
                <div className="contact-form-field">
                  <label htmlFor={`${formId}-name`} className="contact-form-label b2">
                    Adınız soyadınız <span className="contact-form-req">*</span>
                  </label>
                  <input
                    id={`${formId}-name`}
                    className="contact-form-input"
                    type="text"
                    autoComplete="name"
                    value={values.name}
                    onChange={(e) => patch("name", e.target.value)}
                    placeholder="ör. ayşe yılmaz"
                    minLength={2}
                    required
                  />
                </div>
                <div className="contact-form-field">
                  <label htmlFor={`${formId}-email`} className="contact-form-label b2">
                    E-posta <span className="contact-form-req">*</span>
                  </label>
                  <input
                    id={`${formId}-email`}
                    className="contact-form-input"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    value={values.email}
                    onChange={(e) => patch("email", e.target.value)}
                    placeholder="siz@ornek.com"
                    required
                  />
                </div>
              </>
            ) : null}

            {step === 1 ? (
              <>
                <div className="contact-form-field">
                  <label htmlFor={`${formId}-company`} className="contact-form-label b2">
                    Marka veya şirket adı <span className="contact-form-req">*</span>
                  </label>
                  <input
                    id={`${formId}-company`}
                    className="contact-form-input"
                    type="text"
                    autoComplete="organization"
                    value={values.company}
                    onChange={(e) => patch("company", e.target.value)}
                    placeholder="ör. marker, acme co."
                    minLength={2}
                    required
                  />
                </div>
                <div className="contact-form-field">
                  <label htmlFor={`${formId}-type`} className="contact-form-label b2">
                    Şu an en çok nerede destek arıyorsunuz?{" "}
                    <span className="contact-form-req">*</span>
                  </label>
                  <select
                    id={`${formId}-type`}
                    className="contact-form-input contact-form-select"
                    value={values.projectType}
                    onChange={(e) => patch("projectType", e.target.value)}
                    required
                  >
                    {CONTACT_FOCUS_OPTIONS.map((o) => (
                      <option key={o.label + o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            ) : null}

            {step === 2 ? (
              <div className="contact-form-field">
                <label htmlFor={`${formId}-message`} className="contact-form-label b2">
                  Mesajınız <span className="contact-form-req">*</span>
                </label>
                <textarea
                  id={`${formId}-message`}
                  className="contact-form-input contact-form-textarea"
                  rows={6}
                  value={values.message}
                  onChange={(e) => patch("message", e.target.value)}
                  placeholder="Kısaca projenizi veya sorunuzu yazın."
                  minLength={15}
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
              Geri
            </button>
          ) : (
            <span />
          )}
          {step < CONTACT_TOTAL_STEPS - 1 ? (
            <button type="button" className="contact-form-btn contact-form-btn--primary" onClick={goNext}>
              Devam
            </button>
          ) : (
            <button
              type="submit"
              className="contact-form-btn contact-form-btn--primary"
              disabled={submitting || !sessionId}
            >
              {submitting ? "Gönderiliyor…" : "Gönder"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
