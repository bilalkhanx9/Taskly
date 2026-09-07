"use client";

import React, { useState } from "react";
import { Project, User } from "@/types/taskflow";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspaceId: string;
  currentUser: User;
  onProjectCreated: (project: Project) => void;
}

const colorPalette = [
  "#0F766E", // Deep Teal
  "#2E7CD6", // Blue
  "#D97706", // Amber
  "#6941C6", // Purple
  "#15803D", // Green
  "#C0342B", // Red
  "#475467", // Slate
];

export function NewProjectModal({
  isOpen,
  onClose,
  workspaceId,
  currentUser,
  onProjectCreated,
}: NewProjectModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState(colorPalette[0]);
  const [deadline, setDeadline] = useState("2026-10-30");

  const handleCreate = () => {
    if (!name.trim()) return;

    const newProject: Project = {
      id: `proj-${Date.now()}`,
      workspaceId,
      name: name.trim(),
      description: description.trim() || undefined,
      color,
      icon: "folder",
      status: "active",
      startDate: new Date().toISOString().slice(0, 10),
      deadline,
      progress: 0,
      totalTasks: 0,
      completedTasks: 0,
      members: [currentUser],
    };

    onProjectCreated(newProject);
    setName("");
    setDescription("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md p-6 bg-white border border-[#E3E8E6] rounded-xl shadow-xl space-y-4">
        <DialogHeader>
          <DialogTitle className="text-sm font-bold text-[#1F2A2E]">
            Create New Project
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-[#6B7A80] uppercase text-[10px]">
              Project Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Q4 Website Revamp"
              autoFocus
              className="w-full bg-[#F6F8F7] border border-[#E3E8E6] rounded-md px-3 py-2 text-xs text-[#1F2A2E] focus:outline-none focus:border-[#0F766E]"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-[#6B7A80] uppercase text-[10px]">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Brief summary of objectives and scope..."
              className="w-full bg-[#F6F8F7] border border-[#E3E8E6] rounded-md p-2.5 text-xs text-[#1F2A2E] focus:outline-none focus:border-[#0F766E] resize-none"
            />
          </div>

          {/* Color selection */}
          <div className="space-y-1">
            <label className="font-bold text-[#6B7A80] uppercase text-[10px]">
              Accent Color
            </label>
            <div className="flex items-center gap-2 pt-1">
              {colorPalette.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`h-6 w-6 rounded-full transition-transform ${
                    color === c ? "scale-125 ring-2 ring-[#0F766E] ring-offset-2" : "hover:scale-110"
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-[#6B7A80] uppercase text-[10px]">
              Target Deadline
            </label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full bg-[#F6F8F7] border border-[#E3E8E6] rounded-md px-2.5 py-1.5 text-xs text-[#1F2A2E] focus:outline-none focus:border-[#0F766E]"
            />
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
            disabled={!name.trim()}
            className="px-4 py-1.5 rounded-md bg-[#0F766E] hover:bg-[#0C5F58] text-white text-xs font-semibold shadow-xs disabled:opacity-50"
          >
            Create Project
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
