"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getWorkspaceProjects(workspaceId: string) {
  try {
    const projects = await prisma.project.findMany({
      where: { workspaceId },
      include: {
        tasks: {
          select: {
            id: true,
            status: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    const enriched = projects.map((p) => {
      const totalTasks = p.tasks.length;
      const completedTasks = p.tasks.filter((t) => t.status === "done").length;
      return {
        ...p,
        totalTasks,
        completedTasks,
      };
    });

    return { success: true, projects: enriched };
  } catch (error: any) {
    console.error("Error getting projects:", error);
    return { success: false, error: error.message, projects: [] };
  }
}

export async function createProjectAction(data: {
  workspaceId: string;
  name: string;
  description?: string;
  color?: string;
  deadline?: string;
}) {
  try {
    const project = await prisma.project.create({
      data: {
        workspaceId: data.workspaceId,
        name: data.name,
        description: data.description || "",
        color: data.color || "#EA580C",
        deadline: data.deadline || "",
        status: "active",
      },
    });

    await prisma.activityLog.create({
      data: {
        workspaceId: data.workspaceId,
        action: "PROJECT_CREATED",
        details: `Created new project "${project.name}"`,
      },
    });

    revalidatePath("/");
    return { success: true, project };
  } catch (error: any) {
    console.error("Error creating project:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteProjectAction(projectId: string) {
  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (project) {
      await prisma.project.delete({
        where: { id: projectId },
      });

      await prisma.activityLog.create({
        data: {
          workspaceId: project.workspaceId,
          action: "PROJECT_DELETED",
          details: `Deleted project "${project.name}"`,
        },
      });
    }

    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting project:", error);
    return { success: false, error: error.message };
  }
}
