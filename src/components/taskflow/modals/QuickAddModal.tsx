"use client";

import React, { useState, useEffect } from "react";
import { Task, Project, TaskStatus, TaskPriority, User } from "@/types/taskflow";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus } from "lucide-react";

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultStatus?: TaskStatus;
  defaultDueDate?: string;
  projects: Project[];
  teamMembers: User[];
  onTaskCreated: (newTask: Task) => void;
}

export function QuickAddModal({
  isOpen,
  onClose,
  defaultStatus = "todo",
  defaultDueDate = "2026-09-08",
  projects,
  teamMembers,
  onTaskCreated,
}: QuickAddModalProps) {
  const [title, setTitle] = useState("");
  const [projectId, setProjectId] = useState(projects[0]?.id || "proj-1");
  const [status, setStatus] = useState<TaskStatus>(defaultStatus);
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [dueDate, setDueDate] = useState(defaultDueDate);
  const [assigneeId, setAssigneeId] = useState(teamMembers[0]?.id || "");

  useEffect(() => {
    if (defaultStatus) setStatus(defaultStatus);
    if (defaultDueDate) setDueDate(defaultDueDate);
  }, [defaultStatus, defaultDueDate, isOpen]);

  const handleCreate = () => {
    if (!title.trim()) return;

    const assignedUser = teamMembers.find((m) => m.id === assigneeId) || null;

    const newTask: Task = {
      id: `task-${Date.now()}`,
      projectId,
      title: title.trim(),
      status,
      priority,
      dueDate,
      assignee: assignedUser,
      watchers: [],
      position: Date.now(),
      labels: [],
      subtasks: [],
      attachments: [],
      comments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onTaskCreated(newTask);
    setTitle("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md p-6 bg-white border border-[#E3E8E6] rounded-xl shadow-xl space-y-4">
        <DialogHeader>
          <DialogTitle className="text-sm font-bold text-[#1F2A2E]">
            Quick Create Task (Shortcut: N)
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 text-xs">
          {/* Title Input */}
          <div className="space-y-1">
            <label className="font-bold text-[#6B7A80] uppercase text-[10px]">
              Task Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              placeholder="What needs to be done?"
              autoFocus
              className="w-full bg-[#F6F8F7] border border-[#E3E8E6] rounded-md px-3 py-2 text-xs text-[#1F2A2E] focus:outline-none focus:border-[#0F766E]"
            />
          </div>

          {/* Project & Status */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-[#6B7A80] uppercase text-[10px]">
                Project
              </label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full bg-[#F6F8F7] border border-[#E3E8E6] rounded-md px-2.5 py-1.5 text-xs text-[#1F2A2E] focus:outline-none focus:border-[#0F766E]"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#6B7A80] uppercase text-[10px]">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full bg-[#F6F8F7] border border-[#E3E8E6] rounded-md px-2.5 py-1.5 text-xs text-[#1F2A2E] focus:outline-none focus:border-[#0F766E] uppercase font-semibold"
              >
                <option value="backlog">Backlog</option>
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="in_review">In Review</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>

          {/* Priority & Due Date */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-[#6B7A80] uppercase text-[10px]">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full bg-[#F6F8F7] border border-[#E3E8E6] rounded-md px-2.5 py-1.5 text-xs text-[#1F2A2E] focus:outline-none focus:border-[#0F766E] uppercase font-semibold"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#6B7A80] uppercase text-[10px]">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-[#F6F8F7] border border-[#E3E8E6] rounded-md px-2.5 py-1.5 text-xs text-[#1F2A2E] focus:outline-none focus:border-[#0F766E]"
              />
            </div>
          </div>

          {/* Assignee */}
          <div className="space-y-1">
            <label className="font-bold text-[#6B7A80] uppercase text-[10px]">
              Assignee
            </label>
            <select
              value={assigneeId}
              onChange={(e) => setAssigneeId(e.target.value)}
              className="w-full bg-[#F6F8F7] border border-[#E3E8E6] rounded-md px-2.5 py-1.5 text-xs text-[#1F2A2E] focus:outline-none focus:border-[#0F766E]"
            >
              {teamMembers.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.role})
                </option>
              ))}
            </select>
          </div>
        </div>

        <DialogFooter className="pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-md border border-[#E3E8E6] text-xs font-semibold text-[#3D4A4F] hover:bg-[#F6F8F7]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleCreate}
            disabled={!title.trim()}
            className="px-4 py-1.5 rounded-md bg-[#0F766E] hover:bg-[#0C5F58] text-white text-xs font-semibold shadow-xs disabled:opacity-50"
          >
            Create Task
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
