"use client";

import Link from "next/link";
import { useEffect, useId, useMemo, useRef, useState } from "react";
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

const PROJECT_TYPES = [
  { value: "", label: "Seçin…" },
  { value: "marka-kimlik", label: "Marka & kimlik" },
  { value: "web-ui", label: "Web / ürün arayüzü" },
  { value: "paket", label: "Paket & baskı" },
  { value: "kampanya", label: "Kampanya & sosyal" },
  { value: "diger", label: "Diğer / henüz net değil" },
] as const;

const BUDGETS = [
  { value: "", label: "Seçin…" },
  { value: "belirsiz", label: "Henüz net değil" },
  { value: "50k-alt", label: "50.000 TL altı" },
  { value: "50-150k", label: "50.000 – 150.000 TL" },
  { value: "150k-ustu", label: "150.000 TL üstü" },
  { value: "paylasmak-istemiyorum", label: "Paylaşmak istemiyorum" },
] as const;

const TIMELINES = [
  { value: "", label: "Seçin…" },
  { value: "acil", label: "4 hafta içinde" },
  { value: "1-3ay", label: "1–3 ay" },
  { value: "esnek", label: "Takvim esnek" },
] as const;

const REFERRERS = [
  { value: "", label: "Seçin…" },
  { value: "instagram", label: "Instagram" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "referans", label: "Tanıdık / referans" },
  { value: "google", label: "Arama (Google vb.)" },
  { value: "diger", label: "Diğer" },
] as const;

function isValidEmail(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());
}

