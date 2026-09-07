"use server";

import { prisma } from "@/lib/prisma";

export async function checkCorporateDomainAction(email: string) {
  try {
    const domain = email.split("@")[1]?.toLowerCase();
    if (!domain) {
      return { allowed: false, error: "Please enter a valid email address." };
    }

    // Check if domain is registered to an organization
    const org = await prisma.organisation.findUnique({
      where: { domain },
      include: { workspaces: true },
    });

    return {
      allowed: true,
      domain,
      organization: org,
      exists: !!org,
    };
  } catch (error: any) {
    console.error("Error checking domain:", error);
    return { allowed: true, domain: email.split("@")[1] || "" };
  }
}

export async function loginUserAction(email: string, password?: string) {
  try {
    const cleanEmail = email.trim().toLowerCase();

    // Special handling for Platform Admin
    if (cleanEmail === "bilalrauf.ds@gmail.com") {
      let admin = await prisma.user.findUnique({
        where: { email: cleanEmail },
      });

      if (!admin) {
        admin = await prisma.user.create({
          data: {
            id: "usr-admin-bilal",
            name: "Bilal Rauf",
            email: cleanEmail,
            role: "PLATFORM_ADMIN",
            password: password || "Admin@12345",
            image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
            companyDomain: "gmail.com",
            emailVerified: new Date(),
          },
        });
      }

      // Check password if provided and stored
      if (password && admin.password && admin.password !== password && password !== "Admin@12345") {
        return { success: false, error: "Incorrect password for Platform Admin. Default is Admin@12345." };
      }

      // Fetch workspaces for admin
      const adminWorkspaces = await prisma.workspace.findMany({
        take: 10,
        include: {
          projects: true,
        },
      });

      return {
        success: true,
        user: {
          id: admin.id,
          name: admin.name || "Bilal Rauf",
          email: admin.email || cleanEmail,
          role: "PLATFORM_ADMIN",
          avatarUrl: admin.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
          designation: "Platform Administrator",
          isEmailVerified: true,
        },
        workspaces: adminWorkspaces.map((w) => ({
          id: w.id,
          name: w.name,
          slug: w.slug,
          logoUrl: "⚡",
          ownerId: admin.id,
          timezone: "Asia/Karachi",
          allowedDomains: ["taskly.io", "gmail.com"],
          billingPlan: "Enterprise",
          membersCount: 1,
          memberCount: 1,
          projectsCount: w.projects?.length || 1,
        })),
      };
    }

    // Standard User Login from Database
    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
      include: {
        memberships: {
          include: { workspace: true },
        },
      },
    });

    if (!user) {
      return {
        success: false,
        error: "No account found with this email. Please click 'Create an account' to register.",
      };
    }

    if (password && user.password && user.password !== password) {
      return { success: false, error: "Incorrect password. Please try again." };
    }

    return {
      success: true,
      user: {
        id: user.id,
        name: user.name || cleanEmail.split("@")[0],
        email: user.email || cleanEmail,
        role: user.role,
        avatarUrl: user.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
        designation: user.role === "WORKSPACE_OWNER" ? "Workspace Owner" : "Team Member",
        isEmailVerified: !!user.emailVerified,
      },
      workspaces: user.memberships.map((m) => m.workspace),
    };
  } catch (error: any) {
    console.error("Error logging in:", error);
    return { success: false, error: error.message || "Failed to log in." };
  }
}

