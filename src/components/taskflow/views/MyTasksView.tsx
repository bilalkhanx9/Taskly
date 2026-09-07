"use client";

import React, { useState } from "react";
import { Task, Project, TaskStatus } from "@/types/taskflow";
import { CheckSquare, Calendar, AlertTriangle, Clock, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface MyTasksViewProps {
  tasks: Task[];
  projects: Project[];
  currentUserId: string;
  onTaskClick: (task: Task) => void;
  onToggleTaskComplete: (taskId: string) => void;
}

export function MyTasksView({
  tasks,
  projects,
  currentUserId,
  onTaskClick,
  onToggleTaskComplete,
}: MyTasksViewProps) {
  const [filter, setFilter] = useState<"today" | "upcoming" | "overdue" | "all">("today");

  const myTasks = tasks.filter((t) => t.assignee?.id === currentUserId);

  const filteredTasks = myTasks.filter((t) => {
    const isDone = t.status === "done";
    if (filter === "today") return t.dueDate === "2026-09-07" && !isDone;
    if (filter === "overdue") return t.dueDate && t.dueDate < "2026-09-07" && !isDone;
    if (filter === "upcoming") return t.dueDate && t.dueDate > "2026-09-07" && !isDone;
    return true;
  });

  const priorityStyles: Record<string, { bg: string; text: string }> = {
    urgent: { bg: "bg-[#C0342B]/10", text: "text-[#C0342B]" },
    high: { bg: "bg-[#D97706]/10", text: "text-[#D97706]" },
    medium: { bg: "bg-[#2E7CD6]/10", text: "text-[#2E7CD6]" },
    low: { bg: "bg-[#8B98A0]/10", text: "text-[#8B98A0]" },
  };

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-lg border border-[#E3E8E6] shadow-2xs">
        <div>
          <h2 className="text-base font-bold text-[#1F2A2E]">My Assigned Work</h2>
          <p className="text-xs text-[#6B7A80]">
            You have <strong className="text-[#0F766E]">{myTasks.filter((t) => t.status !== "done").length}</strong> active tasks across your projects.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          {(["today", "upcoming", "overdue", "all"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              className={cn(
                "px-3 py-1 text-xs font-semibold rounded-md capitalize transition-all",
                filter === tab
                  ? "bg-[#0F766E] text-white shadow-xs"
                  : "bg-[#EFF2F1] text-[#3D4A4F] hover:bg-[#E6F2F0]"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Task List Cards */}
      <div className="space-y-2">
        {filteredTasks.map((task) => {
          const project = projects.find((p) => p.id === task.projectId);
          const isDone = task.status === "done";
          const priority = priorityStyles[task.priority] || priorityStyles.medium;
          const completedSubtasks = task.subtasks.filter((s) => s.isCompleted).length;

          return (
            <div
              key={task.id}
              className={cn(
                "bg-white p-3.5 rounded-lg border border-[#E3E8E6] hover:border-[#CBD4D1] shadow-2xs flex items-center justify-between gap-4 transition-all",
                isDone && "bg-[#F6F8F7]/60 opacity-80"
              )}
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Complete checkbox */}
                <input
                  type="checkbox"
                  checked={isDone}
                  onChange={() => onToggleTaskComplete(task.id)}
                  className="h-4 w-4 rounded border-[#CBD4D1] text-[#0F766E] focus:ring-[#0F766E] cursor-pointer"
                />

                <div className="min-w-0 cursor-pointer" onClick={() => onTaskClick(task)}>
                  <h4
                    className={cn(
                      "text-xs font-bold text-[#1F2A2E] leading-snug truncate",
                      isDone && "line-through text-[#9AA7AC]"
                    )}
                  >
                    {task.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-[#6B7A80]">
                    {project && (
                      <span className="flex items-center gap-1 font-medium text-[#3D4A4F]">
                        <span
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ backgroundColor: project.color }}
                        />
                        {project.name}
                      </span>
                    )}
                    {task.subtasks.length > 0 && (
                      <>
                        <span>•</span>
                        <span>{completedSubtasks}/{task.subtasks.length} subtasks done</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span
                  className={cn(
                    "text-[10px] font-bold px-2 py-0.5 rounded uppercase",
                    priority.bg,
                    priority.text
                  )}
                >
                  {task.priority}
                </span>

                <span className="text-xs font-mono text-[#6B7A80] tabular-nums">
                  {task.dueDate}
                </span>
              </div>
            </div>
          );
        })}

        {filteredTasks.length === 0 && (
          <div className="bg-white p-12 rounded-lg border border-[#E3E8E6] text-center text-xs text-[#6B7A80]">
            No tasks found under &ldquo;{filter}&rdquo; filter. You&apos;re all caught up!
          </div>
        )}
      </div>
    </div>
  );
}