export function ContactForm() {
  const formId = useId();
  const hpId = `${formId}-hp`;
  const [sessionId, setSessionId] = useState("");
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<ContactPayloadInput>(INITIAL);
  const [hp, setHp] = useState("");
  const [draftStatus, setDraftStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [stepError, setStepError] = useState<string | null>(null);

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
    setDraftStatus("idle");
    const t = window.setTimeout(async () => {
      setDraftStatus("saving");
      try {
        const res = await fetch("/api/contact-partial", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId, step, payload: values }),
        });
        if (!res.ok) throw new Error("save");
        setDraftStatus("saved");
        window.setTimeout(() => setDraftStatus("idle"), 1600);
      } catch {
        setDraftStatus("error");
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
    setStepError(null);
    setFormError(null);
  }

  function validateStep0() {
    if (values.name.trim().length < 2) {
      setStepError("İsminizi en az 2 karakter olarak girin.");
      return false;
    }
    if (!isValidEmail(values.email)) {
      setStepError("Geçerli bir e-posta adresi girin.");
      return false;
    }
    return true;
  }

  function goNext() {
    if (step === 0 && !validateStep0()) return;
    setStep((s) => Math.min(2, s + 1));
    setStepError(null);
  }

  function goBack() {
    setStep((s) => Math.max(0, s - 1));
    setStepError(null);
  }

  async function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validateStep0()) {
      setStep(0);
      return;
    }
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

  const progress = ((step + 1) / 3) * 100;
  const stepTitles = ["Tanışalım", "Proje özeti", "Son dokunuş"];

  if (done) {
    return (
      <div className="contact-form-shell" lang="tr">
        <div className="contact-form-success" role="status">
          <p className="contact-form-success-title h3" style={{ color: "var(--ink)" }}>
            Teşekkürler — mesajınız ulaştı.
          </p>
          <p className="contact-form-success-body b1" style={{ color: "var(--b1-color)" }}>
            En geç 1–2 iş günü içinde dönüş yapacağız. Bu arada projelerimize göz atmak isterseniz{" "}
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
          Kısa adımlarla ilerleyin; yanıtlarınız otomatik taslak olarak kaydedilir — sayfayı kapatsanız bile
          nerede kaldığınızı ekibimiz görebilir.
        </p>
      </header>

      <div className="contact-form-progress-wrap" aria-hidden="true">
        <div className="contact-form-progress-track">
          <div className="contact-form-progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <p className="contact-form-progress-label b2" style={{ color: "var(--ink-faint)" }}>
          Adım {step + 1} / 3 — {stepTitles[step]}
        </p>
      </div>

      {draftStatus === "saving" ? (
        <p className="contact-form-draft b2" style={{ color: "var(--ink-faint)" }}>
          Taslak kaydediliyor…
        </p>
      ) : draftStatus === "saved" ? (
        <p className="contact-form-draft b2" style={{ color: "var(--accent)" }}>
          Taslak kaydedildi
        </p>
      ) : draftStatus === "error" ? (
        <p className="contact-form-draft b2" style={{ color: "var(--danger)" }}>
          Taslak kaydı şu an çalışmadı; gönderim yine de kaydedilir.
        </p>
      ) : null}

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

        {step === 0 ? (
          <div className="contact-form-step">
            <div className="contact-form-field">
              <label htmlFor={`${formId}-name`} className="contact-form-label b2">
                Ad soyad <span className="contact-form-req">*</span>
              </label>
              <input
                id={`${formId}-name`}
                className="contact-form-input"
                type="text"
                autoComplete="name"
                value={values.name}
                onChange={(e) => patch("name", e.target.value)}
                placeholder="ör. ayşe yılmaz"
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
            <div className="contact-form-field">
              <label htmlFor={`${formId}-company`} className="contact-form-label b2">
                Marka / şirket <span className="contact-form-opt">(isteğe bağlı)</span>
              </label>
              <input
                id={`${formId}-company`}
                className="contact-form-input"
                type="text"
                autoComplete="organization"
                value={values.company}
                onChange={(e) => patch("company", e.target.value)}
              />
            </div>
            <div className="contact-form-field">
              <label htmlFor={`${formId}-phone`} className="contact-form-label b2">
                Telefon <span className="contact-form-opt">(isteğe bağlı)</span>
              </label>
              <input
                id={`${formId}-phone`}
                className="contact-form-input"
                type="tel"
                autoComplete="tel"
                value={values.phone}
                onChange={(e) => patch("phone", e.target.value)}
              />
            </div>
          </div>
        ) : null}

        {step === 1 ? (
          <div className="contact-form-step">
            <div className="contact-form-field">
              <label htmlFor={`${formId}-type`} className="contact-form-label b2">
                Ne üzerinde çalışıyorsunuz?
              </label>
              <select
                id={`${formId}-type`}
                className="contact-form-input contact-form-select"
                value={values.projectType}
                onChange={(e) => patch("projectType", e.target.value)}
              >
                {PROJECT_TYPES.map((o) => (
                  <option key={o.label + o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="contact-form-field">
              <label htmlFor={`${formId}-budget`} className="contact-form-label b2">
                Yaklaşık bütçe
              </label>
              <select
                id={`${formId}-budget`}
                className="contact-form-input contact-form-select"
                value={values.budget}
                onChange={(e) => patch("budget", e.target.value)}
              >
                {BUDGETS.map((o) => (
                  <option key={o.label + o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="contact-form-field">
              <label htmlFor={`${formId}-timeline`} className="contact-form-label b2">
                Zaman çizelgesi
              </label>
              <select
                id={`${formId}-timeline`}
                className="contact-form-input contact-form-select"
                value={values.timeline}
                onChange={(e) => patch("timeline", e.target.value)}
              >
                {TIMELINES.map((o) => (
                  <option key={o.label + o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="contact-form-step">
            <div className="contact-form-field">
              <label htmlFor={`${formId}-message`} className="contact-form-label b2">
                Kısaca anlatın
              </label>
              <textarea
                id={`${formId}-message`}
                className="contact-form-input contact-form-textarea"
                rows={5}
                value={values.message}
                onChange={(e) => patch("message", e.target.value)}
                placeholder="Hedefiniz, referans gördüğünüz işler, teslim tarihi…"
              />
            </div>
            <div className="contact-form-field">
              <label htmlFor={`${formId}-ref`} className="contact-form-label b2">
                Bizi nereden duydunuz?
              </label>
              <select
                id={`${formId}-ref`}
                className="contact-form-input contact-form-select"
                value={values.referrer}
                onChange={(e) => patch("referrer", e.target.value)}
              >
                {REFERRERS.map((o) => (
                  <option key={o.label + o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ) : null}

        {stepError ? (
          <p className="contact-form-error b2" role="alert">
            {stepError}
          </p>
        ) : null}
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
          {step < 2 ? (
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
