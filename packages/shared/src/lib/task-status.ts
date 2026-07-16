import type { Task } from "../schema/task";

export type TaskStatus = "tbd" | "completed" | "overdue" | "urgent" | "upcoming";

const TAIPEI_TZ = "Asia/Taipei";
const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Returns the calendar date (as UTC midnight epoch ms) that `date` falls on in
 * Asia/Taipei, regardless of the viewer's own local timezone. Taiwan has no DST,
 * so this is a fixed +08:00 offset, but we still go through Intl to be explicit.
 */
function taipeiCalendarDayMs(date: Date): number {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TAIPEI_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const lookup = Object.fromEntries(parts.map((p) => [p.type, p.value]));
  return Date.UTC(Number(lookup.year), Number(lookup.month) - 1, Number(lookup.day));
}

/** Whole calendar days between "now" and the task's start date, in Asia/Taipei. Null if TBD. */
export function getDaysRemaining(task: Task, now: Date = new Date()): number | null {
  if (!task.startDate) return null;
  const startMs = taipeiCalendarDayMs(new Date(task.startDate));
  const nowMs = taipeiCalendarDayMs(now);
  return Math.round((startMs - nowMs) / DAY_MS);
}

const URGENT_THRESHOLD_DAYS = 7;

export function getTaskStatus(
  task: Task,
  completedIds: ReadonlySet<string>,
  now: Date = new Date(),
): TaskStatus {
  if (completedIds.has(task.id)) return "completed";
  if (!task.startDate) return "tbd";
  const daysRemaining = getDaysRemaining(task, now);
  if (daysRemaining === null) return "tbd";
  if (daysRemaining < 0) return "overdue";
  if (daysRemaining <= URGENT_THRESHOLD_DAYS) return "urgent";
  return "upcoming";
}

/**
 * Sort key for "what do I need to do now": incomplete + soonest first, overdue before
 * urgent before upcoming, TBD tasks pushed to the end since they have no actionable date.
 */
export function compareTasksByUrgency(
  a: Task,
  b: Task,
  completedIds: ReadonlySet<string>,
  now: Date = new Date(),
): number {
  const statusRank: Record<TaskStatus, number> = {
    overdue: 0,
    urgent: 1,
    upcoming: 2,
    completed: 3,
    tbd: 4,
  };
  const statusA = getTaskStatus(a, completedIds, now);
  const statusB = getTaskStatus(b, completedIds, now);
  if (statusRank[statusA] !== statusRank[statusB]) {
    return statusRank[statusA] - statusRank[statusB];
  }
  const daysA = getDaysRemaining(a, now);
  const daysB = getDaysRemaining(b, now);
  if (daysA === null && daysB === null) return a.title.localeCompare(b.title);
  if (daysA === null) return 1;
  if (daysB === null) return -1;
  return daysA - daysB;
}
