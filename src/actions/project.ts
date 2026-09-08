"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function getProjects(workspaceId: string) {
  try {
    const projects = await prisma.project.findMany({
      where: { workspaceId },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: projects };
  } catch (error: any) {
    console.error("getProjects error:", error);
    return { success: false, error: error.message, data: [] };
  }
}

export async function createProject({
  workspaceId,
  name,
  description,
  bannerColor = "#2563EB",
}: {
  workspaceId: string;
  name: string;
  description?: string;
  bannerColor?: string;
}) {
  try {
    if (!name.trim()) {
      return { success: false, error: "Project name is required" };
    }

    const project = await prisma.project.create({
      data: {
        workspaceId,
        name: name.trim(),
        description: description?.trim() || "",
        bannerColor: bannerColor || "#2563EB",
        isFavorite: false,
      },
    });

    revalidatePath("/");
    return { success: true, data: project };
  } catch (error: any) {
    console.error("createProject error:", error);
    return { success: false, error: error.message };
  }
}

export async function duplicateProject(projectId: string) {
  try {
    const existing = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!existing) {
      return { success: false, error: "Project not found" };
    }

    const duplicated = await prisma.project.create({
      data: {
        workspaceId: existing.workspaceId,
        name: `${existing.name} (Copy)`,
        description: existing.description,
        bannerColor: existing.bannerColor,
        isFavorite: false,
      },
    });

    revalidatePath("/");
    return { success: true, data: duplicated };
  } catch (error: any) {
    console.error("duplicateProject error:", error);
    return { success: false, error: error.message };
  }
}

export async function toggleProjectFavorite(projectId: string) {
  try {
    const existing = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!existing) {
      return { success: false, error: "Project not found" };
    }

    const updated = await prisma.project.update({
      where: { id: projectId },
      data: { isFavorite: !existing.isFavorite },
    });

    revalidatePath("/");
    return { success: true, data: updated };
  } catch (error: any) {
    console.error("toggleProjectFavorite error:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteProject(projectId: string) {
  try {
    await prisma.project.delete({
      where: { id: projectId },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("deleteProject error:", error);
    return { success: false, error: error.message };
  }
}
