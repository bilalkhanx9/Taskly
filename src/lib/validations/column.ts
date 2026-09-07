import { z } from "zod";

export const createColumnSchema = z.object({
  boardId: z.string().min(1, "Board ID is required"),
  title: z.string().min(1, "Column title is required").max(50),
  colorDot: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color").optional(),
  order: z.number().int().nonnegative().default(0),
});

export const updateColumnSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1).max(50).optional(),
  colorDot: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).optional(),
  order: z.number().int().nonnegative().optional(),
});

export const deleteColumnSchema = z.object({
  id: z.string().min(1),
});

export type CreateColumnInput = z.infer<typeof createColumnSchema>;
export type UpdateColumnInput = z.infer<typeof updateColumnSchema>;
export type DeleteColumnInput = z.infer<typeof deleteColumnSchema>;
