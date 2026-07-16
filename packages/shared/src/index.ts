export * from "./schema/task";
export * from "./schema/link";
export * from "./schema/guide";
export * from "./schema/category";
export * from "./lib/task-status";
export * from "./lib/calendar";
// Note: ./lib/data-paths is intentionally NOT re-exported here. It imports node:fs and is
// only meant for server-only consumers (apps/web/src/lib/data.ts, apps/editor's data-store).
// Bundling it into this barrel would pull node:fs into client component bundles, since this
// index is imported from client components for the schema/status/calendar helpers above.
