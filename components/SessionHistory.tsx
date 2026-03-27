"use client";

import { Dumbbell, Pencil } from "lucide-react";
import type { Session, Topic } from "@/lib/types";

const TOPIC_STYLE: Record<Topic, { bg: string; text: string; label: string }> = {
  chest:     { bg: "bg-rose-50",    text: "text-rose-600",    label: "Chest" },
  back:      { bg: "bg-blue-50",    text: "text-blue-600",    label: "Back" },
  shoulders: { bg: "bg-amber-50",   text: "text-amber-600",   label: "Shoulders" },
  legs:      { bg: "bg-emerald-50", text: "text-emerald-600", label: "Legs" },
};

interface Props {
  sessions: Session[];
  loading?: boolean;
  onEdit: (session: Session) => void;
}

export function SessionHistory({ sessions, loading, onEdit }: Props) {
  return (
    <section className="space-y-4">
      <div className="px-1">
        <p className="text-sm font-medium text-zinc-500">Past Workouts</p>
        <h2 className="mt-1 text-xl font-semibold tracking-tight text-zinc-950">
          Session history
        </h2>
      </div>

      {loading ? (
        <div className="flex items-center justify-center rounded-[28px] bg-white px-6 py-12 shadow-[0_18px_40px_rgba(15,23,42,0.06)] ring-1 ring-black/5">
          <p className="text-base font-medium text-zinc-400">Loading…</p>
        </div>
      ) : sessions.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[28px] bg-white px-6 py-12 text-center shadow-[0_18px_40px_rgba(15,23,42,0.06)] ring-1 ring-black/5">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 text-zinc-300">
            <Dumbbell className="h-8 w-8" />
          </div>
          <p className="text-base font-medium text-zinc-500">
            No sessions yet. Log your first one!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((session) => {
            const style = TOPIC_STYLE[session.topic];
            return (
              <article
                key={session.id}
                className="rounded-[24px] bg-white p-4 shadow-[0_18px_40px_rgba(15,23,42,0.06)] ring-1 ring-black/5"
              >
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${style.bg} ${style.text}`}
                    >
                      {style.label}
                    </span>
                    <span className="text-sm text-zinc-400">{session.date}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onEdit(session)}
                    aria-label="Edit session"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-50 text-zinc-400 transition hover:bg-rose-50 hover:text-rose-500"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="space-y-2">
                  {session.movements.map((m) => {
                    const maxWeight = Math.max(...m.sets.map((s) => s.weight));
                    return (
                      <div
                        key={m.id}
                        className="flex items-center justify-between rounded-2xl bg-zinc-50 px-3 py-2.5"
                      >
                        <span className="text-sm font-medium text-zinc-950">{m.exercise}</span>
                        <span className="text-xs text-zinc-500">
                          {m.sets.length} sets · {maxWeight} kg max
                        </span>
                      </div>
                    );
                  })}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
