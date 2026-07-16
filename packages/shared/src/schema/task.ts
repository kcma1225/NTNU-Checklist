import { z } from "zod";

// Google Calendar UTC conversion (see lib/calendar.ts) requires every timestamp to carry
// an explicit UTC offset. A bare "2026-09-03T09:00:00" would otherwise be interpreted in
// whichever timezone the browser/CI machine happens to run in — silently wrong dates.
const offsetDateTime = z
  .string()
  .refine((value) => /[+-]\d{2}:\d{2}$|Z$/.test(value), {
    message: "Date must include an explicit UTC offset (e.g. +08:00 or Z)",
  })
  .refine((value) => !Number.isNaN(new Date(value).getTime()), {
    message: "Date must be a valid ISO 8601 timestamp",
  });

export const TaskSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  category: z.string().min(1),
  // null = date not yet announced ("待公告"). Never fabricate a placeholder date.
  startDate: offsetDateTime.nullable(),
  endDate: offsetDateTime.nullable().optional(),
  location: z.string().nullable().optional(),
  summary: z.string().min(1),
  description: z.string().optional(),
  department: z.string().optional(),
  checklist: z.array(z.string().min(1)).default([]),
  officialUrl: z.string().url().optional(),
  mapUrl: z.string().url().optional(),
  documentUrl: z.string().url().optional(),
  academicYear: z.string().optional(),
  semester: z.union([z.literal(1), z.literal(2)]).optional(),
  calendar: z.object({
    enabled: z.boolean().default(true),
  }),
});

export type Task = z.infer<typeof TaskSchema>;

export const TaskListSchema = z.array(TaskSchema).superRefine((tasks, ctx) => {
  const seen = new Set<string>();
  tasks.forEach((task, index) => {
    if (seen.has(task.id)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Duplicate task id "${task.id}"`,
        path: [index, "id"],
      });
    }
    seen.add(task.id);
    if (task.endDate && task.startDate && new Date(task.endDate) < new Date(task.startDate)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `endDate is before startDate for task "${task.id}"`,
        path: [index, "endDate"],
      });
    }
  });
});
