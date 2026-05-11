"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Project } from "@/types";
import { api } from "@/lib/api";
import { toast } from "@/components/ui/Toast";

export function ProjectList({ initial }: { initial: Project[] }) {
  const [items, setItems] = useState(initial);
  const [dragId, setDragId] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const router = useRouter();

  function onDragStart(id: string) {
    setDragId(id);
  }
  function onDragOver(e: React.DragEvent, overId: string) {
    e.preventDefault();
    if (!dragId || dragId === overId) return;
    const from = items.findIndex((p) => p.id === dragId);
    const to = items.findIndex((p) => p.id === overId);
    if (from === -1 || to === -1) return;
    const next = items.slice();
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setItems(next);
  }
  function onDragEnd() {
    if (!dragId) return;
    setDragId(null);
    start(async () => {
      try {
        await api.reorder(items.map((i) => i.id));
        toast("Sıralama güncellendi.");
        router.refresh();
      } catch (err) {
        toast((err as Error).message, "error");
      }
    });
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`"${name}" silinsin mi?`)) return;
    try {
      await api.deleteProject(id);
      setItems((xs) => xs.filter((x) => x.id !== id));
      toast("Proje silindi.");
      router.refresh();
    } catch (err) {
      toast((err as Error).message, "error");
    }
  }

  if (items.length === 0) {
    return (
      <div
        className="b2 py-16 text-center"
        style={{ color: "var(--b2-color)" }}
      >
        Henüz proje yok. İlk projeyi ekle!
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2" aria-busy={pending}>
      {items.map((p) => (
        <div
          key={p.id}
          draggable
          onDragStart={() => onDragStart(p.id)}
          onDragOver={(e) => onDragOver(e, p.id)}
          onDragEnd={onDragEnd}
          className="adm-card flex items-center gap-3.5 px-4 py-3.5 transition-colors"
          style={{
            opacity: dragId === p.id ? 0.5 : 1,
            cursor: dragId ? "grabbing" : "default",
          }}
        >
          <span
            className="select-none text-base"
            style={{ color: "var(--ink-faint)", cursor: "grab" }}
            aria-hidden="true"
            title="Sürükle"
          >
            ⠿
          </span>
          <div
            className="flex h-12 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded"
            style={{
              background: "var(--gray-80)",
              color: "var(--ink-faint)",
            }}
          >
            {p.gorsel ? (
              <Image src={p.gorsel} alt="" width={64} height={48} className="h-full w-full object-cover" />
            ) : (
              <span className="h4">{p.baslik.slice(0, 1)}</span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="b1 truncate font-medium" style={{ color: "var(--ink)" }}>
              {p.baslik}
            </div>
            <div className="b3 mt-0.5 lowercase" style={{ color: "var(--ink-faint)" }}>
              {p.kategori} · {p.yil || "—"} · {p.musteri || "—"}
            </div>
          </div>
          {p.featured && (
            <span
              className="b3 flex-shrink-0 rounded-full px-2 py-0.5 lowercase font-medium"
              style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
            >
              Öne Çıkar
            </span>
          )}
          <div className="flex flex-shrink-0 gap-1.5">
            <Link
              href={`/admin/projects/${p.id}/edit`}
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
      ))}
    </div>
  );
}
