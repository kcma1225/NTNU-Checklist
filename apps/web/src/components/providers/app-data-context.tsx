"use client";

import { createContext, useContext, useMemo } from "react";
import type { Category, GuideSection, Link, Task } from "@ntnu-guide/shared";

interface AppData {
  tasks: Task[];
  links: Link[];
  guide: GuideSection[];
  categories: Category[];
}

const AppDataContext = createContext<AppData | null>(null);

export function AppDataProvider({
  data,
  children,
}: {
  data: AppData;
  children: React.ReactNode;
}) {
  // `data` comes from a server component's props (fs+Zod at build time) and is static
  // for the lifetime of the page, so no need to re-derive it on every render.
  const value = useMemo(() => data, [data]);
  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData(): AppData {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error("useAppData must be used within AppDataProvider");
  return ctx;
}

export function useTaskById(id: string | null): Task | null {
  const { tasks } = useAppData();
  if (!id) return null;
  return tasks.find((t) => t.id === id) ?? null;
}
