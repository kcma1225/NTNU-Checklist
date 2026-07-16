import { z } from "zod";

export const CategorySchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  colorToken: z.enum([
    "blue",
    "green",
    "amber",
    "purple",
    "rose",
    "teal",
    "slate",
  ]),
});

export type Category = z.infer<typeof CategorySchema>;

export const CategoryListSchema = z.array(CategorySchema);
