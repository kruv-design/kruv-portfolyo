"use client";

import { useState } from "react";
import type { Checks, Habit } from "@/lib/habits/types";
import {
  TR_DAYS_SHORT,
  addMonths,
  formatDayTitle,
  formatMonthTitle,
  monthGrid,
  monthOf,
} from "@/lib/habits/date";
import { dayStatus } from "@/lib/habits/logic";
import { TrackList } from "./TrackList";

interface MonthCalendarProps {
  habits: Habit[];
  checks: Checks;
  today: string;
  onSetCount: (habitId: string, dateKey: string, count: number) => void;
  onAddHabit: () => void;
}

export function MonthCalendar({
  habits,
  checks,
  today,
  onSetCount,
  onAddHabit,
}: MonthCalendarProps) {
  const [month, setMonth] = useState(() => monthOf(today));
  const [selected, setSelected] = useState(today);
  const cells = monthGrid(month);

  return (
    <div className="flex flex-col gap-4 pb-4">
      <div className="flex items-center justify-between px-4">
        <h2 className="text-[17px] font-semibold text-ink">{formatMonthTitle(month)}</h2>
        <div className="flex gap-1.5">
          <button
            type="button"
            aria-label="Önceki ay"
            onClick={() => setMonth((m) => addMonths(m, -1))}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-ink-soft transition active:scale-90"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Sonraki ay"
            onClick={() => setMonth((m) => addMonths(m, 1))}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-ink-soft transition active:scale-90"
          >
            ›
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 px-4">
        {TR_DAYS_SHORT.map((d) => (
          <span key={d} className="pb-1 text-center text-[11px] font-medium text-ink-faint">
            {d}
          </span>
        ))}
        {cells.map((day, i) =>
          day === null ? (
            <span key={`pad-${i}`} aria-hidden />
          ) : (
            <DayCell
              key={day}
              day={day}
              today={today}
              selected={selected === day}
              status={dayStatus(habits, checks, day)}
              onSelect={() => setSelected(day)}
            />
          ),
        )}
      </div>

      <div className="flex items-center justify-center gap-4 text-[11px] text-ink-faint">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-[4px] bg-accent" /> perfect
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-[4px] bg-accent-soft" /> kısmi
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-[4px] border border-border-md" /> boş
        </span>
      </div>

      <div className="border-t border-border pt-3">
        <p className="px-4 pb-2 text-[13px] font-medium text-ink-soft">
          {formatDayTitle(selected)}
        </p>
        <TrackList
          habits={habits}
          checks={checks}
          dateKey={selected}
          today={today}
          onSetCount={selected > today ? () => {} : onSetCount}
          onAddHabit={onAddHabit}
        />
      </div>
    </div>
  );
}

function DayCell({
  day,
  today,
  selected,
  status,
  onSelect,
}: {
  day: string;
  today: string;
  selected: boolean;
  status: ReturnType<typeof dayStatus>;
  onSelect: () => void;
}) {
  const num = Number(day.slice(8));
  const future = day > today;
  const base =
    status === "perfect" && !future
      ? "bg-accent text-[var(--white-fixed)]"
      : status === "partial" && !future
        ? "bg-accent-soft text-ink"
        : "text-ink-soft";
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-label={day}
      aria-pressed={selected}
      className={`flex aspect-square min-h-[42px] items-center justify-center rounded-xl text-[13px] font-medium transition active:scale-90 ${base} ${
        selected ? "ring-2 ring-accent" : day === today ? "ring-1 ring-accent/50" : ""
      } ${future ? "opacity-35" : ""}`}
    >
      {num}
    </button>
  );
}
