"use client";

import React from "react";
import { Project, Task } from "@/types/taskflow";
import { Plus, FolderKanban, Calendar, Users, CheckCircle2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProjectsViewProps {
  projects: Project[];
  tasks: Task[];
  onProjectClick: (projectId: string) => void;
  onNewProjectClick: () => void;
}

export function ProjectsView({
  projects,
  tasks,
  onProjectClick,
  onNewProjectClick,
}: ProjectsViewProps) {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-[#1F2A2E]">Workspace Projects</h2>
          <p className="text-xs text-[#6B7A80]">
            Manage all internal and client projects, deadlines, and team members.
          </p>
        </div>

        <button
          type="button"
          onClick={onNewProjectClick}
          className="flex items-center gap-1.5 bg-[#0F766E] hover:bg-[#0C5F58] text-white text-xs font-semibold px-3.5 py-2 rounded-md shadow-xs transition-all active:scale-95"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>New Project</span>
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {projects.map((proj) => {
          const projTasks = tasks.filter((t) => t.projectId === proj.id);
          const completedCount = projTasks.filter((t) => t.status === "done").length;
          const inProgressCount = projTasks.filter((t) => t.status === "in_progress").length;

          return (
            <div
              key={proj.id}
              onClick={() => onProjectClick(proj.id)}
              className="bg-white rounded-lg border border-[#E3E8E6] p-5 shadow-2xs hover:border-[#CBD4D1] cursor-pointer flex flex-col justify-between space-y-4 transition-all"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-3.5 w-3.5 rounded-full"
                      style={{ backgroundColor: proj.color }}
                    />
                    <h3 className="font-bold text-sm text-[#1F2A2E]">{proj.name}</h3>
                  </div>
                  <span className="text-[10px] font-semibold text-[#0F766E] bg-[#E6F2F0] px-2 py-0.5 rounded-full uppercase">
                    {proj.status}
                  </span>
                </div>

                <p className="text-xs text-[#6B7A80] line-clamp-2 leading-relaxed">
                  {proj.description || "No project description provided."}
                </p>
              </div>

              {/* Progress & Task Breakdown */}
              <div className="space-y-2 border-t border-[#EFF2F1] pt-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#6B7A80] font-medium">Progress</span>
                  <span className="font-bold text-[#1F2A2E] font-mono">{proj.progress}%</span>
                </div>

                <div className="w-full h-1.5 rounded-full bg-[#EFF2F1] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${proj.progress}%`,
                      backgroundColor: proj.color,
                    }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#6B7A80] pt-1">
                  <span>{completedCount} Done • {inProgressCount} In Progress</span>
                  <span>{projTasks.length} Total</span>
                </div>
              </div>

              {/* Members & Deadline */}
              <div className="flex items-center justify-between border-t border-[#EFF2F1] pt-3">
                <div className="flex -space-x-1.5 overflow-hidden">
                  {proj.members.map((m) => (
                    <Avatar key={m.id} className="h-6 w-6 border-2 border-white shadow-2xs">
                      <AvatarImage src={m.avatarUrl} alt={m.name} />
                      <AvatarFallback className="text-[9px] bg-[#E6F2F0] text-[#0F766E] font-bold">
                        {m.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                </div>

                {proj.deadline && (
                  <span className="text-[11px] font-mono text-[#6B7A80] flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Due {proj.deadline}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
