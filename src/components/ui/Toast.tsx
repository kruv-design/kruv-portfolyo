"use client";

import { create } from "zustand";
import { useEffect } from "react";

type ToastKind = "success" | "error" | "info";
type ToastItem = { id: number; msg: string; kind: ToastKind };

type ToastStore = {
  items: ToastItem[];
  push: (msg: string, kind?: ToastKind) => void;
  remove: (id: number) => void;
};

export const useToastStore = create<ToastStore>((set) => ({
  items: [],
  push: (msg, kind = "success") => {
    const id = Date.now() + Math.random();
    set((s) => ({ items: [...s.items, { id, msg, kind }] }));
    setTimeout(() => {
      set((s) => ({ items: s.items.filter((i) => i.id !== id) }));
    }, 2800);
  },
  remove: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
}));

export function toast(msg: string, kind: ToastKind = "success") {
  useToastStore.getState().push(msg, kind);
}

export function ToastHost() {
  const items = useToastStore((s) => s.items);
  useEffect(() => {
    // no-op; kept for future portal logic
  }, []);
  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-2">
      {items.map((i) => (
        <div
          key={i.id}
          className="pointer-events-auto b2 rounded-lg px-4 py-2.5 font-medium text-white shadow-lg transition-all"
          style={{
            background:
              i.kind === "error"
                ? "var(--danger)"
                : i.kind === "info"
                  ? "var(--ink)"
                  : "var(--success)",
          }}
        >
          {i.msg}
        </div>
      ))}
    </div>
  );
}
