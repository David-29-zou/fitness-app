"use client";

import { useState } from "react";
import { TrendingUp } from "lucide-react";
import type { Session } from "@/lib/types";

interface ChartPoint {
  date: string;
  maxWeight: number;
}

function fmtDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function SvgChart({ data }: { data: ChartPoint[] }) {
  if (data.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-zinc-400">
        No data for this exercise yet.
      </p>
    );
  }

  if (data.length === 1) {
    return (
      <div className="flex flex-col items-center py-8">
        <p className="text-3xl font-bold text-rose-500">{data[0].maxWeight} kg</p>
        <p className="mt-1 text-sm text-zinc-400">{fmtDate(data[0].date)}</p>
        <p className="mt-4 text-xs text-zinc-400">
          Log one more session to see the trend line.
        </p>
      </div>
    );
  }

  const W = 320;
  const H = 160;
  const PL = 44;
  const PR = 16;
  const PT = 24;
  const PB = 32;
  const cW = W - PL - PR;
  const cH = H - PT - PB;

  const weights = data.map((d) => d.maxWeight);
  const rawMin = Math.min(...weights);
  const rawMax = Math.max(...weights);
  const span = rawMax === rawMin ? 10 : rawMax - rawMin;
  const minY = rawMin - span * 0.15;
  const maxY = rawMax + span * 0.15;

  const tx = (i: number) => PL + (i / (data.length - 1)) * cW;
  const ty = (w: number) => PT + (1 - (w - minY) / (maxY - minY)) * cH;

  const pathD = data
    .map((d, i) => `${i === 0 ? "M" : "L"} ${tx(i).toFixed(1)} ${ty(d.maxWeight).toFixed(1)}`)
    .join(" ");

  const areaD =
    pathD +
    ` L ${tx(data.length - 1).toFixed(1)} ${(PT + cH).toFixed(1)}` +
    ` L ${tx(0).toFixed(1)} ${(PT + cH).toFixed(1)} Z`;

  // 3 Y-axis ticks
  const yTicks = [rawMin, Math.round((rawMin + rawMax) / 2), rawMax];

  // Up to 4 X-axis labels, evenly spaced
  const xCount = Math.min(data.length, 4);
  const xIndices =
    xCount === 1
      ? [0]
      : Array.from({ length: xCount }, (_, i) =>
          Math.round((i / (xCount - 1)) * (data.length - 1))
        );

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" aria-hidden="true">
      {/* Y grid lines + labels */}
      {yTicks.map((tick) => (
        <g key={tick}>
          <line
            x1={PL}
            y1={ty(tick)}
            x2={W - PR}
            y2={ty(tick)}
            stroke="#f4f4f5"
            strokeWidth={1}
          />
          <text
            x={PL - 6}
            y={ty(tick) + 4}
            textAnchor="end"
            fontSize={10}
            fill="#a1a1aa"
          >
            {tick}
          </text>
        </g>
      ))}

      {/* Area fill */}
      <path d={areaD} fill="#f43f5e" opacity={0.07} />

      {/* Line */}
      <path
        d={pathD}
        fill="none"
        stroke="#f43f5e"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Dots + value labels */}
      {data.map((d, i) => (
        <g key={i}>
          <text
            x={tx(i)}
            y={ty(d.maxWeight) - 8}
            textAnchor="middle"
            fontSize={10}
            fontWeight={600}
            fill="#f43f5e"
          >
            {d.maxWeight}
          </text>
          <circle
            cx={tx(i)}
            cy={ty(d.maxWeight)}
            r={i === data.length - 1 ? 5 : 3.5}
            fill="#f43f5e"
          />
        </g>
      ))}

      {/* X axis labels */}
      {xIndices.map((i) => (
        <text
          key={i}
          x={tx(i)}
          y={H - 4}
          textAnchor="middle"
          fontSize={10}
          fill="#a1a1aa"
        >
          {fmtDate(data[i].date)}
        </text>
      ))}
    </svg>
  );
}

interface Props {
  sessions: Session[];
}

export function ProgressChart({ sessions }: Props) {
  const allExercises = [
    ...new Set(sessions.flatMap((s) => s.movements.map((m) => m.exercise))),
  ].sort();

  const [selected, setSelected] = useState("");

  const exercise = selected || allExercises[0] || "";

  const chartData: ChartPoint[] = sessions
    .filter((s) =>
      s.movements.some((m) => m.exercise.toLowerCase() === exercise.toLowerCase())
    )
    .map((s) => {
      const mov = s.movements.find(
        (m) => m.exercise.toLowerCase() === exercise.toLowerCase()
      )!;
      return {
        date: s.date,
        maxWeight: Math.max(...mov.sets.map((set) => set.weight)),
      };
    })
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <section className="space-y-4">
      <div className="px-1">
        <p className="text-sm font-medium text-zinc-500">Track Improvement</p>
        <h2 className="mt-1 text-xl font-semibold tracking-tight text-zinc-950">
          Progress curves
        </h2>
      </div>

      {allExercises.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[28px] bg-white px-6 py-12 text-center shadow-[0_18px_40px_rgba(15,23,42,0.06)] ring-1 ring-black/5">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 text-zinc-300">
            <TrendingUp className="h-8 w-8" />
          </div>
          <p className="text-base font-medium text-zinc-500">
            Log sessions first to see your progress curves.
          </p>
        </div>
      ) : (
        <>
          <div className="rounded-[28px] bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)] ring-1 ring-black/5">
            <p className="mb-3 text-sm font-medium text-zinc-500">Exercise</p>
            <select
              value={exercise}
              onChange={(e) => setSelected(e.target.value)}
              className="h-12 w-full rounded-2xl border-0 bg-zinc-50 px-4 text-base text-zinc-950 shadow-[inset_0_0_0_1px_rgba(15,23,42,0.06)] outline-none transition focus:bg-white focus:shadow-[inset_0_0_0_2px_rgba(244,63,94,0.35)]"
            >
              {allExercises.map((ex) => (
                <option key={ex} value={ex}>
                  {ex}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-[28px] bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)] ring-1 ring-black/5">
            <div className="mb-3 flex items-baseline justify-between">
              <p className="text-sm font-semibold text-zinc-950">{exercise}</p>
              <p className="text-xs text-zinc-400">Max weight · kg</p>
            </div>
            <SvgChart data={chartData} />
          </div>
        </>
      )}
    </section>
  );
}
