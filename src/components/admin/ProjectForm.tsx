"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { Project, ProjectSection } from "@/types";
import { api } from "@/lib/api";
import { toast } from "@/components/ui/Toast";
import { Field } from "@/components/ui/Field";
import { TagInput } from "./TagInput";
import { SectionEditor } from "./SectionEditor";
import { CoverUpload } from "./CoverUpload";
import { GalleryUpload } from "./GalleryUpload";

type FormState = {
  baslik: string;
  kategori: string;
  aciklama: string;
  gorsel: string;
  gorseller: string[];
  bolumler: ProjectSection[];
  etiketler: string[];
  yil: string;
  musteri: string;
  rol: string;
  sure: string;
  link: string;
  featured: boolean;
  renk: string;
  slug: string;
};

const EMPTY: FormState = {
  baslik: "",
  kategori: "",
  aciklama: "",
  gorsel: "",
  gorseller: [],
  bolumler: [],
  etiketler: [],
  yil: "",
  musteri: "",
  rol: "",
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
    gorsel: p.gorsel ?? "",
    gorseller: [...p.gorseller],
    bolumler: [...p.bolumler],
    etiketler: [...p.etiketler],
    yil: p.yil,
    musteri: p.musteri,
    rol: p.rol,
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
  const router = useRouter();
  const [form, setForm] = useState<FormState>(
    project ? fromProject(project) : EMPTY,
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, start] = useTransition();

  function patch<K extends keyof FormState>(key: K, val: FormState[K]) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const localErrors: Record<string, string> = {};
    if (!form.baslik.trim()) localErrors.baslik = "Başlık zorunlu.";
    if (!form.kategori.trim()) localErrors.kategori = "Kategori zorunlu.";
    setErrors(localErrors);
    if (Object.keys(localErrors).length) return;

    start(async () => {
      try {
        const payload = {
          ...form,
          // Drop empty sections
          bolumler: form.bolumler.filter(
            (b) => b.baslik.trim() || b.metin.trim(),
          ),
        };
        if (mode === "create") {
          await api.createProject(payload);
          toast("Proje eklendi.");
        } else if (project) {
          await api.updateProject(project.id, payload);
          toast("Proje güncellendi.");
        }
        router.push("/admin");
        router.refresh();
      } catch (err) {
        toast((err as Error).message, "error");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="pb-20">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="h2">
          {mode === "create" ? "Yeni Proje" : "Projeyi Düzenle"}
        </h1>
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

      <div className="flex flex-col gap-5">
        <Field label="Kapak Görseli">
          <CoverUpload value={form.gorsel} onChange={(v) => patch("gorsel", v)} />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Proje Başlığı *" error={errors.baslik}>
            <input
              type="text"
              className="form-input"
              value={form.baslik}
              onChange={(e) => patch("baslik", e.target.value)}
              placeholder="Marka Kimliği — Karamel"
              maxLength={200}
            />
          </Field>
          <Field label="Kategori *" error={errors.kategori}>
            <input
              type="text"
              className="form-input"
              value={form.kategori}
              onChange={(e) => patch("kategori", e.target.value)}
              placeholder="Branding, UI/UX, Web…"
              maxLength={80}
            />
          </Field>
        </div>

        <Field label="Kısa Açıklama (kart metni)">
          <textarea
            className="form-textarea"
            rows={2}
            value={form.aciklama}
            onChange={(e) => patch("aciklama", e.target.value)}
            placeholder="Kartın üzerine gelince görünen 1-2 cümlelik özet."
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Müşteri">
            <input
              type="text"
              className="form-input"
              value={form.musteri}
              onChange={(e) => patch("musteri", e.target.value)}
              placeholder="Karamel Coffee"
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
          <Field label="Rolün">
            <input
              type="text"
              className="form-input"
              value={form.rol}
              onChange={(e) => patch("rol", e.target.value)}
              placeholder="Marka Tasarımcısı"
            />
          </Field>
          <Field label="Süre">
            <input
              type="text"
              className="form-input"
              value={form.sure}
              onChange={(e) => patch("sure", e.target.value)}
              placeholder="6 hafta"
            />
          </Field>
        </div>

        <Field label="Proje Linki" hint="https:// ile başlamalı.">
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

        <label className="b2 flex cursor-pointer items-center gap-2" style={{ color: "var(--ink-soft)" }}>
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => patch("featured", e.target.checked)}
            className="h-4 w-4"
            style={{ accentColor: "var(--accent)" }}
          />
          Öne çıkar (büyük kart — iki sütun genişliği)
        </label>

        <Field label="Galeri Görselleri">
          <GalleryUpload
            value={form.gorseller}
            onChange={(v) => patch("gorseller", v)}
          />
        </Field>

        <SectionEditor
          value={form.bolumler}
          onChange={(v) => patch("bolumler", v)}
        />

        {mode === "edit" && (
          <Field label="URL Slug" hint="Değiştirirsen eski linkler kırılır.">
            <input
              type="text"
              className="form-input"
              value={form.slug}
              onChange={(e) => patch("slug", e.target.value)}
              placeholder="karamel-branding"
              pattern="[a-z0-9-]+"
            />
          </Field>
        )}
      </div>
    </form>
  );
}
