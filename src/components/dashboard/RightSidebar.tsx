"use client";

import React, { useState } from "react";
import { MoreVertical, Plus, Sparkles } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface DeadlineItem {
  id: string;
  title: string;
  project: string;
  priority: "High" | "Medium" | "Low";
  dueDate: string;
  isToday?: boolean;
  avatar: string;
  avatarFallback: string;
}

interface ActivityItem {
  id: string;
  user: string;
  action: string;
  target: string;
  timeAgo: string;
  avatar: string;
  avatarFallback: string;
  highlightTarget?: boolean;
}

const deadlines: DeadlineItem[] = [
  {
    id: "d-1",
    title: "Design Homepage",
    project: "Website Redesign",
    priority: "High",
    dueDate: "Today",
    isToday: true,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    avatarFallback: "SK",
  },
  {
    id: "d-2",
    title: "API Integration",
    project: "Recruitment Platform",
    priority: "Medium",
    dueDate: "Tomorrow",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    avatarFallback: "AR",
  },
  {
    id: "d-3",
    title: "Create Mobile UI",
    project: "Mobile App",
    priority: "High",
    dueDate: "Sep 10",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
    avatarFallback: "BK",
  },
  {
    id: "d-4",
    title: "Write Documentation",
    project: "Backend",
    priority: "Low",
    dueDate: "Sep 12",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
    avatarFallback: "JD",
  },
];

const activities: ActivityItem[] = [
  {
    id: "a-1",
    user: "Sarah Khan",
    action: "completed task",
    target: "“Homepage Design”",
    timeAgo: "2 hours ago",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    avatarFallback: "SK",
  },
  {
    id: "a-2",
    user: "John Doe",
    action: "commented on",
    target: "“API Integration”",
    timeAgo: "3 hours ago",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
    avatarFallback: "JD",
  },
  {
    id: "a-3",
    user: "You",
    action: "assigned task to Ali Raza",
    target: "“Dashboard Development”",
    timeAgo: "5 hours ago",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    avatarFallback: "AR",
  },
  {
    id: "a-4",
    user: "Bilal Durani",
    action: "created project",
    target: "“Mobile App”",
    timeAgo: "1 day ago",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
    avatarFallback: "BD",
  },
  {
    id: "a-5",
    user: "Sarah Khan",
    action: "uploaded a file",
    target: "“design-mockup.fig”",
    timeAgo: "1 day ago",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    avatarFallback: "SK",
  },
];

export function RightSidebar() {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getPriorityBadge = (p: DeadlineItem["priority"]) => {
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
    <aside className="w-full lg:w-80 shrink-0 space-y-5">
      {/* 1. Upcoming Deadlines Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-sm text-slate-900 tracking-tight">
            Upcoming Deadlines
          </h3>
          <button
            type="button"
            className="text-xs font-semibold text-[#F95738] hover:underline"
          >
            View All
          </button>
        </div>

        <div className="space-y-3.5">
          {deadlines.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-2 p-1.5 rounded-xl hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <input
                  type="checkbox"
                  checked={checkedItems[item.id] || false}
                  onChange={() => toggleCheck(item.id)}
                  className="h-4 w-4 rounded-md border-slate-300 text-[#F95738] focus:ring-[#F95738] accent-[#F95738] cursor-pointer"
                />

                <Avatar className="h-7 w-7 shrink-0">
                  <AvatarImage src={item.avatar} alt={item.title} />
                  <AvatarFallback className="text-[10px]">
                    {item.avatarFallback}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0">
                  <h4
                    className={cn(
                      "text-xs font-bold text-slate-800 truncate leading-tight",
                      checkedItems[item.id] && "line-through text-slate-400"
                    )}
                  >
                    {item.title}
                  </h4>
                  <p className="text-[10px] text-slate-400 truncate">
                    {item.project}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span
                  className={cn(
                    "text-[9px] font-bold px-1.5 py-0.5 rounded-md",
                    getPriorityBadge(item.priority)
                  )}
                >
                  {item.priority}
                </span>
                <span
                  className={cn(
                    "text-[10px] font-semibold min-w-10 text-right",
                    item.isToday ? "text-[#F95738]" : "text-slate-400"
                  )}
                >
                  {item.dueDate}
                </span>
                <button type="button" className="text-slate-400 hover:text-slate-700 p-0.5">
                  <MoreVertical className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Recent Activity Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-sm text-slate-900 tracking-tight">
            Recent Activity
          </h3>
          <button
            type="button"
            className="text-xs font-semibold text-[#F95738] hover:underline"
          >
            View All
          </button>
        </div>

        <div className="space-y-4">
          {activities.map((act) => (
            <div
              key={act.id}
              className="flex items-start justify-between gap-3 text-xs"
            >
              <div className="flex items-start gap-2.5 min-w-0">
                <Avatar className="h-7 w-7 mt-0.5 shrink-0">
                  <AvatarImage src={act.avatar} alt={act.user} />
                  <AvatarFallback className="text-[10px]">
                    {act.avatarFallback}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0">
                  <p className="text-[11px] text-slate-600 leading-snug">
                    <strong className="text-slate-900 font-bold">{act.user}</strong>{" "}
                    {act.action}{" "}
                    <span className="font-semibold text-slate-800">{act.target}</span>
                  </p>
                  <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
                    {act.timeAgo}
                  </span>
                </div>
              </div>

              <button type="button" className="text-slate-400 hover:text-slate-700 p-0.5 shrink-0">
                <MoreVertical className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Bottom Stay Organized Banner */}
      <div className="rounded-2xl bg-gradient-to-br from-[#FFF8F5] via-[#FFF3EE] to-[#FFEBE2] p-5 border border-[#FFDEC $] shadow-xs relative overflow-hidden">
        <div className="relative z-10 max-w-[200px]">
          <h4 className="font-bold text-sm text-slate-900 leading-tight mb-1">
            Stay organized, work better!
          </h4>
          <p className="text-[11px] text-slate-600 leading-relaxed mb-4">
            Create your first project and start managing your tasks efficiently.
          </p>
          <button
            type="button"
            className="flex items-center gap-1.5 bg-[#F95738] hover:bg-[#e44a2c] text-white text-xs font-semibold px-3.5 py-2 rounded-xl shadow-xs transition-colors"
          >
            <Plus className="h-3.5 w-3.5" /> Create Project
          </button>
        </div>

        {/* Decorative illustration */}
        <div className="absolute -right-2 bottom-1 w-28 h-28 pointer-events-none opacity-90">
          <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="60" cy="60" r="50" fill="#FFE5D9" />
            <path d="M40 85C40 70 50 60 65 60C80 60 90 70 90 85" fill="#3B82F6" />
            <circle cx="65" cy="45" r="14" fill="#FBBF24" />
            <rect x="35" y="75" width="30" height="20" rx="3" fill="#1E293B" />
          </svg>
        </div>
      </div>
    </aside>
  );
}
