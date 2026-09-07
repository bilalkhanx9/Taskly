export type UserRole =
  | "PLATFORM_ADMIN"
  | "WORKSPACE_OWNER"
  | "MANAGER"
  | "MEMBER"
  | "VIEWER";

export type TaskStatus =
  | "backlog"
  | "todo"
  | "in_progress"
  | "in_review"
  | "done"
  | "blocked";

export type TaskPriority = "low" | "medium" | "high" | "urgent";

export type ProjectStatus = "planning" | "active" | "on_hold" | "completed" | "cancelled";

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: UserRole;
  jobTitle?: string;
  designation?: string;
  timezone?: string;
  isVerified?: boolean;
  isEmailVerified?: boolean;
  organisationId?: string;
  assignedTasksCount?: number;
  activeProjectsCount?: number;
}

export interface WorkspaceMember {
  userId: string;
  user: User;
  role: UserRole;
  joinedAt: string;
}

export interface Label {
  id: string;
  name: string;
  color: string;
}

export interface Subtask {
  id: string;
  taskId?: string;
  title: string;
  isCompleted?: boolean;
  completed?: boolean;
}

export interface Attachment {
  id: string;
  taskId?: string;
  name?: string;
  fileName?: string;
  size?: string;
  fileSize?: number;
  fileType?: string;
  url?: string;
  uploadedBy?: User;
  uploadedAt?: string;
}

export interface Comment {
  id: string;
  taskId: string;
  user: User;
  content?: string;
  body?: string;
  mentions?: string[];
  createdAt: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee?: User | null;
  startDate?: string;
  dueDate: string;
  completedAt?: string | null;
  position: number;
  labels: (string | Label)[];
  subtasks: Subtask[];
  attachments?: Attachment[];
  comments?: Comment[];
  dependencies?: string[];
  watchers?: User[];
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  workspaceId: string;
  name: string;
  slug?: string;
  description: string;
  color: string;
  status: ProjectStatus;
  deadline?: string;
  progress?: number;
  totalTasks?: number;
  completedTasks?: number;
  taskCount?: number;
  completedTaskCount?: number;
  members: User[];
  createdAt?: string;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  ownerId: string;
  timezone: string;
  organisationId?: string;
  allowedDomains?: string[];
  billingPlan?: "Free" | "Pro" | "Enterprise";
  membersCount?: number;
  memberCount?: number;
  projectsCount?: number;
  createdAt?: string;
}

export interface Organisation {
  id: string;
  domain: string;
  name: string;
  workspacesCount?: number;
  workspaceCount?: number;
  usersCount?: number;
  userCount?: number;
  plan?: string;
  status?: string;
  createdAt: string;
}

export interface AuditLogItem {
  id: string;
  actor?: User;
  actorId?: string;
  actorName?: string;
  action: string;
  target?: string;
  targetType?: string;
  targetId?: string;
  targetName?: string;
  timestamp: string;
  ipAddress?: string;
}
export type AuditLog = AuditLogItem;

export interface NotificationItem {
  id: string;
  userId?: string;
  actorName?: string;
  type: "task_assigned" | "mention" | "comment_mention" | "deadline_approaching" | "task_completed" | "system";
  title: string;
  message?: string;
  body?: string;
  linkUrl?: string;
  isRead?: boolean;
  read?: boolean;
  targetTaskId?: string;
  relatedTaskId?: string;
  timestamp?: string;
  createdAt: string;
}
export type Notification = NotificationItem;
