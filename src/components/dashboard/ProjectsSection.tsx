"use client";

import React from "react";
import { CheckCircle2, Users, Smartphone, Send, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProjectItem {
  id: string;
  name: string;
  category: string;
  tasksCount: number;
  membersCount: number;
  progress: number;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  progressColor: string;
  status: string;
}

const projects: ProjectItem[] = [
  {
    id: "p-1",
    name: "Website Redesign",
    category: "Website",
    tasksCount: 24,
    membersCount: 8,
    progress: 65,
    icon: CheckCircle2,
    iconBg: "bg-emerald-500",
    iconColor: "text-white",
    progressColor: "bg-emerald-500",
    status: "Active",
  },
  {
    id: "p-2",
    name: "Recruitment Platform",
    category: "Recruitment",
    tasksCount: 42,
    membersCount: 6,
    progress: 35,
    icon: Users,
    iconBg: "bg-indigo-600",
    iconColor: "text-white",
    progressColor: "bg-indigo-600",
    status: "Active",
  },
  {
    id: "p-3",
    name: "Mobile App",
    category: "Mobile",
    tasksCount: 18,
    membersCount: 4,
    progress: 20,
    icon: Smartphone,
    iconBg: "bg-[#F95738]",
    iconColor: "text-white",
    progressColor: "bg-blue-500",
    status: "Active",
  },
  {
    id: "p-4",
    name: "Marketing Campaign",
    category: "Marketing",
    tasksCount: 12,
    membersCount: 3,
    progress: 80,
    icon: Send,
    iconBg: "bg-purple-600",
    iconColor: "text-white",
    progressColor: "bg-emerald-500",
    status: "Active",
  },
];

export function ProjectsSection() {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-sm text-slate-900 tracking-tight">
          Projects
        </h3>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="text-xs font-semibold text-[#F95738] hover:underline"
          >
            View All
          </button>
          <button
            type="button"
            className="flex items-center gap-1 bg-[#F95738] hover:bg-[#e44a2c] text-white text-xs font-semibold px-3 py-1.5 rounded-xl shadow-xs transition-colors"
          >
            <Plus className="h-3.5 w-3.5" /> New Project
          </button>
        </div>
      </div>

      {/* Projects List */}
      <div className="space-y-3.5">
        {projects.map((proj) => {
          const Icon = proj.icon;
          return (
            <div
              key={proj.id}
              className="flex items-center justify-between gap-4 p-2 rounded-xl hover:bg-slate-50/80 transition-colors"
            >
              {/* Project Icon & Titles */}
              <div className="flex items-center gap-3.5 min-w-0">
                <div
                  className={cn(
                    "h-10 w-10 rounded-xl flex items-center justify-center shrink-0 shadow-xs",
                    proj.iconBg,
                    proj.iconColor
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-800 truncate">
                    {proj.name}
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    {proj.category}
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium">
                    {proj.tasksCount} tasks • {proj.membersCount} members
                  </p>
                </div>
              </div>

              {/* Progress & Badge */}
              <div className="flex items-center gap-4 shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-20 sm:w-28 h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={cn("h-full rounded-full transition-all", proj.progressColor)}
                      style={{ width: `${proj.progress}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-700 min-w-8 font-mono">
                    {proj.progress}%
                  </span>
                </div>

                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-md">
                  {proj.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
