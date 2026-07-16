import {
  compareTasksByUrgency,
  getDaysRemaining,
  getTaskStatus,
  type Task,
} from "@ntnu-guide/shared";

/** Top N actionable tasks for "你現在需要處理" — excludes completed and TBD (no date to act on). */
export function getNeedsAttentionTasks(
  tasks: Task[],
  completedIds: ReadonlySet<string>,
  limit = 5,
): Task[] {
  return tasks
    .filter((t) => t.startDate !== null && !completedIds.has(t.id))
    .sort((a, b) => compareTasksByUrgency(a, b, completedIds))
    .slice(0, limit);
}

/** Soonest actionable deadline for the hero's "next deadline" callout. */
export function getNextDeadlineTask(
  tasks: Task[],
  completedIds: ReadonlySet<string>,
): Task | null {
  const upcoming = tasks
    .filter((t) => {
      if (!t.startDate || completedIds.has(t.id)) return false;
      const status = getTaskStatus(t, completedIds);
      return status === "urgent" || status === "upcoming";
    })
    .sort((a, b) => (getDaysRemaining(a) ?? Infinity) - (getDaysRemaining(b) ?? Infinity));
  return upcoming[0] ?? null;
}

/** Upcoming tasks in strict chronological order, for the vertical timeline preview/view. */
export function getChronologicalTasks(
  tasks: Task[],
  completedIds: ReadonlySet<string>,
  options: { includeCompleted?: boolean; limit?: number } = {},
): Task[] {
  const { includeCompleted = false, limit } = options;
  const filtered = tasks.filter((t) => {
    if (!t.startDate) return false;
    if (!includeCompleted && completedIds.has(t.id)) return false;
    return true;
  });
  filtered.sort((a, b) => new Date(a.startDate!).getTime() - new Date(b.startDate!).getTime());
  return limit ? filtered.slice(0, limit) : filtered;
}

/** Tasks landing within the next 7 days, for the sidebar's "本週提醒". */
export function getThisWeekTasks(tasks: Task[], completedIds: ReadonlySet<string>): Task[] {
  return tasks
    .filter((t) => {
      if (!t.startDate || completedIds.has(t.id)) return false;
      const days = getDaysRemaining(t);
      return days !== null && days >= 0 && days <= 7;
    })
    .sort((a, b) => (getDaysRemaining(a) ?? 0) - (getDaysRemaining(b) ?? 0));
}
