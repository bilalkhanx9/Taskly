"use client";

import React, { useState } from "react";
import { Task, User, Project } from "@/types/taskflow-v2";
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Plus, 
  Clock 
} from "lucide-react";

interface CalendarViewProps {
  currentUser: User;
  project?: Project;
  tasks: Task[];
  onOpenTask: (taskId: string) => void;
  onQuickAddDate?: (dateStr: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  currentUser,
  project,
  tasks,
  onOpenTask,
  onQuickAddDate
}) => {
  const [currentMonth, setCurrentMonth] = useState<number>(8); // September (0-indexed = 8)
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [viewMode, setViewMode] = useState<"month" | "week">("month");

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sunday

  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const paddingArray = Array.from({ length: firstDayIndex }, (_, i) => i);

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const setToday = () => {
    setCurrentMonth(8); // Sept 2026
    setCurrentYear(2026);
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[var(--surface)] p-3 rounded-xl border border-[var(--line)]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-bold text-base text-[var(--ink)]">
            <CalendarIcon className="w-5 h-5 text-[var(--accent-700)]" />
            <span>{monthNames[currentMonth]} {currentYear}</span>
          </div>

          <div className="flex items-center border border-[var(--line-strong)] rounded-lg overflow-hidden">
            <button
              onClick={prevMonth}
              className="p-1.5 hover:bg-[var(--surface-hover)] text-[var(--ink-muted)] hover:text-[var(--ink)]"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={setToday}
              className="px-2.5 py-1 text-xs font-semibold hover:bg-[var(--surface-hover)] text-[var(--ink-body)] border-x border-[var(--line)]"
            >
              Today
            </button>
            <button
              onClick={nextMonth}
              className="p-1.5 hover:bg-[var(--surface-hover)] text-[var(--ink-muted)] hover:text-[var(--ink)]"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center border border-[var(--line-strong)] rounded-lg p-0.5 bg-[var(--surface-sunken)]">
            <button
              onClick={() => setViewMode("month")}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                viewMode === "month" ? "bg-[var(--surface)] text-[var(--ink)] shadow-xs" : "text-[var(--ink-muted)]"
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setViewMode("week")}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                viewMode === "week" ? "bg-[var(--surface)] text-[var(--ink)] shadow-xs" : "text-[var(--ink-muted)]"
              }`}
            >
              Week
            </button>
          </div>
        </div>
      </div>

      {/* Month Calendar Grid */}
      <div className="bg-[var(--surface)] border border-[var(--line)] rounded-xl overflow-hidden shadow-2xs">
        {/* Days of week header */}
        <div className="grid grid-cols-7 border-b border-[var(--line)] bg-[var(--surface-sunken)] text-center text-[10px] font-bold uppercase tracking-wider text-[var(--ink-muted)] py-2">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>

        {/* Days cells */}
        <div className="grid grid-cols-7 divide-x divide-y divide-[var(--line)]">
          {paddingArray.map((_, i) => (
            <div key={`pad-${i}`} className="min-h-[105px] bg-[var(--surface-sunken)]/40 p-2" />
          ))}

          {daysArray.map((day) => {
            const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const isToday = currentYear === 2026 && currentMonth === 8 && day === 7;
            
            const dayTasks = tasks.filter((t) => {
              const matchProject = project ? t.projectId === project.id : true;
              return matchProject && t.dueDate === dateStr;
            });

            return (
              <div
                key={day}
                className={`min-h-[105px] p-1.5 transition-colors flex flex-col justify-between group ${
                  isToday ? "bg-orange-50/40" : "hover:bg-[var(--surface-hover)]"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full ${
                        isToday
                          ? "bg-[var(--accent-700)] text-white shadow-xs"
                          : "text-[var(--ink)]"
                      }`}
                    >
                      {day}
                    </span>

                    {currentUser.role !== "VIEWER" && onQuickAddDate && (
                      <button
                        onClick={() => onQuickAddDate(dateStr)}
                        className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-[var(--ink-muted)] hover:text-[var(--ink)] hover:bg-[var(--line)]"
                        title="Add task on this date"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Task Chips */}
                  <div className="space-y-1">
                    {dayTasks.map((t) => (
                      <div
                        key={t.id}
                        onClick={() => onOpenTask(t.id)}
                        className="p-1 rounded bg-[var(--surface)] border border-[var(--line-strong)] hover:border-[var(--accent-600)] text-[10px] font-medium text-[var(--ink)] cursor-pointer truncate shadow-2xs flex items-center gap-1"
                      >
                        <span 
                          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{
                            backgroundColor:
                              t.priority === "urgent" ? "#B91C1C" :
                              t.priority === "high" ? "#B45309" :
                              t.priority === "medium" ? "#0E7490" : "#A8A29E"
                          }}
                        />
                        <span className="truncate">{t.title}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {dayTasks.length > 2 && (
                  <div className="text-[9px] text-[var(--ink-faint)] font-mono text-right">
                    +{dayTasks.length - 2} more
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
