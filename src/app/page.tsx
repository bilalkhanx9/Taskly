import { Board } from "@/components/kanban/Board";
import { BoardData } from "@/types/kanban";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sparkles,
  Database,
  Shield,
  Layers,
  FileUp,
  Cpu,
  Mail,
  CheckCircle2,
  Code2,
} from "lucide-react";
import Link from "next/link";

// Initial seed data for the interactive board
const initialKanbanBoard: BoardData = {
  id: "board-1",
  title: "🚀 Product Launch & Sprint Board",
  description: "Manage tasks, team assignments, and releases",
  workspaceId: "ws-1",
  columns: [
    {
      id: "col-backlog",
      boardId: "board-1",
      title: "Backlog",
      order: 0,
      colorDot: "#94A3B8",
      tasks: [
        {
          id: "task-1",
          columnId: "col-backlog",
          boardId: "board-1",
          title: "Setup Cloudflare R2 Bucket & Presigned URLs",
          description: "Configure direct client-to-R2 upload workflow with size limit validation via Zod.",
          priority: "HIGH",
          dueDate: new Date(Date.now() + 86400000 * 3).toISOString(),
          order: 0,
          assignee: {
            id: "user-1",
            name: "Bilal Khan",
            email: "bilal@example.com",
            image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
          },
          attachments: [
            {
              id: "att-1",
              name: "r2-architecture-spec.pdf",
              url: "#",
              fileKey: "tasks/spec.pdf",
              size: 142000,
              type: "application/pdf",
            },
          ],
          comments: [
            {
              id: "com-1",
              content: "S3 Client configured with region 'auto'.",
              createdAt: new Date(Date.now() - 3600000),
              user: { id: "user-1", name: "Bilal", image: null },
            },
          ],
        },
        {
          id: "task-2",
          columnId: "col-backlog",
          boardId: "board-1",
          title: "Configure Weekly Workspace Digest Cron",
          description: "Use Inngest step functions to aggregate active tasks every Monday at 9am.",
          priority: "MEDIUM",
          dueDate: new Date(Date.now() + 86400000 * 7).toISOString(),
          order: 1,
          assignee: {
            id: "user-2",
            name: "Sara Ali",
            email: "sara@example.com",
            image: null,
          },
          attachments: [],
          comments: [],
        },
      ],
    },
    {
      id: "col-todo",
      boardId: "board-1",
      title: "To Do",
      order: 1,
      colorDot: "#3B82F6",
      tasks: [
        {
          id: "task-3",
          columnId: "col-todo",
          boardId: "board-1",
          title: "Integrate NextAuth (Auth.js) with Prisma Adapter",
          description: "Enable JWT session strategy, credentials fallback, and Google/GitHub OAuth.",
          priority: "URGENT",
          dueDate: new Date(Date.now() + 86400000 * 1).toISOString(),
          order: 0,
          assignee: {
            id: "user-1",
            name: "Bilal Khan",
            email: "bilal@example.com",
            image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
          },
          attachments: [],
          comments: [],
        },
      ],
    },
    {
      id: "col-in-progress",
      boardId: "board-1",
      title: "In Progress",
      order: 2,
      colorDot: "#F59E0B",
      tasks: [
        {
          id: "task-4",
          columnId: "col-in-progress",
          boardId: "board-1",
          title: "Build dnd-kit Drag and Drop Kanban Canvas",
          description: "Implement SortableContext with vertical list sorting strategy and optimistic Server Actions.",
          priority: "HIGH",
          dueDate: new Date(Date.now() + 86400000 * 2).toISOString(),
          order: 0,
          assignee: {
            id: "user-1",
            name: "Bilal Khan",
            email: "bilal@example.com",
            image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
          },
          attachments: [],
          comments: [
            {
              id: "com-2",
              content: "PointerSensors adjusted with 5px distance constraint.",
              createdAt: new Date(),
              user: { id: "user-1", name: "Bilal", image: null },
            },
          ],
        },
      ],
    },
    {
      id: "col-done",
      boardId: "board-1",
      title: "Done",
      order: 3,
      colorDot: "#10B981",
      tasks: [
        {
          id: "task-5",
          columnId: "col-done",
          boardId: "board-1",
          title: "Initialize Next.js 16 + Tailwind CSS v4 + shadcn/ui",
          description: "Created project scaffolding, theme tokens, and Base UI components.",
          priority: "LOW",
          dueDate: new Date(Date.now() - 86400000).toISOString(),
          order: 0,
          assignee: {
            id: "user-1",
            name: "Bilal Khan",
            email: "bilal@example.com",
            image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
          },
          attachments: [],
          comments: [],
        },
      ],
    },
  ],
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/20">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/85 backdrop-blur-md">
        <div className="max-w-[1600px] mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-md">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="font-bold text-xl tracking-tight">
              Kanban<span className="text-primary font-black">Pro</span>
            </span>
            <Badge variant="secondary" className="ml-2 font-mono text-xs">
              Full-Stack Architecture
            </Badge>
          </div>

          {/* Technology Badges */}
          <div className="hidden lg:flex items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-muted text-muted-foreground font-medium">
              <Database className="h-3 w-3 text-emerald-500" /> PostgreSQL + Prisma
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-muted text-muted-foreground font-medium">
              <Shield className="h-3 w-3 text-blue-500" /> Auth.js
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-muted text-muted-foreground font-medium">
              <Cpu className="h-3 w-3 text-purple-500" /> Inngest
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-muted text-muted-foreground font-medium">
              <Mail className="h-3 w-3 text-amber-500" /> Resend
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-muted text-muted-foreground font-medium">
              <FileUp className="h-3 w-3 text-orange-500" /> Cloudflare R2
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="https://github.com/bilalkhanx9/LMS"
              target="_blank"
              rel="noreferrer"
              className={buttonVariants({ size: "sm", className: "gap-2 shadow-xs" })}
            >
              <Code2 className="h-4 w-4" /> GitHub
            </Link>
          </div>
        </div>
      </header>

      {/* Main Board Container */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-6 py-6 flex flex-col">
        <Board initialBoard={initialKanbanBoard} />
      </main>
    </div>
  );
}
