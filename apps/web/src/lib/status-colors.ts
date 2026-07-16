import type { TaskStatus } from "@ntnu-guide/shared";

export const STATUS_LABEL: Record<TaskStatus, string> = {
  overdue: "已逾期",
  urgent: "即將截止",
  upcoming: "尚有時間",
  completed: "已完成",
  tbd: "待公告",
};

export const STATUS_BADGE_CLASS: Record<TaskStatus, string> = {
  overdue: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/60 dark:text-red-300 dark:border-red-900",
  urgent:
    "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-900",
  upcoming:
    "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-900",
  completed:
    "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-900",
  tbd: "bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800/60 dark:text-slate-400 dark:border-slate-700",
};

export function formatDaysRemaining(daysRemaining: number | null): string {
  if (daysRemaining === null) return "日期待公告";
  if (daysRemaining < 0) return `已逾期 ${Math.abs(daysRemaining)} 天`;
  if (daysRemaining === 0) return "就是今天";
  return `${daysRemaining} 天後`;
}
