import "server-only";
import fs from "node:fs";
import path from "node:path";
import {
  TaskSchema,
  TaskListSchema,
  LinkSchema,
  LinkListSchema,
  CategoryListSchema,
  type Task,
  type Link,
  type Category,
} from "@ntnu-guide/shared";
// Deep import: touches node:fs, see the note in packages/shared/src/index.ts.
import { resolveDataDir } from "@ntnu-guide/shared/src/lib/data-paths";

function readJsonFile(file: string): unknown {
  return JSON.parse(fs.readFileSync(path.join(resolveDataDir(), file), "utf8"));
}

/** Write-then-rename so a crash mid-write can never leave tasks.json truncated/corrupt. */
function writeJsonFileAtomic(file: string, data: unknown): void {
  const dir = resolveDataDir();
  const target = path.join(dir, file);
  const tmp = path.join(dir, `.${file}.${process.pid}.tmp`);
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2) + "\n", "utf8");
  fs.renameSync(tmp, target);
}

export class NotFoundError extends Error {}
export class ConflictError extends Error {}

// ---- Tasks --------------------------------------------------------------

export function listTasks(): Task[] {
  return TaskListSchema.parse(readJsonFile("tasks.json"));
}

export function getTask(id: string): Task {
  const task = listTasks().find((t) => t.id === id);
  if (!task) throw new NotFoundError(`Task "${id}" not found`);
  return task;
}

export function createTask(input: unknown): Task {
  const parsed = TaskSchema.parse(input);
  const tasks = listTasks();
  if (tasks.some((t) => t.id === parsed.id)) {
    throw new ConflictError(`Task id "${parsed.id}" already exists`);
  }
  const next = [...tasks, parsed];
  TaskListSchema.parse(next);
  writeJsonFileAtomic("tasks.json", next);
  return parsed;
}

export function updateTask(id: string, input: unknown): Task {
  const parsed = TaskSchema.parse(input);
  const tasks = listTasks();
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) throw new NotFoundError(`Task "${id}" not found`);
  if (parsed.id !== id && tasks.some((t) => t.id === parsed.id)) {
    throw new ConflictError(`Task id "${parsed.id}" already exists`);
  }
  const next = [...tasks];
  next[index] = parsed;
  TaskListSchema.parse(next);
  writeJsonFileAtomic("tasks.json", next);
  return parsed;
}

export function deleteTask(id: string): void {
  const tasks = listTasks();
  const next = tasks.filter((t) => t.id !== id);
  if (next.length === tasks.length) throw new NotFoundError(`Task "${id}" not found`);
  writeJsonFileAtomic("tasks.json", next);
}

// ---- Links ----------------------------------------------------------------

export function listLinks(): Link[] {
  return LinkListSchema.parse(readJsonFile("links.json"));
}

export function getLink(id: string): Link {
  const link = listLinks().find((l) => l.id === id);
  if (!link) throw new NotFoundError(`Link "${id}" not found`);
  return link;
}

export function createLink(input: unknown): Link {
  const parsed = LinkSchema.parse(input);
  const links = listLinks();
  if (links.some((l) => l.id === parsed.id)) {
    throw new ConflictError(`Link id "${parsed.id}" already exists`);
  }
  const next = [...links, parsed];
  writeJsonFileAtomic("links.json", next);
  return parsed;
}

export function updateLink(id: string, input: unknown): Link {
  const parsed = LinkSchema.parse(input);
  const links = listLinks();
  const index = links.findIndex((l) => l.id === id);
  if (index === -1) throw new NotFoundError(`Link "${id}" not found`);
  if (parsed.id !== id && links.some((l) => l.id === parsed.id)) {
    throw new ConflictError(`Link id "${parsed.id}" already exists`);
  }
  const next = [...links];
  next[index] = parsed;
  writeJsonFileAtomic("links.json", next);
  return parsed;
}

export function deleteLink(id: string): void {
  const links = listLinks();
  const next = links.filter((l) => l.id !== id);
  if (next.length === links.length) throw new NotFoundError(`Link "${id}" not found`);
  writeJsonFileAtomic("links.json", next);
}

// ---- Read-only reference data (categories aren't editable in the MVP editor) ---

export function listCategories(): Category[] {
  return CategoryListSchema.parse(readJsonFile("categories.json"));
}
