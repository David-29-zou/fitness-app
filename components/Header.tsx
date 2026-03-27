import { BellRing } from "lucide-react";

export function Header() {
  return (
    <header className="flex items-center justify-between px-1">
      <div>
        <p className="text-sm font-medium text-zinc-500">Daily Training</p>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">
          FitLog
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Notifications"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-zinc-600 shadow-[0_8px_24px_rgba(15,23,42,0.08)] ring-1 ring-black/5 transition-transform active:scale-95"
        >
          <BellRing className="h-5 w-5" />
        </button>

        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-rose-400 via-orange-300 to-amber-200 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(251,146,60,0.35)]">
          DZ
        </div>
      </div>
    </header>
  );
}
