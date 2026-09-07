"use server";

import { prisma } from "@/lib/prisma";
import { getPresignedUploadUrl } from "@/lib/r2";
import { revalidatePath } from "next/cache";

export async function createAttachmentUploadUrlAction(
  taskId: string,
  fileName: string,
  contentType: string
) {
  try {
    const key = `tasks/${taskId}/${Date.now()}-${fileName.replace(/\s+/g, "_")}`;
    const result = await getPresignedUploadUrl(key, contentType);
    return { success: true, ...result };
  } catch (error: any) {
    console.error("Error creating presigned URL:", error);
    return { success: false, error: error.message };
  }
}

export async function saveAttachmentRecordAction(data: {
  taskId: string;
  name: string;
  fileKey: string;
  url: string;
  size: number;
  type: string;
  uploaderId?: string;
}) {
  try {
    const attachment = await prisma.taskAttachment.create({
      data: {
        taskId: data.taskId,
        name: data.name,
        fileKey: data.fileKey,
        url: data.url,
        size: data.size,
        type: data.type,
        uploaderId: data.uploaderId,
      },
    });

    revalidatePath("/");
    return { success: true, attachment };
  } catch (error: any) {
    console.error("Error saving attachment record:", error);
    return { success: false, error: error.message };
  }
}
