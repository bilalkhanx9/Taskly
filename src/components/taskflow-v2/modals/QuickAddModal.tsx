"use client";

import React, { useState } from "react";
import { Project, User, TaskPriority, TaskStatus, Task } from "@/types/taskflow-v2";
import { X, Plus, Calendar, AlertCircle } from "lucide-react";

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  members: User[];
  defaultStatus?: TaskStatus;
  defaultProjectId?: string;
  onAddTask: (newTask: Partial<Task>) => void;
}

export const QuickAddModal: React.FC<QuickAddModalProps> = ({
  isOpen,
  onClose,
  projects,
  members,
  defaultStatus = "todo",
  defaultProjectId,
  onAddTask
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projectId, setProjectId] = useState(defaultProjectId || projects[0]?.id || "");
  const [status, setStatus] = useState<TaskStatus>(defaultStatus);
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [assigneeId, setAssigneeId] = useState("");
  const [dueDate, setDueDate] = useState("2026-09-15");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!title.trim()) {
      setError("Task title is required.");
      return;
    }
    if (!projectId) {
      setError("Please select a destination project.");
      return;
    }

    onAddTask({
      title: title.trim(),
      description: description.trim(),
      projectId,
      status,
      priority,
      assignee: members.find(m => m.id === assigneeId),
      dueDate,
      labels: ["Feature"],
      subtasks: []
    });

    setTitle("");
    setDescription("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div 
        className="bg-[var(--surface)] border border-[var(--line-strong)] rounded-2xl w-full max-w-lg shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-[var(--ink)]">Quick Create Task</h2>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[var(--surface-sunken)] border border-[var(--line)] text-[var(--ink-muted)]">
              Shortcut N
            </span>
          </div>
          <button onClick={onClose} className="p-1 rounded text-[var(--ink-muted)] hover:text-[var(--ink)]">
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="mt-3 p-2.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--ink-body)] uppercase tracking-wider mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              autoFocus
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="w-full px-3 py-2 bg-[var(--surface)] border border-[var(--line-strong)] rounded-lg text-xs text-[var(--ink)] focus:outline-none focus:border-[var(--accent-600)]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--ink-body)] uppercase tracking-wider mb-1">
              Destination Project <span className="text-red-500">*</span>
            </label>
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="w-full px-3 py-2 bg-[var(--surface)] border border-[var(--line-strong)] rounded-lg text-xs text-[var(--ink)]"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[var(--ink-body)] uppercase tracking-wider mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full px-3 py-2 bg-[var(--surface)] border border-[var(--line-strong)] rounded-lg text-xs text-[var(--ink)]"
              >
                <option value="backlog">Backlog</option>
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="in_review">In Review</option>
                <option value="done">Done</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--ink-body)] uppercase tracking-wider mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full px-3 py-2 bg-[var(--surface)] border border-[var(--line-strong)] rounded-lg text-xs text-[var(--ink)] capitalize"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[var(--ink-body)] uppercase tracking-wider mb-1">
                Assignee
              </label>
              <select
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                className="w-full px-3 py-2 bg-[var(--surface)] border border-[var(--line-strong)] rounded-lg text-xs text-[var(--ink)]"
              >
                <option value="">Unassigned</option>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--ink-body)] uppercase tracking-wider mb-1">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 bg-[var(--surface)] border border-[var(--line-strong)] rounded-lg text-xs text-[var(--ink)]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--ink-body)] uppercase tracking-wider mb-1">
              Description (Optional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add key context or acceptance criteria..."
              className="w-full px-3 py-2 bg-[var(--surface)] border border-[var(--line-strong)] rounded-lg text-xs text-[var(--ink)]"
            />
          </div>

          {/* Modal Footer with exact Section 5.7.1 scale: Secondary left, Primary right with 8px gap */}
          <div className="pt-3 border-t border-[var(--line)] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="h-[38px] px-4 border border-[var(--line-strong)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] text-xs font-semibold text-[var(--ink)] rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-[38px] px-5 bg-[var(--accent-700)] hover:bg-[var(--accent-800)] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
