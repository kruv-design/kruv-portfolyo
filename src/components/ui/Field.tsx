import type { ReactNode } from "react";

export function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="form-label">{label}</span>
      {children}
      {error ? (
        <span className="text-[11px]" style={{ color: "var(--danger)" }}>
          {error}
        </span>
      ) : hint ? (
        <span className="form-hint">{hint}</span>
      ) : null}
    </div>
  );
}
