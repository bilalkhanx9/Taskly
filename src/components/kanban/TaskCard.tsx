"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TaskItem, Priority } from "@/types/kanban";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Paperclip, MessageSquare, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: TaskItem;
  onClick?: () => void;
  isOverlay?: boolean;
}

const priorityConfig: Record<
  Priority,
  { label: string; className: string; border: string }
> = {
  LOW: {
    label: "Low",
    className: "bg-slate-100 text-slate-700 dark:bg-slate-800/80 dark:text-slate-300",
    border: "border-l-slate-400",
  },
  MEDIUM: {
    label: "Medium",
    className: "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300",
    border: "border-l-blue-500",
  },
  HIGH: {
    label: "High",
    className: "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300",
    border: "border-l-amber-500",
  },
  URGENT: {
    label: "Urgent",
    className: "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300",
    border: "border-l-rose-500",
  },
};

export function TaskCard({ task, onClick, isOverlay = false }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  const priority = priorityConfig[task.priority] || priorityConfig.MEDIUM;

  const formattedDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative rounded-xl border border-border/70 bg-card p-3.5 shadow-sm transition-all duration-150 select-none border-l-4",
        priority.border,
        isDragging && "opacity-40 ring-2 ring-primary/40 shadow-md",
        isOverlay && "rotate-2 shadow-2xl scale-105 ring-2 ring-primary cursor-grabbing opacity-95",
        !isDragging && !isOverlay && "hover:border-border hover:shadow-md hover:-translate-y-0.5"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge
            variant="outline"
            className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-md border-0", priority.className)}
          >
            {priority.label}
          </Badge>
        </div>

        <button
          {...attributes}
          {...listeners}
          type="button"
          aria-label="Drag task"
          className="text-muted-foreground/40 hover:text-foreground cursor-grab active:cursor-grabbing p-0.5 rounded hover:bg-muted transition-colors opacity-0 group-hover:opacity-100"
        >
          <GripVertical className="h-4 w-4" />
        </button>
      </div>

      {/* Task Title & Click Area */}
      <div
        onClick={onClick}
        className="mt-2.5 cursor-pointer"
      >
        <h4 className="text-sm font-semibold tracking-tight text-card-foreground line-clamp-2 leading-snug">
          {task.title}
        </h4>

        {task.description && (
          <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {task.description}
          </p>
        )}
      </div>

      {/* Task Meta: Due Date, Attachments, Comments, Assignee */}
      <div className="mt-3.5 flex items-center justify-between border-t border-border/40 pt-2.5 text-xs text-muted-foreground">
        <div className="flex items-center gap-3">
          {formattedDate && (
            <span className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-foreground">
              <Calendar className="h-3.5 w-3.5" />
              {formattedDate}
            </span>
          )}

          {task.attachments && task.attachments.length > 0 && (
            <span className="flex items-center gap-1 text-[11px]">
              <Paperclip className="h-3.5 w-3.5" />
              {task.attachments.length}
            </span>
          )}

          {task.comments && task.comments.length > 0 && (
            <span className="flex items-center gap-1 text-[11px]">
              <MessageSquare className="h-3.5 w-3.5" />
              {task.comments.length}
            </span>
          )}
        </div>

        {task.assignee && (
          <Avatar className="h-6 w-6 border border-background shadow-xs">
            <AvatarImage src={task.assignee.image || ""} alt={task.assignee.name || "Assignee"} />
            <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-bold">
              {task.assignee.name ? task.assignee.name.charAt(0).toUpperCase() : "U"}
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    </div>
  );
}
