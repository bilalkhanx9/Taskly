"use client";

import React, { useState, useEffect } from "react";
import { Search, CheckSquare, FolderKanban, Users, X, ArrowRight } from "lucide-react";
import { Task, Project, User } from "@/types/taskflow-v2";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  projects: Project[];
  members: User[];
  onSelectTask: ((task: Task) => void) | ((taskId: string) => void);
  onSelectProject: (projectId: string) => void;
  onNavigateScreen?: (screen: string) => void;
  onNavigate?: (screen: string) => void;
}

export function CommandPalette({
  isOpen,
  onClose,
  tasks,
  projects,
  members,
  onSelectTask,
  onSelectProject,
  onNavigateScreen,
  onNavigate,
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const handleNav = onNavigate || onNavigateScreen || (() => {});

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

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
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl border border-[var(--line)] shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input */}
        <div className="flex items-center px-4 py-3 border-b border-[var(--line)] gap-3 bg-white">
          <Search className="h-4 w-4 text-[var(--ink-muted)]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tasks, projects, people, or jump to screen... (ESC to exit)"
            className="w-full text-xs text-[var(--ink)] placeholder:text-[var(--ink-faint)] outline-none bg-transparent"
            autoFocus
          />
          <kbd className="px-1.5 py-0.5 bg-[var(--surface-sunken)] border border-[var(--line)] text-[10px] font-mono text-[var(--ink-muted)] rounded">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-3 space-y-4 text-xs">
          {/* Quick Screen Navigation */}
          {!query.trim() && (
            <div>
              <span className="px-2 text-[10px] font-bold text-[var(--ink-muted)] uppercase tracking-wider">
                Quick Navigation
              </span>
              <div className="mt-1.5 grid grid-cols-2 gap-1.5">
                {[
                  { label: "Workspace Home", screen: "workspace_home" },
                  { label: "My Tasks", screen: "my_tasks" },
                  { label: "Projects Grid", screen: "projects" },
                  { label: "Board View (Kanban)", screen: "board" },
                  { label: "Calendar", screen: "calendar" },
                  { label: "Team Directory", screen: "team" },
                  { label: "Reports & Velocity", screen: "reports" },
                  { label: "Notifications", screen: "notifications" },
                ].map((item) => (
                  <button
                    key={item.screen}
                    type="button"
                    onClick={() => {
                      handleNav(item.screen);
                      onClose();
                    }}
                    className="flex items-center justify-between px-3 py-2 rounded-lg bg-[var(--surface-hover)] hover:bg-[var(--accent-50)] text-[var(--ink)] hover:text-[var(--accent-700)] text-left text-xs font-medium transition-colors"
                  >
                    <span>{item.label}</span>
                    <ArrowRight className="w-3 h-3 text-[var(--ink-muted)]" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tasks Section */}
          {filteredTasks.length > 0 && (
            <div>
              <span className="px-2 text-[10px] font-bold text-[var(--ink-muted)] uppercase tracking-wider">
                Tasks
              </span>
              <div className="mt-1 space-y-1">
                {filteredTasks.map((task) => (
                  <button
                    key={task.id}
                    type="button"
                    onClick={() => {
                      try {
                        (onSelectTask as any)(task.id);
                      } catch {
                        (onSelectTask as any)(task);
                      }
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[var(--surface-hover)] text-left transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <CheckSquare className="h-3.5 w-3.5 text-[var(--accent-700)] shrink-0" />
                      <span className="truncate font-semibold text-[var(--ink)]">{task.title}</span>
                    </div>
                    <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-[var(--surface-sunken)] text-[var(--ink-muted)]">
                      {task.status.replace("_", " ")}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Projects Section */}
          {filteredProjects.length > 0 && (
            <div>
              <span className="px-2 text-[10px] font-bold text-[var(--ink-muted)] uppercase tracking-wider">
                Projects
              </span>
              <div className="mt-1 space-y-1">
                {filteredProjects.map((project) => (
                  <button
                    key={project.id}
                    type="button"
                    onClick={() => {
                      onSelectProject(project.id);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[var(--surface-hover)] text-left transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <FolderKanban className="h-3.5 w-3.5 text-[var(--accent-700)] shrink-0" />
                      <span className="truncate font-semibold text-[var(--ink)]">{project.name}</span>
                    </div>
                    <span className="text-[10px] text-[var(--ink-muted)] font-mono">
                      {project.progress}% Done
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Teammates Section */}
          {filteredMembers.length > 0 && (
            <div>
              <span className="px-2 text-[10px] font-bold text-[var(--ink-muted)] uppercase tracking-wider">
                Teammates
              </span>
              <div className="mt-1 space-y-1">
                {filteredMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[var(--surface-hover)] transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={member.avatarUrl}
                        alt={member.name}
                        className="h-5 w-5 rounded-full object-cover border border-[var(--line)]"
                      />
                      <span className="font-semibold text-[var(--ink)]">{member.name}</span>
                      <span className="text-[10px] text-[var(--ink-muted)]">({member.email})</span>
                    </div>
                    <span className="text-[10px] font-semibold text-[var(--accent-700)] uppercase">
                      {member.role.replace("_", " ")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 bg-[var(--surface-sunken)] border-t border-[var(--line)] flex items-center justify-between text-[11px] text-[var(--ink-muted)]">
          <span>Use &uarr; &darr; to navigate</span>
          <span className="font-mono">Press ESC to dismiss</span>
        </div>
      </div>
    </div>
  );
}
