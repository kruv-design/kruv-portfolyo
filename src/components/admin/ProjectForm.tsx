"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import type { Project, ProjectSection } from "@/types";
import { api } from "@/lib/api";
import { toast } from "@/components/ui/Toast";
import { Field } from "@/components/ui/Field";
import { TagInput } from "./TagInput";
import { SectionEditor } from "./SectionEditor";
import { CoverUpload } from "./CoverUpload";
import { GALERI_KEYS, emptyGaleriSlots, type GaleriKey } from "@/lib/project-images";
import { WORK_PAGE_FILTER_LABELS } from "@/lib/work-filters";

type FormState = {
  baslik: string;
  kategori: string;
  aciklama: string;
  kapak: string;
  bolumler: ProjectSection[];
  etiketler: string[];
  yil: string;
  musteri: string;
  sure: string;
  link: string;
  featured: boolean;
  renk: string;
  slug: string;
} & Record<GaleriKey, string>;

const KATEGORI_EXTRA = ["Packaging", "Motion"] as const;

const EMPTY: FormState = {
  baslik: "",
  kategori: "",
  aciklama: "",
  kapak: "",
  ...emptyGaleriSlots(),
  bolumler: [],
  etiketler: [],
  yil: "",
  musteri: "",
  sure: "",
  link: "",
  featured: false,
  renk: "#C8B8A8",
  slug: "",
};

function fromProject(p: Project): FormState {
  return {
    baslik: p.baslik,
    kategori: p.kategori,
    aciklama: p.aciklama,
    kapak: p.kapak ?? "",
    galeri_1: p.galeri_1,
    galeri_2: p.galeri_2,
    galeri_3: p.galeri_3,
    galeri_4: p.galeri_4,
    galeri_5: p.galeri_5,
    galeri_6: p.galeri_6,
    galeri_7: p.galeri_7,
    galeri_8: p.galeri_8,
    bolumler: [...p.bolumler],
    etiketler: [...p.etiketler],
    yil: p.yil,
    musteri: p.musteri,
    sure: p.sure,
    link: p.link,
    featured: p.featured,
    renk: p.renk || "#C8B8A8",
    slug: p.slug,
  };
}

