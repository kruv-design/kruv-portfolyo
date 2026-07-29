"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import type { DropPack } from "@/types";
import { api } from "@/lib/api";
import { Field } from "@/components/ui/Field";
import { toast } from "@/components/ui/Toast";

type FormState = {
  baslik: string;
  title: string;
  aciklama: string;
  description: string;
  kapak: string;
  pack_zip_url: string;
  sort_order: number;
  yayinda: boolean;
  slug: string;
};

function fromPack(p: DropPack): FormState {
  return {
    baslik: p.baslik,
    title: p.title,
    aciklama: p.aciklama,
    description: p.description,
    kapak: p.kapak,
    pack_zip_url: p.pack_zip_url,
    sort_order: p.sort_order,
    yayinda: p.yayinda,
    slug: p.slug,
  };
}

const EMPTY: FormState = {
  baslik: "",
  title: "",
  aciklama: "",
  description: "",
  kapak: "",
  pack_zip_url: "",
  sort_order: 0,
  yayinda: true,
  slug: "",
};

export function DropPackForm({
  mode,
  pack,
}: {
  mode: "create" | "edit";
  pack?: DropPack;
}) {
  const [form, setForm] = useState<FormState>(pack ? fromPack(pack) : EMPTY);
  const [pending, start] = useTransition();

  function patch<K extends keyof FormState>(key: K, val: FormState[K]) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    start(async () => {
      try {
        if (mode === "create") {
          await api.createDropPack(form);
          toast("Paket eklendi.");
        } else if (pack) {
          await api.updateDropPack(pack.id, form);
          toast("Paket güncellendi.");
        }
        window.location.assign("/admin/drops");
      } catch (err) {
        toast((err as Error).message, "error");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl flex flex-col gap-4">
      <Field label="Başlık (TR) *">
        <input className="input" value={form.baslik} onChange={(e) => patch("baslik", e.target.value)} required />
      </Field>
      <Field label="Title (EN)">
        <input className="input" value={form.title} onChange={(e) => patch("title", e.target.value)} />
      </Field>
      <Field label="Slug" hint="Boşsa başlıktan üretilir">
        <input className="input" value={form.slug} onChange={(e) => patch("slug", e.target.value)} />
      </Field>
      <Field label="Açıklama (TR)">
        <textarea className="input min-h-24" value={form.aciklama} onChange={(e) => patch("aciklama", e.target.value)} />
      </Field>
      <Field label="Description (EN)">
        <textarea className="input min-h-24" value={form.description} onChange={(e) => patch("description", e.target.value)} />
      </Field>
      <Field label="Kapak URL">
        <input className="input" value={form.kapak} onChange={(e) => patch("kapak", e.target.value)} />
      </Field>
      <Field label="Paket ZIP URL">
        <input className="input" value={form.pack_zip_url} onChange={(e) => patch("pack_zip_url", e.target.value)} />
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
        <Link href="/admin/drops" className="btn btn-secondary">
          İptal
        </Link>
      </div>
    </form>
  );
}
