"use client";

import type { Checks, Habit } from "@/lib/habits/types";
import { checkCount, habitStreak, isHabitDone } from "@/lib/habits/logic";

interface TrackListProps {
  habits: Habit[];
  checks: Checks;
  dateKey: string;
  today: string;
  onSetCount: (habitId: string, dateKey: string, count: number) => void;
  onAddHabit: () => void;
}

export function TrackList({
  habits,
  checks,
  dateKey,
  today,
  onSetCount,
  onAddHabit,
}: TrackListProps) {
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
    <ul className="flex flex-col gap-2.5 px-4 pb-4">
      {habits.map((habit) => {
        const count = checkCount(checks, dateKey, habit.id);
        const done = isHabitDone(habit, checks, dateKey);
        const streak = habitStreak(habit, checks, today);
        return (
          <li
            key={habit.id}
            className={`flex min-h-[64px] items-center gap-3 rounded-2xl border px-4 py-2.5 transition ${
              done ? "border-transparent bg-surface" : "border-border bg-surface"
            }`}
            style={done ? { boxShadow: `inset 0 0 0 1.5px ${habit.color}` } : undefined}
          >
            <span
              aria-hidden
              className="h-3 w-3 shrink-0 rounded-full"
              style={{ backgroundColor: habit.color }}
            />
            <div className="min-w-0 flex-1">
              <p className={`truncate text-[15px] font-medium ${done ? "text-ink" : "text-ink"}`}>
                {habit.name}
              </p>
              <p className="text-[12px] text-ink-faint">
                {habit.kind === "count"
                  ? `${count}/${habit.target}${habit.unit ? ` ${habit.unit}` : ""}`
                  : done
                    ? "tamam"
                    : "bekliyor"}
                {streak > 0 ? ` · ✦ ${streak}` : ""}
              </p>
            </div>
            {habit.kind === "boolean" ? (
              <button
                type="button"
                aria-label={done ? `${habit.name} işaretini kaldır` : `${habit.name} tamamla`}
                aria-pressed={done}
                onClick={() => onSetCount(habit.id, dateKey, done ? 0 : habit.target)}
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 text-[20px] transition active:scale-90 ${
                  done ? "border-transparent text-[var(--white-fixed)]" : "border-border-md text-ink-faint"
                }`}
                style={done ? { backgroundColor: habit.color } : undefined}
              >
                ✓
              </button>
            ) : (
              <div className="flex shrink-0 items-center gap-1.5">
                <button
                  type="button"
                  aria-label={`${habit.name} azalt`}
                  disabled={count === 0}
                  onClick={() => onSetCount(habit.id, dateKey, Math.max(0, count - 1))}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-[20px] text-ink-soft transition active:scale-90 disabled:opacity-30"
                >
                  −
                </button>
                <button
                  type="button"
                  aria-label={`${habit.name} artır`}
                  onClick={() =>
                    onSetCount(habit.id, dateKey, Math.min(habit.target, count + 1))
                  }
                  disabled={done}
                  className={`flex h-11 w-11 items-center justify-center rounded-full text-[20px] font-medium transition active:scale-90 ${
                    done ? "text-[var(--white-fixed)]" : "border border-border-md text-ink"
                  }`}
                  style={done ? { backgroundColor: habit.color } : undefined}
                >
                  {done ? "✓" : "+"}
                </button>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
