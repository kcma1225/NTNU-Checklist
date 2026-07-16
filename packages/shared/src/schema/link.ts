import { z } from "zod";

// Allow-list of icon names mapped to Lucide components in apps/web/src/lib/icons.ts.
// An unrecognized name falls back to a default icon at render time rather than
// breaking anything, but keeping an enum here catches typos at editor-save time.
export const LinkIconSchema = z.enum([
  "graduation-cap",
  "book-open",
  "calendar-days",
  "wallet",
  "file-text",
  "map-pin",
  "globe",
  "clipboard-list",
  "building-2",
  "link",
]);

export const LinkSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  description: z.string().optional(),
  url: z.string().url(),
  icon: LinkIconSchema.default("link"),
});

export type Link = z.infer<typeof LinkSchema>;
export type LinkIcon = z.infer<typeof LinkIconSchema>;

export const LinkListSchema = z.array(LinkSchema);
