"use client";

import React, { useState, useEffect } from "react";
import { Search, CheckSquare, FolderKanban, Users, ArrowRight, X } from "lucide-react";
import { Task, Project, User } from "@/types/taskflow";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  projects: Project[];
  members: User[];
  onSelectTask: (task: Task) => void;
  onSelectProject: (projectId: string) => void;
}

export function CommandPalette({
  isOpen,
  onClose,
  tasks,
  projects,
  members,
  onSelectTask,
  onSelectProject,
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        // Toggle or open handled by parent
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const filteredTasks = tasks
    .filter((t) => t.title.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 4);

  const filteredProjects = projects
    .filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 3);

  const filteredMembers = members
    .filter((m) => m.name.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 3);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl p-0 overflow-hidden bg-white border border-[#E3E8E6] shadow-xl rounded-xl">
        {/* Search Input */}
        <div className="flex items-center px-4 py-3 border-b border-[#E3E8E6] gap-3">
          <Search className="h-4 w-4 text-[#6B7A80]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search tasks, projects, people..."
            className="w-full text-sm text-[#1F2A2E] placeholder:text-[#9AA7AC] outline-none bg-transparent"
            autoFocus
          />
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-[#6B7A80] hover:text-[#1F2A2E]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-4 text-xs">
          {/* Tasks Section */}
          {filteredTasks.length > 0 && (
            <div>
              <span className="px-2.5 text-[10px] font-bold text-[#6B7A80] uppercase tracking-wider">
                Tasks
              </span>
              <div className="mt-1 space-y-0.5">
                {filteredTasks.map((task) => (
                  <button
                    key={task.id}
                    type="button"
                    onClick={() => {
                      onSelectTask(task);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-[#EFF2F1] text-left transition-colors group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <CheckSquare className="h-3.5 w-3.5 text-[#0F766E] shrink-0" />
                      <span className="truncate font-medium text-[#1F2A2E]">{task.title}</span>
                    </div>
                    <span className="text-[10px] font-semibold text-[#6B7A80] uppercase">
                      {task.status}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Projects Section */}
          {filteredProjects.length > 0 && (
            <div>
              <span className="px-2.5 text-[10px] font-bold text-[#6B7A80] uppercase tracking-wider">
                Projects
              </span>
              <div className="mt-1 space-y-0.5">
                {filteredProjects.map((project) => (
                  <button
                    key={project.id}
                    type="button"
                    onClick={() => {
                      onSelectProject(project.id);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-[#EFF2F1] text-left transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <FolderKanban className="h-3.5 w-3.5 text-[#2E7CD6] shrink-0" />
                      <span className="truncate font-medium text-[#1F2A2E]">{project.name}</span>
                    </div>
                    <span className="text-[10px] text-[#6B7A80]">
                      {project.completedTasks}/{project.totalTasks} Done
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Members Section */}
          {filteredMembers.length > 0 && (
            <div>
              <span className="px-2.5 text-[10px] font-bold text-[#6B7A80] uppercase tracking-wider">
                Team Members
              </span>
              <div className="mt-1 space-y-0.5">
                {filteredMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-[#EFF2F1]"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Users className="h-3.5 w-3.5 text-[#D97706] shrink-0" />
                      <span className="font-medium text-[#1F2A2E]">{member.name}</span>
                      <span className="text-[10px] text-[#6B7A80]">({member.email})</span>
                    </div>
                    <span className="text-[10px] text-[#0F766E] font-semibold uppercase">
                      {member.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {filteredTasks.length === 0 && filteredProjects.length === 0 && (
            <div className="py-8 text-center text-[#9AA7AC]">
              No results found for &ldquo;{query}&rdquo;
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 bg-[#F6F8F7] border-t border-[#E3E8E6] flex items-center justify-between text-[10px] text-[#6B7A80]">
          <span>Tip: Press ESC to close</span>
          <span>TaskFlow Command Palette</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
