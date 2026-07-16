"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import type { Task } from "@ntnu-guide/shared";
import { getDaysRemaining } from "@ntnu-guide/shared";
import { Badge } from "@/components/ui/badge";
import { useAppData } from "@/components/providers/app-data-context";
import { getCategoryBadgeClass, getCategoryDotClass } from "@/lib/category-colors";
import { formatDaysRemaining } from "@/lib/status-colors";
import { formatShortDate, formatTaskDateRange } from "@/lib/format-date";
import { buildTaskHref } from "@/lib/task-link";

export function VerticalTimeline({ tasks }: { tasks: Task[] }) {
  const { categories } = useAppData();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (tasks.length === 0) {
    return (
      <p className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
        沒有符合條件的時程
      </p>
    );
  }

  return (
    <ol className="relative border-l pl-6">
      {tasks.map((task, index) => {
        const category = categories.find((c) => c.id === task.category);
        return (
          <motion.li
            key={task.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25, delay: Math.min(index, 8) * 0.04 }}
            className="relative pb-8 last:pb-0"
          >
            <span
              className={`absolute -left-[29px] top-1 size-3 rounded-full border-2 border-background ${
                category ? getCategoryDotClass(category.colorToken) : "bg-slate-400"
              }`}
            />
            <Link
              href={buildTaskHref(pathname, searchParams, task.id)}
              scroll={false}
              className="block rounded-lg p-2 -m-2 transition-colors hover:bg-accent"
            >
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <time>{formatShortDate(task.startDate)}</time>
                {category && (
                  <Badge variant="outline" className={getCategoryBadgeClass(category.colorToken)}>
                    {category.label}
                  </Badge>
                )}
                <span>{formatDaysRemaining(getDaysRemaining(task))}</span>
              </div>
              <h3 className="mt-1 font-medium">{task.title}</h3>
              <p className="text-sm text-muted-foreground">{formatTaskDateRange(task)}</p>
              {task.location && (
                <p className="mt-0.5 flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="size-3.5 shrink-0" />
                  {task.location}
                </p>
              )}
            </Link>
          </motion.li>
        );
      })}
    </ol>
  );
}
