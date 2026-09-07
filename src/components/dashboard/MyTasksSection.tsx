"use client";

import React, { useState } from "react";
import { MoreVertical } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface TaskItem {
  id: string;
  title: string;
  project: string;
  priority: "High" | "Medium" | "Low";
  dueDate: string;
  isToday?: boolean;
  avatar: string;
  avatarFallback: string;
  completed?: boolean;
}

const initialTasks: TaskItem[] = [
  {
    id: "t-1",
    title: "Design landing page",
    project: "Website Redesign",
    priority: "High",
    dueDate: "Today",
    isToday: true,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    avatarFallback: "SK",
  },
  {
    id: "t-2",
    title: "Fix authentication issue",
    project: "Recruitment Platform",
    priority: "Medium",
    dueDate: "Tomorrow",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    avatarFallback: "AR",
  },
  {
    id: "t-3",
    title: "Review candidate flow",
    project: "Recruitment Platform",
    priority: "Low",
    dueDate: "Sep 10",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
    avatarFallback: "JD",
  },
  {
    id: "t-4",
    title: "Create API endpoints",
    project: "Backend",
    priority: "High",
    dueDate: "Sep 12",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
    avatarFallback: "BK",
  },
  {
    id: "t-5",
    title: "Mobile app wireframes",
    project: "Mobile App",
    priority: "Medium",
    dueDate: "Sep 15",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80",
    avatarFallback: "MA",
  },
];

export function MyTasksSection() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [tasks, setTasks] = useState<TaskItem[]>(initialTasks);

  const filters = [
    { label: "All", count: 8 },
    { label: "Today", count: 3 },
    { label: "Upcoming", count: 4 },
    { label: "Overdue", count: 1 },
  ];

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const getPriorityBadge = (p: TaskItem["priority"]) => {
    switch (p) {
      case "High":
        return "bg-rose-50 text-rose-600 border border-rose-100";
      case "Medium":
        return "bg-amber-50 text-amber-600 border border-amber-100";
      case "Low":
        return "bg-emerald-50 text-emerald-600 border border-emerald-100";
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-sm text-slate-900 tracking-tight">
            My Tasks
          </h3>
          <button
            type="button"
            className="text-xs font-semibold text-[#F95738] hover:underline"
          >
            View All
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1">
          {filters.map((f) => {
            const isActive = activeFilter === f.label;
            return (
              <button
                key={f.label}
                type="button"
                onClick={() => setActiveFilter(f.label)}
                className={cn(
                  "px-3 py-1 rounded-xl text-xs font-semibold transition-all whitespace-nowrap",
                  isActive
                    ? "bg-[#F95738] text-white shadow-xs"
                    : "bg-[#F8FAFC] text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                )}
              >
                {f.label} ({f.count})
              </button>
            );
          })}
        </div>

        {/* Task Items List */}
        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-slate-50/80 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Custom Checkbox */}
                <input
                  type="checkbox"
                  checked={task.completed || false}
                  onChange={() => toggleTask(task.id)}
                  className="h-4 w-4 rounded-md border-slate-300 text-[#F95738] focus:ring-[#F95738] accent-[#F95738] cursor-pointer"
                />

                <div className="min-w-0">
                  <span
                    className={cn(
                      "text-xs font-bold text-slate-800 truncate block leading-tight",
                      task.completed && "line-through text-slate-400"
                    )}
                  >
                    {task.title}
                  </span>
                  <span className="text-[11px] text-slate-400 block">
                    {task.project}
                  </span>
                </div>
              </div>

              {/* Priority & Due Date & Avatar */}
              <div className="flex items-center gap-4 shrink-0">
                <span
                  className={cn(
                    "text-[10px] font-bold px-2 py-0.5 rounded-md",
                    getPriorityBadge(task.priority)
                  )}
                >
                  {task.priority}
                </span>

                <span
                  className={cn(
                    "text-[11px] font-medium min-w-16 text-right",
                    task.isToday ? "text-[#F95738] font-bold" : "text-slate-400"
                  )}
                >
                  {task.dueDate}
                </span>

                <Avatar className="h-6 w-6">
                  <AvatarImage src={task.avatar} alt={task.title} />
                  <AvatarFallback className="text-[9px] bg-slate-100 text-slate-700">
                    {task.avatarFallback}
                  </AvatarFallback>
                </Avatar>

                <button
                  type="button"
                  aria-label="More options"
                  className="text-slate-400 hover:text-slate-700 p-1"
                >
                  <MoreVertical className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
