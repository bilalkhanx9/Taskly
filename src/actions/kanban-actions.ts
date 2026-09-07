"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { inngest } from "@/inngest/client";
import { getPresignedUploadUrl } from "@/lib/r2";
import {
  createTaskSchema,
  updateTaskSchema,
  reorderTaskSchema,
  addCommentSchema,
  CreateTaskInput,
  UpdateTaskInput,
  ReorderTaskInput,
  AddCommentInput,
} from "@/lib/validations/task";
import {
  createColumnSchema,
  updateColumnSchema,
  deleteColumnSchema,
  CreateColumnInput,
  UpdateColumnInput,
  DeleteColumnInput,
} from "@/lib/validations/column";
import {
  requestUploadUrlSchema,
  confirmAttachmentSchema,
  RequestUploadUrlInput,
  ConfirmAttachmentInput,
} from "@/lib/validations/attachment";

// ----------------------------------------------------
// TASK ACTIONS
// ----------------------------------------------------
export async function createTaskAction(data: CreateTaskInput) {
  const parsed = createTaskSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.flatten().fieldErrors };
  }

  try {
    const { boardId, columnId, title, description, priority, dueDate, assigneeId, order } = parsed.data;

    const task = await prisma.task.create({
      data: {
        boardId,
        columnId,
        title,
        description,
        priority,
        dueDate: dueDate ? new Date(dueDate) : null,
        assigneeId: assigneeId || null,
        order,
      },
      include: {
        assignee: true,
        column: true,
        board: true,
      },
    });

    // Trigger Inngest event if task assigned
    if (task.assignee?.email) {
      await inngest.send({
        name: "tasks/assigned",
        data: {
          taskId: task.id,
          taskTitle: task.title,
          assigneeEmail: task.assignee.email,
          assigneeName: task.assignee.name || "Colleague",
          assignerName: "Project Admin",
          boardTitle: task.board.title,
        },
      });
    }

    // Schedule due reminder if due date present
    if (task.dueDate && task.assignee?.email) {
      await inngest.send({
        name: "tasks/due-reminder",
        data: {
          taskId: task.id,
          taskTitle: task.title,
          dueDate: task.dueDate.toISOString(),
          userEmail: task.assignee.email,
        },
      });
    }

    revalidatePath(`/`);
    return { success: true, data: task };
  } catch (error) {
    console.error("createTaskAction error:", error);
    return { success: false, error: "Failed to create task" };
  }
}

export async function updateTaskAction(data: UpdateTaskInput) {
  const parsed = updateTaskSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.flatten().fieldErrors };
  }

  try {
    const { id, title, description, priority, dueDate, assigneeId, columnId, order } = parsed.data;

    const updated = await prisma.task.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(priority && { priority }),
        ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
        ...(assigneeId !== undefined && { assigneeId }),
        ...(columnId && { columnId }),
        ...(order !== undefined && { order }),
      },
      include: {
        assignee: true,
        attachments: true,
        comments: { include: { user: true } },
      },
    });

    revalidatePath(`/`);
    return { success: true, data: updated };
  } catch (error) {
    console.error("updateTaskAction error:", error);
    return { success: false, error: "Failed to update task" };
  }
}

export async function deleteTaskAction(taskId: string) {
  try {
    await prisma.task.delete({
      where: { id: taskId },
    });
    revalidatePath(`/`);
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete task" };
  }
}

export async function reorderTaskAction(data: ReorderTaskInput) {
  const parsed = reorderTaskSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: "Invalid reorder parameters" };
  }

  const { taskId, destinationColumnId, newOrder } = parsed.data;

  try {
    await prisma.task.update({
      where: { id: taskId },
      data: {
        columnId: destinationColumnId,
        order: newOrder,
      },
    });

    revalidatePath(`/`);
    return { success: true };
  } catch (error) {
    console.error("reorderTaskAction error:", error);
    return { success: false, error: "Failed to reorder task" };
  }
}

// ----------------------------------------------------
// COLUMN ACTIONS
// ----------------------------------------------------
export async function createColumnAction(data: CreateColumnInput) {
  const parsed = createColumnSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.flatten().fieldErrors };
  }

  try {
    const column = await prisma.column.create({
      data: parsed.data,
    });
    revalidatePath(`/`);
    return { success: true, data: column };
  } catch (error) {
    return { success: false, error: "Failed to create column" };
  }
}

export async function updateColumnAction(data: UpdateColumnInput) {
  const parsed = updateColumnSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.flatten().fieldErrors };
  }

  try {
    const { id, title, colorDot, order } = parsed.data;
    const updated = await prisma.column.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(colorDot && { colorDot }),
        ...(order !== undefined && { order }),
      },
    });
    revalidatePath(`/`);
    return { success: true, data: updated };
  } catch (error) {
    return { success: false, error: "Failed to update column" };
  }
}

export async function deleteColumnAction(data: DeleteColumnInput) {
  const parsed = deleteColumnSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: "Invalid column ID" };
  }

  try {
    await prisma.column.delete({
      where: { id: parsed.data.id },
    });
    revalidatePath(`/`);
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete column" };
  }
}

// ----------------------------------------------------
// CLOUDFLARE R2 ATTACHMENT ACTIONS
// ----------------------------------------------------
export async function requestAttachmentUploadAction(data: RequestUploadUrlInput) {
  const parsed = requestUploadUrlSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.flatten().fieldErrors };
  }

  const { taskId, filename, fileType } = parsed.data;
  const fileKey = `tasks/${taskId}/${Date.now()}-${filename.replace(/\s+/g, "_")}`;

  try {
    const { uploadUrl, publicUrl, key } = await getPresignedUploadUrl(fileKey, fileType);
    return { success: true, uploadUrl, publicUrl, fileKey: key };
  } catch (error) {
    return { success: false, error: "Failed to generate upload URL" };
  }
}

export async function confirmAttachmentAction(data: ConfirmAttachmentInput) {
  const parsed = confirmAttachmentSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.flatten().fieldErrors };
  }

  try {
    const attachment = await prisma.taskAttachment.create({
      data: parsed.data,
    });
    revalidatePath(`/`);
    return { success: true, data: attachment };
  } catch (error) {
    return { success: false, error: "Failed to save attachment metadata" };
  }
}

// ----------------------------------------------------
// COMMENTS
// ----------------------------------------------------
export async function addCommentAction(data: AddCommentInput, userId: string = "demo-user-1") {
  const parsed = addCommentSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.flatten().fieldErrors };
  }

  try {
    const comment = await prisma.taskComment.create({
      data: {
        taskId: parsed.data.taskId,
        content: parsed.data.content,
        userId,
      },
      include: { user: true },
    });
    revalidatePath(`/`);
    return { success: true, data: comment };
  } catch (error) {
    return { success: false, error: "Failed to post comment" };
  }
}
