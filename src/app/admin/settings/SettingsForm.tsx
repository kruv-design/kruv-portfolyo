"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { SiteSettings } from "@/types";
import { Field } from "@/components/ui/Field";
import { toast } from "@/components/ui/Toast";

export function SettingsForm({ initial }: { initial: SiteSettings }) {
  const [state, setState] = useState(initial);
  const [pending, start] = useTransition();
  const router = useRouter();

  function onSave(e: React.FormEvent) {
    e.preventDefault();
    start(async () => {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast(json.error ?? "Hata.", "error");
        return;
      }
      toast("Ayarlar kaydedildi.");
      router.refresh();
    });
  }

  return (
    <form onSubmit={onSave}>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="serif text-[1.8rem]">Ayarlar</h1>
        <button
          type="submit"
          disabled={pending}
          className="btn btn-primary disabled:opacity-60"
        >
          {pending ? "Kaydediliyor…" : "Kaydet"}
        </button>
      </div>

      <div className="adm-card mb-5 p-7">
        <div
          className="mb-5 border-b pb-3 text-[14px] font-medium"
          style={{ borderColor: "var(--adm-border)", color: "var(--ink)" }}
        >
          Site Bilgileri
        </div>
        <div className="flex flex-col gap-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Site Adı">
              <input
                type="text"
                className="form-input"
                value={state.siteAdi}
                onChange={(e) =>
                  setState((s) => ({ ...s, siteAdi: e.target.value }))
                }
              />
            </Field>
            <Field label="Alt Başlık">
              <input
                type="text"
                className="form-input"
                value={state.tagline}
                onChange={(e) =>
                  setState((s) => ({ ...s, tagline: e.target.value }))
                }
              />
            </Field>
          </div>
          <Field label="Footer Yazısı">
            <input
              type="text"
              className="form-input"
              value={state.footerYazi}
              onChange={(e) =>
                setState((s) => ({ ...s, footerYazi: e.target.value }))
              }
            />
          </Field>
        </div>
      </div>

      <div className="adm-card p-7">
        <div
          className="mb-3 text-[14px] font-medium"
          style={{ color: "var(--ink)" }}
        >
          Güvenlik
        </div>
        <p
          className="text-[13px] leading-relaxed"
          style={{ color: "var(--ink-soft)" }}
        >
          Şifre değişiklikleri <strong>Supabase Dashboard → Authentication</strong>
          {" "}üzerinden yapılır. E-posta ve şifre sıfırlama akışları tamamen
          Supabase tarafından yönetilir; hiçbir credential burada saklanmaz.
        </p>
      </div>
    </form>
  );
}
