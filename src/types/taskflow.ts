export type TaskStatus = "backlog" | "todo" | "in_progress" | "in_review" | "done";
export type TaskPriority = "low" | "medium" | "high" | "urgent";
export type UserRole = "owner" | "manager" | "member" | "viewer";
export type ProjectStatus = "planning" | "active" | "on_hold" | "completed" | "archived";

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  jobTitle?: string;
  timezone?: string;
  role?: UserRole;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  ownerId: string;
  membersCount: number;
  projectsCount: number;
}

export interface Project {
  id: string;
  workspaceId: string;
  name: string;
  description?: string;
  color: string;
  icon: string;
  status: ProjectStatus;
  startDate?: string;
  deadline?: string;
  progress: number;
  totalTasks: number;
  completedTasks: number;
  members: User[];
  isArchived?: boolean;
}

export interface Subtask {
  id: string;
  taskId: string;
  title: string;
  isCompleted: boolean;
}

export interface Label {
  id: string;
  name: string;
  color: string;
}

export interface Attachment {
  id: string;
  taskId: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number; // in bytes
  uploadedBy: User;
  createdAt: string;
}

export interface Comment {
  id: string;
  taskId: string;
  user: User;
  content: string;
  createdAt: string;
  isEdited?: boolean;
}

export interface ActivityLogItem {
  id: string;
  taskId?: string;
  taskTitle?: string;
  projectId?: string;
  projectName?: string;
  user: User;
  action: "created" | "updated" | "status_changed" | "assigned" | "commented" | "file_uploaded";
  details: string;
  createdAt: string;
}

export interface Task {
  id: string;
  projectId: string;
  parentTaskId?: string | null;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee?: User | null;
  watchers: User[];
  startDate?: string;
  dueDate?: string;
  completedAt?: string | null;
  estimatedHours?: number;
  actualHours?: number;
  position: number;
  labels: Label[];
  subtasks: Subtask[];
  attachments: Attachment[];
  comments: Comment[];
  isArchived?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  type: "assignment" | "mention" | "due_soon" | "overdue" | "status_change" | "project_invite";
  title: string;
  message: string;
  linkUrl?: string;
  isRead: boolean;
  relatedTaskId?: string;
  createdAt: string;
}
