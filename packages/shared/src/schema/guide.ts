import { z } from "zod";

export const GuideSectionSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  category: z.string().min(1),
  paragraphs: z.array(z.string().min(1)).min(1),
});

export type GuideSection = z.infer<typeof GuideSectionSchema>;

export const GuideSectionListSchema = z.array(GuideSectionSchema);
