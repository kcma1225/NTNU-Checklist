"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { MapPin } from "lucide-react";
import type { Task } from "@ntnu-guide/shared";
import { getDaysRemaining, getTaskStatus } from "@ntnu-guide/shared";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarButton } from "@/components/task/calendar-button";
import { MarkCompleteButton } from "@/components/task/mark-complete-button";
import { useAppData } from "@/components/providers/app-data-context";
import { useCompletedTasks } from "@/components/providers/completed-tasks-context";
import { getCategoryBadgeClass } from "@/lib/category-colors";
import { STATUS_BADGE_CLASS, STATUS_LABEL, formatDaysRemaining } from "@/lib/status-colors";
import { formatTaskDateRange } from "@/lib/format-date";
import { buildTaskHref } from "@/lib/task-link";
import { cn } from "@/lib/utils";

export function TaskCard({ task }: { task: Task }) {
  const { categories } = useAppData();
  const { completedIds, mounted } = useCompletedTasks();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const category = categories.find((c) => c.id === task.category);
  const daysRemaining = getDaysRemaining(task);
  const status = getTaskStatus(task, mounted ? completedIds : new Set());
  const detailHref = buildTaskHref(pathname, searchParams, task.id);

  return (
    <Card className="gap-3 py-4">
      <CardContent className="flex flex-col gap-3 px-4">
        <div className="flex items-center justify-between gap-2">
          {category && (
            <Badge variant="outline" className={getCategoryBadgeClass(category.colorToken)}>
              {category.label}
            </Badge>
          )}
          <span
            className={cn(
              "rounded-full border px-2 py-0.5 text-xs font-medium",
              STATUS_BADGE_CLASS[status],
            )}
          >
            {status === "tbd" ? STATUS_LABEL.tbd : formatDaysRemaining(daysRemaining)}
          </span>
        </div>

        <div>
          <h3 className="font-semibold leading-snug">{task.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{formatTaskDateRange(task)}</p>
          {task.location && (
            <p className="mt-0.5 flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="size-3.5 shrink-0" />
              <span>{task.location}</span>
            </p>
          )}
        </div>

        <p className="text-sm text-foreground/80 line-clamp-2">{task.summary}</p>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <Button asChild variant="secondary" size="sm">
            <Link href={detailHref} scroll={false}>
              查看詳情
            </Link>
          </Button>
          <CalendarButton task={task} variant="outline" size="sm" />
          <MarkCompleteButton taskId={task.id} size="sm" />
        </div>
      </CardContent>
    </Card>
  );
}
