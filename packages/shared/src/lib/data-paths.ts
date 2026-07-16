import { existsSync } from "node:fs";
import path from "node:path";

/**
 * Resolves the repo-root `data/` directory that both apps/web (read-only, at build time)
 * and apps/editor (read-write, local dev) treat as the single source of truth. Both apps
 * live two levels below the repo root (apps/<name>), and pnpm runs them with cwd set to
 * their own package dir, so the default relative path holds — DATA_DIR exists purely as
 * an override for non-standard layouts (e.g. CI checkout of a subdirectory).
 */
export function resolveDataDir(): string {
  const dir = process.env.DATA_DIR ?? path.resolve(process.cwd(), "../../data");
  if (!existsSync(path.join(dir, "tasks.json"))) {
    throw new Error(
      `Could not find tasks.json under resolved DATA_DIR "${dir}". ` +
        "Set the DATA_DIR environment variable if the repo layout differs from the default apps/<name> -> ../../data.",
    );
  }
  return dir;
}
