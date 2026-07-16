"use client";

import { ListChecks } from "lucide-react";
import { useAppData } from "@/components/providers/app-data-context";
import { useCompletedTasks } from "@/components/providers/completed-tasks-context";

export function ProgressIndicator() {
  const { tasks } = useAppData();
  const { completedIds, mounted } = useCompletedTasks();

  const trackable = tasks.filter((t) => t.startDate !== null);
  const doneCount = mounted
    ? trackable.filter((t) => completedIds.has(t.id)).length
    : 0;

  return (
    <div className="hidden items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs text-muted-foreground sm:flex">
      <ListChecks className="size-3.5" />
      <span>
        個人進度 {doneCount}/{trackable.length}
      </span>
    </div>
  );
}
