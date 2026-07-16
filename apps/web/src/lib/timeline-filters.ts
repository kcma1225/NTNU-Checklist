import { getTaskStatus, type Task, type TaskStatus } from "@ntnu-guide/shared";

export interface TimelineFilters {
  q: string;
  categories: string[];
  academicYear: string | null;
  semester: 1 | 2 | null;
  status: TaskStatus | null;
}

export function filterTasks(
  tasks: Task[],
  completedIds: ReadonlySet<string>,
  filters: TimelineFilters,
): Task[] {
  const q = filters.q.trim().toLowerCase();
  return tasks.filter((task) => {
    if (q) {
      const haystack = `${task.title} ${task.summary} ${task.location ?? ""}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    if (filters.categories.length > 0 && !filters.categories.includes(task.category)) {
      return false;
    }
    if (filters.academicYear && task.academicYear !== filters.academicYear) return false;
    if (filters.semester && task.semester !== filters.semester) return false;
    if (filters.status && getTaskStatus(task, completedIds) !== filters.status) return false;
    return true;
  });
}

export function getUniqueAcademicYears(tasks: Task[]): string[] {
  return Array.from(new Set(tasks.map((t) => t.academicYear).filter((v): v is string => !!v))).sort();
}
