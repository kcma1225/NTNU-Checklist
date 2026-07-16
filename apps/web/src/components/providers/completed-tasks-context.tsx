"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "ntnu-guide:completed-tasks";

function readStoredIds(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed)
      ? new Set(parsed.filter((id): id is string => typeof id === "string"))
      : new Set();
  } catch {
    return new Set();
  }
}

interface CompletedTasksState {
  completedIds: Set<string>;
  isComplete: (id: string) => boolean;
  toggleComplete: (id: string) => void;
  /** False until the client has read localStorage — use to avoid a hydration flash. */
  mounted: boolean;
}

const CompletedTasksContext = createContext<CompletedTasksState | null>(null);

export function CompletedTasksProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [completedIds, setCompletedIds] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    // One-time read of localStorage on mount, not state synced from a system that changes
    // over time — see the hydration-flash note in the component docs above.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCompletedIds(readStoredIds());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(completedIds)));
  }, [completedIds, mounted]);

  const toggleComplete = useCallback((id: string) => {
    setCompletedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const isComplete = useCallback((id: string) => completedIds.has(id), [completedIds]);

  return (
    <CompletedTasksContext.Provider value={{ completedIds, isComplete, toggleComplete, mounted }}>
      {children}
    </CompletedTasksContext.Provider>
  );
}

export function useCompletedTasks(): CompletedTasksState {
  const ctx = useContext(CompletedTasksContext);
  if (!ctx) throw new Error("useCompletedTasks must be used within CompletedTasksProvider");
  return ctx;
}
