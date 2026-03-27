"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { CalendarDays, Dumbbell, Hash, Layers3 } from "lucide-react";

const today = new Date().toISOString().slice(0, 10);

interface WorkoutFormProps {
  onAddWorkout: (workout: {
    id: string;
    date: string;
    exercise: string;
    weight: number;
    sets: number;
    reps: number;
  }) => void;
}

function FieldLabel({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <span className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-zinc-600">
      <Icon className="h-4 w-4 text-rose-500" />
      {label}
    </span>
  );
}

export function WorkoutForm({ onAddWorkout }: WorkoutFormProps) {
  const [date, setDate] = useState(today);
  const [exercise, setExercise] = useState("");
  const [weight, setWeight] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedExercise = exercise.trim();
    const parsedWeight = Number(weight);
    const parsedSets = Number(sets);
    const parsedReps = Number(reps);

    if (!trimmedExercise) {
      setErrorMessage("动作名称不能为空。");
      return;
    }

    if (
      Number.isNaN(parsedWeight) ||
      Number.isNaN(parsedSets) ||
      Number.isNaN(parsedReps) ||
      parsedWeight < 0 ||
      parsedSets < 0 ||
      parsedReps < 0
    ) {
      setErrorMessage("重量、组数和次数都必须是非负数字。");
      return;
    }

    onAddWorkout({
      id: Date.now().toString(),
      date,
      exercise: trimmedExercise,
      weight: parsedWeight,
      sets: parsedSets,
      reps: parsedReps,
    });

    setExercise("");
    setWeight("");
    setSets("");
    setReps("");
    setErrorMessage("");
  }

  return (
    <section className="rounded-[28px] bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)] ring-1 ring-black/5">
      <div className="mb-6">
        <p className="text-sm font-medium text-zinc-500">Quick Log</p>
        <h2 className="mt-1 text-xl font-semibold tracking-tight text-zinc-950">
          Add workout record
        </h2>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block">
          <FieldLabel icon={CalendarDays} label="Date" />
          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className="h-13 w-full rounded-2xl border-0 bg-zinc-50 px-4 text-base text-zinc-950 shadow-[inset_0_0_0_1px_rgba(15,23,42,0.06)] outline-none transition focus:bg-white focus:shadow-[inset_0_0_0_2px_rgba(244,63,94,0.35)]"
          />
        </label>

        <label className="block">
          <FieldLabel icon={Dumbbell} label="Exercise" />
          <input
            type="text"
            placeholder="Squat"
            value={exercise}
            onChange={(event) => setExercise(event.target.value)}
            className="h-13 w-full rounded-2xl border-0 bg-zinc-50 px-4 text-base text-zinc-950 shadow-[inset_0_0_0_1px_rgba(15,23,42,0.06)] outline-none transition placeholder:text-zinc-400 focus:bg-white focus:shadow-[inset_0_0_0_2px_rgba(244,63,94,0.35)]"
          />
        </label>

        <div className="grid grid-cols-3 gap-3">
          <label className="block">
            <FieldLabel icon={Layers3} label="Weight" />
            <div className="relative">
              <input
                type="number"
                placeholder="80"
                min="0"
                value={weight}
                onChange={(event) => setWeight(event.target.value)}
                className="h-13 w-full rounded-2xl border-0 bg-zinc-50 px-4 pr-10 text-base text-zinc-950 shadow-[inset_0_0_0_1px_rgba(15,23,42,0.06)] outline-none transition placeholder:text-zinc-400 focus:bg-white focus:shadow-[inset_0_0_0_2px_rgba(244,63,94,0.35)]"
              />
              <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm font-medium text-zinc-400">
                kg
              </span>
            </div>
          </label>

          <label className="block">
            <FieldLabel icon={Hash} label="Sets" />
            <input
              type="number"
              placeholder="4"
              min="0"
              value={sets}
              onChange={(event) => setSets(event.target.value)}
              className="h-13 w-full rounded-2xl border-0 bg-zinc-50 px-4 text-base text-zinc-950 shadow-[inset_0_0_0_1px_rgba(15,23,42,0.06)] outline-none transition placeholder:text-zinc-400 focus:bg-white focus:shadow-[inset_0_0_0_2px_rgba(244,63,94,0.35)]"
            />
          </label>

          <label className="block">
            <FieldLabel icon={Hash} label="Reps" />
            <input
              type="number"
              placeholder="8"
              min="0"
              value={reps}
              onChange={(event) => setReps(event.target.value)}
              className="h-13 w-full rounded-2xl border-0 bg-zinc-50 px-4 text-base text-zinc-950 shadow-[inset_0_0_0_1px_rgba(15,23,42,0.06)] outline-none transition placeholder:text-zinc-400 focus:bg-white focus:shadow-[inset_0_0_0_2px_rgba(244,63,94,0.35)]"
            />
          </label>
        </div>

        {errorMessage ? (
          <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
            {errorMessage}
          </p>
        ) : null}

        <button
          type="submit"
          className="mt-2 flex h-14 w-full items-center justify-center rounded-2xl bg-zinc-950 text-base font-semibold text-white shadow-[0_16px_30px_rgba(24,24,27,0.22)] transition-transform active:scale-[0.99]"
        >
          Save Workout
        </button>
      </form>
    </section>
  );
}
