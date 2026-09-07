"use client";

import React, { useState } from "react";
import {
  Task,
  Project,
  User,
  TaskStatus,
  TaskPriority,
  Subtask,
  Comment,
  Attachment,
} from "@/types/taskflow";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Calendar,
  CheckSquare,
  Clock,
  MessageSquare,
  Paperclip,
  Plus,
  Send,
  Trash2,
  Upload,
  User as UserIcon,
  X,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskDetailModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  teamMembers: User[];
  currentUser: User;
  onUpdateTask: (updatedTask: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

const statusOptions: { id: TaskStatus; label: string; text: string; bg: string }[] = [
  { id: "backlog", label: "Backlog", text: "text-[#6B7A80]", bg: "bg-[#F1F3F2]" },
  { id: "todo", label: "To Do", text: "text-[#475467]", bg: "bg-[#F2F4F7]" },
  { id: "in_progress", label: "In Progress", text: "text-[#B45309]", bg: "bg-[#FEF6E7]" },
  { id: "in_review", label: "In Review", text: "text-[#6941C6]", bg: "bg-[#F4F0FE]" },
  { id: "done", label: "Done", text: "text-[#15803D]", bg: "bg-[#ECFAF0]" },
];

const priorityOptions: { id: TaskPriority; label: string; text: string; bg: string }[] = [
  { id: "low", label: "Low", text: "text-[#8B98A0]", bg: "bg-[#8B98A0]/10" },
  { id: "medium", label: "Medium", text: "text-[#2E7CD6]", bg: "bg-[#2E7CD6]/10" },
  { id: "high", label: "High", text: "text-[#D97706]", bg: "bg-[#D97706]/10" },
  { id: "urgent", label: "Urgent", text: "text-[#C0342B]", bg: "bg-[#C0342B]/10" },
];

export function TaskDetailModal({
  task,
  isOpen,
  onClose,
  projects,
  teamMembers,
  currentUser,
  onUpdateTask,
  onDeleteTask,
}: TaskDetailModalProps) {
  if (!task) return null;

  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [status, setStatus] = useState<TaskStatus>(task.status);
  const [priority, setPriority] = useState<TaskPriority>(task.priority);
  const [dueDate, setDueDate] = useState(task.dueDate || "");
  const [assigneeId, setAssigneeId] = useState<string>(task.assignee?.id || "");
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
  const [newComment, setNewComment] = useState("");

  const project = projects.find((p) => p.id === task.projectId);

  // Subtask Toggle
  const toggleSubtask = (stId: string) => {
    const updatedSubtasks = task.subtasks.map((st) =>
      st.id === stId ? { ...st, isCompleted: !st.isCompleted } : st
    );
    const updated = { ...task, subtasks: updatedSubtasks };
    onUpdateTask(updated);
  };

  // Add Subtask
  const handleAddSubtask = () => {
    if (!newSubtaskTitle.trim()) return;
    const newSt: Subtask = {
      id: `st-${Date.now()}`,
      taskId: task.id,
      title: newSubtaskTitle.trim(),
      isCompleted: false,
    };
    const updated = { ...task, subtasks: [...task.subtasks, newSt] };
    onUpdateTask(updated);
    setNewSubtaskTitle("");
  };

  // Add Comment
  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const newC: Comment = {
      id: `com-${Date.now()}`,
      taskId: task.id,
      user: currentUser,
      content: newComment.trim(),
      createdAt: "Just now",
    };
    const updated = { ...task, comments: [...task.comments, newC] };
    onUpdateTask(updated);
    setNewComment("");
  };

  // Save Main Changes
  const handleSave = () => {
    const assignedUser = teamMembers.find((m) => m.id === assigneeId) || null;
    const updated: Task = {
      ...task,
      title,
      description,
      status,
      priority,
      dueDate,
      assignee: assignedUser,
      completedAt: status === "done" ? new Date().toISOString() : null,
      updatedAt: new Date().toISOString(),
    };
    onUpdateTask(updated);
    onClose();
  };

  const completedSubtasks = task.subtasks.filter((s) => s.isCompleted).length;
  const subtaskProgress =
    task.subtasks.length > 0 ? (completedSubtasks / task.subtasks.length) * 100 : 0;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0 bg-white border border-[#E3E8E6] rounded-xl shadow-xl">
        {/* Modal Header */}
        <div className="p-6 border-b border-[#E3E8E6] space-y-3 bg-[#F6F8F7]">
          <div className="flex items-center justify-between text-xs text-[#6B7A80]">
            <div className="flex items-center gap-2">
              {project && (
                <span className="flex items-center gap-1 font-semibold text-[#1F2A2E]">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: project.color }}
                  />
                  {project.name}
                </span>
              )}
              <span>•</span>
              <span className="font-mono">TASK-{task.id.slice(-4)}</span>
            </div>

            <div className="flex items-center gap-2">
              {/* Status Select */}
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className={cn(
                  "text-[10px] font-bold px-2 py-1 rounded border-0 uppercase cursor-pointer",
                  statusOptions.find((s) => s.id === status)?.bg,
                  statusOptions.find((s) => s.id === status)?.text
                )}
              >
                {statusOptions.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>

              {/* Priority Select */}
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className={cn(
                  "text-[10px] font-bold px-2 py-1 rounded border-0 uppercase cursor-pointer",
                  priorityOptions.find((p) => p.id === priority)?.bg,
                  priorityOptions.find((p) => p.id === priority)?.text
                )}
              >
                {priorityOptions.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-lg font-bold text-[#1F2A2E] bg-transparent border-0 focus:outline-none focus:ring-0 p-0"
            placeholder="Task Title"
          />
        </div>

        {/* Modal Body Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6">
          {/* Main Left Column (8 cols) */}
          <div className="md:col-span-8 space-y-6">
            {/* Description */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#6B7A80] uppercase tracking-wider block">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Add rich description, acceptance criteria, or notes..."
                className="w-full text-xs text-[#3D4A4F] bg-[#F6F8F7] border border-[#E3E8E6] rounded-lg p-3 focus:outline-none focus:border-[#0F766E] leading-relaxed resize-none"
              />
            </div>

            {/* Subtasks Checklist */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#6B7A80] uppercase tracking-wider flex items-center gap-1.5">
                  <CheckSquare className="h-3.5 w-3.5 text-[#0F766E]" />
                  Subtasks ({completedSubtasks}/{task.subtasks.length})
                </label>
                <span className="text-[11px] font-mono text-[#6B7A80]">
                  {Math.round(subtaskProgress)}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 rounded-full bg-[#EFF2F1] overflow-hidden">
                <div
                  className="h-full bg-[#0F766E] transition-all duration-300 rounded-full"
                  style={{ width: `${subtaskProgress}%` }}
                />
              </div>

              {/* Subtasks List */}
              <div className="space-y-1.5">
                {task.subtasks.map((st) => (
                  <label
                    key={st.id}
                    className="flex items-center gap-2.5 p-2 rounded-md hover:bg-[#F6F8F7] cursor-pointer text-xs"
                  >
                    <input
                      type="checkbox"
                      checked={st.isCompleted}
                      onChange={() => toggleSubtask(st.id)}
                      className="rounded border-[#CBD4D1] text-[#0F766E] focus:ring-[#0F766E]"
                    />
                    <span
                      className={cn(
                        "text-[#1F2A2E]",
                        st.isCompleted && "line-through text-[#9AA7AC]"
                      )}
                    >
                      {st.title}
                    </span>
                  </label>
                ))}

                {/* Add subtask input */}
                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={newSubtaskTitle}
                    onChange={(e) => setNewSubtaskTitle(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddSubtask()}
                    placeholder="Add a subtask..."
                    className="flex-1 text-xs bg-[#F6F8F7] border border-[#E3E8E6] rounded-md px-3 py-1.5 focus:outline-none focus:border-[#0F766E]"
                  />
                  <button
                    type="button"
                    onClick={handleAddSubtask}
                    disabled={!newSubtaskTitle.trim()}
                    className="px-3 py-1.5 bg-[#EFF2F1] hover:bg-[#E6F2F0] text-[#0F766E] text-xs font-bold rounded-md disabled:opacity-50"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            {/* Comments Thread */}
            <div className="space-y-3 pt-4 border-t border-[#E3E8E6]">
              <label className="text-xs font-bold text-[#6B7A80] uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquare className="h-3.5 w-3.5 text-[#0F766E]" />
                Activity & Comments
              </label>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
                  placeholder="Leave a comment or mention @teammate..."
                  className="flex-1 text-xs bg-[#F6F8F7] border border-[#E3E8E6] rounded-md px-3 py-1.5 focus:outline-none focus:border-[#0F766E]"
                />
                <button
                  type="button"
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  className="p-2 bg-[#0F766E] hover:bg-[#0C5F58] text-white rounded-md disabled:opacity-50"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                {task.comments.map((c) => (
                  <div key={c.id} className="flex items-start gap-2.5 p-2 rounded-lg bg-[#F6F8F7] text-xs">
                    <Avatar className="h-6 w-6 mt-0.5 border border-[#E3E8E6]">
                      <AvatarImage src={c.user.avatarUrl} />
                      <AvatarFallback className="text-[9px] bg-[#E6F2F0] text-[#0F766E] font-bold">
                        {c.user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-[#1F2A2E]">{c.user.name}</span>
                        <span className="text-[#9AA7AC]">{c.createdAt}</span>
                      </div>
                      <p className="text-[#3D4A4F] mt-0.5">{c.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Meta Sidebar (4 cols) */}
          <div className="md:col-span-4 space-y-4 border-l border-[#E3E8E6] pl-6 text-xs">
            {/* Assignee */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#6B7A80] uppercase">Assignee</label>
              <select
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                className="w-full bg-[#F6F8F7] border border-[#E3E8E6] rounded-md px-2.5 py-1.5 text-xs text-[#1F2A2E] focus:outline-none focus:border-[#0F766E]"
              >
                <option value="">Unassigned</option>
                {teamMembers.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.role})
                  </option>
                ))}
              </select>
            </div>

            {/* Due Date */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#6B7A80] uppercase">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-[#F6F8F7] border border-[#E3E8E6] rounded-md px-2.5 py-1.5 text-xs text-[#1F2A2E] focus:outline-none focus:border-[#0F766E]"
              />
            </div>

            {/* Hours */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#6B7A80] uppercase">Est. Hours</label>
                <input
                  type="number"
                  defaultValue={task.estimatedHours || 0}
                  className="w-full bg-[#F6F8F7] border border-[#E3E8E6] rounded-md px-2 py-1 text-xs font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#6B7A80] uppercase">Act. Hours</label>
                <input
                  type="number"
                  defaultValue={task.actualHours || 0}
                  className="w-full bg-[#F6F8F7] border border-[#E3E8E6] rounded-md px-2 py-1 text-xs font-mono"
                />
              </div>
            </div>

            {/* Delete Button */}
            <div className="pt-6 border-t border-[#E3E8E6]">
              <button
                type="button"
                onClick={() => {
                  onDeleteTask(task.id);
                  onClose();
                }}
                className="w-full flex items-center justify-center gap-1.5 text-[#C0342B] hover:bg-rose-50 border border-rose-200 py-1.5 rounded-md font-semibold text-xs transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Delete Task</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#F6F8F7] border-t border-[#E3E8E6] flex items-center justify-between">
          <span className="text-[11px] text-[#6B7A80]">
            Created {task.createdAt.slice(0, 10)}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-md border border-[#E3E8E6] text-xs font-semibold text-[#3D4A4F] hover:bg-white"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-1.5 rounded-md bg-[#0F766E] hover:bg-[#0C5F58] text-white text-xs font-semibold shadow-xs"
            >
              Save Changes
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
