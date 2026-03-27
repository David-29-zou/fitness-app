"use client";

import { ChevronRight, Clock3, Dumbbell } from "lucide-react";

interface WorkoutItem {
  id: string;
  date: string;
  exercise: string;
  weight: number;
  sets: number;
  reps: number;
}

interface HistoryListProps {
  workouts: WorkoutItem[];
  loading?: boolean;
}

export function HistoryList({ workouts, loading }: HistoryListProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between px-1">
        <div>
          <p className="text-sm font-medium text-zinc-500">Recent Entries</p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-zinc-950">
            Workout history
          </h2>
        </div>
        <button
          type="button"
          className="text-sm font-medium text-rose-500 transition hover:text-rose-600"
        >
          View all
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center rounded-[28px] bg-white px-6 py-12 text-center shadow-[0_18px_40px_rgba(15,23,42,0.06)] ring-1 ring-black/5">
          <p className="text-base font-medium text-zinc-400">Loading…</p>
        </div>
      ) : workouts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[28px] bg-white px-6 py-12 text-center shadow-[0_18px_40px_rgba(15,23,42,0.06)] ring-1 ring-black/5">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 text-zinc-300">
            <Dumbbell className="h-8 w-8" />
          </div>
          <p className="text-base font-medium text-zinc-500">
            No workout logged today. Start your first set.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {workouts.map((workout) => (
            <article
              key={workout.id}
              className="rounded-[24px] bg-white p-4 shadow-[0_18px_40px_rgba(15,23,42,0.06)] ring-1 ring-black/5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-600">
                    <Clock3 className="h-3.5 w-3.5" />
                    {workout.date}
                  </div>
                  <h3 className="mt-3 text-lg font-semibold text-zinc-950">
                    {workout.exercise}
                  </h3>
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-50 text-zinc-400">
                  <ChevronRight className="h-4 w-4" />
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="rounded-2xl bg-zinc-50 px-3 py-3">
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">
                    Weight
                  </p>
                  <p className="mt-2 text-sm font-semibold text-zinc-950">
                    {workout.weight} kg
                  </p>
                </div>
                <div className="rounded-2xl bg-zinc-50 px-3 py-3">
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">
                    Sets
                  </p>
                  <p className="mt-2 text-sm font-semibold text-zinc-950">
                    {workout.sets} sets
                  </p>
                </div>
                <div className="rounded-2xl bg-zinc-50 px-3 py-3">
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">
                    Reps
                  </p>
                  <p className="mt-2 text-sm font-semibold text-zinc-950">
                    {workout.reps} reps
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
