"use client";

import type { Checks, Habit } from "@/lib/habits/types";
import { TR_DAYS_SHORT } from "@/lib/habits/date";
import { checkCount } from "@/lib/habits/logic";

interface TrackGridProps {
  habits: Habit[];
  checks: Checks;
  days: string[];
  today: string;
  onCellTap: (habitId: string, dateKey: string) => void;
  onAddHabit: () => void;
}

export function TrackGrid({
  habits,
  checks,
  days,
  today,
  onCellTap,
  onAddHabit,
}: TrackGridProps) {
  if (habits.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 px-6 py-16 text-center">
        <p className="text-ink-soft text-[15px]">Henüz habit yok.</p>
        <button
          type="button"
          onClick={onAddHabit}
          className="min-h-[52px] w-full max-w-[280px] rounded-2xl bg-accent px-6 text-[16px] font-semibold text-[var(--white-fixed)] transition active:scale-[0.97]"
        >
          + Habit ekle
        </button>
      </div>
    );
  }

  return (
    <div className="px-3 pb-4">
      <div
        className="grid items-center gap-x-1 gap-y-1.5"
        style={{ gridTemplateColumns: "minmax(64px, 1fr) repeat(7, minmax(40px, 44px))" }}
      >
        <span aria-hidden />
        {days.map((day, i) => (
          <span
            key={day}
            className={`pb-1 text-center text-[11px] font-medium ${
              day === today ? "text-accent" : "text-ink-faint"
            }`}
          >
            {TR_DAYS_SHORT[i]}
          </span>
        ))}

        {habits.map((habit) => (
          <Row
            key={habit.id}
            habit={habit}
            checks={checks}
            days={days}
            today={today}
            onCellTap={onCellTap}
          />
        ))}
      </div>
      <p className="pt-3 text-center text-[12px] text-ink-faint">
        Hücreye dokun: işaretle · sayaçlı habit’te tekrar dokun +1
      </p>
    </div>
  );
}

function Row({
  habit,
  checks,
  days,
  today,
  onCellTap,
}: {
  habit: Habit;
  checks: Checks;
  days: string[];
  today: string;
  onCellTap: (habitId: string, dateKey: string) => void;
}) {
  return (
    <>
      <span className="flex min-w-0 items-center gap-1.5 pr-1">
        <span
          aria-hidden
          className="h-2 w-2 shrink-0 rounded-full"
          style={{ backgroundColor: habit.color }}
        />
        <span className="truncate text-[13px] font-medium text-ink">{habit.name}</span>
      </span>
      {days.map((day) => {
        const future = day > today;
        const count = checkCount(checks, day, habit.id);
        const full = count >= habit.target;
        const partial = count > 0 && !full;
        return (
          <button
            key={day}
            type="button"
            disabled={future}
            aria-label={`${habit.name} — ${day}${full ? " (tamam)" : partial ? ` (${count}/${habit.target})` : ""}`}
            onClick={() => onCellTap(habit.id, day)}
            className={`relative flex aspect-square min-h-[40px] items-center justify-center rounded-xl border text-[12px] font-semibold transition active:scale-90 ${
              future
                ? "border-border opacity-30"
                : full || partial
                  ? "border-transparent"
                  : "border-border-md"
            } ${day === today && !future ? "ring-1 ring-accent/60" : ""}`}
            style={
              full
                ? { backgroundColor: habit.color }
                : partial
                  ? { backgroundColor: `color-mix(in srgb, ${habit.color} 35%, transparent)` }
                  : undefined
            }
          >
            {full ? (
              <span className="text-[var(--white-fixed)]">✓</span>
            ) : partial ? (
              <span className="text-ink">{count}</span>
            ) : null}
          </button>
        );
      })}
    </>
  );
}