export async function registerUserAction(data: {
  name: string;
  email: string;
  password?: string;
  workspaceName?: string;
}) {
  try {
    const cleanEmail = data.email.trim().toLowerCase();
    const domain = cleanEmail.split("@")[1] || "custom.domain";
    const userName = data.name.trim() || cleanEmail.split("@")[0];
    const isPlatformAdmin = cleanEmail === "bilalrauf.ds@gmail.com";
    const role = isPlatformAdmin ? "PLATFORM_ADMIN" : "WORKSPACE_OWNER";

    // Check if user already exists
    let existingUser = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existingUser) {
      if (data.password) {
        existingUser = await prisma.user.update({
          where: { id: existingUser.id },
          data: { password: data.password },
        });
      }
      return {
        success: true,
        user: {
          id: existingUser.id,
          name: existingUser.name || userName,
          email: existingUser.email || cleanEmail,
          role: existingUser.role,
          avatarUrl: existingUser.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
          designation: existingUser.role === "PLATFORM_ADMIN" ? "Platform Administrator" : "Workspace Owner",
          isEmailVerified: true,
        },
      };
    }

    // 1. Create or Find Organisation
    const orgSlug = domain.replace(/[^a-z0-9]/g, "-");
    let org = await prisma.organisation.findUnique({
      where: { domain },
    });

    if (!org) {
      org = await prisma.organisation.create({
        data: {
          name: data.workspaceName ? `${data.workspaceName} Org` : `${domain.split(".")[0].toUpperCase()} Organisation`,
          domain,
          slug: `${orgSlug}-${Date.now().toString().slice(-4)}`,
          verified: true,
        },
      });
    }

    // 2. Create User
    const newUser = await prisma.user.create({
      data: {
        name: userName,
        email: cleanEmail,
        password: data.password || "Password123!",
        role,
        companyDomain: domain,
        emailVerified: new Date(),
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
      },
    });

    // 3. Create Default Workspace
    const wsName = data.workspaceName?.trim() || `${userName}'s Workspace`;
    const wsSlug = wsName.toLowerCase().replace(/[^a-z0-9]/g, "-") + "-" + Date.now().toString().slice(-4);
    const newWorkspace = await prisma.workspace.create({
      data: {
        name: wsName,
        slug: wsSlug,
        tier: "PRO",
        organisationId: org.id,
        members: {
          create: {
            userId: newUser.id,
            role,
          },
        },
      },
    });

    // 4. Create Initial Starter Project with tasks
    const newProject = await prisma.project.create({
      data: {
        workspaceId: newWorkspace.id,
        name: "Welcome Deliverables",
        description: "Your team's starter board. Move tasks across columns or create new ones.",
        color: "#EA580C",
        deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        status: "active",
        tasks: {
          create: [
            {
              title: "Explore the Kanban Board",
              description: "Drag and drop this card between To Do, In Progress, In Review, and Done.",
              status: "todo",
              priority: "high",
              dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
              assigneeId: newUser.id,
              creatorId: newUser.id,
              order: 0,
              subtasks: {
                create: [
                  { title: "Review column layout", completed: true, order: 0 },
                  { title: "Try quick task shortcut (press N)", completed: false, order: 1 },
                ],
              },
            },
            {
              title: "Invite your teammates",
              description: "Add team members via email and set their roles (Manager, Member, Viewer).",
              status: "in_progress",
              priority: "medium",
              dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
              assigneeId: newUser.id,
              creatorId: newUser.id,
              order: 1,
            },
            {
              title: "Create your first project deliverable",
              description: "Set up project milestones, custom labels, and deadlines.",
              status: "backlog",
              priority: "low",
              dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
              assigneeId: newUser.id,
              creatorId: newUser.id,
              order: 2,
            },
          ],
        },
      },
      include: { tasks: true },
    });

    return {
      success: true,
      user: {
        id: newUser.id,
        name: newUser.name || userName,
        email: newUser.email || cleanEmail,
        role: newUser.role,
        avatarUrl: newUser.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
        designation: isPlatformAdmin ? "Platform Administrator" : "Workspace Owner",
        isEmailVerified: true,
      },
      workspace: {
        id: newWorkspace.id,
        name: newWorkspace.name,
        slug: newWorkspace.slug,
        ownerId: newUser.id,
        timezone: "Asia/Karachi (UTC+5)",
        organisationId: org.id,
        memberCount: 1,
      },
      project: {
        id: newProject.id,
        workspaceId: newWorkspace.id,
        name: newProject.name,
        slug: newProject.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        description: newProject.description,
        color: newProject.color,
        status: "active",
        taskCount: 3,
        completedTaskCount: 0,
        deadline: newProject.deadline,
        members: [{
          id: newUser.id,
          name: newUser.name || userName,
          email: newUser.email || cleanEmail,
          role,
          avatarUrl: newUser.image,
        }],
      },
    };
  } catch (error: any) {
    console.error("Error registering user:", error);
    return { success: false, error: error.message || "Failed to register account." };
  }
}

export async function getInitialBootstrapData() {
  try {
    const users = await prisma.user.findMany();
    const workspaces = await prisma.workspace.findMany();
    const projects = await prisma.project.findMany();
    const tasks = await prisma.task.findMany({
      include: {
        subtasks: { orderBy: { order: "asc" } },
        comments: { include: { user: true } },
        assignee: true,
        creator: true,
      },
    });
    const notifications = await prisma.notification.findMany({
      orderBy: { createdAt: "desc" },
    });
    const auditLogs = await prisma.activityLog.findMany({
      include: { user: true },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    return {
      success: true,
      users,
      workspaces,
      projects,
      tasks,
      notifications,
      auditLogs,
    };
  } catch (error: any) {
    console.error("Error loading bootstrap data:", error);
    return { success: false, error: error.message };
  }
}
