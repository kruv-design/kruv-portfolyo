"use client";

import type { ProjectSection } from "@/types";

export function SectionEditor({
  value,
  onChange,
}: {
  value: ProjectSection[];
  onChange: (next: ProjectSection[]) => void;
}) {
  function update(idx: number, patch: Partial<ProjectSection>) {
    const next = value.slice();
    next[idx] = { ...next[idx], ...patch };
    onChange(next);
  }
  function remove(idx: number) {
    onChange(value.filter((_, i) => i !== idx));
  }
  function add() {
    onChange([...value, { baslik: "", metin: "" }]);
  }

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <span className="form-label">Metin Bölümleri</span>
        <button type="button" className="btn btn-ghost btn-sm" onClick={add}>
          ＋ Bölüm Ekle
        </button>
      </div>

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
              <span className="b3 font-medium normal-case" style={{ color: "var(--ink-faint)" }}>
                Bölüm {i + 1}
              </span>
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
            <input
              type="text"
              value={b.baslik}
              onChange={(e) => update(i, { baslik: e.target.value })}
              placeholder="Başlık (ör. Süreç)"
              className="form-input mb-2"
            />
            <textarea
              rows={3}
              value={b.metin}
              onChange={(e) => update(i, { metin: e.target.value })}
              placeholder="Bölüm metni…"
              className="form-textarea"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
