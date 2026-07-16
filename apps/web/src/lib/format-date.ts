import type { Task } from "@ntnu-guide/shared";

const TAIPEI_TZ = "Asia/Taipei";

function datePart(iso: string): string {
  return new Intl.DateTimeFormat("zh-TW", {
    timeZone: TAIPEI_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .format(new Date(iso))
    .replace(/\//g, "/");
}

function timePart(iso: string): string {
  return new Intl.DateTimeFormat("zh-TW", {
    timeZone: TAIPEI_TZ,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(iso));
}

/** "2026/09/03 09:00–16:00" (same day) or "2026/09/04 09:00 – 2026/09/05 16:00" (spans days). */
export function formatTaskDateRange(task: Task): string {
  if (!task.startDate) return "日期待公告";
  const startDate = datePart(task.startDate);
  const startTime = timePart(task.startDate);
  if (!task.endDate) return `${startDate} ${startTime}`;

  const endDate = datePart(task.endDate);
  const endTime = timePart(task.endDate);

  if (startDate === endDate) {
    return `${startDate} ${startTime}–${endTime}`;
  }
  return `${startDate} ${startTime} – ${endDate} ${endTime}`;
}

export function formatShortDate(iso: string | null): string {
  if (!iso) return "待公告";
  return datePart(iso);
}
