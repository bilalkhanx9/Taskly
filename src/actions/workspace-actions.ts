"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { sendTaskAssignmentEmail } from "@/lib/mail";

export async function getWorkspacesAction() {
  try {
    const workspaces = await prisma.workspace.findMany({
      include: {
        members: {
          include: {
            user: true,
          },
        },
      },
    });
    return { success: true, workspaces };
  } catch (error: any) {
    console.error("Error fetching workspaces:", error);
    return { success: false, error: error.message, workspaces: [] };
  }
}

export async function createWorkspaceAction(data: {
  name: string;
  slug: string;
  description?: string;
  ownerId: string;
}) {
  try {
    const existing = await prisma.workspace.findUnique({
      where: { slug: data.slug },
    });

    if (existing) {
      return { success: false, error: "Workspace URL slug already exists. Please pick another." };
    }

    const workspace = await prisma.workspace.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description || "",
        tier: "STARTER",
        members: {
          create: {
            userId: data.ownerId,
            role: "WORKSPACE_OWNER",
          },
        },
      },
    });

    revalidatePath("/");
    return { success: true, workspace };
  } catch (error: any) {
    console.error("Error creating workspace:", error);
    return { success: false, error: error.message };
  }
}

export async function updateWorkspaceSettingsAction(
  workspaceId: string,
  data: {
    name?: string;
    description?: string;
  }
) {
  try {
    const workspace = await prisma.workspace.update({
      where: { id: workspaceId },
      data,
    });
    revalidatePath("/");
    return { success: true, workspace };
  } catch (error: any) {
    console.error("Error updating workspace settings:", error);
    return { success: false, error: error.message };
  }
}

export async function inviteWorkspaceMemberAction(
  workspaceId: string,
  email: string,
  role: string = "MEMBER",
  inviterName: string = "Workspace Owner"
) {
  try {
    // Find or create user placeholder
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name: email.split("@")[0],
          role,
          image: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80`,
        },
      });
    }

    // Connect to workspace
    const existingMember = await prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId,
          userId: user.id,
        },
      },
    });

    if (!existingMember) {
      await prisma.workspaceMember.create({
        data: {
          workspaceId,
          userId: user.id,
          role,
        },
      });
    }

    // Create Notification
    await prisma.notification.create({
      data: {
        userId: user.id,
        title: "Workspace Invitation",
        message: `${inviterName} invited you to join this workspace as a ${role.replace("_", " ")}`,
        type: "assignment",
      },
    });

    revalidatePath("/");
    return { success: true, member: user };
  } catch (error: any) {
    console.error("Error inviting workspace member:", error);
    return { success: false, error: error.message };
  }
}
