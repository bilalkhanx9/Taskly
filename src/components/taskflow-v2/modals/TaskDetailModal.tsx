"use client";

import React, { useState } from "react";
import { Task, TaskStatus, TaskPriority, User, Project, Subtask, Comment } from "@/types/taskflow-v2";
import { 
  X, 
  CheckSquare, 
  Square, 
  Plus, 
  Paperclip, 
  MessageSquare, 
  Clock, 
  Calendar, 
  Trash2, 
  Send, 
  Tag, 
  AlertTriangle,
  Download,
  Link as LinkIcon
} from "lucide-react";
import {
  toggleSubtaskAction,
  addSubtaskAction,
  addTaskCommentAction,
  updateTaskDetailsAction
} from "@/actions/task-actions";

interface TaskDetailModalProps {
  task: Task;
  project?: Project;
  members: User[];
  currentUser: User;
  onClose: () => void;
  onUpdateTask: (updated: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  task,
  project,
  members,
  currentUser,
  onClose,
  onUpdateTask,
  onDeleteTask
}) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [status, setStatus] = useState<TaskStatus>(task.status);
  const [priority, setPriority] = useState<TaskPriority>(task.priority);
  const [assigneeId, setAssigneeId] = useState<string>(task.assignee?.id || "");
  const [dueDate, setDueDate] = useState<string>(task.dueDate || "");
  
  // Subtasks
  const [subtasks, setSubtasks] = useState<Subtask[]>(task.subtasks || []);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");

  // Comments
  const [comments, setComments] = useState<Comment[]>(task.comments || []);
  const [newCommentText, setNewCommentText] = useState("");

  const isViewer = currentUser.role === "VIEWER";

  const handleSaveProperties = async (updates: Partial<Task>) => {
    const updated = {
      ...task,
      title,
      description,
      status,
      priority,
      assignee: members.find(m => m.id === assigneeId),
      dueDate,
      subtasks,
      comments,
      ...updates
    };
    onUpdateTask(updated);

    try {
      await updateTaskDetailsAction(task.id, {
        title: updates.title ?? title,
        description: updates.description ?? description,
        status: updates.status ?? status,
        priority: updates.priority ?? priority,
        dueDate: updates.dueDate ?? dueDate,
        assigneeId: updates.assignee !== undefined ? updates.assignee?.id : assigneeId,
      });
    } catch (err) {
      console.error("Error updating task details in DB:", err);
    }
  };

  const handleToggleSubtask = async (subId: string) => {
    if (isViewer) return;
    const target = subtasks.find(s => s.id === subId);
    if (!target) return;
    const newCompleted = !target.completed;
    const updated = subtasks.map(s => s.id === subId ? { ...s, completed: newCompleted } : s);
    setSubtasks(updated);
    handleSaveProperties({ subtasks: updated });

    if (!subId.startsWith("sub-")) {
      try {
        await toggleSubtaskAction(subId, newCompleted);
      } catch (err) {
        console.error("Error toggling subtask in DB:", err);
      }
    }
  };

  const handleAddSubtask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim() || isViewer) return;
    const titleToAdd = newSubtaskTitle.trim();
    const tempId = `sub-${Date.now()}`;
    const newSub: Subtask = {
      id: tempId,
      title: titleToAdd,
      completed: false
    };
    const updated = [...subtasks, newSub];
    setSubtasks(updated);
    setNewSubtaskTitle("");
    handleSaveProperties({ subtasks: updated });

    try {
      const res = await addSubtaskAction(task.id, titleToAdd);
      if (res.success && res.subtask) {
        setSubtasks(prev => prev.map(s => s.id === tempId ? { ...s, id: res.subtask.id } : s));
      }
    } catch (err) {
      console.error("Error adding subtask in DB:", err);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || isViewer) return;
    const textToAdd = newCommentText.trim();
    const tempId = `c-${Date.now()}`;
    const newComment: Comment = {
      id: tempId,
      taskId: task.id,
      user: currentUser,
      body: textToAdd,
      content: textToAdd,
      createdAt: new Date().toISOString()
    };
    const updated = [...comments, newComment];
    setComments(updated);
    setNewCommentText("");
    handleSaveProperties({ comments: updated });

    try {
      const res = await addTaskCommentAction(task.id, currentUser.id, textToAdd);
      if (res.success && res.comment) {
        setComments(prev => prev.map(c => c.id === tempId ? { ...c, id: res.comment.id } : c));
      }
    } catch (err) {
      console.error("Error adding task comment in DB:", err);
    }
  };

  const completedSubCount = subtasks.filter(s => s.completed).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto">
      <div 
        className="bg-[var(--surface)] border border-[var(--line-strong)] rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Modal Navigation */}
        <div className="px-6 py-4 border-b border-[var(--line)] flex items-center justify-between bg-[var(--surface)] flex-shrink-0">
          <div className="flex items-center gap-2 text-xs text-[var(--ink-muted)]">
            <span className="font-semibold text-[var(--ink)]">{project?.name || "Project"}</span>
            <span>›</span>
            <span className="font-mono text-[var(--ink-faint)]">#{task.id}</span>
          </div>

          <div className="flex items-center gap-2">
            {!isViewer && (
              <button
                onClick={() => {
                  if (confirm("Are you sure you want to delete this task?")) {
                    onDeleteTask(task.id);
                  }
                }}
                className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                title="Delete task"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[var(--ink-muted)] hover:text-[var(--ink)] hover:bg-[var(--surface-sunken)] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: 2 Columns */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Main Left Column (Title, Description, Subtasks, Comments) */}
          <div className="md:col-span-2 space-y-6">
            {/* Title (Inline editable) */}
            <div>
              <input
                type="text"
                disabled={isViewer}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={() => handleSaveProperties({ title })}
                className="w-full text-xl font-bold text-[var(--ink)] bg-transparent border-b border-transparent hover:border-[var(--line-strong)] focus:border-[var(--accent-600)] focus:outline-none transition-colors py-1"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-[var(--ink-muted)] uppercase tracking-wider mb-1.5">
                Description
              </label>
              <textarea
                disabled={isViewer}
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={() => handleSaveProperties({ description })}
                placeholder="Add a detailed description or context..."
                className="w-full p-3 bg-[var(--surface-sunken)] border border-[var(--line-strong)] rounded-xl text-xs text-[var(--ink)] focus:bg-[var(--surface)] focus:border-[var(--accent-600)] focus:outline-none transition-colors"
              />
            </div>

            {/* Subtasks (1-Level Nesting Only - Section 2) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-[var(--accent-700)]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--ink)]">
                    Subtasks ({completedSubCount}/{subtasks.length})
                  </span>
                </div>
                {subtasks.length > 0 && (
                  <span className="text-[11px] font-semibold text-[var(--ink-muted)]">
                    {Math.round((completedSubCount / subtasks.length) * 100)}%
                  </span>
                )}
              </div>

              {subtasks.length > 0 && (
                <div className="w-full h-1.5 bg-[var(--surface-sunken)] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[var(--accent-700)] rounded-full transition-all duration-300"
                    style={{ width: `${(completedSubCount / subtasks.length) * 100}%` }}
                  />
                </div>
              )}

              <div className="divide-y divide-[var(--line)] border border-[var(--line)] rounded-xl overflow-hidden bg-[var(--surface)]">
                {subtasks.map((st) => (
                  <div 
                    key={st.id}
                    onClick={() => handleToggleSubtask(st.id)}
                    className="p-2.5 flex items-center gap-2.5 text-xs hover:bg-[var(--surface-hover)] cursor-pointer"
                  >
                    {st.completed ? (
                      <CheckSquare className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-[var(--ink-faint)] flex-shrink-0" />
                    )}
                    <span className={`flex-1 ${st.completed ? "line-through text-[var(--ink-faint)]" : "text-[var(--ink)]"}`}>
                      {st.title}
                    </span>
                  </div>
                ))}
              </div>

              {!isViewer && (
                <form onSubmit={handleAddSubtask} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="+ Add subtask..."
                    value={newSubtaskTitle}
                    onChange={(e) => setNewSubtaskTitle(e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-[var(--surface)] border border-[var(--line-strong)] rounded-lg text-xs"
                  />
                  <button
                    type="submit"
                    className="h-[32px] px-3 bg-[var(--surface-sunken)] hover:bg-[var(--line)] text-xs font-semibold text-[var(--ink)] rounded-lg"
                  >
                    Add
                  </button>
                </form>
              )}
            </div>

            {/* Attachments List */}
            {task.attachments && task.attachments.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--ink)] flex items-center gap-1.5">
                  <Paperclip className="w-3.5 h-3.5 text-[var(--accent-700)]" />
                  Attachments ({task.attachments.length})
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {task.attachments.map(att => (
                    <div key={att.id} className="p-2.5 border border-[var(--line)] rounded-lg bg-[var(--surface-sunken)] flex items-center justify-between">
                      <div className="truncate text-xs font-medium text-[var(--ink)] pr-2">
                        {att.name}
                        <span className="text-[10px] text-[var(--ink-muted)] block">{att.size}</span>
                      </div>
                      <Download className="w-4 h-4 text-[var(--ink-muted)] hover:text-[var(--accent-700)] cursor-pointer" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Comments & Activity Log */}
            <div className="space-y-4 pt-4 border-t border-[var(--line)]">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[var(--accent-700)]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--ink)]">
                  Activity &amp; Comments ({comments.length})
                </span>
              </div>

              <div className="space-y-3">
                {comments.map(c => (
                  <div key={c.id} className="flex items-start gap-3 text-xs">
                    <img 
                      src={c.user?.avatarUrl || (c as any).userAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"} 
                      alt="" 
                      className="w-6 h-6 rounded-full border border-white object-cover mt-0.5" 
                    />
                    <div className="flex-1 bg-[var(--surface-sunken)] p-3 rounded-xl border border-[var(--line)]">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-[var(--ink)]">{c.user?.name || (c as any).userName || "Team Member"}</span>
                        <span className="text-[10px] text-[var(--ink-faint)] font-mono">
                          {c.createdAt ? new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : (c as any).timestamp || ""}
                        </span>
                      </div>
                      <p className="text-[var(--ink-body)] leading-relaxed">{c.body || c.content}</p>
                    </div>
                  </div>
                ))}
              </div>

              {!isViewer && (
                <form onSubmit={handleAddComment} className="flex gap-2 pt-2">
                  <input
                    type="text"
                    placeholder="Write a comment... (use @name to mention teammate)"
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    className="flex-1 px-3 py-2 bg-[var(--surface)] border border-[var(--line-strong)] rounded-xl text-xs"
                  />
                  <button
                    type="submit"
                    className="h-[34px] px-3.5 bg-[var(--accent-700)] hover:bg-[var(--accent-800)] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" /> Post
                  </button>
                </form>
              )}
            </div>

          </div>

          {/* Right Column: Properties Grid */}
          <div className="bg-[var(--surface-sunken)] p-4 rounded-xl border border-[var(--line)] space-y-4 h-fit">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--ink-muted)] border-b border-[var(--line)] pb-2">
              Properties
            </h3>

            {/* Status */}
            <div>
              <label className="block text-[11px] font-semibold text-[var(--ink-muted)] mb-1">Status</label>
              <select
                disabled={isViewer}
                value={status}
                onChange={(e) => {
                  const newSt = e.target.value as TaskStatus;
                  setStatus(newSt);
                  handleSaveProperties({ status: newSt });
                }}
                className="w-full px-2.5 py-1.5 bg-[var(--surface)] border border-[var(--line-strong)] rounded-lg text-xs font-medium text-[var(--ink)]"
              >
                <option value="backlog">Backlog</option>
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="in_review">In Review</option>
                <option value="done">Done</option>
                <option value="blocked">Blocked</option>
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-[11px] font-semibold text-[var(--ink-muted)] mb-1">Priority</label>
              <select
                disabled={isViewer}
                value={priority}
                onChange={(e) => {
                  const newPr = e.target.value as TaskPriority;
                  setPriority(newPr);
                  handleSaveProperties({ priority: newPr });
                }}
                className="w-full px-2.5 py-1.5 bg-[var(--surface)] border border-[var(--line-strong)] rounded-lg text-xs font-medium capitalize text-[var(--ink)]"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            {/* Assignee */}
            <div>
              <label className="block text-[11px] font-semibold text-[var(--ink-muted)] mb-1">Assignee</label>
              <select
                disabled={isViewer}
                value={assigneeId}
                onChange={(e) => {
                  const newId = e.target.value;
                  setAssigneeId(newId);
                  handleSaveProperties({ assignee: members.find(m => m.id === newId) });
                }}
                className="w-full px-2.5 py-1.5 bg-[var(--surface)] border border-[var(--line-strong)] rounded-lg text-xs font-medium text-[var(--ink)]"
              >
                <option value="">Unassigned</option>
                {members.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-[11px] font-semibold text-[var(--ink-muted)] mb-1">Due Date</label>
              <input
                type="date"
                disabled={isViewer}
                value={dueDate}
                onChange={(e) => {
                  setDueDate(e.target.value);
                  handleSaveProperties({ dueDate: e.target.value });
                }}
                className="w-full px-2.5 py-1.5 bg-[var(--surface)] border border-[var(--line-strong)] rounded-lg text-xs text-[var(--ink)]"
              />
            </div>

            {/* Labels */}
            <div>
              <label className="block text-[11px] font-semibold text-[var(--ink-muted)] mb-1">Labels</label>
              <div className="flex flex-wrap gap-1">
                {task.labels.map((l, idx) => {
                  const labelName = typeof l === "string" ? l : l.name;
                  const labelKey = typeof l === "string" ? `${l}-${idx}` : l.id;
                  return (
                    <span key={labelKey} className="px-2 py-0.5 rounded bg-[var(--surface)] border border-[var(--line)] text-[10px] font-medium text-[var(--ink-body)]">
                      {labelName}
                    </span>
                  );
                })}
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
