"use client";

import React, { useState } from "react";
import { Task, TaskStatus, TaskPriority, User, Project } from "@/types/taskflow-v2";
import { 
  CheckSquare, 
  Square, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Filter, 
  Layers,
  ArrowUpDown,
  X
} from "lucide-react";

interface ListViewProps {
  currentUser: User;
  project: Project;
  tasks: Task[];
  onOpenTask: (taskId: string) => void;
  onUpdateTaskStatus: (taskId: string, newStatus: TaskStatus) => void;
  onUpdateTaskPriority: (taskId: string, newPriority: TaskPriority) => void;
  onDeleteTask?: (taskId: string) => void;
  onQuickAddTask: (status: TaskStatus) => void;
}

export const ListView: React.FC<ListViewProps> = ({
  currentUser,
  project,
  tasks,
  onOpenTask,
  onUpdateTaskStatus,
  onUpdateTaskPriority,
  onDeleteTask,
  onQuickAddTask
}) => {
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);
  const [groupBy, setGroupBy] = useState<"status" | "priority" | "none">("status");
  const [filterQuery, setFilterQuery] = useState("");

  const projectTasks = tasks.filter(t => t.projectId === project.id && 
    (t.title.toLowerCase().includes(filterQuery.toLowerCase()) || 
     t.labels.some(l => (typeof l === "string" ? l : l.name).toLowerCase().includes(filterQuery.toLowerCase())))
  );

  const toggleSelectTask = (id: string) => {
    setSelectedTaskIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedTaskIds.length === projectTasks.length) {
      setSelectedTaskIds([]);
    } else {
      setSelectedTaskIds(projectTasks.map(t => t.id));
    }
  };

  const handleBulkMarkDone = () => {
    selectedTaskIds.forEach(id => onUpdateTaskStatus(id, "done"));
    setSelectedTaskIds([]);
  };

  const handleBulkDelete = () => {
    if (onDeleteTask) {
      selectedTaskIds.forEach(id => onDeleteTask(id));
    }
    setSelectedTaskIds([]);
  };

  // Grouping logic
  const statusGroups: { title: string; status: TaskStatus; items: Task[] }[] = [
    { title: "To Do", status: "todo", items: projectTasks.filter(t => t.status === "todo") },
    { title: "In Progress", status: "in_progress", items: projectTasks.filter(t => t.status === "in_progress") },
    { title: "In Review", status: "in_review", items: projectTasks.filter(t => t.status === "in_review") },
    { title: "Backlog", status: "backlog", items: projectTasks.filter(t => t.status === "backlog") },
    { title: "Done", status: "done", items: projectTasks.filter(t => t.status === "done") },
  ];

  return (
    <div className="flex flex-col h-full space-y-4 relative pb-16">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-1">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-[var(--ink-muted)]">
            <Layers className="w-3.5 h-3.5" />
            <span className="font-semibold uppercase tracking-wider text-[10px]">Group By:</span>
          </div>

          <select
            value={groupBy}
            onChange={(e) => setGroupBy(e.target.value as any)}
            className="px-2.5 py-1 text-xs bg-[var(--surface)] border border-[var(--line-strong)] rounded-md text-[var(--ink)] focus:outline-none"
          >
            <option value="status">Status</option>
            <option value="none">No Grouping</option>
          </select>
        </div>

        <div className="w-full sm:w-64">
          <input
            type="text"
            placeholder="Search tasks or labels..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="w-full px-3 py-1 bg-[var(--surface)] border border-[var(--line-strong)] rounded-lg text-xs text-[var(--ink)] focus:outline-none focus:border-[var(--accent-600)]"
          />
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-[var(--surface)] border border-[var(--line)] rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[var(--surface-sunken)] text-[var(--ink-muted)] border-b border-[var(--line)] uppercase tracking-wider font-semibold text-[10px]">
              <tr>
                <th className="py-2.5 px-3 w-8">
                  <button onClick={toggleSelectAll} className="flex items-center text-[var(--ink-muted)] hover:text-[var(--ink)]">
                    {selectedTaskIds.length === projectTasks.length && projectTasks.length > 0 ? (
                      <CheckSquare className="w-4 h-4 text-[var(--accent-700)]" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="py-2.5 px-3 min-w-[240px]">Task Title</th>
                <th className="py-2.5 px-3 w-32">Status</th>
                <th className="py-2.5 px-3 w-28">Priority</th>
                <th className="py-2.5 px-3 w-36">Assignee</th>
                <th className="py-2.5 px-3 w-28">Due Date</th>
                <th className="py-2.5 px-3 w-24 text-right">Subtasks</th>
              </tr>
            </thead>

            {groupBy === "status" ? (
              statusGroups.map((group) => {
                if (group.items.length === 0) return null;
                return (
                  <tbody key={group.status} className="divide-y divide-[var(--line)]">
                    <tr className="bg-[var(--surface-inset)]">
                      <td colSpan={7} className="py-1.5 px-3 font-bold text-[11px] uppercase tracking-wider text-[var(--ink-body)]">
                        {group.title} ({group.items.length})
                      </td>
                    </tr>
                    {group.items.map((task) => {
                      const isSelected = selectedTaskIds.includes(task.id);
                      const completedSubs = task.subtasks?.filter(s => s.completed).length || 0;
                      const totalSubs = task.subtasks?.length || 0;

                      return (
                        <tr 
                          key={task.id}
                          className={`hover:bg-[var(--surface-hover)] transition-colors ${isSelected ? "bg-orange-50/50" : ""}`}
                        >
                          <td className="py-2.5 px-3">
                            <button onClick={() => toggleSelectTask(task.id)} className="flex items-center text-[var(--ink-muted)] hover:text-[var(--ink)]">
                              {isSelected ? <CheckSquare className="w-4 h-4 text-[var(--accent-700)]" /> : <Square className="w-4 h-4" />}
                            </button>
                          </td>
                          <td className="py-2.5 px-3">
                            <div className="flex items-center gap-2">
                              <span 
                                onClick={() => onOpenTask(task.id)}
                                className={`font-semibold cursor-pointer hover:text-[var(--accent-700)] transition-colors ${
                                  task.status === "done" ? "line-through text-[var(--ink-faint)]" : "text-[var(--ink)]"
                                }`}
                              >
                                {task.title}
                              </span>
                                <div className="flex gap-1">
                                  {task.labels.map((l, idx) => {
                                    const labelName = typeof l === "string" ? l : l.name;
                                    const labelKey = typeof l === "string" ? `${l}-${idx}` : l.id;
                                    return (
                                      <span key={labelKey} className="text-[9px] px-1 py-0.2 rounded bg-[var(--surface-sunken)] border border-[var(--line)] text-[var(--ink-muted)]">
                                        {labelName}
                                      </span>
                                    );
                                  })}
                                </div>
                            </div>
                          </td>
                          <td className="py-2.5 px-3">
                            <select
                              value={task.status}
                              disabled={currentUser.role === "VIEWER"}
                              onChange={(e) => onUpdateTaskStatus(task.id, e.target.value as TaskStatus)}
                              className="px-2 py-1 bg-[var(--surface-sunken)] border border-[var(--line-strong)] rounded text-[11px] font-medium text-[var(--ink)] focus:outline-none"
                            >
                              <option value="backlog">Backlog</option>
                              <option value="todo">To Do</option>
                              <option value="in_progress">In Progress</option>
                              <option value="in_review">In Review</option>
                              <option value="done">Done</option>
                            </select>
                          </td>
                          <td className="py-2.5 px-3">
                            <select
                              value={task.priority}
                              disabled={currentUser.role === "VIEWER"}
                              onChange={(e) => onUpdateTaskPriority(task.id, e.target.value as TaskPriority)}
                              className="px-2 py-1 bg-[var(--surface-sunken)] border border-[var(--line-strong)] rounded text-[11px] font-medium capitalize text-[var(--ink)] focus:outline-none"
                            >
                              <option value="low">Low</option>
                              <option value="medium">Medium</option>
                              <option value="high">High</option>
                              <option value="urgent">Urgent</option>
                            </select>
                          </td>
                          <td className="py-2.5 px-3">
                            {task.assignee ? (
                              <div className="flex items-center gap-1.5">
                                <img src={task.assignee.avatarUrl} alt="" className="w-5 h-5 rounded-full border border-white" />
                                <span className="text-[11px] text-[var(--ink)] truncate max-w-[100px]">{task.assignee.name}</span>
                              </div>
                            ) : (
                              <span className="text-[11px] text-[var(--ink-faint)]">Unassigned</span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 font-medium text-[11px] text-[var(--ink-body)]">
                            {task.dueDate}
                          </td>
                          <td className="py-2.5 px-3 text-right text-[11px] text-[var(--ink-muted)]">
                            {totalSubs > 0 ? `${completedSubs}/${totalSubs}` : "—"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                );
              })
            ) : (
              <tbody className="divide-y divide-[var(--line)]">
                {projectTasks.map((task) => {
                  const isSelected = selectedTaskIds.includes(task.id);
                  return (
                    <tr key={task.id} className="hover:bg-[var(--surface-hover)]">
                      <td className="py-2.5 px-3">
                        <button onClick={() => toggleSelectTask(task.id)}>
                          {isSelected ? <CheckSquare className="w-4 h-4 text-[var(--accent-700)]" /> : <Square className="w-4 h-4" />}
                        </button>
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-[var(--ink)] cursor-pointer" onClick={() => onOpenTask(task.id)}>
                        {task.title}
                      </td>
                      <td className="py-2.5 px-3 capitalize">{task.status.replace("_", " ")}</td>
                      <td className="py-2.5 px-3 capitalize">{task.priority}</td>
                      <td className="py-2.5 px-3">{task.assignee?.name || "Unassigned"}</td>
                      <td className="py-2.5 px-3">{task.dueDate}</td>
                      <td className="py-2.5 px-3 text-right">{task.subtasks?.length || 0}</td>
                    </tr>
                  );
                })}
              </tbody>
            )}
          </table>
        </div>
      </div>

      {/* Floating Bulk Actions Bar */}
      {selectedTaskIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-[var(--surface)] border border-[var(--line-heavy)] shadow-xl rounded-xl px-4 py-2.5 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2">
          <div className="text-xs font-bold text-[var(--ink)] border-r border-[var(--line)] pr-3">
            {selectedTaskIds.length} {selectedTaskIds.length === 1 ? "task" : "tasks"} selected
          </div>

          <button
            onClick={handleBulkMarkDone}
            className="h-[32px] px-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 shadow-xs"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Mark Done
          </button>

          {onDeleteTask && currentUser.role !== "VIEWER" && (
            <button
              onClick={handleBulkDelete}
              className="h-[32px] px-3 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 shadow-xs"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </button>
          )}

          <button
            onClick={() => setSelectedTaskIds([])}
            className="p-1 rounded text-[var(--ink-muted)] hover:text-[var(--ink)]"
            title="Dismiss selection"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
