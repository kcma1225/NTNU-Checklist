import type { Task } from "../schema/task";

const HOUR_MS = 60 * 60 * 1000;

/** "2026-09-03T01:00:00.000Z" -> "20260903T010000Z" (Google Calendar's UTC format). */
function formatUTC(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

/**
 * Builds a Google Calendar "add event" URL per the spec's field mapping. Returns null
 * when the task shouldn't offer calendar integration at all — the caller (a button
 * component) is expected to disable itself in that case:
 *   - calendar.enabled === false (task author opted out)
 *   - startDate === null ("待公告" — date not yet announced, nothing to schedule)
 */
export function buildGoogleCalendarUrl(task: Task): string | null {
  if (!task.calendar.enabled) return null;
  if (!task.startDate) return null;

  const start = new Date(task.startDate);
  const end = task.endDate ? new Date(task.endDate) : new Date(start.getTime() + HOUR_MS);

  const detailLines = [
    task.summary,
    task.checklist.length > 0 ? `準備事項:\n- ${task.checklist.join("\n- ")}` : "",
    task.officialUrl ? `官方網站: ${task.officialUrl}` : "",
  ].filter(Boolean);

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: task.title,
    dates: `${formatUTC(start)}/${formatUTC(end)}`,
    details: detailLines.join("\n\n"),
    location: task.location ?? "",
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
