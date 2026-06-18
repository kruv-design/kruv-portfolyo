"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import type { Project, ProjectSection } from "@/types";
import { api } from "@/lib/api";
import { toast } from "@/components/ui/Toast";
import { Field } from "@/components/ui/Field";
import { TagInput } from "./TagInput";
import { SectionEditor } from "./SectionEditor";
import { MediaSlotEditor } from "./MediaSlotEditor";
import { CoverUpload } from "./CoverUpload";
import {
  GALERI_KEYS,
  GALERI_VIDEO_BY_SLOT,
  GALERI_VIDEO_KEYS,
  GALERI_VIDEO_SLOT_RULES,
  emptyGaleriSlots,
  emptyGaleriVideoSlots,
  type GaleriKey,
  type GaleriVideoKey,
} from "@/lib/project-images";
import { ADMIN_ONLY_CATEGORY_LABELS } from "@/lib/project-categories";
import { WORK_PAGE_FILTER_LABELS } from "@/lib/work-filters";

type FormState = {
  baslik: string;
  title: string;
  kategori: string;
  category: string;
  aciklama: string;
  description: string;
  kapak: string;
  bolumler: ProjectSection[];
  etiketler: string[];
  featured: boolean;
  yayinda: boolean;
  next_project_override: string;
  renk: string;
  slug: string;
} & Record<GaleriKey, string> &
  Record<GaleriVideoKey, string>;

const EMPTY: FormState = {
  baslik: "",
  title: "",
  kategori: "",
  category: "",
  aciklama: "",
  description: "",
  kapak: "",
  ...emptyGaleriSlots(),
  ...emptyGaleriVideoSlots(),
  bolumler: [],
  etiketler: [],
  featured: false,
  yayinda: true,
  next_project_override: "",
  renk: "#C8B8A8",
  slug: "",
};

