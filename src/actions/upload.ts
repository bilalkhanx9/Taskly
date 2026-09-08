"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { uploadToR2, deleteFromR2 } from "@/lib/r2";

export async function uploadAttachment(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    const projectId = (formData.get("projectId") as string) || null;

    if (!file) {
      return { success: false, error: "No file provided" };
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize filename and create unique key
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const fileKey = `attachments/${Date.now()}-${cleanFileName}`;

    // Upload to Cloudflare R2
    const { url } = await uploadToR2({
      fileKey,
      buffer,
      contentType: file.type || "application/octet-stream",
    });

    // Record attachment in Prisma database
    const attachment = await prisma.attachment.create({
      data: {
        filename: file.name,
        fileUrl: url,
        fileKey,
        fileSize: file.size,
        mimeType: file.type || "application/octet-stream",
        projectId: projectId || undefined,
      },
    });

    revalidatePath("/");
    return { success: true, data: attachment };
  } catch (error: any) {
    console.error("uploadAttachment error:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteAttachment(attachmentId: string) {
  try {
    const attachment = await prisma.attachment.findUnique({
      where: { id: attachmentId },
    });

    if (!attachment) {
      return { success: false, error: "Attachment not found" };
    }

    // Delete from Cloudflare R2
    await deleteFromR2(attachment.fileKey);

    // Delete record from Prisma database
    await prisma.attachment.delete({
      where: { id: attachmentId },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("deleteAttachment error:", error);
    return { success: false, error: error.message };
  }
}
