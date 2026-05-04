"use client";

import { useRef, useState } from "react";

export function TagInput({
  value,
  onChange,
  placeholder = "Yaz ve Enter'a bas…",
}: {
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function commit() {
    const t = draft.trim();
    if (!t) return;
    if (value.includes(t)) {
      setDraft("");
      return;
    }
    onChange([...value, t]);
    setDraft("");
  }

  return (
    <div
      role="group"
      aria-label="Etiketler"
      onClick={() => inputRef.current?.focus()}
      className="flex min-h-[40px] cursor-text flex-wrap items-center gap-1.5 rounded-md px-2.5 py-2 transition-colors focus-within:[border-color:var(--ink)]"
      style={{
        border: "1px solid var(--adm-border)",
        background: "var(--adm-surface)",
      }}
    >
      {value.map((tag, i) => (
        <span
          key={tag + i}
          className="inline-flex items-center gap-1.5 rounded-full py-0.5 pl-2.5 pr-2 b3 normal-case"
          style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
        >
          {tag}
          <button
            type="button"
            onClick={() => onChange(value.filter((_, idx) => idx !== i))}
            aria-label={`Kaldır: ${tag}`}
            className="b2 leading-none opacity-70 hover:opacity-100"
            style={{ color: "var(--accent)" }}
          >
            ×
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            commit();
          } else if (e.key === "Backspace" && !draft && value.length) {
            onChange(value.slice(0, -1));
          }
        }}
        onBlur={commit}
        placeholder={value.length ? "" : placeholder}
        className="b2 min-w-[80px] flex-1 border-0 bg-transparent outline-none"
        style={{ color: "var(--ink)" }}
      />
    </div>
  );
}
