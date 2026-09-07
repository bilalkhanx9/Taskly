import { z } from "zod";

export const requestUploadUrlSchema = z.object({
  taskId: z.string().min(1, "Task ID is required"),
  filename: z.string().min(1, "Filename is required"),
  fileType: z.string().min(1, "File MIME type is required"),
  fileSize: z.number().max(25 * 1024 * 1024, "Max file size is 25MB"),
});

export const confirmAttachmentSchema = z.object({
  taskId: z.string().min(1),
  name: z.string().min(1),
  fileKey: z.string().min(1),
  url: z.string().url(),
  size: z.number().int().positive(),
  type: z.string().min(1),
});

export type RequestUploadUrlInput = z.infer<typeof requestUploadUrlSchema>;
export type ConfirmAttachmentInput = z.infer<typeof confirmAttachmentSchema>;
