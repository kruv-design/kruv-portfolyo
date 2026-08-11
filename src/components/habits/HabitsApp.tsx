"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  STREAK_MILESTONES,
  type Habit,
  type HabitsState,
  type TabId,
  type TrackView,
} from "@/lib/habits/types";
import { addDays, formatDayShort, formatDayTitle, todayKey, weekDays, weekStart } from "@/lib/habits/date";
import { activeHabits, dayStreak, isHabitDone, isPerfectDay } from "@/lib/habits/logic";
import { loadState, saveState } from "@/lib/habits/storage";
import { TrackList } from "./TrackList";
import { TrackGrid } from "./TrackGrid";
import { MonthCalendar } from "./MonthCalendar";
import { HabitsManager } from "./HabitsManager";
import { HabitFormSheet, type HabitFormValues } from "./HabitFormSheet";
import { AchievementsPanel } from "./AchievementsPanel";

type SheetState = { mode: "create" } | { mode: "edit"; habit: Habit } | null;

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: "track", label: "Takip", icon: "✓" },
  { id: "calendar", label: "Takvim", icon: "▦" },
  { id: "habits", label: "Habitler", icon: "≡" },
  { id: "awards", label: "Başarı", icon: "★" },
];

export function HabitsApp() {
  const [state, setState] = useState<HabitsState | null>(null);
  const [tab, setTab] = useState<TabId>("track");
  const [sheet, setSheet] = useState<SheetState>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [gridWeekStart, setGridWeekStart] = useState(() => weekStart(todayKey()));
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const today = todayKey();

  useEffect(() => {
    setState(loadState());
  }, []);

  useEffect(() => {
    if (state) saveState(state);
  }, [state]);

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  }, []);

  const setCount = useCallback(
    (habitId: string, dateKey: string, count: number) => {
      setState((prev) => {
        if (!prev) return prev;
        const day = { ...(prev.checks[dateKey] ?? {}) };
        if (count <= 0) {
          delete day[habitId];
        } else {
          day[habitId] = count;
        }
        const checks = { ...prev.checks, [dateKey]: day };
        const next: HabitsState = { ...prev, checks };

        const streak = dayStreak(next.habits, checks, today);
        const milestone = STREAK_MILESTONES.find(
          (m) => streak >= m && !prev.prefs.celebratedMilestones.includes(m),
        );
        if (milestone && isPerfectDay(next.habits, checks, today)) {
          next.prefs = {
            ...prev.prefs,
            celebratedMilestones: [...prev.prefs.celebratedMilestones, milestone],
          };
          showToast(`✦ ${milestone} günlük zincir!`);
        }
        return next;
      });
    },
    [showToast, today],
  );

  const cycleCell = useCallback(
    (habitId: string, dateKey: string) => {
      setState((prev) => {
        if (!prev) return prev;
        const habit = prev.habits.find((h) => h.id === habitId);
        if (!habit) return prev;
        const current = prev.checks[dateKey]?.[habitId] ?? 0;
        const next = current >= habit.target ? 0 : current + 1;
        const day = { ...(prev.checks[dateKey] ?? {}) };
        if (next === 0) delete day[habitId];
        else day[habitId] = next;
        return { ...prev, checks: { ...prev.checks, [dateKey]: day } };
      });
    },
    [],
  );

  const saveHabit = useCallback(
    (values: HabitFormValues) => {
      setState((prev) => {
        if (!prev) return prev;
        if (sheet?.mode === "edit") {
          return {
            ...prev,
            habits: prev.habits.map((h) =>
              h.id === sheet.habit.id ? { ...h, ...values, unit: values.unit || undefined } : h,
            ),
          };
        }
        const habit: Habit = {
          id: crypto.randomUUID(),
          name: values.name,
          kind: values.kind,
          target: values.target,
          unit: values.unit || undefined,
          color: values.color,
          archived: false,
          order: prev.habits.length,
          createdAt: new Date().toISOString(),
        };
        return { ...prev, habits: [...prev.habits, habit] };
      });
      setSheet(null);
    },
    [sheet],
  );

  const toggleArchive = useCallback((habitId: string) => {
    setState((prev) =>
      prev
        ? {
            ...prev,
            habits: prev.habits.map((h) =>
              h.id === habitId ? { ...h, archived: !h.archived } : h,
            ),
          }
        : prev,
    );
  }, []);

  const deleteHabit = useCallback((habitId: string) => {
    setState((prev) => {
      if (!prev) return prev;
      const checks = Object.fromEntries(
        Object.entries(prev.checks).map(([date, day]) => {
          const rest = { ...day };
          delete rest[habitId];
          return [date, rest];
        }),
      );
      return {
        ...prev,
        habits: prev.habits.filter((h) => h.id !== habitId),
        checks,
      };
    });
  }, []);

  const setView = useCallback((view: TrackView) => {
    setState((prev) => (prev ? { ...prev, prefs: { ...prev.prefs, view } } : prev));
  }, []);

  if (!state) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <span className="text-[14px] text-ink-faint">Yükleniyor…</span>
      </div>
    );
  }

  const habits = activeHabits(state.habits);
  const doneCount = habits.filter((h) => isHabitDone(h, state.checks, today)).length;
  const streak = dayStreak(state.habits, state.checks, today);
  const gridDays = weekDays(gridWeekStart);
  const view = state.prefs.view;

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col">
      <header className="sticky top-0 z-30 border-b border-border bg-bg/95 px-4 pb-3 pt-[max(env(safe-area-inset-top),14px)] backdrop-blur">
        <div className="flex items-baseline justify-between">
          <p className="text-[15px] font-semibold text-ink">
            <span className="text-accent">✦ {streak}</span> gün
          </p>
          <p className="text-[13px] text-ink-soft">{formatDayTitle(today)}</p>
        </div>
        {tab === "track" ? (
          <div className="mt-3 flex flex-col gap-2.5">
            <div
              className="grid grid-cols-2 rounded-2xl border border-border p-1"
              role="tablist"
              aria-label="Görünüm"
            >
              {(
                [
                  ["list", "Liste"],
                  ["grid", "Grid"],
                ] as const
              ).map(([v, label]) => (
                <button
                  key={v}
                  type="button"
                  role="tab"
                  aria-selected={view === v}
                  onClick={() => setView(v)}
                  className={`min-h-[42px] rounded-xl text-[14px] font-medium transition ${
                    view === v ? "bg-accent text-[var(--white-fixed)]" : "text-ink-soft"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            {habits.length > 0 && view === "list" ? (
              <div className="flex items-center gap-2.5">
                <span className="text-[12px] text-ink-faint">
                  {doneCount}/{habits.length}
                </span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-border">
                  <div
                    className="h-full rounded-full bg-accent transition-all"
                    style={{ width: `${habits.length ? (doneCount / habits.length) * 100 : 0}%` }}
                  />
                </div>
              </div>
            ) : null}
            {view === "grid" ? (
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-ink-faint">
                  {formatDayShort(gridDays[0])} – {formatDayShort(gridDays[6])}
                </span>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    aria-label="Önceki hafta"
                    onClick={() => setGridWeekStart((s) => addDays(s, -7))}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-ink-soft transition active:scale-90"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    aria-label="Sonraki hafta"
                    disabled={addDays(gridWeekStart, 7) > today}
                    onClick={() => setGridWeekStart((s) => addDays(s, 7))}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-ink-soft transition active:scale-90 disabled:opacity-30"
                  >
                    ›
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
      </header>

      <main className="flex-1 overflow-y-auto pt-4">
        {tab === "track" ? (
          view === "list" ? (
            <TrackList
              habits={habits}
              checks={state.checks}
              dateKey={today}
              today={today}
              onSetCount={setCount}
              onAddHabit={() => setSheet({ mode: "create" })}
            />
          ) : (
            <TrackGrid
              habits={habits}
              checks={state.checks}
              days={gridDays}
              today={today}
              onCellTap={cycleCell}
              onAddHabit={() => setSheet({ mode: "create" })}
            />
          )
        ) : null}
        {tab === "calendar" ? (
          <MonthCalendar
            habits={habits}
            checks={state.checks}
            today={today}
            onSetCount={setCount}
            onAddHabit={() => setSheet({ mode: "create" })}
          />
        ) : null}
        {tab === "habits" ? (
          <HabitsManager
            habits={state.habits}
            checks={state.checks}
            today={today}
            onAdd={() => setSheet({ mode: "create" })}
            onEdit={(habit) => setSheet({ mode: "edit", habit })}
            onToggleArchive={toggleArchive}
            onDelete={deleteHabit}
          />
        ) : null}
        {tab === "awards" ? (
          <AchievementsPanel habits={state.habits} checks={state.checks} today={today} />
        ) : null}
      </main>

      {toast ? (
        <div className="pointer-events-none fixed inset-x-0 bottom-[calc(76px+env(safe-area-inset-bottom))] z-40 flex justify-center px-6">
          <p className="animate-fadeUp rounded-full bg-accent px-5 py-2.5 text-[14px] font-semibold text-[var(--white-fixed)] shadow-lg">
            {toast}
          </p>
        </div>
      ) : null}

      <nav
        aria-label="Bölümler"
        className="sticky bottom-0 z-30 grid grid-cols-4 border-t border-border bg-bg/95 pb-[max(env(safe-area-inset-bottom),8px)] pt-1.5 backdrop-blur"
      >
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            aria-current={tab === t.id ? "page" : undefined}
            onClick={() => setTab(t.id)}
            className={`flex min-h-[52px] flex-col items-center justify-center gap-0.5 transition active:scale-95 ${
              tab === t.id ? "text-accent" : "text-ink-faint"
            }`}
          >
            <span aria-hidden className="text-[17px] leading-none">
              {t.icon}
            </span>
            <span className="text-[11px] font-medium">{t.label}</span>
          </button>
        ))}
      </nav>

      {sheet ? (
        <HabitFormSheet
          habit={sheet.mode === "edit" ? sheet.habit : undefined}
          onSave={saveHabit}
          onClose={() => setSheet(null)}
        />
      ) : null}
    </div>
  );
}
