import { z } from "zod";
import type { Task } from "@ntnu-guide/shared";

// Client-side form shape: everything is a plain string/boolean suited to HTML inputs.
// The API route re-validates the transformed payload against the real TaskSchema, so this
// schema only needs to catch obviously-missing required fields before submitting.
export const taskFormSchema = z
  .object({
    id: z
      .string()
      .min(1, "必填")
      .regex(/^[a-z0-9-]+$/, "只能使用小寫英文、數字與連字號（如 health-check）"),
    title: z.string().min(1, "必填"),
    category: z.string().min(1, "請選擇類別"),
    tbd: z.boolean(),
    // <input type="datetime-local"> value, e.g. "2026-09-03T09:00" (always Taipei local time)
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    location: z.string().optional(),
    summary: z.string().min(1, "必填"),
    description: z.string().optional(),
    department: z.string().optional(),
    checklist: z.string().optional(),
    officialUrl: z.string().optional(),
    mapUrl: z.string().optional(),
    documentUrl: z.string().optional(),
    academicYear: z.string().optional(),
    semester: z.enum(["none", "1", "2"]),
    calendarEnabled: z.boolean(),
  })
  .refine((v) => v.tbd || !!v.startDate, {
    message: "請輸入日期，或勾選「日期尚未公布」",
    path: ["startDate"],
  });

export type TaskFormValues = z.infer<typeof taskFormSchema>;

function toDatetimeLocal(iso: string | null | undefined): string {
  if (!iso) return "";
  // "2026-09-03T09:00:00+08:00" -> "2026-09-03T09:00" for the native input's value
  return iso.slice(0, 16);
}

export function taskToFormValues(task?: Task): TaskFormValues {
  if (!task) {
    return {
      id: "",
      title: "",
      category: "",
      tbd: false,
      startDate: "",
      endDate: "",
      location: "",
      summary: "",
      description: "",
      department: "",
      checklist: "",
      officialUrl: "",
      mapUrl: "",
      documentUrl: "",
      academicYear: "",
      semester: "none",
      calendarEnabled: true,
    };
  }
  return {
    id: task.id,
    title: task.title,
    category: task.category,
    tbd: task.startDate === null,
    startDate: toDatetimeLocal(task.startDate),
    endDate: toDatetimeLocal(task.endDate),
    location: task.location ?? "",
    summary: task.summary,
    description: task.description ?? "",
    department: task.department ?? "",
    checklist: task.checklist.join("\n"),
    officialUrl: task.officialUrl ?? "",
    mapUrl: task.mapUrl ?? "",
    documentUrl: task.documentUrl ?? "",
    academicYear: task.academicYear ?? "",
    semester: task.semester ? (String(task.semester) as "1" | "2") : "none",
    calendarEnabled: task.calendar.enabled,
  };
}

/** Assumes Asia/Taipei (+08:00) — this editor is a single-timezone local tool by design. */
function toIsoWithOffset(datetimeLocal: string): string {
  return `${datetimeLocal}:00+08:00`;
}

export function formValuesToTaskPayload(values: TaskFormValues): unknown {
  return {
    id: values.id.trim(),
    title: values.title.trim(),
    category: values.category,
    startDate: values.tbd || !values.startDate ? null : toIsoWithOffset(values.startDate),
    endDate: values.tbd || !values.endDate ? null : toIsoWithOffset(values.endDate),
    location: values.location?.trim() || undefined,
    summary: values.summary.trim(),
    description: values.description?.trim() || undefined,
    department: values.department?.trim() || undefined,
    checklist: (values.checklist ?? "")
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean),
    officialUrl: values.officialUrl?.trim() || undefined,
    mapUrl: values.mapUrl?.trim() || undefined,
    documentUrl: values.documentUrl?.trim() || undefined,
    academicYear: values.academicYear?.trim() || undefined,
    semester: values.semester === "none" ? undefined : Number(values.semester),
    calendar: { enabled: values.calendarEnabled },
  };
}
