"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getWorkspaceTasks(workspaceId?: string) {
  try {
    const tasks = await prisma.task.findMany({
      where: workspaceId
        ? {
            project: {
              workspaceId,
            },
          }
        : undefined,
      include: {
        subtasks: {
          orderBy: { order: "asc" },
        },
        comments: {
          include: { user: true },
          orderBy: { createdAt: "desc" },
        },
        assignee: true,
        creator: true,
        attachments: true,
        project: true,
      },
      orderBy: { order: "asc" },
    });
    return { success: true, tasks };
  } catch (error: any) {
    console.error("Error fetching tasks:", error);
    return { success: false, error: error.message, tasks: [] };
  }
}

export async function createTaskAction(data: {
  title: string;
  projectId: string;
  description?: string;
  priority?: string;
  status?: string;
  dueDate?: string;
  assigneeId?: string;
  creatorId?: string;
  subtasks?: string[];
}) {
  try {
    const task = await prisma.task.create({
      data: {
        title: data.title,
        projectId: data.projectId,
        description: data.description || "",
        priority: data.priority || "medium",
        status: data.status || "todo",
        dueDate: data.dueDate,
        assigneeId: data.assigneeId,
        creatorId: data.creatorId,
        subtasks: data.subtasks && data.subtasks.length > 0
          ? {
              create: data.subtasks.map((st, idx) => ({
                title: st,
                order: idx,
                completed: false,
              })),
            }
          : undefined,
      },
      include: {
        subtasks: true,
        assignee: true,
        creator: true,
        project: true,
      },
    });

    // Create activity log
    if (task.project?.workspaceId) {
      await prisma.activityLog.create({
        data: {
          workspaceId: task.project.workspaceId,
          taskId: task.id,
          userId: data.creatorId,
          action: "TASK_CREATED",
          details: `Created task "${task.title}"`,
        },
      });
    }

    revalidatePath("/");
    return { success: true, task };
  } catch (error: any) {
    console.error("Error creating task:", error);
    return { success: false, error: error.message };
  }
}

export async function updateTaskStatusAction(taskId: string, status: string, userId?: string) {
  try {
    const task = await prisma.task.update({
      where: { id: taskId },
      data: { status },
      include: { project: true },
    });

    if (task.project?.workspaceId) {
      await prisma.activityLog.create({
        data: {
          workspaceId: task.project.workspaceId,
          taskId: task.id,
          userId,
          action: status === "done" ? "TASK_COMPLETED" : "TASK_STATUS_CHANGED",
          details: `Moved "${task.title}" to ${status.toUpperCase().replace("_", " ")}`,
        },
      });
    }

    revalidatePath("/");
    return { success: true, task };
  } catch (error: any) {
    console.error("Error updating task status:", error);
    return { success: false, error: error.message };
  }
}

export async function updateTaskPriorityAction(taskId: string, priority: string) {
  try {
    const task = await prisma.task.update({
      where: { id: taskId },
      data: { priority },
    });
    revalidatePath("/");
    return { success: true, task };
  } catch (error: any) {
    console.error("Error updating task priority:", error);
    return { success: false, error: error.message };
  }
}

export async function toggleSubtaskAction(subtaskId: string, completed: boolean) {
  try {
    const subtask = await prisma.subtask.update({
      where: { id: subtaskId },
      data: { completed },
    });
    revalidatePath("/");
    return { success: true, subtask };
  } catch (error: any) {
    console.error("Error toggling subtask:", error);
    return { success: false, error: error.message };
  }
}

export async function addSubtaskAction(taskId: string, title: string) {
  try {
    const count = await prisma.subtask.count({ where: { taskId } });
    const subtask = await prisma.subtask.create({
      data: {
        taskId,
        title,
        order: count,
        completed: false,
      },
    });
    revalidatePath("/");
    return { success: true, subtask };
  } catch (error: any) {
    console.error("Error adding subtask:", error);
    return { success: false, error: error.message };
  }
}

export async function addTaskCommentAction(taskId: string, userId: string, content: string) {
  try {
    const comment = await prisma.taskComment.create({
      data: {
        taskId,
        userId,
        content,
      },
      include: {
        user: true,
      },
    });
    revalidatePath("/");
    return { success: true, comment };
  } catch (error: any) {
    console.error("Error adding task comment:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteTaskAction(taskId: string) {
  try {
    await prisma.task.delete({
      where: { id: taskId },
    });
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting task:", error);
    return { success: false, error: error.message };
  }
}

export async function updateTaskDetailsAction(taskId: string, data: {
  title?: string;
  description?: string;
  status?: string;
  priority?: string;
  dueDate?: string;
  assigneeId?: string;
}) {
  try {
    const task = await prisma.task.update({
      where: { id: taskId },
      data: {
        ...(data.title !== undefined ? { title: data.title } : {}),
        ...(data.description !== undefined ? { description: data.description } : {}),
        ...(data.status !== undefined ? { status: data.status } : {}),
        ...(data.priority !== undefined ? { priority: data.priority } : {}),
        ...(data.dueDate !== undefined ? { dueDate: data.dueDate } : {}),
        ...(data.assigneeId !== undefined ? { assigneeId: data.assigneeId } : {}),
      },
    });
    revalidatePath("/");
    return { success: true, task };
  } catch (error: any) {
    console.error("Error updating task details:", error);
    return { success: false, error: error.message };
  }
}
