"use client";

import { useSearchParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { TaskCard } from "@/components/task/task-card";
import { VerticalTimeline } from "@/components/timeline/vertical-timeline";
import { FiltersBar } from "@/components/timeline/filters-bar";
import { useAppData } from "@/components/providers/app-data-context";
import { useCompletedTasks } from "@/components/providers/completed-tasks-context";
import { filterTasks, type TimelineFilters } from "@/lib/timeline-filters";
import type { TaskStatus } from "@ntnu-guide/shared";

export function TimelinePageContent() {
  const searchParams = useSearchParams();
  const { tasks } = useAppData();
  const { completedIds, mounted } = useCompletedTasks();

  const view = searchParams.get("view") === "list" ? "list" : "timeline";
  const filters: TimelineFilters = {
    q: searchParams.get("q") ?? "",
    categories: searchParams.getAll("category"),
    academicYear: searchParams.get("year"),
    semester: searchParams.get("semester") === "1" || searchParams.get("semester") === "2"
      ? (Number(searchParams.get("semester")) as 1 | 2)
      : null,
    status: (searchParams.get("status") as TaskStatus | null) ?? null,
  };

  const filtered = mounted ? filterTasks(tasks, completedIds, filters) : [];
  const dated = filtered
    .filter((t) => t.startDate !== null)
    .sort((a, b) => new Date(a.startDate!).getTime() - new Date(b.startDate!).getTime());
  const tbd = filtered.filter((t) => t.startDate === null);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">時間軸</h1>
        <p className="mt-1 text-sm text-muted-foreground">搜尋、篩選並瀏覽所有入學與就學時程</p>
      </div>

      <FiltersBar filters={filters} view={view} />

      <div className="mt-8">
        {!mounted ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        ) : view === "timeline" ? (
          <>
            <VerticalTimeline tasks={dated} />
            {tbd.length > 0 && (
              <div className="mt-10">
                <h2 className="mb-3 text-sm font-semibold text-muted-foreground">日期待公告</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {tbd.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {[...dated, ...tbd].map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
            {filtered.length === 0 && (
              <p className="col-span-full rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
                沒有符合條件的任務
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
