import { z } from "zod";

export const createBoardSchema = z.object({
  workspaceId: z.string().min(1, "Workspace ID is required"),
  title: z.string().min(1, "Board title is required").max(100),
  description: z.string().max(500).optional(),
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).default("#6366F1"),
});

export const updateBoardSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional().nullable(),
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).optional(),
  isFavorite: z.boolean().optional(),
});

export type CreateBoardInput = z.infer<typeof createBoardSchema>;
export type UpdateBoardInput = z.infer<typeof updateBoardSchema>;
