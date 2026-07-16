"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppData } from "@/components/providers/app-data-context";
import { useCompletedTasks } from "@/components/providers/completed-tasks-context";
import { getThisWeekTasks } from "@/lib/task-queries";
import { getLinkIcon } from "@/lib/icons";
import { formatDaysRemaining } from "@/lib/status-colors";
import { getDaysRemaining } from "@ntnu-guide/shared";
import { buildTaskHref } from "@/lib/task-link";

export function HomeSidebar() {
  const { tasks, links } = useAppData();
  const { completedIds, mounted } = useCompletedTasks();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const thisWeek = mounted ? getThisWeekTasks(tasks, completedIds) : [];

  return (
    <aside className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">本週提醒</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {!mounted ? (
            <Skeleton className="h-16 w-full" />
          ) : thisWeek.length > 0 ? (
            thisWeek.map((task) => (
              <Link
                key={task.id}
                href={buildTaskHref(pathname, searchParams, task.id)}
                scroll={false}
                className="rounded-md border p-2.5 text-sm transition-colors hover:bg-accent"
              >
                <p className="font-medium">{task.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {formatDaysRemaining(getDaysRemaining(task))}
                </p>
              </Link>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">本週沒有需要處理的事項</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">常用連結</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-1">
          {links.map((link) => {
            const Icon = getLinkIcon(link.icon);
            return (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 rounded-md p-2 text-sm transition-colors hover:bg-accent"
              >
                <Icon className="size-4 shrink-0 text-muted-foreground" />
                <span className="flex-1">{link.label}</span>
                <ArrowUpRight className="size-3.5 shrink-0 text-muted-foreground" />
              </a>
            );
          })}
        </CardContent>
      </Card>
    </aside>
  );
}
