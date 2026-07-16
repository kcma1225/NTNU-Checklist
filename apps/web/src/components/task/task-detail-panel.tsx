"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { ExternalLink, FileDown, Link2, MapPin } from "lucide-react";
import { getDaysRemaining, getTaskStatus } from "@ntnu-guide/shared";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Markdown } from "@/components/markdown";
import { CalendarButton } from "@/components/task/calendar-button";
import { MarkCompleteButton } from "@/components/task/mark-complete-button";
import { useAppData, useTaskById } from "@/components/providers/app-data-context";
import { useCompletedTasks } from "@/components/providers/completed-tasks-context";
import { getCategoryBadgeClass } from "@/lib/category-colors";
import { STATUS_BADGE_CLASS, STATUS_LABEL, formatDaysRemaining } from "@/lib/status-colors";
import { formatTaskDateRange } from "@/lib/format-date";
import { buildTaskHref } from "@/lib/task-link";
import { cn } from "@/lib/utils";

export function TaskDetailPanel() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { categories } = useAppData();
  const { completedIds, mounted } = useCompletedTasks();

  const taskId = searchParams.get("task");
  const task = useTaskById(taskId);
  const open = Boolean(taskId && task);

  function close() {
    router.push(buildTaskHref(pathname, searchParams, null), { scroll: false });
  }

  const category = task ? categories.find((c) => c.id === task.category) : undefined;
  const daysRemaining = task ? getDaysRemaining(task) : null;
  const status = task ? getTaskStatus(task, mounted ? completedIds : new Set()) : "tbd";

  return (
    <Sheet open={open} onOpenChange={(next) => !next && close()}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md md:max-w-lg overflow-y-auto gap-0"
      >
        {task && (
          <>
            <SheetHeader className="gap-3">
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
              <SheetTitle className="text-xl">{task.title}</SheetTitle>
              <SheetDescription asChild>
                <div className="space-y-1 text-sm">
                  <p>{formatTaskDateRange(task)}</p>
                  {task.location && (
                    <p className="flex items-center gap-1">
                      <MapPin className="size-3.5 shrink-0" />
                      {task.location}
                    </p>
                  )}
                  {task.department && <p>負責單位：{task.department}</p>}
                </div>
              </SheetDescription>
            </SheetHeader>

            <div className="flex flex-col gap-6 px-4 pb-4">
              <Markdown className="text-foreground/90">{task.description || task.summary}</Markdown>

              {task.checklist.length > 0 && (
                <div>
                  <h4 className="mb-2 text-sm font-semibold">準備資料</h4>
                  <ul className="space-y-1.5 text-sm">
                    {task.checklist.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="mt-1 size-1.5 shrink-0 rounded-full bg-muted-foreground" />
                        <Markdown inline>{item}</Markdown>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <Separator />

              <div className="flex flex-col gap-2">
                {task.officialUrl && (
                  <Button asChild>
                    <a href={task.officialUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink />
                      前往官方網站
                    </a>
                  </Button>
                )}

                <div className="flex flex-wrap gap-2">
                  {task.mapUrl && (
                    <Button asChild variant="outline" size="sm">
                      <a href={task.mapUrl} target="_blank" rel="noopener noreferrer">
                        <MapPin />
                        開啟地圖
                      </a>
                    </Button>
                  )}
                  {task.documentUrl && (
                    <Button asChild variant="outline" size="sm">
                      <a href={task.documentUrl} target="_blank" rel="noopener noreferrer">
                        <FileDown />
                        下載文件
                      </a>
                    </Button>
                  )}
                  <CalendarButton task={task} />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const href = buildTaskHref(pathname, searchParams, task.id);
                      navigator.clipboard.writeText(`${window.location.origin}${href}`);
                      toast.success("已複製連結");
                    }}
                  >
                    <Link2 />
                    複製連結
                  </Button>
                  <MarkCompleteButton taskId={task.id} />
                </div>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
