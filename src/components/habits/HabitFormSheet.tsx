"use client";

import { useEffect, useState } from "react";
import { HABIT_COLORS, type Habit, type HabitKind } from "@/lib/habits/types";

export interface HabitFormValues {
  name: string;
  kind: HabitKind;
  target: number;
  unit: string;
  color: string;
}

interface HabitFormSheetProps {
  habit?: Habit;
  onSave: (values: HabitFormValues) => void;
  onClose: () => void;
}

export function HabitFormSheet({ habit, onSave, onClose }: HabitFormSheetProps) {
  const [name, setName] = useState(habit?.name ?? "");
  const [kind, setKind] = useState<HabitKind>(habit?.kind ?? "boolean");
  const [target, setTarget] = useState(habit?.target ?? 1);
  const [unit, setUnit] = useState(habit?.unit ?? "");
  const [color, setColor] = useState(habit?.color ?? HABIT_COLORS[0]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const valid = name.trim().length > 0 && target >= 1;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <button
        type="button"
        aria-label="Kapat"
        onClick={onClose}
        className="absolute inset-0 bg-[var(--gray-scrim-600)]"
      />
      <div className="relative rounded-t-3xl border-t border-border bg-surface px-5 pb-[max(env(safe-area-inset-bottom),20px)] pt-5">
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-border-md" aria-hidden />
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-[17px] font-semibold text-ink">
            {habit ? "Habit düzenle" : "Habit ekle"}
          </h2>
          <button
            type="button"
            aria-label="Kapat"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-ink-soft"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Habit adı — ör. 2 lt su"
            autoFocus={!habit}
            className="min-h-[52px] rounded-2xl border border-border-md bg-bg px-4 text-[16px] text-ink outline-none placeholder:text-ink-faint focus:border-accent"
          />

          <div className="flex gap-2" role="radiogroup" aria-label="Renk">
            {HABIT_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                role="radio"
                aria-checked={color === c}
                aria-label={`Renk ${c}`}
                onClick={() => setColor(c)}
                className={`h-10 w-10 rounded-full transition active:scale-90 ${
                  color === c ? "ring-2 ring-ink ring-offset-2 ring-offset-surface" : ""
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Tür">
            <button
              type="button"
              role="radio"
              aria-checked={kind === "boolean"}
              onClick={() => {
                setKind("boolean");
                setTarget(1);
              }}
              className={`min-h-[48px] rounded-2xl border text-[15px] font-medium transition ${
                kind === "boolean"
                  ? "border-accent bg-accent-soft text-ink"
                  : "border-border text-ink-soft"
              }`}
            >
              Tek tik
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={kind === "count"}
              onClick={() => {
                setKind("count");
                if (target < 2) setTarget(2);
              }}
              className={`min-h-[48px] rounded-2xl border text-[15px] font-medium transition ${
                kind === "count"
                  ? "border-accent bg-accent-soft text-ink"
                  : "border-border text-ink-soft"
              }`}
            >
              Sayılı hedef
            </button>
          </div>

          {kind === "count" ? (
            <div className="flex items-center gap-3">
              <span className="flex-1 text-[14px] text-ink-soft">Günlük hedef</span>
              <button
                type="button"
                aria-label="Hedefi azalt"
                disabled={target <= 1}
                onClick={() => setTarget((t) => Math.max(1, t - 1))}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-border-md text-[20px] text-ink disabled:opacity-30"
              >
                −
              </button>
              <span className="w-8 text-center text-[18px] font-semibold text-ink">{target}</span>
              <button
                type="button"
                aria-label="Hedefi artır"
                onClick={() => setTarget((t) => Math.min(20, t + 1))}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-border-md text-[20px] text-ink"
              >
                +
              </button>
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="birim"
                className="min-h-[44px] w-20 rounded-xl border border-border bg-bg px-3 text-center text-[14px] text-ink outline-none placeholder:text-ink-faint focus:border-accent"
              />
            </div>
          ) : null}

          <button
            type="button"
            disabled={!valid}
            onClick={() =>
              onSave({ name: name.trim(), kind, target: kind === "boolean" ? 1 : target, unit: unit.trim(), color })
            }
            className="min-h-[54px] rounded-2xl bg-accent text-[16px] font-semibold text-[var(--white-fixed)] transition active:scale-[0.98] disabled:opacity-40"
          >
            Kaydet
          </button>
        </div>
      </div>
    </div>
  );
}
