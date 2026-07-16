"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { VerticalTimeline } from "@/components/timeline/vertical-timeline";
import { useAppData } from "@/components/providers/app-data-context";
import { useCompletedTasks } from "@/components/providers/completed-tasks-context";
import { getChronologicalTasks } from "@/lib/task-queries";

export function TimelinePreview() {
  const { tasks } = useAppData();
  const { completedIds, mounted } = useCompletedTasks();
  const items = mounted ? getChronologicalTasks(tasks, completedIds, { limit: 6 }) : [];

  return (
    <div>
      <div className="mb-4 flex items-end justify-between gap-4">
        <h2 className="text-xl font-bold tracking-tight">時間軸預覽</h2>
        <Button asChild variant="ghost" size="sm" className="shrink-0">
          <Link href="/timeline">
            完整時間軸
            <ArrowRight />
          </Link>
        </Button>
      </div>
      {!mounted ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : (
        <VerticalTimeline tasks={items} />
      )}
    </div>
  );
}
