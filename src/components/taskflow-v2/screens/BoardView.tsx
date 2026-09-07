"use client";

import React, { useState } from "react";
import { Task, TaskStatus, User, Project } from "@/types/taskflow-v2";
import { 
  Plus, 
  CheckSquare, 
  Paperclip, 
  MessageSquare, 
  Clock, 
  ChevronRight, 
  ChevronLeft,
  Filter,
  MoreVertical,
  CheckCircle2,
  AlertOctagon
} from "lucide-react";

interface BoardViewProps {
  currentUser: User;
  project: Project;
  tasks: Task[];
  onOpenTask: (taskId: string) => void;
  onUpdateTaskStatus: (taskId: string, newStatus: TaskStatus) => void;
  onQuickAddTask: (status: TaskStatus) => void;
}

const COLUMNS: { status: TaskStatus; label: string; dotColor: string }[] = [
  { status: "backlog", label: "Backlog", dotColor: "#78716C" },
  { status: "todo", label: "To Do", dotColor: "#475569" },
  { status: "in_progress", label: "In Progress", dotColor: "#1D4ED8" },
  { status: "in_review", label: "In Review", dotColor: "#6D28D9" },
  { status: "done", label: "Done", dotColor: "#15803D" },
];

export const BoardView: React.FC<BoardViewProps> = ({
  currentUser,
  project,
  tasks,
  onOpenTask,
  onUpdateTaskStatus,
  onQuickAddTask
}) => {
  const [filterAssignee, setFilterAssignee] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");

  const filteredTasks = tasks.filter((t) => {
    const matchProject = t.projectId === project.id;
    const matchAssignee = filterAssignee === "all" || t.assignee?.id === filterAssignee;
    const matchPriority = filterPriority === "all" || t.priority === filterPriority;
    return matchProject && matchAssignee && matchPriority;
  });

  const getPriorityBadge = (priority: Task["priority"]) => {
    switch (priority) {
      case "urgent":
        return <span className="text-[10px] font-semibold text-red-700 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded">Urgent</span>;
      case "high":
        return <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">High</span>;
      case "medium":
        return <span className="text-[10px] font-semibold text-cyan-700 bg-cyan-50 border border-cyan-200 px-1.5 py-0.5 rounded">Medium</span>;
      case "low":
      default:
        return <span className="text-[10px] font-medium text-stone-600 bg-stone-100 border border-stone-200 px-1.5 py-0.5 rounded">Low</span>;
    }
  };

  const moveTask = (task: Task, direction: "prev" | "next") => {
    const colOrder: TaskStatus[] = ["backlog", "todo", "in_progress", "in_review", "done"];
    const currentIndex = colOrder.indexOf(task.status);
    if (direction === "next" && currentIndex < colOrder.length - 1) {
      onUpdateTaskStatus(task.id, colOrder[currentIndex + 1]);
    } else if (direction === "prev" && currentIndex > 0) {
      onUpdateTaskStatus(task.id, colOrder[currentIndex - 1]);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Board Filter Bar */}
      <div className="flex items-center justify-between gap-3 px-1 py-1">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-[var(--ink-muted)]">
            <Filter className="w-3.5 h-3.5" />
            <span className="font-semibold uppercase tracking-wider text-[10px]">Filter:</span>
          </div>

          <select
            value={filterAssignee}
            onChange={(e) => setFilterAssignee(e.target.value)}
            className="px-2.5 py-1 text-xs bg-[var(--surface)] border border-[var(--line-strong)] rounded-md text-[var(--ink)] focus:outline-none focus:border-[var(--accent-600)]"
          >
            <option value="all">All Assignees</option>
            {project.members.map((m) => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-2.5 py-1 text-xs bg-[var(--surface)] border border-[var(--line-strong)] rounded-md text-[var(--ink)] focus:outline-none focus:border-[var(--accent-600)]"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        <div className="text-xs text-[var(--ink-muted)] font-medium">
          Showing <span className="font-bold text-[var(--ink)]">{filteredTasks.length}</span> project tasks
        </div>
      </div>

      {/* 5-Column Kanban Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto pb-4 items-start">
        {COLUMNS.map((col) => {
          const colTasks = filteredTasks.filter((t) => t.status === col.status);

          return (
            <div
              key={col.status}
              className="bg-[var(--surface-sunken)] rounded-xl border border-[var(--line)] flex flex-col min-w-[240px] max-h-[calc(100vh-230px)] shadow-2xs"
            >
              {/* Column Header */}
              <div className="p-3 border-b border-[var(--line)] flex items-center justify-between bg-[var(--surface)] rounded-t-xl">
                <div className="flex items-center gap-2">
                  <span 
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: col.dotColor }}
                  />
                  <span className="text-xs font-bold text-[var(--ink)] uppercase tracking-wider">
                    {col.label}
                  </span>
                  <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-[var(--surface-sunken)] border border-[var(--line)] rounded-full text-[var(--ink-muted)]">
                    {colTasks.length}
                  </span>
                </div>

                {currentUser.role !== "VIEWER" && (
                  <button
                    onClick={() => onQuickAddTask(col.status)}
                    className="w-6 h-6 rounded flex items-center justify-center text-[var(--ink-muted)] hover:text-[var(--ink)] hover:bg-[var(--surface-sunken)] transition-colors"
                    title={`Add task to ${col.label}`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Tasks List */}
              <div className="p-2 space-y-2.5 overflow-y-auto flex-1">
                {colTasks.length === 0 ? (
                  <div className="py-8 text-center text-xs text-[var(--ink-faint)] border border-dashed border-[var(--line-strong)] rounded-lg m-1">
                    No tasks
                  </div>
                ) : (
                  colTasks.map((t) => {
                    const completedSubs = t.subtasks?.filter((s) => s.completed).length || 0;
                    const totalSubs = t.subtasks?.length || 0;

                    return (
                      <div
                        key={t.id}
                        onClick={() => onOpenTask(t.id)}
                        className="bg-[var(--surface)] p-3.5 rounded-lg border border-[var(--line)] hover:border-[var(--accent-600)] hover:shadow-xs transition-all cursor-pointer group"
                      >
                        {/* Tags & Priority */}
                        <div className="flex items-center justify-between gap-1.5 mb-2">
                          <div className="flex flex-wrap gap-1">
                            {t.labels.slice(0, 2).map((lbl, idx) => {
                              const labelName = typeof lbl === "string" ? lbl : lbl.name;
                              const labelKey = typeof lbl === "string" ? `${lbl}-${idx}` : lbl.id;
                              return (
                                <span
                                  key={labelKey}
                                  className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--surface-sunken)] text-[var(--ink-body)] border border-[var(--line)] font-medium"
                                >
                                  {labelName}
                                </span>
                              );
                            })}
                          </div>
                          {getPriorityBadge(t.priority)}
                        </div>

                        {/* Title */}
                        <h4 className="text-xs font-semibold text-[var(--ink)] leading-snug group-hover:text-[var(--accent-700)] transition-colors mb-2.5">
                          {t.title}
                        </h4>

                        {/* Metadata Footer */}
                        <div className="flex items-center justify-between pt-2 border-t border-[var(--line)] text-[11px] text-[var(--ink-muted)]">
                          <div className="flex items-center gap-2">
                            {totalSubs > 0 && (
                              <span className="flex items-center gap-1 text-[10px]">
                                <CheckSquare className="w-3 h-3 text-[var(--ink-faint)]" />
                                {completedSubs}/{totalSubs}
                              </span>
                            )}
                            {t.attachments && t.attachments.length > 0 && (
                              <span className="flex items-center gap-1 text-[10px]">
                                <Paperclip className="w-3 h-3 text-[var(--ink-faint)]" />
                                {t.attachments.length}
                              </span>
                            )}
                            {t.comments && t.comments.length > 0 && (
                              <span className="flex items-center gap-1 text-[10px]">
                                <MessageSquare className="w-3 h-3 text-[var(--ink-faint)]" />
                                {t.comments.length}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5">
                            {t.dueDate && (
                              <span className="flex items-center gap-1 text-[10px] text-orange-700 font-medium">
                                <Clock className="w-3 h-3" />
                                {t.dueDate.slice(5)}
                              </span>
                            )}
                            {t.assignee && (
                              <img
                                src={t.assignee.avatarUrl}
                                alt={t.assignee.name}
                                className="w-5 h-5 rounded-full border border-white object-cover"
                                title={t.assignee.name}
                              />
                            )}
                          </div>
                        </div>

                        {/* Fast Shift Column Controls */}
                        {currentUser.role !== "VIEWER" && (
                          <div 
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center justify-between mt-2 pt-1 border-t border-dashed border-[var(--line)] opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <button
                              disabled={col.status === "backlog"}
                              onClick={() => moveTask(t, "prev")}
                              className="text-[10px] text-[var(--ink-muted)] hover:text-[var(--ink)] disabled:opacity-30 flex items-center"
                            >
                              <ChevronLeft className="w-3 h-3" /> Prev
                            </button>
                            <span className="text-[9px] font-mono text-[var(--ink-faint)]">#{t.id}</span>
                            <button
                              disabled={col.status === "done"}
                              onClick={() => moveTask(t, "next")}
                              className="text-[10px] text-[var(--ink-muted)] hover:text-[var(--accent-700)] disabled:opacity-30 flex items-center font-medium"
                            >
                              Next <ChevronRight className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
