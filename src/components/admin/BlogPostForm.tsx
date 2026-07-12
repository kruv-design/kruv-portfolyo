"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import type { BlogPost, BlogSection } from "@/types";
import { api } from "@/lib/api";
import { toast } from "@/components/ui/Toast";
import { Field } from "@/components/ui/Field";
import { CoverUpload } from "./CoverUpload";
import { BlogSectionEditor } from "./BlogSectionEditor";

type FormState = {
  baslik: string;
  title: string;
  aciklama: string;
  description: string;
  kapak: string;
  bolumler: BlogSection[];
  yayinda: boolean;
  slug: string;
};

const EMPTY: FormState = {
  baslik: "",
  title: "",
  aciklama: "",
  description: "",
  kapak: "",
  bolumler: [],
  yayinda: true,
  slug: "",
};

function fromPost(p: BlogPost): FormState {
  return {
    baslik: p.baslik,
    title: p.title,
    aciklama: p.aciklama,
    description: p.description,
    kapak: p.kapak,
    bolumler: [...p.bolumler],
    yayinda: p.yayinda,
    slug: p.slug,
  };
}

export function BlogPostForm({
  mode,
  post,
}: {
  mode: "create" | "edit";
  post?: BlogPost;
}) {
  const [form, setForm] = useState<FormState>(post ? fromPost(post) : EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  function patch<K extends keyof FormState>(key: K, val: FormState[K]) {
    setForm((f) => ({ ...f, [key]: val }));
    setFormError(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    const localErrors: Record<string, string> = {};
    if (!form.baslik.trim()) localErrors.baslik = "Başlık zorunlu.";
    setErrors(localErrors);
    if (Object.keys(localErrors).length) return;

    start(async () => {
      try {
        const payload = {
          ...form,
          bolumler: form.bolumler.filter(
            (b) => b.baslik.trim() || b.metin.trim() || (b.gorsel ?? "").trim(),
          ),
        };
        if (mode === "create") {
          await api.createBlogPost(payload);
          toast("Yazı eklendi.");
        } else if (post) {
          const updated = await api.updateBlogPost(post.id, payload);
          setForm(fromPost(updated));
          toast("Yazı güncellendi.");
        }
        window.location.assign("/admin/blog");
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
            {mode === "create" ? "Yeni yazı" : "Yazıyı düzenle"}
          </h1>
          <p className="b2 mt-2 max-w-xl" style={{ color: "var(--ink-faint)" }}>
            Blog yazılarını buradan yönetin. Yayındaki yazılar /blog listesinde
            yeniden eskiye sıralanır.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/blog" className="btn btn-ghost">
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

          <Field label="Başlık *" error={errors.baslik}>
            <input
              type="text"
              className="form-input"
              value={form.baslik}
              onChange={(e) => patch("baslik", e.target.value)}
              placeholder="ör. Tasarımın Görünmez İskeleti: Grid Sistemleri"
              maxLength={200}
            />
          </Field>

          <Field
            label="Giriş metni"
            hint="Başlığın hemen altında görünür; meta description olarak da kullanılır. Paragraf ayırmak için boş satır bırakın."
          >
            <textarea
              className="form-textarea"
              rows={5}
              value={form.aciklama}
              onChange={(e) => patch("aciklama", e.target.value)}
              placeholder="Yazının giriş paragraf(lar)ı…"
            />
          </Field>

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
              Supabase sütunları: <code>title</code>, <code>description</code>. Boş
              bırakılırsa İngilizce sitede Türkçe gösterilir.
            </p>
          </div>

          <Field label="title">
            <input
              type="text"
              className="form-input"
              value={form.title}
              onChange={(e) => patch("title", e.target.value)}
              placeholder="e.g. The Invisible Skeleton of Design: Grid Systems"
              maxLength={200}
            />
          </Field>

          <Field label="description">
            <textarea
              className="form-textarea"
              rows={5}
              value={form.description}
              onChange={(e) => patch("description", e.target.value)}
              placeholder="English intro paragraph(s)."
            />
          </Field>
        </section>

        <section
          className="flex flex-col gap-5 rounded-xl border p-5 sm:p-6"
          style={{ borderColor: "var(--adm-border)", background: "var(--adm-surface)" }}
        >
          <div>
            <h2 className="b1 font-semibold" style={{ color: "var(--ink)" }}>
              Kapak görseli
            </h2>
            <p className="b3 mt-2 max-w-2xl" style={{ color: "var(--ink-faint)" }}>
              /blog listesindeki kart görseli ve sosyal medya paylaşım (og) görseli.
            </p>
          </div>

          <Field label="Kapak" error={errors.kapak}>
            <CoverUpload
              value={form.kapak}
              onChange={(v) => patch("kapak", v)}
              previewAlt="Kapak görseli"
            />
          </Field>
        </section>

        <section
          className="flex flex-col gap-5 rounded-xl border p-5 sm:p-6"
          style={{ borderColor: "var(--adm-border)", background: "var(--adm-surface)" }}
        >
          <BlogSectionEditor
            value={form.bolumler}
            onChange={(v) => patch("bolumler", v)}
          />
        </section>

        {mode === "edit" ? (
          <section
            className="flex flex-col gap-5 rounded-xl border p-5 sm:p-6"
            style={{ borderColor: "var(--adm-border)", background: "var(--adm-surface)" }}
          >
            <Field label="URL slug" hint="Değiştirirsen eski link kırılır.">
              <input
                type="text"
                className="form-input"
                value={form.slug}
                onChange={(e) => patch("slug", e.target.value)}
                placeholder="grid-sistemleri"
                pattern="[a-z0-9-]+"
              />
            </Field>
          </section>
        ) : null}
      </div>

      <div
        className="sticky bottom-0 z-20 -mx-10 mt-10 flex flex-wrap items-center justify-end gap-2 border-t px-10 py-4"
        style={{
          background: "var(--adm-bg)",
          borderColor: "var(--adm-border)",
          boxShadow: "0 -12px 32px color-mix(in srgb, var(--gray-anti) 12%, transparent)",
        }}
      >
        <Link href="/admin/blog" className="btn btn-ghost">
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