function fromProject(p: Project): FormState {
  return {
    baslik: p.baslik,
    title: p.title,
    kategori: p.kategori,
    category: p.category,
    aciklama: p.aciklama,
    description: p.description,
    kapak: p.kapak ?? "",
    ...(Object.fromEntries(
      GALERI_KEYS.map((k) => [k, p[k] ?? ""]),
    ) as Record<GaleriKey, string>),
    ...(Object.fromEntries(
      GALERI_VIDEO_KEYS.map((k) => [k, p[k] ?? ""]),
    ) as Record<GaleriVideoKey, string>),
    bolumler: [...p.bolumler],
    etiketler: [...p.etiketler],
    featured: p.featured,
    yayinda: p.yayinda,
    next_project_override: p.next_project_override ?? "",
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
    const base = [...WORK_PAGE_FILTER_LABELS, ...ADMIN_ONLY_CATEGORY_LABELS];
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
    for (const { galeriKey, videoKey, allowVideoOnly } of GALERI_VIDEO_SLOT_RULES) {
      if (form[videoKey].trim() && !form[galeriKey].trim() && !allowVideoOnly) {
        localErrors[galeriKey] = "Video için poster görseli zorunlu.";
      }
    }
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

          <Field
            label="Kısa açıklama"
            hint="Proje detay sayfasında görünür; kartlarda gösterilmez."
          >
            <textarea
              className="form-textarea"
              rows={3}
              value={form.aciklama}
              onChange={(e) => patch("aciklama", e.target.value)}
              placeholder="Detay sayfası için 1–2 paragraf."
            />
          </Field>

          <div className="flex flex-col gap-3">
            <label
              className="b2 flex cursor-pointer items-center gap-2"
              style={{ color: "var(--ink-soft)" }}
            >
              <input
                type="checkbox"
                checked={form.yayinda}
                onChange={(e) => patch("yayinda", e.target.checked)}
                className="h-4 w-4"
                style={{ accentColor: "var(--accent)" }}
              />
              <span>
                Yayında
                {!form.yayinda && (
                  <span
                    className="ml-2 rounded-full px-2 py-0.5 text-xs font-medium"
                    style={{ background: "var(--gray-100)", color: "var(--ink-faint)" }}
                  >
                    Gizli — ziyaretçiler göremez
                  </span>
                )}
              </span>
            </label>
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
          </div>
        </section>

        <section
          className="flex flex-col gap-5 rounded-xl border p-5 sm:p-6"
          style={{ borderColor: "var(--adm-border)", background: "var(--adm-surface)" }}
        >
          <div>
            <h2 className="b1 font-semibold" style={{ color: "var(--ink)" }}>
              English
            </h2>
            <p className="b3 mt-2 max-w-2xl" style={{ color: "var(--ink-faint)" }}>
              Supabase sütunları: <code>title</code>, <code>description</code>,{" "}
              <code>category</code>. Boş bırakılırsa İngilizce sitede Türkçe gösterilir.
            </p>
          </div>

          <Field label="title">
            <input
              type="text"
              className="form-input"
              value={form.title}
              onChange={(e) => patch("title", e.target.value)}
              placeholder="e.g. Levantines Conference"
              maxLength={200}
            />
          </Field>

          <Field label="category">
            <select
              className="form-input contact-form-select"
              value={form.category}
              onChange={(e) => patch("category", e.target.value)}
            >
              <option value="">— same as kategori —</option>
              {kategoriOptions.map((k) => (
                <option key={`en-${k}`} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </Field>

          <Field label="description">
            <textarea
              className="form-textarea"
              rows={3}
              value={form.description}
              onChange={(e) => patch("description", e.target.value)}
              placeholder="English intro for the project page."
            />
          </Field>
        </section>

        <section
          className="flex flex-col gap-5 rounded-xl border p-5 sm:p-6"
          style={{ borderColor: "var(--adm-border)", background: "var(--adm-surface)" }}
        >
          <div>
            <h2 className="b1 font-semibold" style={{ color: "var(--ink)" }}>
              Görseller
            </h2>
            <p className="b3 mt-2 max-w-2xl" style={{ color: "var(--ink-faint)" }}>
              Kapak: anasayfa ve işler listesindeki kart. Galeri 1–15: proje detayında sırayla
              (boş slotlar atlanır). Video yalnızca Görsel 1 (görsel yerine) ve Görsel 5
              (opsiyonel loop) için.
            </p>
          </div>

          <Field
            label="Kapak görseli"
            hint="İsteğe bağlı — kart + detay üst banner."
            error={errors.kapak}
          >
            <CoverUpload
              value={form.kapak}
              onChange={(v) => patch("kapak", v)}
              previewAlt="Kapak görseli"
            />
          </Field>

          <div className="grid gap-6 sm:grid-cols-2">
            {GALERI_KEYS.map((key, i) => {
              const videoKey = GALERI_VIDEO_BY_SLOT[key];
              const videoRule = GALERI_VIDEO_SLOT_RULES.find(
                (r) => r.galeriKey === key,
              );
              return (
                <MediaSlotEditor
                  key={key}
                  label={`Görsel ${i + 1}`}
                  posterValue={form[key]}
                  posterOnChange={(v) => patch(key, v)}
                  posterError={errors[key]}
                  videoValue={videoKey ? form[videoKey] : undefined}
                  videoOnChange={
                    videoKey ? (v) => patch(videoKey, v) : undefined
                  }
                  allowVideoWithoutPoster={videoRule?.allowVideoOnly}
                  posterOptional={videoRule?.allowVideoOnly}
                />
              );
            })}
          </div>
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

              <Field
                label="Sonraki proje (manuel)"
                hint="Boş bırakılırsa kategori / featured kurallarına göre otomatik seçilir."
              >
                <input
                  type="text"
                  className="form-input"
                  value={form.next_project_override}
                  onChange={(e) => patch("next_project_override", e.target.value)}
                  placeholder="ornek-proje-slug"
                  pattern="[a-z0-9-]*"
                />
              </Field>
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
