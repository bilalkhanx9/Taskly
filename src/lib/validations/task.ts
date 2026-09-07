import { z } from "zod";

export const PriorityEnum = z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]);

export const createTaskSchema = z.object({
  boardId: z.string().min(1, "Board ID is required"),
  columnId: z.string().min(1, "Column ID is required"),
  title: z.string().min(1, "Title is required").max(200, "Title is too long"),
  description: z.string().optional(),
  priority: PriorityEnum.default("MEDIUM"),
  dueDate: z.string().datetime().optional().nullable(),
  assigneeId: z.string().optional().nullable(),
  order: z.number().int().nonnegative().default(0),
});

export const updateTaskSchema = z.object({
  id: z.string().min(1, "Task ID is required"),
  title: z.string().min(1, "Title is required").max(200).optional(),
  description: z.string().optional().nullable(),
  priority: PriorityEnum.optional(),
  dueDate: z.string().datetime().optional().nullable(),
  assigneeId: z.string().optional().nullable(),
  columnId: z.string().optional(),
  order: z.number().int().nonnegative().optional(),
});

export const reorderTaskSchema = z.object({
  taskId: z.string().min(1),
  sourceColumnId: z.string().min(1),
  destinationColumnId: z.string().min(1),
  newOrder: z.number().int().nonnegative(),
});

export const addCommentSchema = z.object({
  taskId: z.string().min(1),
  content: z.string().min(1, "Comment content cannot be empty").max(2000),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type ReorderTaskInput = z.infer<typeof reorderTaskSchema>;
export type AddCommentInput = z.infer<typeof addCommentSchema>;
