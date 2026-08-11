"use client";

import type { Checks, Habit } from "@/lib/habits/types";
import { STREAK_MILESTONES } from "@/lib/habits/types";
import { weekDays, weekStart } from "@/lib/habits/date";
import { dayStreak, isPerfectDay, weekAchievements } from "@/lib/habits/logic";

interface AchievementsPanelProps {
  habits: Habit[];
  checks: Checks;
  today: string;
}

export function AchievementsPanel({ habits, checks, today }: AchievementsPanelProps) {
  const achievements = weekAchievements(habits, checks, today);
  const days = weekDays(weekStart(today)).filter((d) => d <= today);
  const perfectCount = days.filter((d) => isPerfectDay(habits, checks, d)).length;
  const streak = dayStreak(habits, checks, today);
  const reached = STREAK_MILESTONES.filter((m) => streak >= m);

  return (
    <div className="flex flex-col gap-4 px-4 pb-4">
      <div className="rounded-2xl border border-border bg-surface p-4">
        <p className="text-[13px] text-ink-soft">Bu hafta</p>
        <p className="pt-1 text-[24px] font-semibold text-ink">
          {perfectCount} <span className="text-[15px] font-normal text-ink-soft">perfect gün</span>
        </p>
      </div>

      <ul className="flex flex-col gap-2.5">
        {achievements.map((a) => (
          <li
            key={a.id}
            className={`flex min-h-[60px] items-center gap-3 rounded-2xl border px-4 py-2.5 ${
              a.unlocked ? "border-accent bg-accent-soft" : "border-border bg-surface opacity-70"
            }`}
          >
            <span
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[18px] ${
                a.unlocked ? "bg-accent text-[var(--white-fixed)]" : "border border-border-md text-ink-faint"
              }`}
              aria-hidden
            >
              {a.unlocked ? "★" : "☆"}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-medium text-ink">{a.name}</p>
              <p className="text-[12px] text-ink-faint">{a.desc}</p>
            </div>
            <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-faint">
              {a.unlocked ? "açık" : "kilitli"}
            </span>
          </li>
        ))}
      </ul>

      <div className="rounded-2xl border border-border bg-surface p-4">
        <p className="pb-2 text-[13px] text-ink-soft">Zincir dönüm noktaları</p>
        <div className="flex flex-wrap gap-2">
          {STREAK_MILESTONES.map((m) => (
            <span
              key={m}
              className={`rounded-full px-3 py-1.5 text-[13px] font-medium ${
                reached.includes(m)
                  ? "bg-accent text-[var(--white-fixed)]"
                  : "border border-border text-ink-faint"
              }`}
            >
              ✦ {m}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
