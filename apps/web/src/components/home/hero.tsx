"use client";

import Link from "next/link";
import { ArrowRight, CalendarClock, ListTodo } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppData } from "@/components/providers/app-data-context";
import { useCompletedTasks } from "@/components/providers/completed-tasks-context";
import { getNextDeadlineTask } from "@/lib/task-queries";
import { formatTaskDateRange } from "@/lib/format-date";
import { getDaysRemaining } from "@ntnu-guide/shared";
import { formatDaysRemaining } from "@/lib/status-colors";
import { Skeleton } from "@/components/ui/skeleton";

export function Hero() {
  const { tasks } = useAppData();
  const { completedIds, mounted } = useCompletedTasks();
  const nextTask = mounted ? getNextDeadlineTask(tasks, completedIds) : null;

  return (
    <section className="border-b bg-gradient-to-b from-muted/50 to-background">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
        <h1 className="max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
          師大碩士生，一站掌握所有入學與就學時程
        </h1>
        <p className="mt-4 max-w-xl text-lg text-muted-foreground">
          從入學前準備到畢業離校，時間軸 + 任務卡片幫你隨時知道「現在最需要做什麼」。
        </p>

        <div className="mt-6 flex min-h-14 items-center">
          {!mounted ? (
            <Skeleton className="h-10 w-72" />
          ) : nextTask ? (
            <div className="flex items-center gap-2 rounded-lg border bg-background px-4 py-2.5 text-sm shadow-sm">
              <CalendarClock className="size-4 text-primary shrink-0" />
              <span className="text-muted-foreground">下一個截止日期：</span>
              <span className="font-medium">{nextTask.title}</span>
              <span className="text-muted-foreground">·</span>
              <span className="text-muted-foreground">{formatTaskDateRange(nextTask)}</span>
              <span className="font-medium text-primary">
                {formatDaysRemaining(getDaysRemaining(nextTask))}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-lg border bg-background px-4 py-2.5 text-sm text-muted-foreground shadow-sm">
              <ListTodo className="size-4 shrink-0" />
              目前沒有進行中的截止事項
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link href="#needs-attention">
              查看近期任務
              <ArrowRight />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/timeline">完整時間軸</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
