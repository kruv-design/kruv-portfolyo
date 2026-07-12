"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { BlogPost } from "@/types";
import { resolveProjectImageUrl } from "@/lib/project-images";
import { api } from "@/lib/api";
import { toast } from "@/components/ui/Toast";

function formatDate(iso: string): string {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

export function BlogPostList({ initial }: { initial: BlogPost[] }) {
  const [items, setItems] = useState(initial);
  const router = useRouter();

  useEffect(() => {
    setItems(initial);
  }, [initial]);

  async function handleToggleVisibility(id: string, current: boolean) {
    try {
      await api.toggleBlogVisibility(id, !current);
      setItems((xs) =>
        xs.map((x) => (x.id === id ? { ...x, yayinda: !current } : x)),
      );
      toast(!current ? "Yazı yayında." : "Yazı gizlendi.");
      router.refresh();
    } catch (err) {
      toast((err as Error).message, "error");
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`"${name}" silinsin mi?`)) return;
    try {
      await api.deleteBlogPost(id);
      setItems((xs) => xs.filter((x) => x.id !== id));
      toast("Yazı silindi.");
      router.refresh();
    } catch (err) {
      toast((err as Error).message, "error");
    }
  }

  if (items.length === 0) {
    return (
      <div className="b2 py-16 text-center" style={{ color: "var(--b2-color)" }}>
        <p className="font-medium" style={{ color: "var(--ink)" }}>
          Henüz blog yazısı yok.
        </p>
        <p className="mx-auto mt-3 max-w-lg" style={{ color: "var(--ink-faint)" }}>
          İlk yazıyı ekleyin; /blog sayfası canlı veriyi çeker.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {items.map((p) => {
        const cover = p.kapak ? resolveProjectImageUrl(p.kapak) : "";
        return (
          <div
            key={p.id}
            className="adm-card flex items-center gap-3.5 px-4 py-3.5 transition-colors"
          >
            <div
              className="flex h-12 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded"
              style={{
                background: "var(--gray-80)",
                color: "var(--ink-faint)",
              }}
            >
              {cover ? (
                <Image
                  src={cover}
                  alt=""
                  width={64}
                  height={48}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="h4">{p.baslik.slice(0, 1)}</span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="b1 truncate font-medium" style={{ color: "var(--ink)" }}>
                {p.baslik}
              </div>
              <div className="b3 mt-0.5 lowercase" style={{ color: "var(--ink-faint)" }}>
                {formatDate(p.created_at)}
              </div>
            </div>
            {!p.yayinda && (
              <span
                className="b3 flex-shrink-0 rounded-full px-2 py-0.5 lowercase font-medium"
                style={{ background: "var(--gray-100)", color: "var(--ink-faint)" }}
              >
                Gizli
              </span>
            )}
            <div className="flex flex-shrink-0 gap-1.5">
              <button
                type="button"
                title={p.yayinda ? "Gizle" : "Yayına al"}
                onClick={() => handleToggleVisibility(p.id, p.yayinda)}
                className="btn btn-ghost btn-sm"
                style={
                  p.yayinda
                    ? { color: "var(--ink-soft)" }
                    : { color: "var(--accent)", fontWeight: 600 }
                }
              >
                {p.yayinda ? "Gizle" : "Yayına Al"}
              </button>
              <Link
                href={`/admin/blog/${p.id}/edit`}
                className="btn btn-ghost btn-sm"
              >
                Düzenle
              </Link>
              <button
                type="button"
                onClick={() => handleDelete(p.id, p.baslik)}
                className="btn btn-danger btn-sm"
              >
                Sil
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
