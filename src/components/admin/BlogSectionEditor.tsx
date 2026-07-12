"use client";

import type { BlogSection } from "@/types";
import { CoverUpload } from "./CoverUpload";

export function BlogSectionEditor({
  value,
  onChange,
}: {
  value: BlogSection[];
  onChange: (next: BlogSection[]) => void;
}) {
  function update(idx: number, patch: Partial<BlogSection>) {
    const next = value.slice();
    next[idx] = { ...next[idx], ...patch };
    onChange(next);
  }
  function remove(idx: number) {
    onChange(value.filter((_, i) => i !== idx));
  }
  function move(idx: number, dir: -1 | 1) {
    const to = idx + dir;
    if (to < 0 || to >= value.length) return;
    const next = value.slice();
    const [moved] = next.splice(idx, 1);
    next.splice(to, 0, moved);
    onChange(next);
  }
  function add() {
    onChange([...value, { baslik: "", metin: "", title: "", text: "", gorsel: "" }]);
  }

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <span className="form-label">İçerik Bölümleri</span>
        <button type="button" className="btn btn-ghost btn-sm" onClick={add}>
          ＋ Bölüm Ekle
        </button>
      </div>
      <p className="form-hint">
        Her bölüm: ara başlık (H2) + metin + opsiyonel görsel. Sitede bu sırayla
        alt alta gösterilir. Paragraf ayırmak için metinde boş satır bırakın.
      </p>

      <div className="flex flex-col gap-2.5">
        {value.map((b, i) => (
          <div
            key={i}
            className="rounded-lg p-3.5"
            style={{
              background: "var(--gray-50)",
              border: "1px solid var(--adm-border)",
            }}
          >
            <div className="mb-2.5 flex items-center justify-between gap-2">
              <span className="b3 font-medium lowercase" style={{ color: "var(--ink-faint)" }}>
                Bölüm {i + 1}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  aria-label="Yukarı taşı"
                  className="rounded px-1.5 text-base transition-colors disabled:opacity-30"
                  style={{ color: "var(--ink-faint)" }}
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  disabled={i === value.length - 1}
                  aria-label="Aşağı taşı"
                  className="rounded px-1.5 text-base transition-colors disabled:opacity-30"
                  style={{ color: "var(--ink-faint)" }}
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => remove(i)}
                  aria-label="Kaldır"
                  className="rounded px-1.5 text-base transition-colors"
                  style={{ color: "var(--ink-faint)" }}
                >
                  ×
                </button>
              </div>
            </div>
            <input
              type="text"
              value={b.baslik}
              onChange={(e) => update(i, { baslik: e.target.value })}
              placeholder="Ara başlık TR (ör. Neden grid kullanıyoruz?)"
              className="form-input mb-2"
            />
            <textarea
              rows={5}
              value={b.metin}
              onChange={(e) => update(i, { metin: e.target.value })}
              placeholder="Metin TR…"
              className="form-textarea mb-2"
            />
            <input
              type="text"
              value={b.title ?? ""}
              onChange={(e) => update(i, { title: e.target.value })}
              placeholder="title EN (ör. Why Do We Use Grids?)"
              className="form-input mb-2"
            />
            <textarea
              rows={5}
              value={b.text ?? ""}
              onChange={(e) => update(i, { text: e.target.value })}
              placeholder="text EN…"
              className="form-textarea mb-3"
            />
            <CoverUpload
              value={b.gorsel ?? ""}
              onChange={(v) => update(i, { gorsel: v })}
              previewAlt={`Bölüm ${i + 1} görseli`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
