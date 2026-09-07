"use client";

import React from "react";
import { Task, Project, User } from "@/types/taskflow-v2";
import { 
  BarChart3, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  PieChart,
  Calendar
} from "lucide-react";

interface ReportsViewProps {
  tasks: Task[];
  projects: Project[];
  members: User[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  tasks,
  projects,
  members
}) => {
  const totalTasks = tasks.length;
  const doneTasks = tasks.filter(t => t.status === "done").length;
  const inProgressTasks = tasks.filter(t => t.status === "in_progress" || t.status === "in_review").length;
  const todoTasks = tasks.filter(t => t.status === "todo").length;
  const backlogTasks = tasks.filter(t => t.status === "backlog").length;

  const urgentTasks = tasks.filter(t => t.priority === "urgent").length;
  const highTasks = tasks.filter(t => t.priority === "high").length;
  const mediumTasks = tasks.filter(t => t.priority === "medium").length;
  const lowTasks = tasks.filter(t => t.priority === "low").length;

  // Velocity data (tasks delivered over past 4 weeks)
  const weeklyVelocity = [
    { week: "Week 1", count: 8, height: "65%" },
    { week: "Week 2", count: 12, height: "85%" },
    { week: "Week 3", count: 10, height: "75%" },
    { week: "Week 4", count: 14, height: "95%" }
  ];

  return (
    <div className="w-full space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--ink)]">Workspace Analytics &amp; Reports</h1>
        <p className="text-xs text-[var(--ink-muted)] mt-1">
          Monitor velocity, throughput, workload capacity, and status distribution across all projects.
        </p>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[var(--surface)] p-4 rounded-xl border border-[var(--line)] shadow-2xs">
          <div className="text-xs text-[var(--ink-muted)] mb-1">Total Throughput</div>
          <div className="text-2xl font-bold text-[var(--ink)]">{doneTasks}</div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +18% vs last month
          </div>
        </div>

        <div className="bg-[var(--surface)] p-4 rounded-xl border border-[var(--line)] shadow-2xs">
          <div className="text-xs text-[var(--ink-muted)] mb-1">Active Pipeline</div>
          <div className="text-2xl font-bold text-[var(--ink)]">{inProgressTasks}</div>
          <div className="text-[11px] text-[var(--ink-muted)] mt-1">In progress &amp; review</div>
        </div>

        <div className="bg-[var(--surface)] p-4 rounded-xl border border-[var(--line)] shadow-2xs">
          <div className="text-xs text-[var(--ink-muted)] mb-1">Completion Rate</div>
          <div className="text-2xl font-bold text-[var(--ink)]">
            {totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0}%
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">Healthy delivery pace</div>
        </div>

        <div className="bg-[var(--surface)] p-4 rounded-xl border border-[var(--line)] shadow-2xs">
          <div className="text-xs text-[var(--ink-muted)] mb-1">Urgent Queue</div>
          <div className="text-2xl font-bold text-red-700">{urgentTasks}</div>
          <div className="text-[11px] text-red-600 font-medium mt-1">High priority tasks</div>
        </div>
      </div>

      {/* Velocity & Status Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Weekly Velocity Chart */}
        <div className="bg-[var(--surface)] p-5 rounded-xl border border-[var(--line)] shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[var(--accent-700)]" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--ink)]">
                Sprint Velocity (Completed Tasks)
              </h2>
            </div>
            <span className="text-[11px] text-[var(--ink-muted)] font-mono">Last 30 Days</span>
          </div>

          <div className="h-48 flex items-end justify-between gap-4 pt-4 px-2 border-b border-[var(--line)]">
            {weeklyVelocity.map((w, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <div className="text-[11px] font-bold text-[var(--ink)] group-hover:text-[var(--accent-700)]">
                  {w.count}
                </div>
                <div 
                  className="w-full max-w-[48px] bg-orange-100 group-hover:bg-[var(--accent-700)] rounded-t-md transition-colors"
                  style={{ height: w.height }}
                />
                <span className="text-[10px] font-semibold text-[var(--ink-muted)]">{w.week}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Task Status Distribution */}
        <div className="bg-[var(--surface)] p-5 rounded-xl border border-[var(--line)] shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <PieChart className="w-4 h-4 text-[var(--accent-700)]" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--ink)]">
                Status Distribution
              </h2>
            </div>
            <span className="text-[11px] text-[var(--ink-muted)]">{totalTasks} Total</span>
          </div>

          <div className="space-y-3 pt-2">
            {[
              { label: "Done", count: doneTasks, color: "bg-emerald-600" },
              { label: "In Progress & Review", count: inProgressTasks, color: "bg-blue-600" },
              { label: "To Do", count: todoTasks, color: "bg-stone-600" },
              { label: "Backlog", count: backlogTasks, color: "bg-stone-400" },
            ].map((st, i) => {
              const pct = totalTasks > 0 ? Math.round((st.count / totalTasks) * 100) : 0;
              return (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-[var(--ink)]">{st.label}</span>
                    <span className="text-[var(--ink-muted)]">{st.count} ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 bg-[var(--surface-sunken)] rounded-full overflow-hidden">
                    <div className={`h-full ${st.color} rounded-full`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Workload Capacity Breakdown by Teammate */}
      <div className="bg-[var(--surface)] p-5 rounded-xl border border-[var(--line)] shadow-2xs">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--ink)] mb-4">
          Individual Workload Distribution
        </h2>
        <div className="space-y-3">
          {members.map((m) => {
            const memberTasks = tasks.filter(t => t.assignee?.id === m.id);
            const memberDone = memberTasks.filter(t => t.status === "done").length;
            const memberOpen = memberTasks.length - memberDone;

            return (
              <div key={m.id} className="flex items-center justify-between text-xs py-2 border-b border-[var(--line)] last:border-0">
                <div className="flex items-center gap-2.5 w-1/3">
                  <img src={m.avatarUrl} alt="" className="w-7 h-7 rounded-full border border-white object-cover" />
                  <div>
                    <div className="font-semibold text-[var(--ink)]">{m.name}</div>
                    <div className="text-[10px] text-[var(--ink-muted)]">{m.designation}</div>
                  </div>
                </div>

                <div className="flex-1 mx-4">
                  <div className="w-full h-1.5 bg-[var(--surface-sunken)] rounded-full overflow-hidden flex">
                    <div 
                      className="h-full bg-emerald-600" 
                      style={{ width: `${memberTasks.length > 0 ? (memberDone / memberTasks.length) * 100 : 0}%` }} 
                      title={`${memberDone} done`}
                    />
                    <div 
                      className="h-full bg-blue-500" 
                      style={{ width: `${memberTasks.length > 0 ? (memberOpen / memberTasks.length) * 100 : 0}%` }} 
                      title={`${memberOpen} open`}
                    />
                  </div>
                </div>

                <div className="text-right text-[11px] text-[var(--ink-muted)] w-28">
                  <strong className="text-[var(--ink)]">{memberDone}</strong> done / <strong className="text-[var(--ink)]">{memberOpen}</strong> open
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
