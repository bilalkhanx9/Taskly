"use client";

import React, { useState } from "react";
import { Task, TaskStatus, User, Project } from "@/types/taskflow-v2";
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  AlertCircle, 
  Plus, 
  Calendar, 
  RotateCcw,
  Check,
  Filter
} from "lucide-react";

interface MyTasksViewProps {
  currentUser: User;
  tasks: Task[];
  projects: Project[];
  onOpenTask: (taskId: string) => void;
  onToggleTaskComplete: (taskId: string, currentStatus: TaskStatus) => void;
  onInlineAddTask: (title: string, dueDate: string) => void;
}

export const MyTasksView: React.FC<MyTasksViewProps> = ({
  currentUser,
  tasks,
  projects,
  onOpenTask,
  onToggleTaskComplete,
  onInlineAddTask
}) => {
  const [activeTab, setActiveTab] = useState<"all" | "today" | "upcoming" | "overdue" | "completed">("all");
  const [quickTitle, setQuickTitle] = useState("");
  const [undoTaskId, setUndoTaskId] = useState<string | null>(null);

  // Filter tasks assigned to current user
  const myTasks = tasks.filter(t => t.assignee?.id === currentUser.id);

  // Categorize
  const todayStr = "2026-09-07"; // Simulated local system date
  const overdueTasks = myTasks.filter(t => t.status !== "done" && t.dueDate < todayStr);
  const todayTasks = myTasks.filter(t => t.status !== "done" && t.dueDate === todayStr);
  const upcomingTasks = myTasks.filter(t => t.status !== "done" && t.dueDate > todayStr);
  const completedTasks = myTasks.filter(t => t.status === "done");

  const displayedTasks = (() => {
    switch (activeTab) {
      case "today": return todayTasks;
      case "upcoming": return upcomingTasks;
      case "overdue": return overdueTasks;
      case "completed": return completedTasks;
      case "all":
      default:
        return myTasks;
    }
  })();

  const handleCheckboxClick = (e: React.MouseEvent, task: Task) => {
    e.stopPropagation();
    onToggleTaskComplete(task.id, task.status);
    if (task.status !== "done") {
      setUndoTaskId(task.id);
      setTimeout(() => setUndoTaskId(null), 5000);
    }
  };

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;
    onInlineAddTask(quickTitle, todayStr);
    setQuickTitle("");
  };

  const getProjectInfo = (projectId: string) => {
    return projects.find(p => p.id === projectId);
  };

  return (
    <div className="w-full space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--ink)]">My Tasks</h1>
          <p className="text-xs text-[var(--ink-muted)] mt-1">
            Focus on what you personally need to deliver today across all projects.
          </p>
        </div>

        {/* Quick Tabs */}
        <div className="flex items-center gap-1 bg-[var(--surface-sunken)] p-1 rounded-xl border border-[var(--line)]">
          {(["all", "today", "upcoming", "overdue", "completed"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-colors ${
                activeTab === tab 
                  ? "bg-[var(--surface)] text-[var(--ink)] shadow-xs" 
                  : "text-[var(--ink-muted)] hover:text-[var(--ink)]"
              }`}
            >
              {tab}
              {tab === "overdue" && overdueTasks.length > 0 && (
                <span className="ml-1.5 px-1.5 py-0.2 bg-red-100 text-red-700 text-[10px] rounded-full font-bold">
                  {overdueTasks.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Overdue Warning Alert (Section 7.17) */}
      {overdueTasks.length > 0 && activeTab !== "completed" && (
        <div className="p-4 bg-red-50/70 border border-red-200 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-xs text-red-800">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span>
              You have <strong className="font-semibold">{overdueTasks.length} overdue</strong> {overdueTasks.length === 1 ? "task" : "tasks"} past their scheduled completion date.
            </span>
          </div>
          <button
            onClick={() => setActiveTab("overdue")}
            className="text-xs font-bold text-red-700 hover:underline"
          >
            Review Overdue
          </button>
        </div>
      )}

      {/* Quick Add Inline Input */}
      {currentUser.role !== "VIEWER" && (
        <form onSubmit={handleQuickAdd} className="relative">
          <input
            type="text"
            placeholder="+ Add a task to your list and press Enter..."
            value={quickTitle}
            onChange={(e) => setQuickTitle(e.target.value)}
            className="w-full px-4 py-3 bg-[var(--surface)] border border-[var(--line-strong)] rounded-xl text-xs text-[var(--ink)] placeholder:text-[var(--ink-faint)] focus:outline-none focus:border-[var(--accent-600)] focus:ring-2 focus:ring-[var(--accent-50)] shadow-2xs transition-all"
          />
        </form>
      )}

      {/* Tasks List Card */}
      <div className="bg-[var(--surface)] border border-[var(--line)] rounded-xl divide-y divide-[var(--line)] shadow-2xs overflow-hidden">
        {displayedTasks.length === 0 ? (
          <div className="py-12 text-center text-xs text-[var(--ink-muted)]">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
            <div className="font-semibold text-[var(--ink)]">You&apos;re all caught up!</div>
            <div className="text-[11px] text-[var(--ink-faint)] mt-0.5">No tasks in this view.</div>
          </div>
        ) : (
          displayedTasks.map((t) => {
            const project = getProjectInfo(t.projectId);
            const isDone = t.status === "done";
            const isOverdue = t.status !== "done" && t.dueDate < todayStr;

            return (
              <div
                key={t.id}
                onClick={() => onOpenTask(t.id)}
                className={`p-3.5 hover:bg-[var(--surface-hover)] transition-colors flex items-center justify-between gap-3 cursor-pointer group ${
                  isDone ? "bg-[var(--surface-sunken)]/40" : ""
                }`}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {/* Complete Checkbox */}
                  <button
                    onClick={(e) => handleCheckboxClick(e, t)}
                    disabled={currentUser.role === "VIEWER"}
                    className="p-1 text-[var(--ink-faint)] hover:text-[var(--accent-700)] transition-colors flex-shrink-0"
                    title={isDone ? "Mark as in progress" : "Mark as done"}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <Circle className="w-5 h-5 group-hover:border-[var(--accent-700)]" />
                    )}
                  </button>

                  {/* Title & Project Pill */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-semibold truncate ${
                        isDone ? "line-through text-[var(--ink-faint)]" : "text-[var(--ink)]"
                      }`}>
                        {t.title}
                      </span>
                      {project && (
                        <span 
                          className="text-[10px] px-1.5 py-0.2 rounded font-medium flex items-center gap-1 border border-[var(--line)] bg-[var(--surface-sunken)] text-[var(--ink-muted)] flex-shrink-0"
                        >
                          <span className="w-1.5 h-1.5 rounded-xs" style={{ backgroundColor: project.color }} />
                          {project.name}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Due Date & Priority */}
                <div className="flex items-center gap-3 text-xs flex-shrink-0">
                  <span className={`flex items-center gap-1 text-[11px] font-medium ${
                    isOverdue ? "text-red-700 font-bold" : "text-[var(--ink-muted)]"
                  }`}>
                    <Clock className="w-3 h-3" /> {t.dueDate}
                  </span>

                  <span className={`text-[10px] px-1.5 py-0.5 rounded capitalize font-semibold ${
                    t.priority === "urgent" ? "bg-red-50 text-red-700 border border-red-200" :
                    t.priority === "high" ? "bg-amber-50 text-amber-700 border border-amber-200" :
                    "bg-stone-100 text-stone-600 border border-stone-200"
                  }`}>
                    {t.priority}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Reversible Action Toast Notification (Section 1.4 Principle 4) */}
      {undoTaskId && (
        <div className="fixed bottom-6 right-6 z-50 bg-[var(--ink)] text-white text-xs px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Task marked completed.</span>
          <button
            onClick={() => {
              onToggleTaskComplete(undoTaskId, "done");
              setUndoTaskId(null);
            }}
            className="text-[var(--accent-500)] hover:text-white font-bold underline flex items-center gap-1 ml-2"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Undo
          </button>
        </div>
      )}
    </div>
  );
};
