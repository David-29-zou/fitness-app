"use client";

import { useEffect, useState } from "react";
import { Dumbbell, History, TrendingUp } from "lucide-react";
import { Header } from "@/components/Header";
import { SessionForm } from "@/components/SessionForm";
import { SessionHistory } from "@/components/SessionHistory";
import { ProgressChart } from "@/components/ProgressChart";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import type { Session } from "@/lib/types";

type Tab = "log" | "history" | "progress";

const TABS: {
  id: Tab;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: "log",      label: "Log",      Icon: Dumbbell   },
  { id: "history",  label: "History",  Icon: History    },
  { id: "progress", label: "Progress", Icon: TrendingUp },
];

export default function Home() {
  const [sessions, setSessions]           = useState<Session[]>([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState("");
  const [tab, setTab]                     = useState<Tab>("log");
  const [editingSession, setEditingSession] = useState<Session | null>(null);

  const STORAGE_KEY = "fitlog_sessions";

  function saveLocally(updated: Session[]) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // storage quota exceeded — silently ignore
    }
    setSessions(updated);
  }

  useEffect(() => {
    async function load() {
      if (!isSupabaseConfigured()) {
        try {
          const raw = localStorage.getItem(STORAGE_KEY);
          if (raw) setSessions(JSON.parse(raw) as Session[]);
        } catch {
          // corrupted data — start fresh
        }
        setLoading(false);
        return;
      }
      const { data, error } = await getSupabase()
        .from("sessions")
        .select("*, movements(*)")
        .order("date", { ascending: false });
      if (error) setError("Failed to load sessions.");
      else setSessions((data ?? []) as Session[]);
      setLoading(false);
    }
    load();
  }, []);

  function handleEdit(session: Session) {
    setEditingSession(session);
    setTab("log");
  }

  async function handleSave(savedSession: Session) {
    const isUpdate = editingSession !== null;

    if (!isSupabaseConfigured()) {
      const updated = isUpdate
        ? sessions.map((s) => (s.id === savedSession.id ? savedSession : s))
        : [savedSession, ...sessions];
      saveLocally(updated);
      setEditingSession(null);
      setTab("history");
      return;
    }

    if (isUpdate) {
      /* update session row */
      const { error: e1 } = await getSupabase()
        .from("sessions")
        .update({ date: savedSession.date, topic: savedSession.topic })
        .eq("id", savedSession.id);
      if (e1) { setError("Failed to update session."); return; }

      /* replace movements: delete old, insert new */
      const { error: e2 } = await getSupabase()
        .from("movements")
        .delete()
        .eq("session_id", savedSession.id);
      if (e2) { setError("Failed to update movements."); return; }

      const { error: e3 } = await getSupabase()
        .from("movements")
        .insert(
          savedSession.movements.map((m) => ({
            id: m.id,
            session_id: savedSession.id,
            exercise: m.exercise,
            sets: m.sets,
          }))
        );
      if (e3) { setError("Failed to update movements."); return; }

      setSessions((prev) => prev.map((s) => (s.id === savedSession.id ? savedSession : s)));
    } else {
      /* insert new session */
      const { error: e1 } = await getSupabase()
        .from("sessions")
        .insert({ id: savedSession.id, date: savedSession.date, topic: savedSession.topic });
      if (e1) { setError("Failed to save session."); return; }

      const { error: e2 } = await getSupabase()
        .from("movements")
        .insert(
          savedSession.movements.map((m) => ({
            id: m.id,
            session_id: savedSession.id,
            exercise: m.exercise,
            sets: m.sets,
          }))
        );
      if (e2) { setError("Failed to save movements."); return; }

      setSessions((prev) => [savedSession, ...prev]);
    }

    setError("");
    setEditingSession(null);
    setTab("history");
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#ffffff_0%,#f6f7fb_45%,#eef1f6_100%)]">
      <div className="mx-auto flex w-full max-w-md flex-col gap-6 px-4 pb-28 pt-6">
        <Header />

        {error && (
          <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
            {error}
          </p>
        )}

        {tab === "log" && (
          <SessionForm
            key={editingSession?.id ?? "new"}
            initialSession={editingSession ?? undefined}
            onSave={handleSave}
          />
        )}
        {tab === "history" && (
          <SessionHistory sessions={sessions} loading={loading} onEdit={handleEdit} />
        )}
        {tab === "progress" && <ProgressChart sessions={sessions} />}
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-10 border-t border-zinc-100 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-md">
          {TABS.map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => {
                if (id !== "log") setEditingSession(null);
                setTab(id);
              }}
              className={`flex flex-1 flex-col items-center gap-1 py-3 text-xs font-medium transition ${
                tab === id ? "text-rose-500" : "text-zinc-400 hover:text-zinc-600"
              }`}
            >
              <Icon className="h-5 w-5" />
              {label}
            </button>
          ))}
        </div>
      </nav>
    </main>
  );
}