export function ProjectForm({
  mode,
  project,
}: {
  mode: "create" | "edit";
  project?: Project;
}) {
  const [form, setForm] = useState<FormState>(
    project ? fromProject(project) : EMPTY,
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [pending, start] = useTransition();

  const kategoriOptions = useMemo(() => {
    const base = [...WORK_PAGE_FILTER_LABELS, ...KATEGORI_EXTRA];
    if (form.kategori && !base.includes(form.kategori as (typeof base)[number])) {
      return [form.kategori, ...base];
    }
    return base;
  }, [form.kategori]);

  function patch<K extends keyof FormState>(key: K, val: FormState[K]) {
    setForm((f) => ({ ...f, [key]: val }));
    setFormError(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    const localErrors: Record<string, string> = {};
    if (!form.baslik.trim()) localErrors.baslik = "Başlık zorunlu.";
    if (!form.kategori.trim()) localErrors.kategori = "Kategori seçin.";
    setErrors(localErrors);
    if (Object.keys(localErrors).length) return;

    start(async () => {
      try {
        const payload = {
          ...form,
          etiketler: form.etiketler ?? [],
          bolumler: form.bolumler.filter(
            (b) => b.baslik.trim() || b.metin.trim(),
          ),
        };
        if (mode === "create") {
          await api.createProject(payload);
          toast("Proje eklendi.");
        } else if (project) {
          const updated = await api.updateProject(project.id, payload);
          setForm(fromProject(updated));
          toast("Proje güncellendi.");
        }
        window.location.assign("/admin");
      } catch (err) {
        const msg = (err as Error).message || "Kayıt başarısız.";
        setFormError(msg);
        toast(msg, "error");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="pb-32" noValidate>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="h2">
            {mode === "create" ? "Yeni proje" : "Projeyi düzenle"}
          </h1>
          <p className="b2 mt-2 max-w-xl" style={{ color: "var(--ink-faint)" }}>
            Projeleri buradan yönetin. Supabase tablosunu açmanıza gerek yok — liste
            sırası admin ana sayfasında sürükle-bırak ile ayarlanır.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin" className="btn btn-ghost">
            İptal
          </Link>
          <button
            type="submit"
            disabled={pending}
            className="btn btn-primary disabled:opacity-60"
          >
            {pending ? "Kaydediliyor…" : "Kaydet"}
          </button>
        </div>
      </div>

      {formError ? (
        <div
          className="b2 mb-6 rounded-lg border px-4 py-3"
          role="alert"
          style={{
            borderColor: "var(--danger)",
            color: "var(--danger)",
            background: "color-mix(in srgb, var(--danger) 10%, transparent)",
          }}
        >
          {formError}
        </div>
      ) : null}

      <div className="flex flex-col gap-6">
        <section
          className="flex flex-col gap-5 rounded-xl border p-5 sm:p-6"
          style={{ borderColor: "var(--adm-border)", background: "var(--adm-surface)" }}
        >
          <h2 className="b1 font-semibold" style={{ color: "var(--ink)" }}>
            Temel bilgiler
          </h2>

          <Field label="Kapak" hint="İsteğe bağlı — Work kartı ve detay üstü.">
            <CoverUpload value={form.kapak} onChange={(v) => patch("kapak", v)} />
          </Field>

          <div className="flex flex-col gap-4">
            <p className="b3" style={{ color: "var(--ink-faint)" }}>
              Galeri (isteğe bağlı) — detay sayfasında sırayla görünür. Boş slotları atlayabilirsiniz.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {GALERI_KEYS.map((key, i) => (
                <Field key={key} label={`Galeri ${i + 1}`}>
                  <CoverUpload
                    value={form[key]}
                    onChange={(v) => patch(key, v)}
                  />
                </Field>
              ))}
            </div>
          </div>

          <Field label="Proje adı *" error={errors.baslik}>
            <input
              type="text"
              className="form-input"
              value={form.baslik}
              onChange={(e) => patch("baslik", e.target.value)}
              placeholder="ör. Marker"
              maxLength={200}
            />
          </Field>

          <Field label="Kategori *" error={errors.kategori}>
            <select
              className="form-input contact-form-select"
              value={form.kategori}
              onChange={(e) => patch("kategori", e.target.value)}
            >
              <option value="">Seçin…</option>
              {kategoriOptions.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Kısa açıklama">
            <textarea
              className="form-textarea"
              rows={3}
              value={form.aciklama}
              onChange={(e) => patch("aciklama", e.target.value)}
              placeholder="Work sayfasındaki kartta görünen 1–2 cümle."
            />
          </Field>

          <label
            className="b2 flex cursor-pointer items-center gap-2"
            style={{ color: "var(--ink-soft)" }}
          >
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => patch("featured", e.target.checked)}
              className="h-4 w-4"
              style={{ accentColor: "var(--accent)" }}
            />
            Ana sayfada öne çıkar
          </label>
        </section>

        <section
          className="rounded-xl border"
          style={{ borderColor: "var(--adm-border)", background: "var(--adm-surface)" }}
        >
          <button
            type="button"
            className="b2 flex w-full items-center justify-between px-5 py-4 text-left font-medium"
            style={{ color: "var(--ink-soft)" }}
            onClick={() => setShowAdvanced((v) => !v)}
            aria-expanded={showAdvanced}
          >
            Gelişmiş ayarlar
            <span aria-hidden="true">{showAdvanced ? "−" : "+"}</span>
          </button>

          {showAdvanced ? (
            <div
              className="flex flex-col gap-5 border-t px-5 pb-5 pt-4 sm:px-6"
              style={{ borderColor: "var(--adm-border)" }}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Müşteri">
                  <input
                    type="text"
                    className="form-input"
                    value={form.musteri}
                    onChange={(e) => patch("musteri", e.target.value)}
                    placeholder="İsteğe bağlı"
                  />
                </Field>
                <Field label="Yıl">
                  <input
                    type="text"
                    className="form-input"
                    value={form.yil}
                    onChange={(e) => patch("yil", e.target.value)}
                    placeholder="2024"
                  />
                </Field>
                <Field label="Süre">
                  <input
                    type="text"
                    className="form-input"
                    value={form.sure}
                    onChange={(e) => patch("sure", e.target.value)}
                  />
                </Field>
              </div>

              <Field label="Dış link" hint="Behance, web sitesi vb.">
                <input
                  type="url"
                  className="form-input"
                  value={form.link}
                  onChange={(e) => patch("link", e.target.value)}
                  placeholder="https://…"
                />
              </Field>

              <Field label="Etiketler">
                <TagInput
                  value={form.etiketler}
                  onChange={(v) => patch("etiketler", v)}
                />
              </Field>

              <SectionEditor
                value={form.bolumler}
                onChange={(v) => patch("bolumler", v)}
              />

              {mode === "edit" ? (
                <Field label="URL slug" hint="Değiştirirsen eski link kırılır.">
                  <input
                    type="text"
                    className="form-input"
                    value={form.slug}
                    onChange={(e) => patch("slug", e.target.value)}
                    placeholder="marker-branding"
                    pattern="[a-z0-9-]+"
                  />
                </Field>
              ) : null}
            </div>
          ) : null}
        </section>
      </div>

      <div
        className="sticky bottom-0 z-20 -mx-10 mt-10 flex flex-wrap items-center justify-end gap-2 border-t px-10 py-4"
        style={{
          background: "var(--adm-bg)",
          borderColor: "var(--adm-border)",
          boxShadow: "0 -12px 32px color-mix(in srgb, var(--gray-anti) 12%, transparent)",
        }}
      >
        <Link href="/admin" className="btn btn-ghost">
          İptal
        </Link>
        <button
          type="submit"
          disabled={pending}
          className="btn btn-primary disabled:opacity-60"
        >
          {pending ? "Kaydediliyor…" : "Kaydet"}
        </button>
      </div>
    </form>
  );
}
