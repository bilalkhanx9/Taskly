"use client";

import React, { useState } from "react";
import { Project, User } from "@/types/taskflow-v2";
import { X, FolderPlus, Check } from "lucide-react";

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onAddProject: (newProject: Project) => void;
}

const COLOR_OPTIONS = [
  "#C2410C", // Warm Orange
  "#1D4ED8", // Blue
  "#15803D", // Green
  "#7C3AED", // Violet
  "#B45309", // Amber
  "#0E7490", // Cyan
  "#BE185D"  // Pink
];

export const NewProjectModal: React.FC<NewProjectModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onAddProject
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState(COLOR_OPTIONS[0]);
  const [deadline, setDeadline] = useState("2026-10-31");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const project: Project = {
      id: `proj-${Date.now()}`,
      workspaceId: "ws-1",
      name: name.trim(),
      slug: name.toLowerCase().replace(/[^a-z0-9]/g, "-"),
      description: description.trim() || "Project deliverables and timeline.",
      color,
      status: "active",
      taskCount: 0,
      completedTaskCount: 0,
      members: [currentUser],
      deadline
    };

    onAddProject(project);
    setName("");
    setDescription("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div 
        className="bg-[var(--surface)] border border-[var(--line-strong)] rounded-2xl w-full max-w-md shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-orange-50 text-[var(--accent-700)] flex items-center justify-center">
              <FolderPlus className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-[var(--ink)]">Create Project</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded text-[var(--ink-muted)] hover:text-[var(--ink)]">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--ink-body)] uppercase tracking-wider mb-1">
              Project Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              autoFocus
              required
              placeholder="e.g. Mobile Application V2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-[var(--surface)] border border-[var(--line-strong)] rounded-lg text-xs text-[var(--ink)] focus:outline-none focus:border-[var(--accent-600)]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--ink-body)] uppercase tracking-wider mb-1">
              Colour Identifier
            </label>
            <div className="flex items-center gap-2">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  style={{ backgroundColor: c }}
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                    color === c ? "ring-2 ring-offset-2 ring-[var(--ink)] scale-110" : "opacity-80 hover:opacity-100"
                  }`}
                >
                  {color === c && <Check className="w-3.5 h-3.5 text-white" />}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--ink-body)] uppercase tracking-wider mb-1">
              Target Deadline
            </label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full px-3 py-2 bg-[var(--surface)] border border-[var(--line-strong)] rounded-lg text-xs text-[var(--ink)]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--ink-body)] uppercase tracking-wider mb-1">
              Description
            </label>
            <textarea
              rows={2}
              placeholder="Describe the milestone or deliverables..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-[var(--surface)] border border-[var(--line-strong)] rounded-lg text-xs text-[var(--ink)]"
            />
          </div>

          <div className="pt-3 border-t border-[var(--line)] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="h-[38px] px-4 border border-[var(--line-strong)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] text-xs font-semibold text-[var(--ink)] rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-[38px] px-5 bg-[var(--accent-700)] hover:bg-[var(--accent-800)] text-white text-xs font-semibold rounded-lg shadow-sm"
            >
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
