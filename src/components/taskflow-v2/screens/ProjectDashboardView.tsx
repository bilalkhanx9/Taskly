"use client";

import React, { useState } from "react";
import { Project, Task, User, TaskStatus, TaskPriority } from "@/types/taskflow-v2";
import { BoardView } from "./BoardView";
import { ListView } from "./ListView";
import { CalendarView } from "./CalendarView";
import { 
  Kanban, 
  ListTodo, 
  Calendar as CalendarIcon, 
  FileText, 
  Settings, 
  Plus, 
  Clock, 
  ArrowLeft,
  Users,
  Paperclip,
  Download
} from "lucide-react";

interface ProjectDashboardViewProps {
  currentUser: User;
  project: Project;
  tasks: Task[];
  onBackToProjects: () => void;
  onOpenTask: (taskId: string) => void;
  onUpdateTaskStatus: (taskId: string, newStatus: TaskStatus) => void;
  onUpdateTaskPriority: (taskId: string, newPriority: TaskPriority) => void;
  onDeleteTask?: (taskId: string) => void;
  onNewTask: () => void;
  onQuickAddStatus?: (status: TaskStatus) => void;
}

export const ProjectDashboardView: React.FC<ProjectDashboardViewProps> = ({
  currentUser,
  project,
  tasks,
  onBackToProjects,
  onOpenTask,
  onUpdateTaskStatus,
  onUpdateTaskPriority,
  onDeleteTask,
  onNewTask,
  onQuickAddStatus
}) => {
  const [activeTab, setActiveTab] = useState<"board" | "list" | "calendar" | "files" | "settings">("board");

  const projectTasks = tasks.filter(t => t.projectId === project.id);
  const completedCount = projectTasks.filter(t => t.status === "done").length;
  const progressPercent = projectTasks.length > 0 ? Math.round((completedCount / projectTasks.length) * 100) : 0;

  // Gather all attachments in project
  const allAttachments = projectTasks.flatMap(t => 
    (t.attachments || []).map(a => ({ ...a, taskTitle: t.title, taskId: t.id }))
  );

  return (
    <div className="w-full space-y-4">
      {/* Top Project Header Strip */}
      <div className="bg-[var(--surface)] border border-[var(--line)] rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToProjects}
              className="p-1.5 rounded-lg border border-[var(--line-strong)] hover:bg-[var(--surface-sunken)] text-[var(--ink-muted)] hover:text-[var(--ink)]"
              title="Back to all projects"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2.5">
              <span 
                className="w-4 h-4 rounded-md shadow-xs" 
                style={{ backgroundColor: project.color }} 
              />
              <h1 className="text-xl font-bold tracking-tight text-[var(--ink)]">
                {project.name}
              </h1>
              <span className="capitalize px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                {project.status}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {currentUser.role !== "VIEWER" && (
              <button
                onClick={onNewTask}
                className="h-[34px] px-3.5 bg-[var(--accent-700)] hover:bg-[var(--accent-800)] text-white font-medium text-xs rounded-lg flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                New Task
              </button>
            )}
          </div>
        </div>

        {/* Project Description & Metadata Sub-bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[var(--line)] text-xs text-[var(--ink-muted)]">
          <p className="max-w-xl text-[var(--ink-body)] line-clamp-1">
            {project.description}
          </p>

          <div className="flex items-center gap-4 flex-shrink-0">
            <span className="flex items-center gap-1 font-medium text-[var(--ink)]">
              <Clock className="w-3.5 h-3.5 text-orange-700" /> Deadline: {project.deadline}
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-medium text-[var(--ink)]">{completedCount}/{projectTasks.length} ({progressPercent}%)</span>
              <div className="w-16 h-1.5 bg-[var(--surface-sunken)] rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${progressPercent}%`, backgroundColor: project.color }} />
              </div>
            </div>
            <div className="flex -space-x-1.5">
              {project.members.map((m, idx) => (
                <img
                  key={idx}
                  src={m.avatarUrl}
                  alt={m.name}
                  className="w-5 h-5 rounded-full border border-white"
                  title={m.name}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Sub-View Navigation Tabs */}
        <div className="flex items-center gap-1 pt-1 border-t border-[var(--line)]">
          <button
            onClick={() => setActiveTab("board")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              activeTab === "board"
                ? "bg-[var(--accent-50)] text-[var(--accent-800)] border border-[var(--accent-100)]"
                : "text-[var(--ink-muted)] hover:text-[var(--ink)] hover:bg-[var(--surface-sunken)]"
            }`}
          >
            <Kanban className="w-3.5 h-3.5 text-[var(--accent-700)]" />
            Board
          </button>

          <button
            onClick={() => setActiveTab("list")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              activeTab === "list"
                ? "bg-[var(--accent-50)] text-[var(--accent-800)] border border-[var(--accent-100)]"
                : "text-[var(--ink-muted)] hover:text-[var(--ink)] hover:bg-[var(--surface-sunken)]"
            }`}
          >
            <ListTodo className="w-3.5 h-3.5 text-[var(--accent-700)]" />
            List
          </button>

          <button
            onClick={() => setActiveTab("calendar")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              activeTab === "calendar"
                ? "bg-[var(--accent-50)] text-[var(--accent-800)] border border-[var(--accent-100)]"
                : "text-[var(--ink-muted)] hover:text-[var(--ink)] hover:bg-[var(--surface-sunken)]"
            }`}
          >
            <CalendarIcon className="w-3.5 h-3.5 text-[var(--accent-700)]" />
            Calendar
          </button>

          <button
            onClick={() => setActiveTab("files")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              activeTab === "files"
                ? "bg-[var(--accent-50)] text-[var(--accent-800)] border border-[var(--accent-100)]"
                : "text-[var(--ink-muted)] hover:text-[var(--ink)] hover:bg-[var(--surface-sunken)]"
            }`}
          >
            <Paperclip className="w-3.5 h-3.5 text-[var(--accent-700)]" />
            Files ({allAttachments.length})
          </button>

          {(currentUser.role === "WORKSPACE_OWNER" || currentUser.role === "MANAGER") && (
            <button
              onClick={() => setActiveTab("settings")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                activeTab === "settings"
                  ? "bg-[var(--accent-50)] text-[var(--accent-800)] border border-[var(--accent-100)]"
                  : "text-[var(--ink-muted)] hover:text-[var(--ink)] hover:bg-[var(--surface-sunken)]"
              }`}
            >
              <Settings className="w-3.5 h-3.5 text-[var(--ink-muted)]" />
              Settings
            </button>
          )}
        </div>
      </div>

      {/* Sub-view Content Panel */}
      <div>
        {activeTab === "board" && (
          <BoardView
            currentUser={currentUser}
            project={project}
            tasks={tasks}
            onOpenTask={onOpenTask}
            onUpdateTaskStatus={onUpdateTaskStatus}
            onQuickAddTask={(st) => {
              if (onQuickAddStatus) onQuickAddStatus(st);
              else onNewTask();
            }}
          />
        )}

        {activeTab === "list" && (
          <ListView
            currentUser={currentUser}
            project={project}
            tasks={tasks}
            onOpenTask={onOpenTask}
            onUpdateTaskStatus={onUpdateTaskStatus}
            onUpdateTaskPriority={onUpdateTaskPriority}
            onDeleteTask={onDeleteTask}
            onQuickAddTask={(st) => {
              if (onQuickAddStatus) onQuickAddStatus(st);
              else onNewTask();
            }}
          />
        )}

        {activeTab === "calendar" && (
          <CalendarView
            currentUser={currentUser}
            project={project}
            tasks={tasks}
            onOpenTask={onOpenTask}
          />
        )}

        {activeTab === "files" && (
          <div className="bg-[var(--surface)] border border-[var(--line)] rounded-xl p-6">
            <h3 className="text-sm font-bold text-[var(--ink)] mb-4">Project Attachments</h3>
            {allAttachments.length === 0 ? (
              <div className="text-center py-8 text-xs text-[var(--ink-muted)]">
                No attachments uploaded to this project yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {allAttachments.map((f) => (
                  <div key={f.id} className="p-3 border border-[var(--line)] rounded-lg bg-[var(--surface-hover)] flex items-center justify-between">
                    <div className="flex items-center gap-2.5 truncate">
                      <FileText className="w-5 h-5 text-[var(--accent-700)] flex-shrink-0" />
                      <div className="truncate">
                        <div className="text-xs font-semibold text-[var(--ink)] truncate">{f.name}</div>
                        <div className="text-[10px] text-[var(--ink-muted)]">{f.size} • {f.taskTitle}</div>
                      </div>
                    </div>
                    <button 
                      onClick={() => alert(`Downloading ${f.name}`)}
                      className="p-1 text-[var(--ink-muted)] hover:text-[var(--ink)]" 
                      title="Download"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "settings" && (
          <div className="bg-[var(--surface)] border border-[var(--line)] rounded-xl p-6 max-w-2xl space-y-4">
            <h3 className="text-sm font-bold text-[var(--ink)]">Project Settings</h3>
            <div>
              <label className="block text-xs font-semibold text-[var(--ink-body)] mb-1">Project Name</label>
              <input 
                type="text" 
                defaultValue={project.name} 
                className="w-full px-3 py-2 bg-[var(--surface)] border border-[var(--line-strong)] rounded-lg text-xs" 
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--ink-body)] mb-1">Target Deadline</label>
              <input 
                type="date" 
                defaultValue={project.deadline} 
                className="w-full px-3 py-2 bg-[var(--surface)] border border-[var(--line-strong)] rounded-lg text-xs" 
              />
            </div>
            <div className="pt-2">
              <button 
                onClick={() => alert("Project settings saved.")}
                className="h-[34px] px-4 bg-[var(--accent-700)] text-white text-xs font-medium rounded-lg shadow-sm"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
