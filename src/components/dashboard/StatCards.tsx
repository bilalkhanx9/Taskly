"use client";

import React from "react";
import { Calendar, Clock, CheckCircle2, AlertTriangle, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatItem {
  title: string;
  value: string;
  trend: string;
  isPositive: boolean;
  subtitle: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
}

export function StatCards() {
  const stats: StatItem[] = [
    {
      title: "Total Tasks",
      value: "48",
      trend: "↑ 12%",
      isPositive: true,
      subtitle: "vs last week",
      icon: Calendar,
      iconBg: "bg-indigo-50",
      iconColor: "text-indigo-600",
    },
    {
      title: "In Progress",
      value: "18",
      trend: "↑ 8%",
      isPositive: true,
      subtitle: "vs last week",
      icon: Clock,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-500",
    },
    {
      title: "Completed",
      value: "24",
      trend: "↑ 20%",
      isPositive: true,
      subtitle: "vs last week",
      icon: CheckCircle2,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-500",
    },
    {
      title: "Overdue",
      value: "6",
      trend: "↓ 2%",
      isPositive: false,
      subtitle: "vs last week",
      icon: AlertTriangle,
      iconBg: "bg-rose-50",
      iconColor: "text-[#F95738]",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.title}
            className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex items-center justify-between transition-all hover:shadow-md"
          >
            <div className="flex items-center gap-4">
              <div
                className={cn(
                  "h-12 w-12 rounded-2xl flex items-center justify-center shrink-0",
                  stat.iconBg,
                  stat.iconColor
                )}
              >
                <Icon className="h-6 w-6 stroke-[2]" />
              </div>

              <div>
                <span className="text-xs font-medium text-slate-400 block mb-1">
                  {stat.title}
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-slate-900 tracking-tight">
                    {stat.value}
                  </span>
                  <span
                    className={cn(
                      "text-xs font-semibold flex items-center gap-0.5",
                      stat.isPositive ? "text-emerald-500" : "text-[#F95738]"
                    )}
                  >
                    {stat.trend}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-medium">
                  {stat.subtitle}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
