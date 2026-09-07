"use client";

import React from "react";
import { FolderCheck, Users, Tag, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickStatItem {
  id: string;
  label: string;
  value: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
}

const quickStats: QuickStatItem[] = [
  {
    id: "qs-1",
    label: "Active Projects",
    value: "4",
    icon: FolderCheck,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-500",
  },
  {
    id: "qs-2",
    label: "Team Members",
    value: "8",
    icon: Users,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-500",
  },
  {
    id: "qs-3",
    label: "Total Tags",
    value: "12",
    icon: Tag,
    iconBg: "bg-purple-50",
    iconColor: "text-purple-500",
  },
  {
    id: "qs-4",
    label: "Time Tracked Today",
    value: "5h 32m",
    icon: Clock,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-500",
  },
];

export function QuickStatsSection() {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
      <h3 className="font-bold text-sm text-slate-900 tracking-tight mb-3">
        Quick Stats
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {quickStats.map((qs) => {
          const Icon = qs.icon;
          return (
            <div
              key={qs.id}
              className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-[#F8FAFC]/50 hover:bg-slate-50 transition-colors"
            >
              <div
                className={cn(
                  "h-9 w-9 rounded-xl flex items-center justify-center shrink-0",
                  qs.iconBg,
                  qs.iconColor
                )}
              >
                <Icon className="h-4 w-4 stroke-[2.2]" />
              </div>

              <div>
                <span className="text-[10px] text-slate-400 font-medium block">
                  {qs.label}
                </span>
                <span className="text-sm font-bold text-slate-900 font-mono">
                  {qs.value}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
