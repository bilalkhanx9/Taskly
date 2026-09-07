"use client";

import React, { useState } from "react";
import { Task, Project, TaskStatus, TaskPriority } from "@/types/taskflow";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CheckSquare,
  Calendar,
  MoreHorizontal,
  ChevronDown,
  ArrowUpDown,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ListViewProps {
  tasks: Task[];
  projects: Project[];
  onTaskClick: (task: Task) => void;
  onUpdateTaskStatus: (taskId: string, status: TaskStatus) => void;
}

const statusOptions: { id: TaskStatus; label: string; text: string; bg: string }[] = [
  { id: "backlog", label: "Backlog", text: "text-[#6B7A80]", bg: "bg-[#F1F3F2]" },
  { id: "todo", label: "To Do", text: "text-[#475467]", bg: "bg-[#F2F4F7]" },
  { id: "in_progress", label: "In Progress", text: "text-[#B45309]", bg: "bg-[#FEF6E7]" },
  { id: "in_review", label: "In Review", text: "text-[#6941C6]", bg: "bg-[#F4F0FE]" },
  { id: "done", label: "Done", text: "text-[#15803D]", bg: "bg-[#ECFAF0]" },
];

const priorityStyles: Record<TaskPriority, { text: string; bg: string }> = {
  low: { text: "text-[#8B98A0]", bg: "bg-[#8B98A0]/10" },
  medium: { text: "text-[#2E7CD6]", bg: "bg-[#2E7CD6]/10" },
  high: { text: "text-[#D97706]", bg: "bg-[#D97706]/10" },
  urgent: { text: "text-[#C0342B]", bg: "bg-[#C0342B]/10" },
};

