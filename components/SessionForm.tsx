"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { CalendarDays, Check, Plus, Trash2, X } from "lucide-react";
import type { Session, Topic } from "@/lib/types";
import { PRESETS } from "@/lib/presets";

const today = new Date().toISOString().slice(0, 10);

const TOPICS: { value: Topic; label: string; activeClass: string }[] = [
  { value: "chest",     label: "Chest",     activeClass: "bg-rose-500 text-white" },
  { value: "back",      label: "Back",      activeClass: "bg-blue-500 text-white" },
  { value: "shoulders", label: "Shoulders", activeClass: "bg-amber-500 text-white" },
  { value: "legs",      label: "Legs",      activeClass: "bg-emerald-500 text-white" },
];

interface DraftSet {
  id: string;
  weight: string;
  reps: string;
}

interface DraftMovement {
  id: string;
  exercise: string;
  sets: DraftSet[];
}

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function emptyMovement(exercise = ""): DraftMovement {
  return { id: uid(), exercise, sets: [{ id: uid(), weight: "", reps: "" }] };
}

function sessionToDraft(session: Session): DraftMovement[] {
  return session.movements.map((m) => ({
    id: m.id,
    exercise: m.exercise,
    sets: m.sets.map((s) => ({ id: uid(), weight: String(s.weight), reps: String(s.reps) })),
  }));
}

interface Props {
  initialSession?: Session;
  onSave: (session: Session) => void;
}

