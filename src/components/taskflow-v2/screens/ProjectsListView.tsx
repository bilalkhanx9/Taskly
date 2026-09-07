"use client";

import React, { useState } from "react";
import { Project, User } from "@/types/taskflow-v2";
import { 
  FolderKanban, 
  Search, 
  Plus, 
  LayoutGrid, 
  List, 
  MoreHorizontal, 
  Calendar, 
  CheckCircle2, 
  Archive, 
  Trash2,
  ExternalLink,
  Users
} from "lucide-react";

interface ProjectsListViewProps {
  currentUser: User;
  projects: Project[];
  onSelectProject: (projectId: string) => void;
  onNewProject: () => void;
  onDeleteProject?: (projectId: string) => void;
}

export const ProjectsListView: React.FC<ProjectsListViewProps> = ({
  currentUser,
  projects,
  onSelectProject,
  onNewProject,
  onDeleteProject
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "archived" | "completed">("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const canCreate = currentUser.role === "WORKSPACE_OWNER" || currentUser.role === "MANAGER";

  const filteredProjects = projects.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" ? true : p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="w-full space-y-5">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--ink)]">Projects</h1>
          <p className="text-xs text-[var(--ink-muted)] mt-1">
            Organise, assign, and track company deliverables across your team.
          </p>
        </div>

        {canCreate && (
          <button
            onClick={onNewProject}
            className="h-[38px] px-4 bg-[var(--accent-700)] hover:bg-[var(--accent-800)] text-white font-medium text-xs rounded-lg flex items-center gap-2 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            New Project
          </button>
        )}
      </div>

      {/* Filter and View Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[var(--surface)] p-3 rounded-xl border border-[var(--line)]">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[var(--ink-faint)] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter projects by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-[var(--surface-sunken)] border border-[var(--line-strong)] rounded-lg text-xs text-[var(--ink)] focus:outline-none focus:border-[var(--accent-600)]"
          />
        </div>

        {/* Status Pills and Layout Switcher */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-1 bg-[var(--surface-sunken)] p-1 rounded-lg border border-[var(--line)]">
            {(["all", "active", "completed", "archived"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md capitalize transition-colors ${
                  statusFilter === tab 
                    ? "bg-[var(--surface)] text-[var(--ink)] shadow-xs" 
                    : "text-[var(--ink-muted)] hover:text-[var(--ink)]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex items-center border border-[var(--line-strong)] rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 transition-colors ${
                viewMode === "grid" ? "bg-[var(--surface-sunken)] text-[var(--ink)]" : "bg-[var(--surface)] text-[var(--ink-muted)]"
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 transition-colors ${
                viewMode === "list" ? "bg-[var(--surface-sunken)] text-[var(--ink)]" : "bg-[var(--surface)] text-[var(--ink-muted)]"
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Projects Display */}
      {filteredProjects.length === 0 ? (
        <div className="bg-[var(--surface)] border border-[var(--line)] rounded-xl p-12 text-center">
          <FolderKanban className="w-10 h-10 text-[var(--ink-faint)] mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-[var(--ink)]">No projects found</h3>
          <p className="text-xs text-[var(--ink-muted)] mt-1 max-w-sm mx-auto">
            {searchQuery ? "Try refining your search keyword." : "Get started by creating your team's first project."}
          </p>
          {canCreate && (
            <button
              onClick={onNewProject}
              className="mt-4 h-[32px] px-3.5 bg-[var(--accent-700)] text-white text-xs font-medium rounded-lg inline-flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              Create Project
            </button>
          )}
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.map((p) => {
            const total = p.taskCount ?? p.totalTasks ?? 0;
            const completed = p.completedTaskCount ?? p.completedTasks ?? 0;
            const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
            return (
              <div
                key={p.id}
                className="bg-[var(--surface)] border border-[var(--line)] rounded-xl p-5 hover:border-[var(--accent-600)] hover:shadow-sm transition-all flex flex-col justify-between relative group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div 
                      onClick={() => onSelectProject(p.id)}
                      className="flex items-center gap-2.5 cursor-pointer flex-1 min-w-0"
                    >
                      <span 
                        className="w-3.5 h-3.5 rounded-sm flex-shrink-0"
                        style={{ backgroundColor: p.color }}
                      />
                      <h3 className="text-sm font-bold text-[var(--ink)] group-hover:text-[var(--accent-700)] transition-colors truncate">
                        {p.name}
                      </h3>
                    </div>

                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenuId(activeMenuId === p.id ? null : p.id);
                        }}
                        className="p-1 rounded text-[var(--ink-muted)] hover:text-[var(--ink)] hover:bg-[var(--surface-sunken)]"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>

                      {activeMenuId === p.id && (
                        <div 
                          onClick={(e) => e.stopPropagation()}
                          className="absolute right-0 top-full mt-1 w-36 bg-[var(--surface)] border border-[var(--line-strong)] rounded-lg shadow-lg py-1 z-20 text-xs"
                        >
                          <button
                            onClick={() => {
                              setActiveMenuId(null);
                              onSelectProject(p.id);
                            }}
                            className="w-full px-3 py-1.5 text-left text-[var(--ink)] hover:bg-[var(--surface-hover)] flex items-center gap-2"
                          >
                            <ExternalLink className="w-3.5 h-3.5 text-[var(--ink-muted)]" />
                            Open Board
                          </button>
                          {canCreate && (
                            <button
                              onClick={() => {
                                setActiveMenuId(null);
                                if (onDeleteProject) onDeleteProject(p.id);
                              }}
                              className="w-full px-3 py-1.5 text-left text-red-600 hover:bg-red-50 flex items-center gap-2"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Delete Project
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-[var(--ink-muted)] line-clamp-2 mb-4 leading-relaxed">
                    {p.description}
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-[var(--line)]">
                  <div className="flex items-center justify-between text-xs text-[var(--ink-muted)]">
                    <span>{p.completedTaskCount}/{p.taskCount} tasks done</span>
                    <span className="font-semibold text-[var(--ink)]">{percent}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[var(--surface-sunken)] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{ width: `${percent}%`, backgroundColor: p.color }}
                    />
                  </div>
                  <div className="flex items-center justify-between pt-1 text-[11px] text-[var(--ink-faint)]">
                    <div className="flex -space-x-1.5">
                      {p.members.slice(0, 4).map((m, idx) => (
                        <img
                          key={idx}
                          src={m.avatarUrl}
                          alt={m.name}
                          className="w-5 h-5 rounded-full border border-white object-cover"
                          title={m.name}
                        />
                      ))}
                    </div>
                    <span className="flex items-center gap-1 font-medium text-[var(--ink-body)]">
                      <Calendar className="w-3 h-3 text-[var(--ink-muted)]" /> {p.deadline}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="bg-[var(--surface)] border border-[var(--line)] rounded-xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-[var(--surface-sunken)] text-[var(--ink-muted)] border-b border-[var(--line)] uppercase tracking-wider font-semibold text-[10px]">
              <tr>
                <th className="py-3 px-4">Project</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Progress</th>
                <th className="py-3 px-4">Team</th>
                <th className="py-3 px-4">Deadline</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--line)]">
              {filteredProjects.map((p) => {
                const total = p.taskCount ?? p.totalTasks ?? 0;
                const completed = p.completedTaskCount ?? p.completedTasks ?? 0;
                const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
                return (
                  <tr 
                    key={p.id}
                    onClick={() => onSelectProject(p.id)}
                    className="hover:bg-[var(--surface-hover)] cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4 font-semibold text-[var(--ink)] flex items-center gap-2.5">
                      <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: p.color }} />
                      <span>{p.name}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="capitalize px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 w-48">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-[var(--surface-sunken)] rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${percent}%`, backgroundColor: p.color }} />
                        </div>
                        <span className="text-[11px] font-medium text-[var(--ink-muted)]">{percent}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex -space-x-1">
                        {p.members.slice(0, 3).map((m, idx) => (
                          <img key={idx} src={m.avatarUrl} alt={m.name} className="w-5 h-5 rounded-full border border-white" />
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[var(--ink-body)]">{p.deadline}</td>
                    <td className="py-3 px-4 text-right">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectProject(p.id);
                        }}
                        className="px-2.5 py-1 bg-[var(--surface-sunken)] hover:bg-[var(--line)] rounded text-xs text-[var(--ink)] font-medium"
                      >
                        Open
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