export function ListView({
  tasks,
  projects,
  onTaskClick,
  onUpdateTaskStatus,
}: ListViewProps) {
  const [filter, setFilter] = useState<string>("all");
  const [selectedIds, setSelectedIds] = useState<Record<string, boolean>>({});

  const filteredTasks = tasks.filter((t) => {
    if (filter === "completed") return t.status === "done";
    if (filter === "in_progress") return t.status === "in_progress";
    if (filter === "overdue") return t.status !== "done" && t.dueDate && t.dueDate < "2026-09-07";
    return true;
  });

  const toggleSelectAll = () => {
    if (Object.keys(selectedIds).length === filteredTasks.length) {
      setSelectedIds({});
    } else {
      const all: Record<string, boolean> = {};
      filteredTasks.forEach((t) => (all[t.id] = true));
      setSelectedIds(all);
    }
  };

  const toggleRow = (id: string) => {
    setSelectedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="bg-white rounded-lg border border-[#E3E8E6] shadow-2xs overflow-hidden space-y-3 p-4">
      {/* Table Header Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E3E8E6]">
        <div className="flex items-center gap-2">
          {(["all", "in_progress", "overdue", "completed"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              className={cn(
                "px-3 py-1 text-xs font-semibold rounded-md capitalize transition-all",
                filter === tab
                  ? "bg-[#0F766E] text-white shadow-xs"
                  : "bg-[#EFF2F1] text-[#3D4A4F] hover:bg-[#E6F2F0]"
              )}
            >
              {tab.replace("_", " ")}
            </button>
          ))}
        </div>

        <span className="text-xs text-[#6B7A80] font-medium tabular-nums">
          Showing {filteredTasks.length} tasks
        </span>
      </div>

      {/* Table Element */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#E3E8E6] text-[11px] font-bold text-[#6B7A80] uppercase tracking-wider">
              <th className="py-2.5 px-3 w-8">
                <input
                  type="checkbox"
                  checked={
                    filteredTasks.length > 0 &&
                    Object.keys(selectedIds).length === filteredTasks.length
                  }
                  onChange={toggleSelectAll}
                  className="rounded border-[#CBD4D1] text-[#0F766E] focus:ring-[#0F766E] cursor-pointer"
                />
              </th>
              <th className="py-2.5 px-3">Task Title</th>
              <th className="py-2.5 px-3">Project</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3">Priority</th>
              <th className="py-2.5 px-3">Due Date</th>
              <th className="py-2.5 px-3">Assignee</th>
              <th className="py-2.5 px-3 w-10 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EFF2F1] text-xs">
            {filteredTasks.map((task) => {
              const project = projects.find((p) => p.id === task.projectId);
              const priority = priorityStyles[task.priority] || priorityStyles.medium;
              const isSelected = selectedIds[task.id] || false;
              const isDone = task.status === "done";
              const isOverdue = task.dueDate && task.dueDate < "2026-09-07" && !isDone;

              return (
                <tr
                  key={task.id}
                  className={cn(
                    "hover:bg-[#F6F8F7] transition-colors group",
                    isSelected && "bg-[#E6F2F0]/40"
                  )}
                >
                  {/* Checkbox */}
                  <td className="py-3 px-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleRow(task.id)}
                      className="rounded border-[#CBD4D1] text-[#0F766E] focus:ring-[#0F766E] cursor-pointer"
                    />
                  </td>

                  {/* Title & Subtasks info */}
                  <td className="py-3 px-3 cursor-pointer" onClick={() => onTaskClick(task)}>
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "font-semibold text-[#1F2A2E] leading-tight",
                          isDone && "line-through text-[#9AA7AC]"
                        )}
                      >
                        {task.title}
                      </span>
                      {task.subtasks.length > 0 && (
                        <span className="text-[10px] text-[#6B7A80] font-mono tabular-nums bg-[#EFF2F1] px-1.5 py-0.2 rounded">
                          {task.subtasks.filter((s) => s.isCompleted).length}/{task.subtasks.length}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Project */}
                  <td className="py-3 px-3">
                    {project ? (
                      <div className="flex items-center gap-1.5 text-[#3D4A4F]">
                        <span
                          className="h-2 w-2 rounded-full shrink-0"
                          style={{ backgroundColor: project.color }}
                        />
                        <span className="truncate max-w-[120px]">{project.name}</span>
                      </div>
                    ) : (
                      <span className="text-[#9AA7AC]">-</span>
                    )}
                  </td>

                  {/* Status Dropdown Switcher */}
                  <td className="py-3 px-3">
                    <select
                      value={task.status}
                      onChange={(e) => onUpdateTaskStatus(task.id, e.target.value as TaskStatus)}
                      className={cn(
                        "text-[10px] font-bold px-2 py-1 rounded-md border-0 uppercase cursor-pointer outline-none",
                        statusOptions.find((s) => s.id === task.status)?.bg,
                        statusOptions.find((s) => s.id === task.status)?.text
                      )}
                    >
                      {statusOptions.map((opt) => (
                        <option key={opt.id} value={opt.id}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* Priority */}
                  <td className="py-3 px-3">
                    <span
                      className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase",
                        priority.bg,
                        priority.text
                      )}
                    >
                      {task.priority}
                    </span>
                  </td>

                  {/* Due Date */}
                  <td className="py-3 px-3">
                    <span
                      className={cn(
                        "font-mono tabular-nums text-xs",
                        isOverdue ? "text-[#C0342B] font-bold" : "text-[#6B7A80]"
                      )}
                    >
                      {task.dueDate || "-"}
                    </span>
                  </td>

                  {/* Assignee */}
                  <td className="py-3 px-3">
                    {task.assignee ? (
                      <div className="flex items-center gap-1.5">
                        <Avatar className="h-5 w-5 border border-[#E3E8E6]">
                          <AvatarImage src={task.assignee.avatarUrl} alt={task.assignee.name} />
                          <AvatarFallback className="text-[8px] bg-[#E6F2F0] text-[#0F766E] font-bold">
                            {task.assignee.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-[#3D4A4F] truncate max-w-[90px]">
                          {task.assignee.name}
                        </span>
                      </div>
                    ) : (
                      <span className="text-[#9AA7AC] text-[11px] italic">Unassigned</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-3 text-right">
                    <button
                      type="button"
                      onClick={() => onTaskClick(task)}
                      className="p-1 rounded text-[#6B7A80] hover:text-[#1F2A2E] hover:bg-[#EFF2F1]"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredTasks.length === 0 && (
          <div className="py-12 text-center text-[#6B7A80] text-xs">
            No tasks found matching current filter.
          </div>
        )}
      </div>
    </div>
  );
}
