"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import type { DropFont } from "@/types";
import { api } from "@/lib/api";
import { Field } from "@/components/ui/Field";
import { toast } from "@/components/ui/Toast";

type FormState = {
  pack_id: string;
  name: string;
  slug: string;
  aciklama: string;
  description: string;
  preview_text: string;
  tester_default_text: string;
  tester_placeholder: string;
  hero_image: string;
  font_file_url: string;
  font_preview_url: string;
  sort_order: number;
  yayinda: boolean;
};

function fromFont(f: DropFont): FormState {
  return {
    pack_id: f.pack_id,
    name: f.name,
    slug: f.slug,
    aciklama: f.aciklama,
    description: f.description,
    preview_text: f.preview_text,
    tester_default_text: f.tester_default_text,
    tester_placeholder: f.tester_placeholder,
    hero_image: f.hero_image,
    font_file_url: f.font_file_url,
    font_preview_url: f.font_preview_url,
    sort_order: f.sort_order,
    yayinda: f.yayinda,
  };
}

export function DropFontForm({
  mode,
  packId,
  font,
  backHref,
}: {
  mode: "create" | "edit";
  packId: string;
  font?: DropFont;
  backHref: string;
}) {
  const [form, setForm] = useState<FormState>(
    font
      ? fromFont(font)
      : {
          pack_id: packId,
          name: "",
          slug: "",
          aciklama: "",
          description: "",
          preview_text: "",
          tester_default_text: "",
          tester_placeholder: "",
          hero_image: "",
          font_file_url: "",
          font_preview_url: "",
          sort_order: 0,
          yayinda: true,
        },
  );
  const [pending, start] = useTransition();

  function patch<K extends keyof FormState>(key: K, val: FormState[K]) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    start(async () => {
      try {
        const payload = { ...form, specimen_blocks: font?.specimen_blocks ?? [] };
        if (mode === "create") {
          await api.createDropFont(payload);
          toast("Font eklendi.");
        } else if (font) {
          await api.updateDropFont(font.id, payload);
          toast("Font güncellendi.");
        }
        window.location.assign(backHref);
      } catch (err) {
        toast((err as Error).message, "error");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl flex flex-col gap-4">
      <Field label="Font adı *">
        <input className="input" value={form.name} onChange={(e) => patch("name", e.target.value)} required />
      </Field>
      <Field label="Slug">
        <input className="input" value={form.slug} onChange={(e) => patch("slug", e.target.value)} />
      </Field>
      <Field label="Kart metni">
        <input className="input" value={form.preview_text} onChange={(e) => patch("preview_text", e.target.value)} />
      </Field>
      <Field label="Tester varsayılan metin">
        <input className="input" value={form.tester_default_text} onChange={(e) => patch("tester_default_text", e.target.value)} />
      </Field>
      <Field label="Açıklama (TR)">
        <textarea className="input min-h-24" value={form.aciklama} onChange={(e) => patch("aciklama", e.target.value)} />
      </Field>
      <Field label="Description (EN)">
        <textarea className="input min-h-24" value={form.description} onChange={(e) => patch("description", e.target.value)} />
      </Field>
      <Field label="Hero görsel URL">
        <input className="input" value={form.hero_image} onChange={(e) => patch("hero_image", e.target.value)} />
      </Field>
      <Field label="Preview woff2 URL">
        <input className="input" value={form.font_preview_url} onChange={(e) => patch("font_preview_url", e.target.value)} />
      </Field>
      <Field label="İndirme dosyası URL (zip/otf)">
        <input className="input" value={form.font_file_url} onChange={(e) => patch("font_file_url", e.target.value)} />
      </Field>
      <Field label="Sıra">
        <input
          className="input"
          type="number"
          value={form.sort_order}
          onChange={(e) => patch("sort_order", Number(e.target.value) || 0)}
        />
      </Field>
      <label className="flex items-center gap-2 b2">
        <input type="checkbox" checked={form.yayinda} onChange={(e) => patch("yayinda", e.target.checked)} />
        Yayında
      </label>
      <div className="flex gap-2">
        <button type="submit" className="btn btn-primary" disabled={pending}>
          Kaydet
        </button>
        <Link href={backHref} className="btn btn-secondary">
          İptal
        </Link>
      </div>
    </form>
  );
}
