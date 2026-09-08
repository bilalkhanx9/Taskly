"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function getWorkspaces() {
  try {
    const workspaces = await prisma.workspace.findMany({
      include: {
        projects: {
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { createdAt: "asc" },
    });
    return { success: true, data: workspaces };
  } catch (error: any) {
    console.error("getWorkspaces error:", error);
    return { success: false, error: error.message, data: [] };
  }
}

export async function getActiveWorkspace(slugOrId?: string) {
  try {
    if (slugOrId) {
      const workspace = await prisma.workspace.findFirst({
        where: {
          OR: [{ id: slugOrId }, { slug: slugOrId }],
        },
        include: {
          projects: {
            orderBy: { createdAt: "desc" },
          },
        },
      });
      if (workspace) return { success: true, data: workspace };
    }

    // Default to the first available workspace
    const firstWorkspace = await prisma.workspace.findFirst({
      include: {
        projects: {
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return { success: true, data: firstWorkspace };
  } catch (error: any) {
    console.error("getActiveWorkspace error:", error);
    return { success: false, error: error.message, data: null };
  }
}

export async function createWorkspace(name: string, projectName?: string, projectDesc?: string) {
  try {
    if (!name.trim()) {
      return { success: false, error: "Workspace name is required" };
    }

    const baseSlug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");
    const uniqueSlug = `${baseSlug}-${Date.now()}`;

    const workspace = await prisma.workspace.create({
      data: {
        name: name.trim(),
        slug: uniqueSlug,
        projects: projectName?.trim()
          ? {
              create: {
                name: projectName.trim(),
                description: projectDesc?.trim() || null,
              },
            }
          : undefined,
      },
      include: {
        projects: true,
      },
    });

    revalidatePath("/");
    return { success: true, data: workspace };
  } catch (error: any) {
    console.error("createWorkspace error:", error);
    return { success: false, error: error.message };
  }
}

export async function updateWorkspaceName(id: string, name: string) {
  try {
    const workspace = await prisma.workspace.update({
      where: { id },
      data: { name: name.trim() },
    });

    revalidatePath("/");
    return { success: true, data: workspace };
  } catch (error: any) {
    console.error("updateWorkspaceName error:", error);
    return { success: false, error: error.message };
  }
}

export async function createProject({
  workspaceId,
  name,
  description,
  bannerColor,
}: {
  workspaceId: string;
  name: string;
  description?: string;
  bannerColor?: string;
}) {
  try {
    const project = await prisma.project.create({
      data: {
        workspaceId,
        name: name.trim(),
        description: description?.trim() || null,
        bannerColor: bannerColor || "#2563EB",
      },
    });
    revalidatePath("/");
    return { success: true, data: project };
  } catch (error: any) {
    console.error("createProject error:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteProject(id: string) {
  try {
    await prisma.project.delete({ where: { id } });
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("deleteProject error:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteWorkspace(id: string) {
  try {
    await prisma.workspace.delete({ where: { id } });
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("deleteWorkspace error:", error);
    return { success: false, error: error.message };
  }
}

