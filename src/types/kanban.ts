export type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface Assignee {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  fileKey: string;
  size: number;
  type: string;
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string | Date;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

export interface TaskItem {
  id: string;
  columnId: string;
  boardId: string;
  title: string;
  description?: string | null;
  priority: Priority;
  dueDate?: string | Date | null;
  order: number;
  assignee?: Assignee | null;
  attachments?: Attachment[];
  comments?: Comment[];
}

export interface ColumnItem {
  id: string;
  boardId: string;
  title: string;
  order: number;
  colorDot?: string | null;
  tasks: TaskItem[];
}

export interface BoardData {
  id: string;
  title: string;
  description?: string | null;
  workspaceId: string;
  columns: ColumnItem[];
}
