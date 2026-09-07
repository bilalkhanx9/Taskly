"use client";

import React from "react";
import {
  Calendar,
  AlertTriangle,
  Clock,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  FolderKanban,
  MoreVertical,
} from "lucide-react";
import { Project, Task, ActivityLogItem } from "@/types/taskflow";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { cn } from "@/lib/utils";

interface DashboardViewProps {
  projects: Project[];
  tasks: Task[];
  activityLogs: ActivityLogItem[];
  onTaskClick: (task: Task) => void;
  onProjectClick: (projectId: string) => void;
  onNavigateToTab: (tab: any) => void;
}

export function DashboardView({
  projects,
  tasks,
  activityLogs,
  onTaskClick,
  onProjectClick,
  onNavigateToTab,
}: DashboardViewProps) {
  // Compute Key Metrics
  const dueTodayTasks = tasks.filter((t) => t.dueDate === "2026-09-07" && t.status !== "done");
  const overdueTasks = tasks.filter((t) => t.status !== "done" && t.dueDate && t.dueDate < "2026-09-07");
  const inProgressTasks = tasks.filter((t) => t.status === "in_progress");
  const completedTasks = tasks.filter((t) => t.status === "done");

  const statusDonutData = [
    { name: "Backlog", value: tasks.filter((t) => t.status === "backlog").length, color: "#6B7A80" },
    { name: "To Do", value: tasks.filter((t) => t.status === "todo").length, color: "#475467" },
    { name: "In Progress", value: tasks.filter((t) => t.status === "in_progress").length, color: "#B45309" },
    { name: "In Review", value: tasks.filter((t) => t.status === "in_review").length, color: "#6941C6" },
    { name: "Done", value: completedTasks.length, color: "#15803D" },
  ];

  const upcomingDeadlines = tasks
    .filter((t) => t.status !== "done" && t.dueDate)
    .sort((a, b) => (a.dueDate! > b.dueDate! ? 1 : -1))
    .slice(0, 5);

  const priorityStyles: Record<string, { bg: string; text: string }> = {
    urgent: { bg: "bg-[#C0342B]/10", text: "text-[#C0342B]" },
    high: { bg: "bg-[#D97706]/10", text: "text-[#D97706]" },
    medium: { bg: "bg-[#2E7CD6]/10", text: "text-[#2E7CD6]" },
    low: { bg: "bg-[#8B98A0]/10", text: "text-[#8B98A0]" },
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Due Today */}
        <div className="bg-white rounded-lg p-4 border border-[#E3E8E6] shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs text-[#6B7A80] font-medium block mb-1">
              Tasks Due Today
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-[#1F2A2E] tabular-nums">
                {dueTodayTasks.length}
              </span>
              <span className="text-[11px] font-semibold text-[#0F766E]">Ready to tackle</span>
            </div>
          </div>
          <div className="h-10 w-10 rounded-lg bg-[#E6F2F0] text-[#0F766E] flex items-center justify-center">
            <Calendar className="h-5 w-5" />
          </div>
        </div>

        {/* Overdue */}
        <div className="bg-white rounded-lg p-4 border border-[#E3E8E6] shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs text-[#6B7A80] font-medium block mb-1">
              Overdue Count
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-[#C0342B] tabular-nums">
                {overdueTasks.length}
              </span>
              <span className="text-[11px] font-semibold text-[#C0342B]">Needs Attention</span>
            </div>
          </div>
          <div className="h-10 w-10 rounded-lg bg-rose-50 text-[#C0342B] flex items-center justify-center">
            <AlertTriangle className="h-5 w-5" />
          </div>
        </div>

        {/* In Progress */}
        <div className="bg-white rounded-lg p-4 border border-[#E3E8E6] shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs text-[#6B7A80] font-medium block mb-1">
              In Progress
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-[#1F2A2E] tabular-nums">
                {inProgressTasks.length}
              </span>
              <span className="text-[11px] font-semibold text-[#B45309]">Active Sprints</span>
            </div>
          </div>
          <div className="h-10 w-10 rounded-lg bg-amber-50 text-[#B45309] flex items-center justify-center">
            <Clock className="h-5 w-5" />
          </div>
        </div>

        {/* Completed */}
        <div className="bg-white rounded-lg p-4 border border-[#E3E8E6] shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs text-[#6B7A80] font-medium block mb-1">
              Completed Tasks
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-[#15803D] tabular-nums">
                {completedTasks.length}
              </span>
              <span className="text-[11px] font-semibold text-[#15803D]">Great pace!</span>
            </div>
          </div>
          <div className="h-10 w-10 rounded-lg bg-emerald-50 text-[#15803D] flex items-center justify-center">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Row 2: Projects Progress (Left) + Donut Distribution (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Project Progress Bars (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-lg p-5 border border-[#E3E8E6] shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-[#1F2A2E]">Project Progress</h3>
            <button
              type="button"
              onClick={() => onNavigateToTab("projects")}
              className="text-xs font-semibold text-[#0F766E] hover:underline"
            >
              View All Projects
            </button>
          </div>

          <div className="space-y-4">
            {projects.map((proj) => (
              <div
                key={proj.id}
                onClick={() => onProjectClick(proj.id)}
                className="p-3 rounded-lg border border-[#E3E8E6] hover:bg-[#F6F8F7] cursor-pointer transition-colors space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: proj.color }}
                    />
                    <h4 className="text-xs font-bold text-[#1F2A2E]">{proj.name}</h4>
                    <span className="text-[10px] text-[#6B7A80] font-medium uppercase">
                      {proj.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-semibold text-[#3D4A4F]">
                    <span className="tabular-nums font-mono">{proj.progress}%</span>
                    <span className="text-[11px] text-[#6B7A80]">
                      ({proj.completedTasks}/{proj.totalTasks} Tasks)
                    </span>
                  </div>
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
              </div>
            ))}
          </div>
        </div>

        {/* Task Status Donut Distribution (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-lg p-5 border border-[#E3E8E6] shadow-2xs flex flex-col justify-between">
          <h3 className="text-sm font-bold text-[#1F2A2E] mb-2">Task Distribution</h3>

          <div className="relative h-40 w-full flex items-center justify-center my-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDonutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={46}
                  outerRadius={64}
                  paddingAngle={3}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {statusDonutData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-bold text-[#1F2A2E] tabular-nums">
                {tasks.length}
              </span>
              <span className="text-[10px] text-[#6B7A80]">Total Tasks</span>
            </div>
          </div>

          <div className="space-y-1.5 pt-3 border-t border-[#E3E8E6] text-xs">
            {statusDonutData.map((s) => (
              <div key={s.name} className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
                  <span className="text-[#3D4A4F]">{s.name}</span>
                </div>
                <span className="font-bold text-[#1F2A2E] font-mono tabular-nums">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: Upcoming Deadlines + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Deadlines */}
        <div className="bg-white rounded-lg p-5 border border-[#E3E8E6] shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-[#1F2A2E]">Upcoming Deadlines</h3>
            <button
              type="button"
              onClick={() => onNavigateToTab("calendar")}
              className="text-xs font-semibold text-[#0F766E] hover:underline"
            >
              Open Calendar
            </button>
          </div>

          <div className="space-y-2.5">
            {upcomingDeadlines.map((task) => {
              const priority = priorityStyles[task.priority] || priorityStyles.medium;
              const isOverdue = task.dueDate && task.dueDate < "2026-09-07";
              return (
                <div
                  key={task.id}
                  onClick={() => onTaskClick(task)}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-[#E3E8E6] hover:bg-[#F6F8F7] cursor-pointer transition-colors"
                >
                  <div className="min-w-0 pr-3">
                    <h4 className="text-xs font-bold text-[#1F2A2E] truncate">{task.title}</h4>
                    <span className="text-[10px] text-[#6B7A80] block">
                      {task.subtasks.length > 0
                        ? `${task.subtasks.filter((s) => s.isCompleted).length}/${task.subtasks.length} subtasks done`
                        : "No subtasks"}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded uppercase",
                        priority.bg,
                        priority.text
                      )}
                    >
                      {task.priority}
                    </span>
                    <span
                      className={cn(
                        "text-xs font-mono font-medium",
                        isOverdue ? "text-[#C0342B] font-bold" : "text-[#6B7A80]"
                      )}
                    >
                      {task.dueDate}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity Log Feed */}
        <div className="bg-white rounded-lg p-5 border border-[#E3E8E6] shadow-2xs">
          <h3 className="text-sm font-bold text-[#1F2A2E] mb-4">Recent Activity</h3>
          <div className="space-y-3.5">
            {activityLogs.map((act) => (
              <div key={act.id} className="flex items-start gap-3 text-xs">
                <Avatar className="h-7 w-7 mt-0.5 shrink-0 border border-[#E3E8E6]">
                  <AvatarImage src={act.user.avatarUrl} alt={act.user.name} />
                  <AvatarFallback className="text-[9px] bg-[#E6F2F0] text-[#0F766E] font-bold">
                    {act.user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-[#3D4A4F] leading-snug">
                    <strong className="text-[#1F2A2E] font-semibold">{act.user.name}</strong>{" "}
                    {act.details}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5 text-[10px] text-[#6B7A80]">
                    {act.projectName && <span>in {act.projectName}</span>}
                    <span>•</span>
                    <span>{act.createdAt}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
