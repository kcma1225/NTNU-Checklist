import fs from "node:fs";
import path from "node:path";
import {
  TaskListSchema,
  LinkListSchema,
  GuideSectionListSchema,
  CategoryListSchema,
  type Task,
  type Link,
  type GuideSection,
  type Category,
} from "@ntnu-guide/shared";
// Deep import (not via the package barrel): this touches node:fs and must never be pulled
// into a client bundle, see the note in packages/shared/src/index.ts.
import { resolveDataDir } from "@ntnu-guide/shared/src/lib/data-paths";

interface AppData {
  tasks: Task[];
  links: Link[];
  guide: GuideSection[];
  categories: Category[];
}

let cache: AppData | null = null;

function readJson(dir: string, file: string): unknown {
  const raw = fs.readFileSync(path.join(dir, file), "utf8");
  return JSON.parse(raw);
}

// Server-only: executed at `next build` time (static export has no runtime server), so
// throwing here fails the build loudly instead of shipping bad/missing data.
function loadAll(): AppData {
  if (cache) return cache;
  const dir = resolveDataDir();
  cache = {
    tasks: TaskListSchema.parse(readJson(dir, "tasks.json")),
    links: LinkListSchema.parse(readJson(dir, "links.json")),
    guide: GuideSectionListSchema.parse(readJson(dir, "guide.json")),
    categories: CategoryListSchema.parse(readJson(dir, "categories.json")),
  };
  return cache;
}

export function getAllTasks(): Task[] {
  return loadAll().tasks;
}

export function getAllLinks(): Link[] {
  return loadAll().links;
}

export function getGuideSections(): GuideSection[] {
  return loadAll().guide;
}

export function getCategories(): Category[] {
  return loadAll().categories;
}

export function getCategoryLabel(categoryId: string): string {
  return getCategories().find((c) => c.id === categoryId)?.label ?? categoryId;
}
