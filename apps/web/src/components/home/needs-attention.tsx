"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TaskCard } from "@/components/task/task-card";
import { useAppData } from "@/components/providers/app-data-context";
import { useCompletedTasks } from "@/components/providers/completed-tasks-context";
import { getNeedsAttentionTasks } from "@/lib/task-queries";

export function NeedsAttention() {
  const { tasks } = useAppData();
  const { completedIds, mounted } = useCompletedTasks();

  const items = mounted ? getNeedsAttentionTasks(tasks, completedIds, 5) : [];

  return (
    <section id="needs-attention" className="mx-auto max-w-6xl px-4 py-12 scroll-mt-20">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">你現在需要處理</h2>
          <p className="mt-1 text-sm text-muted-foreground">依時間與緊急程度排序的近期任務</p>
        </div>
        <Button asChild variant="ghost" size="sm" className="shrink-0">
          <Link href="/timeline">
            查看全部
            <ArrowRight />
          </Link>
        </Button>
      </div>

      {!mounted ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-52 w-full" />
          ))}
        </div>
      ) : items.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      ) : (
        <p className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
          目前沒有待處理的任務，太棒了！
        </p>
      )}
    </section>
  );
}
