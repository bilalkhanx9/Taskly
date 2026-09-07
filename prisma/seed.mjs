import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Taskly v2 with clean Production & Platform Admin...");

  // Clean existing tables
  await prisma.activityLog.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.taskComment.deleteMany({});
  await prisma.taskAttachment.deleteMany({});
  await prisma.subtask.deleteMany({});
  await prisma.taskLabel.deleteMany({});
  await prisma.label.deleteMany({});
  await prisma.task.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.workspaceMember.deleteMany({});
  await prisma.workspace.deleteMany({});
  await prisma.organisation.deleteMany({});
  await prisma.user.deleteMany({});

  // 1. Create Platform Admin (Bilal Rauf)
  const adminUser = await prisma.user.create({
    data: {
      id: "usr-admin-bilal",
      name: "Bilal Rauf",
      email: "bilalrauf.ds@gmail.com",
      password: "Admin@12345",
      role: "PLATFORM_ADMIN",
      companyDomain: "gmail.com",
      emailVerified: new Date(),
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
    },
  });

  // 2. Create Global Organisation
  const org = await prisma.organisation.create({
    data: {
      id: "org-taskly",
      name: "Taskly Global Inc.",
      domain: "taskly.io",
      slug: "taskly-global",
      verified: true,
    },
  });

  // 3. Create Default Workspace
  const ws = await prisma.workspace.create({
    data: {
      id: "ws-taskly-hq",
      name: "Taskly HQ",
      slug: "taskly-hq",
      description: "Primary headquarters and central workspace.",
      tier: "ENTERPRISE",
      organisationId: org.id,
      members: {
        create: {
          userId: adminUser.id,
          role: "PLATFORM_ADMIN",
        },
      },
    },
  });

  // 4. Create Initial Deliverable Project
  const project = await prisma.project.create({
    data: {
      id: "proj-core-platform",
      workspaceId: ws.id,
      name: "Core Platform 2.0",
      description: "Taskly multi-tenant workspace architecture and real-time board.",
      color: "#EA580C",
      deadline: "2026-10-15",
      status: "active",
      tasks: {
        create: [
          {
            id: "tsk-admin-1",
            title: "Taskly Platform Architecture Setup",
            description: "Production SQLite database connected with full role authorization.",
            status: "done",
            priority: "urgent",
            order: 0,
            dueDate: "2026-09-10",
            creatorId: adminUser.id,
            assigneeId: adminUser.id,
            subtasks: {
              create: [
                { title: "Database schema migration", completed: true, order: 0 },
                { title: "Platform Admin credentials configured", completed: true, order: 1 },
              ],
            },
          },
          {
            id: "tsk-admin-2",
            title: "Welcome to your new Taskly Workspace",
            description: "Press N to quickly create tasks or invite team members from the top bar.",
            status: "todo",
            priority: "medium",
            order: 1,
            dueDate: "2026-09-20",
            creatorId: adminUser.id,
            assigneeId: adminUser.id,
            subtasks: {
              create: [
                { title: "Explore Kanban columns", completed: false, order: 0 },
                { title: "Test 1-level checklist items", completed: false, order: 1 },
              ],
            },
          },
        ],
      },
    },
  });

  // 5. Activity Log
  await prisma.activityLog.create({
    data: {
      workspaceId: ws.id,
      userId: adminUser.id,
      action: "PLATFORM_INITIALIZED",
      details: "Platform initialized for Bilal Rauf (bilalrauf.ds@gmail.com)",
    },
  });

  console.log("Seeding complete! Platform Admin: bilalrauf.ds@gmail.com / Admin@12345");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
