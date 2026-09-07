"use client";

import React, { useState } from "react";
import { Task, Project } from "@/types/taskflow";
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface CalendarViewProps {
  tasks: Task[];
  projects: Project[];
  onTaskClick: (task: Task) => void;
  onQuickAddDate: (dateStr: string) => void;
}

export function CalendarView({
  tasks,
  projects,
  onTaskClick,
  onQuickAddDate,
}: CalendarViewProps) {
  const [currentMonth] = useState("September 2026");

  // September 2026 days (30 days, starts on Tuesday)
  const daysInMonth = 30;
  const startDayOffset = 2; // Tuesday

  const daysArray = Array.from({ length: 35 }, (_, i) => {
    const dayNum = i - startDayOffset + 1;
    if (dayNum > 0 && dayNum <= daysInMonth) {
      const dateStr = `2026-09-${String(dayNum).padStart(2, "0")}`;
      const dayTasks = tasks.filter((t) => t.dueDate === dateStr);
      return { dayNum, dateStr, tasks: dayTasks, isCurrentMonth: true };
    }
    return { dayNum: null, dateStr: "", tasks: [], isCurrentMonth: false };
  });

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const priorityColors: Record<string, string> = {
    urgent: "border-l-[#C0342B] bg-[#C0342B]/5 text-[#C0342B]",
    high: "border-l-[#D97706] bg-[#D97706]/5 text-[#D97706]",
    medium: "border-l-[#2E7CD6] bg-[#2E7CD6]/5 text-[#2E7CD6]",
    low: "border-l-[#8B98A0] bg-[#8B98A0]/5 text-[#8B98A0]",
  };

  return (
    <div className="bg-white rounded-lg border border-[#E3E8E6] shadow-2xs p-5 space-y-4">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CalendarIcon className="h-5 w-5 text-[#0F766E]" />
          <h2 className="text-base font-bold text-[#1F2A2E]">{currentMonth}</h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="p-1.5 rounded-md border border-[#E3E8E6] text-[#6B7A80] hover:text-[#1F2A2E] hover:bg-[#EFF2F1]"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="px-3 py-1 text-xs font-semibold rounded-md bg-[#EFF2F1] text-[#1F2A2E]"
          >
            Today
          </button>
          <button
            type="button"
            className="p-1.5 rounded-md border border-[#E3E8E6] text-[#6B7A80] hover:text-[#1F2A2E] hover:bg-[#EFF2F1]"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 gap-px bg-[#E3E8E6] rounded-t-lg overflow-hidden text-center text-xs font-bold text-[#6B7A80] py-2 bg-white border-b border-[#E3E8E6]">
        {weekDays.map((wd) => (
          <div key={wd}>{wd}</div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-px bg-[#E3E8E6] rounded-b-lg overflow-hidden border border-[#E3E8E6]">
        {daysArray.map((cell, idx) => {
          const isToday = cell.dateStr === "2026-09-07";
          return (
            <div
              key={idx}
              className={cn(
                "min-h-28 bg-white p-2 flex flex-col justify-between group transition-colors",
                !cell.isCurrentMonth && "bg-[#F6F8F7]/50 text-[#CBD4D1]",
                isToday && "bg-[#E6F2F0]/20"
              )}
            >
              {cell.dayNum && (
                <>
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={cn(
                        "text-xs font-bold font-mono h-5 w-5 rounded-full flex items-center justify-center tabular-nums",
                        isToday
                          ? "bg-[#0F766E] text-white"
                          : "text-[#3D4A4F]"
                      )}
                    >
                      {cell.dayNum}
                    </span>

                    <button
                      type="button"
                      onClick={() => onQuickAddDate(cell.dateStr)}
                      className="p-0.5 rounded text-[#9AA7AC] hover:text-[#0F766E] opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Add task on this date"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="space-y-1 overflow-y-auto max-h-20 scrollbar-none">
                    {cell.tasks.map((task) => (
                      <div
                        key={task.id}
                        onClick={() => onTaskClick(task)}
                        className={cn(
                          "p-1 text-[10px] font-medium rounded border-l-2 truncate cursor-pointer hover:opacity-90 shadow-2xs transition-all",
                          priorityColors[task.priority] || "border-l-slate-400 bg-slate-50 text-slate-700"
                        )}
                        title={task.title}
                      >
                        {task.title}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
