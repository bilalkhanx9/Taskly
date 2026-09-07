import {
  User,
  Workspace,
  Project,
  Task,
  NotificationItem,
  AuditLogItem,
  Organisation,
  Label,
} from "@/types/taskflow-v2";

export const initialLabels: Label[] = [
  { id: "lbl-1", name: "Frontend", color: "#1D4ED8" },
  { id: "lbl-2", name: "UI/UX", color: "#C2410C" },
  { id: "lbl-3", name: "Backend", color: "#6D28D9" },
  { id: "lbl-4", name: "Bug", color: "#B91C1C" },
  { id: "lbl-5", name: "Urgent", color: "#B45309" },
];

export const adminUser: User = {
  id: "usr-admin-bilal",
  name: "Bilal Rauf",
  email: "bilalrauf.ds@gmail.com",
  role: "PLATFORM_ADMIN",
  jobTitle: "Platform Administrator",
  timezone: "Asia/Karachi (UTC+5)",
  isVerified: true,
  isEmailVerified: true,
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
  assignedTasksCount: 2,
  activeProjectsCount: 1,
};

export const allUsers: User[] = [adminUser];

export const initialWorkspaces: Workspace[] = [
  {
    id: "ws-taskly-hq",
    name: "Taskly HQ",
    slug: "taskly-hq",
    logoUrl: "⚡",
    ownerId: "usr-admin-bilal",
    timezone: "Asia/Karachi",
    allowedDomains: ["taskly.io", "gmail.com"],
    billingPlan: "Enterprise",
    membersCount: 1,
    memberCount: 1,
    projectsCount: 1,
  },
];

export const initialProjects: Project[] = [
  {
    id: "proj-core-platform",
    workspaceId: "ws-taskly-hq",
    name: "Core Platform 2.0",
    slug: "core-platform-2",
    description: "Taskly multi-tenant workspace architecture and real-time board.",
    color: "#EA580C",
    status: "active",
    deadline: "2026-10-15",
    progress: 50,
    totalTasks: 2,
    completedTasks: 1,
    taskCount: 2,
    completedTaskCount: 1,
    members: [adminUser],
    createdAt: "2026-09-01",
  },
];export const initialTasks: Task[] = [
  {
    id: "tsk-admin-1",
    projectId: "proj-core-platform",
    title: "Taskly Platform Architecture Setup",
    description: "Production SQLite database connected with full role authorization.",
    status: "done",
    priority: "urgent",
    assignee: adminUser,
    startDate: "2026-09-04",
    dueDate: "2026-09-10",
    completedAt: "2026-09-08T00:00:00Z",
    position: 1,
    labels: [initialLabels[0], initialLabels[2]],
    subtasks: [
      { id: "st-1", taskId: "tsk-admin-1", title: "Database schema migration", isCompleted: true, completed: true },
      { id: "st-2", taskId: "tsk-admin-1", title: "Platform Admin credentials configured", isCompleted: true, completed: true },
    ],
    attachments: [],
    comments: [],
    createdAt: "2026-09-04T09:00:00Z",
    updatedAt: "2026-09-08T00:00:00Z",
  },
  {
    id: "tsk-admin-2",
    projectId: "proj-core-platform",
    title: "Welcome to your new Taskly Workspace",
    description: "Press N to quickly create tasks or invite team members from the top bar.",
    status: "todo",
    priority: "medium",
    assignee: adminUser,
    startDate: "2026-09-08",
    dueDate: "2026-09-20",
    completedAt: null,
    position: 2,
    labels: [initialLabels[1]],
    subtasks: [
      { id: "st-3", taskId: "tsk-admin-2", title: "Explore Kanban columns", isCompleted: false, completed: false },
      { id: "st-4", taskId: "tsk-admin-2", title: "Test 1-level checklist items", isCompleted: false, completed: false },
    ],
    attachments: [],
    comments: [],
    createdAt: "2026-09-08T00:00:00Z",
    updatedAt: "2026-09-08T00:00:00Z",
  },
];

export const initialOrganisations: Organisation[] = [
  {
    id: "org-taskly",
    domain: "taskly.io",
    name: "Taskly Global Inc.",
    workspacesCount: 1,
    usersCount: 1,
    createdAt: "2026-01-15",
  },
];

export const initialAuditLogs: AuditLogItem[] = [
  {
    id: "aud-1",
    actor: adminUser,
    action: "platform.initialize",
    target: "Platform initialized for Bilal Rauf (bilalrauf.ds@gmail.com)",
    timestamp: "Just now",
    ipAddress: "127.0.0.1",
  },
];

export const initialNotifications: NotificationItem[] = [
  {
    id: "notif-1",
    userId: "usr-admin-bilal",
    type: "task_assigned",
    title: "Welcome to Taskly",
    message: "Your platform admin account is active with bilalrauf.ds@gmail.com.",
    linkUrl: "/admin",
    isRead: false,
    createdAt: new Date().toISOString(),
  },
];
;

export const mockUsers = allUsers;
export const mockWorkspaces = initialWorkspaces;
export const mockProjects = initialProjects.map(p => ({
  ...p,
  taskCount: p.taskCount ?? p.totalTasks ?? 0,
  completedTaskCount: p.completedTaskCount ?? p.completedTasks ?? 0
}));
export const mockTasks = initialTasks.map(t => ({
  ...t,
  dueDate: t.dueDate || "2026-09-15"
}));
export const mockAuditLogs = initialAuditLogs.map(a => ({
  ...a,
  actorName: a.actor?.name || "System Admin",
  actorId: a.actor?.id || "usr-admin",
  targetName: a.target || "Workspace"
}));
export const mockNotifications = initialNotifications.map(n => ({
  ...n,
  actorName: "System",
  read: n.isRead,
  timestamp: n.createdAt,
  body: n.message
}));
