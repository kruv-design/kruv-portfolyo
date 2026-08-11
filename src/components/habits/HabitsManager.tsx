"use client";

import { useState } from "react";
import type { Checks, Habit } from "@/lib/habits/types";
import { habitStreak } from "@/lib/habits/logic";

interface HabitsManagerProps {
  habits: Habit[];
  checks: Checks;
  today: string;
  onAdd: () => void;
  onEdit: (habit: Habit) => void;
  onToggleArchive: (habitId: string) => void;
  onDelete: (habitId: string) => void;
}

export function HabitsManager({
  habits,
  checks,
  today,
  onAdd,
  onEdit,
  onToggleArchive,
  onDelete,
}: HabitsManagerProps) {
  const active = habits.filter((h) => !h.archived).sort((a, b) => a.order - b.order);
  const archived = habits.filter((h) => h.archived).sort((a, b) => a.order - b.order);

  return (
    <div className="flex flex-col gap-3 px-4 pb-4">
      <h2 className="text-[17px] font-semibold text-ink">Habitler</h2>

      {active.length === 0 && archived.length === 0 ? (
        <p className="py-6 text-center text-[15px] text-ink-soft">
          Henüz habit yok — ilkini ekle.
        </p>
      ) : null}

      <ul className="flex flex-col gap-2.5">
        {active.map((habit) => (
          <HabitRow
            key={habit.id}
            habit={habit}
            streak={habitStreak(habit, checks, today)}
            onEdit={() => onEdit(habit)}
            onToggleArchive={() => onToggleArchive(habit.id)}
            onDelete={() => onDelete(habit.id)}
          />
        ))}
      </ul>

      <button
        type="button"
        onClick={onAdd}
        className="min-h-[54px] rounded-2xl bg-accent text-[16px] font-semibold text-[var(--white-fixed)] transition active:scale-[0.98]"
      >
        + Habit ekle
      </button>

      {archived.length > 0 ? (
        <>
          <p className="pt-3 text-[12px] font-medium uppercase tracking-wide text-ink-faint">
            Arşiv
          </p>
          <ul className="flex flex-col gap-2.5">
            {archived.map((habit) => (
              <HabitRow
                key={habit.id}
                habit={habit}
                streak={0}
                onEdit={() => onEdit(habit)}
                onToggleArchive={() => onToggleArchive(habit.id)}
                onDelete={() => onDelete(habit.id)}
              />
            ))}
          </ul>
        </>
      ) : null}
    </div>
  );
}

function HabitRow({
  habit,
  streak,
  onEdit,
  onToggleArchive,
  onDelete,
}: {
  habit: Habit;
  streak: number;
  onEdit: () => void;
  onToggleArchive: () => void;
  onDelete: () => void;
}) {
  const [confirming, setConfirming] = useState(false);

  return (
    <li
      className={`flex min-h-[64px] items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-2.5 ${
        habit.archived ? "opacity-60" : ""
      }`}
    >
      <span
        aria-hidden
        className="h-3 w-3 shrink-0 rounded-full"
        style={{ backgroundColor: habit.color }}
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-medium text-ink">{habit.name}</p>
        <p className="text-[12px] text-ink-faint">
          {habit.kind === "count"
            ? `hedef ${habit.target}${habit.unit ? ` ${habit.unit}` : ""} / gün`
            : "günde 1"}
          {streak > 0 ? ` · ✦ ${streak}` : ""}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-1.5">
        {confirming ? (
          <>
            <button
              type="button"
              onClick={onDelete}
              className="min-h-[44px] rounded-xl bg-[var(--danger-soft)] px-3 text-[13px] font-semibold text-[var(--danger)]"
            >
              Sil
            </button>
            <button
              type="button"
              onClick={() => setConfirming(false)}
              className="min-h-[44px] rounded-xl border border-border px-3 text-[13px] text-ink-soft"
            >
              Vazgeç
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              aria-label={`${habit.name} düzenle`}
              onClick={onEdit}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-[15px] text-ink-soft transition active:scale-90"
            >
              ✎
            </button>
            <button
              type="button"
              aria-label={habit.archived ? `${habit.name} arşivden çıkar` : `${habit.name} arşivle`}
              onClick={onToggleArchive}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-[15px] text-ink-soft transition active:scale-90"
            >
              {habit.archived ? "↩" : "▣"}
            </button>
            <button
              type="button"
              aria-label={`${habit.name} sil`}
              onClick={() => setConfirming(true)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-[15px] text-[var(--danger)] transition active:scale-90"
            >
              🗑
            </button>
          </>
        )}
      </div>
    </li>
  );
}