export function SessionForm({ initialSession, onSave }: Props) {
  const isEditing = !!initialSession;

  const [topic, setTopic]         = useState<Topic | "">(initialSession?.topic ?? "");
  const [date, setDate]           = useState(initialSession?.date ?? today);
  const [movements, setMovements] = useState<DraftMovement[]>(
    initialSession ? sessionToDraft(initialSession) : [emptyMovement()]
  );
  const [error, setError] = useState("");

  /* ── movement helpers ── */
  function updateExercise(mId: string, name: string) {
    setMovements((ms) => ms.map((m) => (m.id === mId ? { ...m, exercise: name } : m)));
  }
  function addMovement(exercise = "") {
    setMovements((ms) => [...ms, emptyMovement(exercise)]);
  }
  function removeMovement(mId: string) {
    setMovements((ms) => ms.filter((m) => m.id !== mId));
  }

  /* ── set helpers ── */
  function addSet(mId: string) {
    setMovements((ms) =>
      ms.map((m) =>
        m.id === mId ? { ...m, sets: [...m.sets, { id: uid(), weight: "", reps: "" }] } : m
      )
    );
  }
  function removeSet(mId: string, sId: string) {
    setMovements((ms) =>
      ms.map((m) =>
        m.id === mId ? { ...m, sets: m.sets.filter((s) => s.id !== sId) } : m
      )
    );
  }
  function updateSet(mId: string, sId: string, field: "weight" | "reps", val: string) {
    setMovements((ms) =>
      ms.map((m) =>
        m.id === mId
          ? { ...m, sets: m.sets.map((s) => (s.id === sId ? { ...s, [field]: val } : s)) }
          : m
      )
    );
  }

  /* ── preset chip handler ── */
  function handlePreset(exercise: string) {
    const already = movements.some((m) => m.exercise === exercise);
    if (!already) addMovement(exercise);
  }

  /* ── submit ── */
  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!topic) { setError("Please select a training focus."); return; }

    for (const m of movements) {
      if (!m.exercise.trim()) { setError("Please fill in all exercise names."); return; }
      if (m.sets.length === 0) { setError("Each exercise needs at least one set."); return; }
      for (const s of m.sets) {
        const w = Number(s.weight);
        const r = Number(s.reps);
        if (s.weight === "" || s.reps === "" || isNaN(w) || isNaN(r) || w < 0 || r <= 0) {
          setError("All sets need a valid weight (≥ 0 kg) and reps (≥ 1).");
          return;
        }
      }
    }

    onSave({
      id: initialSession?.id ?? uid(),
      date,
      topic: topic as Topic,
      movements: movements.map((m) => ({
        id: m.id,
        exercise: m.exercise.trim(),
        sets: m.sets.map((s) => ({ weight: Number(s.weight), reps: Number(s.reps) })),
      })),
    });

    if (!isEditing) {
      setTopic("");
      setDate(today);
      setMovements([emptyMovement()]);
    }
    setError("");
  }

  return (
    <section className="space-y-4">
      <div className="px-1">
        <p className="text-sm font-medium text-zinc-500">
          {isEditing ? "Editing session" : "New Entry"}
        </p>
        <h2 className="mt-1 text-xl font-semibold tracking-tight text-zinc-950">
          {isEditing ? "Update session" : "Log a session"}
        </h2>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>

        {/* ── Topic picker ── */}
        <div className="rounded-[28px] bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)] ring-1 ring-black/5">
          <p className="mb-3 text-sm font-medium text-zinc-500">Training focus</p>
          <div className="grid grid-cols-4 gap-2">
            {TOPICS.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setTopic(t.value)}
                className={`rounded-2xl py-2.5 text-sm font-medium transition ${
                  topic === t.value
                    ? t.activeClass + " shadow-md"
                    : "bg-zinc-50 text-zinc-600 hover:bg-zinc-100"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Preset exercise chips ── */}
        {topic && (
          <div className="rounded-[28px] bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)] ring-1 ring-black/5">
            <p className="mb-3 text-sm font-medium text-zinc-500">Quick add exercise</p>
            <div className="flex flex-wrap gap-2">
              {PRESETS[topic].map((exercise) => {
                const added = movements.some((m) => m.exercise === exercise);
                return (
                  <button
                    key={exercise}
                    type="button"
                    onClick={() => handlePreset(exercise)}
                    disabled={added}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition ${
                      added
                        ? "bg-rose-50 text-rose-500 cursor-default"
                        : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-950"
                    }`}
                  >
                    {added && <Check className="h-3 w-3 flex-shrink-0" />}
                    {exercise}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Date ── */}
        <div className="rounded-[28px] bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)] ring-1 ring-black/5">
          <label className="block">
            <span className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-zinc-600">
              <CalendarDays className="h-4 w-4 text-rose-500" />
              Date
            </span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="h-12 w-full rounded-2xl border-0 bg-zinc-50 px-4 text-base text-zinc-950 shadow-[inset_0_0_0_1px_rgba(15,23,42,0.06)] outline-none transition focus:bg-white focus:shadow-[inset_0_0_0_2px_rgba(244,63,94,0.35)]"
            />
          </label>
        </div>

        {/* ── Movement cards ── */}
        {movements.map((movement, mIdx) => (
          <div
            key={movement.id}
            className="rounded-[28px] bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)] ring-1 ring-black/5"
          >
            <div className="mb-4 flex items-center gap-2">
              <input
                type="text"
                placeholder={`Exercise ${mIdx + 1}, e.g. Bench Press`}
                value={movement.exercise}
                onChange={(e) => updateExercise(movement.id, e.target.value)}
                className="h-11 flex-1 rounded-2xl border-0 bg-zinc-50 px-4 text-base text-zinc-950 shadow-[inset_0_0_0_1px_rgba(15,23,42,0.06)] outline-none transition placeholder:text-zinc-400 focus:bg-white focus:shadow-[inset_0_0_0_2px_rgba(244,63,94,0.35)]"
              />
              {movements.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeMovement(movement.id)}
                  className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-zinc-50 text-zinc-400 transition hover:bg-rose-50 hover:text-rose-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Sets header */}
            <div className="mb-1 grid grid-cols-[28px_1fr_1fr_28px] gap-2 px-1">
              <span className="text-center text-xs font-medium text-zinc-400">#</span>
              <span className="text-xs font-medium text-zinc-400">Weight (kg)</span>
              <span className="text-xs font-medium text-zinc-400">Reps</span>
              <span />
            </div>

            {/* Set rows */}
            <div className="space-y-2">
              {movement.sets.map((set, sIdx) => (
                <div
                  key={set.id}
                  className="grid grid-cols-[28px_1fr_1fr_28px] items-center gap-2"
                >
                  <span className="text-center text-sm font-medium text-zinc-400">
                    {sIdx + 1}
                  </span>
                  <input
                    type="number"
                    placeholder="80"
                    min="0"
                    step="0.5"
                    value={set.weight}
                    onChange={(e) => updateSet(movement.id, set.id, "weight", e.target.value)}
                    className="h-10 w-full rounded-xl border-0 bg-zinc-50 px-3 text-sm text-zinc-950 shadow-[inset_0_0_0_1px_rgba(15,23,42,0.06)] outline-none transition placeholder:text-zinc-400 focus:bg-white focus:shadow-[inset_0_0_0_2px_rgba(244,63,94,0.35)]"
                  />
                  <input
                    type="number"
                    placeholder="8"
                    min="1"
                    value={set.reps}
                    onChange={(e) => updateSet(movement.id, set.id, "reps", e.target.value)}
                    className="h-10 w-full rounded-xl border-0 bg-zinc-50 px-3 text-sm text-zinc-950 shadow-[inset_0_0_0_1px_rgba(15,23,42,0.06)] outline-none transition placeholder:text-zinc-400 focus:bg-white focus:shadow-[inset_0_0_0_2px_rgba(244,63,94,0.35)]"
                  />
                  <button
                    type="button"
                    onClick={() => removeSet(movement.id, set.id)}
                    disabled={movement.sets.length === 1}
                    className="flex h-7 w-7 items-center justify-center rounded-full text-zinc-300 transition hover:bg-rose-50 hover:text-rose-400 disabled:pointer-events-none disabled:opacity-30"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => addSet(movement.id)}
              className="mt-3 flex h-9 w-full items-center justify-center gap-1.5 rounded-2xl border border-dashed border-zinc-200 text-sm font-medium text-zinc-400 transition hover:border-rose-300 hover:text-rose-400"
            >
              <Plus className="h-4 w-4" />
              Add set
            </button>
          </div>
        ))}

        {/* ── Add custom exercise ── */}
        <button
          type="button"
          onClick={() => addMovement()}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-[24px] border border-dashed border-zinc-300 text-sm font-medium text-zinc-500 transition hover:border-rose-300 hover:text-rose-500"
        >
          <Plus className="h-4 w-4" />
          Add custom exercise
        </button>

        {error && (
          <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="flex h-14 w-full items-center justify-center rounded-2xl bg-zinc-950 text-base font-semibold text-white shadow-[0_16px_30px_rgba(24,24,27,0.22)] transition-transform active:scale-[0.99]"
        >
          {isEditing ? "Update Session" : "Save Session"}
        </button>
      </form>
    </section>
  );
}
