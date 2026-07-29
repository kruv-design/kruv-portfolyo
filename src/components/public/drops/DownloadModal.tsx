"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import type { Locale } from "@/lib/i18n/config";
import { KruvStarIcon } from "@/components/public/KruvStarIcon";
import { SocialFooterLinks } from "@/components/public/SocialFooterLinks";
import type { Messages } from "@/lib/i18n/get-messages";
import type { SiteSettings } from "@/types";

export type DownloadRequest = {
  packSlug: string;
  fontSlug?: string;
  type: "font" | "pack";
  label: string;
};

type Props = {
  open: boolean;
  request: DownloadRequest | null;
  locale: Locale;
  settings: SiteSettings;
  messages: Messages;
  copy: {
    eyebrow: string;
    title: string;
    nameLabel: string;
    emailLabel: string;
    namePlaceholder: string;
    emailPlaceholder: string;
    submit: string;
    submitting: string;
    error: string;
    fileMissing: string;
  };
  onClose: () => void;
};

const LEAD_KEY = "kruv-drops-lead";

export function DownloadModal({
  open,
  request,
  locale,
  settings,
  messages,
  copy,
  onClose,
}: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  useEffect(() => {
    const dlg = dialogRef.current;
    if (!dlg) return;
    if (open) {
      if (!dlg.open) dlg.showModal();
      try {
        const saved = sessionStorage.getItem(LEAD_KEY);
        if (saved) {
          const parsed = JSON.parse(saved) as { name?: string; email?: string };
          if (parsed.name) setName(parsed.name);
          if (parsed.email) setEmail(parsed.email);
        }
      } catch {
        /* ignore */
      }
    } else if (dlg.open) {
      dlg.close();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!request) return;
    setError(null);

    start(async () => {
      try {
        const res = await fetch("/api/drops/download", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            email,
            packSlug: request.packSlug,
            fontSlug: request.fontSlug,
            type: request.type,
            locale,
            hp: "",
          }),
        });
        const json = (await res.json()) as {
          ok?: boolean;
          url?: string;
          filename?: string;
          error?: string;
        };
        if (!res.ok || !json.ok) {
          setError(json.error ?? copy.error);
          return;
        }
        sessionStorage.setItem(LEAD_KEY, JSON.stringify({ name, email }));
        if (json.url) {
          const a = document.createElement("a");
          a.href = json.url;
          a.download = json.filename ?? "font.zip";
          a.rel = "noopener";
          document.body.appendChild(a);
          a.click();
          a.remove();
        }
        onClose();
      } catch {
        setError(copy.error);
      }
    });
  }

  if (!open) return null;

  return (
    <dialog ref={dialogRef} className="drops-modal" onClose={onClose}>
      <div className="drops-modal__backdrop" aria-hidden onClick={onClose} />
      <div className="drops-modal__panel" role="document">
        <button type="button" className="drops-modal__close" onClick={onClose} aria-label="Close">
          ×
        </button>
        <div className="drops-modal__header">
          <p className="drops-modal__eyebrow">
            <KruvStarIcon className="drops-modal__eyebrow-icon" size={24} />
            <span>{copy.eyebrow}</span>
          </p>
          <h2 className="drops-modal__title">{copy.title}</h2>
        </div>
        <form className="drops-modal__form" onSubmit={handleSubmit}>
          <label className="drops-modal__field">
            <span>{copy.nameLabel}</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={copy.namePlaceholder}
              required
              autoComplete="name"
            />
          </label>
          <label className="drops-modal__field">
            <span>{copy.emailLabel}</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={copy.emailPlaceholder}
              required
              autoComplete="email"
            />
          </label>
          {error ? <p className="drops-modal__error">{error}</p> : null}
          <button type="submit" className="drops-modal__submit" disabled={pending}>
            {pending ? copy.submitting : request?.label ?? copy.submit}
          </button>
        </form>
        <SocialFooterLinks
          settings={settings}
          messages={messages}
          className="drops-modal__socials"
        />
      </div>
    </dialog>
  );
}
