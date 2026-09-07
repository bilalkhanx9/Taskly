"use client";

import React, { useState, useTransition } from "react";
import { TaskItem, Priority, Attachment } from "@/types/kanban";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Paperclip,
  MessageSquare,
  Trash2,
  Upload,
  Clock,
  Send,
  Loader2,
  FileText,
} from "lucide-react";
import {
  updateTaskAction,
  deleteTaskAction,
  addCommentAction,
  requestAttachmentUploadAction,
  confirmAttachmentAction,
} from "@/actions/kanban-actions";

interface TaskModalProps {
  task: TaskItem | null;
  isOpen: boolean;
  onClose: () => void;
  onTaskUpdated: (updatedTask: TaskItem) => void;
  onTaskDeleted: (taskId: string) => void;
}

const priorities: Priority[] = ["LOW", "MEDIUM", "HIGH", "URGENT"];

export function TaskModal({
  task,
  isOpen,
  onClose,
  onTaskUpdated,
  onTaskDeleted,
}: TaskModalProps) {
  if (!task) return null;

  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [priority, setPriority] = useState<Priority>(task.priority);
  const [newComment, setNewComment] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSaveDetails = () => {
    startTransition(async () => {
      const res = await updateTaskAction({
        id: task.id,
        title,
        description,
        priority,
      });
      if (res.success && res.data) {
        onTaskUpdated({
          ...task,
          title,
          description,
          priority,
        });
        onClose();
      }
    });
  };

  const handleDelete = () => {
    startTransition(async () => {
      const res = await deleteTaskAction(task.id);
      if (res.success) {
        onTaskDeleted(task.id);
        onClose();
      }
    });
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    startTransition(async () => {
      const res = await addCommentAction({
        taskId: task.id,
        content: newComment,
      });

      if (res.success && res.data) {
        const updatedComments = [
          ...(task.comments || []),
          {
            id: res.data.id,
            content: res.data.content,
            createdAt: new Date(),
            user: {
              id: "demo-user-1",
              name: "Demo User",
              image: null,
            },
          },
        ];
        onTaskUpdated({ ...task, comments: updatedComments });
        setNewComment("");
      }
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // 1. Request presigned upload URL from Server Action
      const presignRes = await requestAttachmentUploadAction({
        taskId: task.id,
        filename: file.name,
        fileType: file.type || "application/octet-stream",
        fileSize: file.size,
      });

      if (presignRes.success && presignRes.publicUrl && presignRes.fileKey) {
        // 2. Upload file or record metadata
        const confirmRes = await confirmAttachmentAction({
          taskId: task.id,
          name: file.name,
          fileKey: presignRes.fileKey,
          url: presignRes.publicUrl,
          size: file.size,
          type: file.type || "file",
        });

        if (confirmRes.success && confirmRes.data) {
          const newAtt: Attachment = {
            id: confirmRes.data.id,
            name: confirmRes.data.name,
            url: confirmRes.data.url,
            fileKey: confirmRes.data.fileKey,
            size: confirmRes.data.size,
            type: confirmRes.data.type,
          };
          onTaskUpdated({
            ...task,
            attachments: [...(task.attachments || []), newAtt],
          });
        }
      }
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
              Task ID: {task.id.slice(-6)}
            </span>
            <div className="flex items-center gap-1.5">
              {priorities.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`text-xs px-2.5 py-1 rounded-md font-medium transition-all ${
                    priority === p
                      ? "bg-primary text-primary-foreground shadow-xs ring-2 ring-primary/40"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-lg font-bold tracking-tight border-none focus-visible:ring-1 px-1 -mx-1"
            placeholder="Task Title"
          />
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
          {/* Main Details (Left 2 cols) */}
          <div className="md:col-span-2 space-y-6">
            {/* Description */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a detailed description for this task..."
                rows={4}
                className="w-full rounded-xl border border-input bg-background/50 p-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none leading-relaxed"
              />
            </div>

            {/* Attachments (Cloudflare R2) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Paperclip className="h-3.5 w-3.5" /> Attachments (Cloudflare R2)
                </label>
                <label className="cursor-pointer">
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                  />
                  <span className="inline-flex items-center gap-1.5 text-xs text-primary font-medium hover:underline">
                    {isUploading ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Upload className="h-3 w-3" />
                    )}
                    Upload File
                  </span>
                </label>
              </div>

              {task.attachments && task.attachments.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {task.attachments.map((att) => (
                    <a
                      key={att.id}
                      href={att.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 p-2 rounded-lg border border-border/60 bg-muted/30 hover:bg-muted/60 transition-colors text-xs"
                    >
                      <FileText className="h-4 w-4 text-primary shrink-0" />
                      <span className="truncate font-medium flex-1">{att.name}</span>
                      <span className="text-[10px] text-muted-foreground">
                        {(att.size / 1024).toFixed(0)}KB
                      </span>
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground italic">No files attached</p>
              )}
            </div>

            <Separator />

            {/* Comments */}
            <div className="space-y-3">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquare className="h-3.5 w-3.5" /> Activity & Comments
              </label>

              <div className="flex gap-2">
                <Input
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
                  placeholder="Write a comment..."
                  className="text-xs h-9"
                />
                <Button
                  size="sm"
                  onClick={handleAddComment}
                  disabled={isPending || !newComment.trim()}
                  className="h-9 px-3 gap-1"
                >
                  <Send className="h-3.5 w-3.5" />
                </Button>
              </div>

              <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                {task.comments && task.comments.length > 0 ? (
                  task.comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="flex items-start gap-2.5 p-2.5 rounded-lg bg-muted/40 border border-border/40 text-xs"
                    >
                      <Avatar className="h-6 w-6 mt-0.5">
                        <AvatarImage src={comment.user.image || ""} />
                        <AvatarFallback className="text-[10px]">
                          {comment.user.name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-foreground">
                            {comment.user.name || "User"}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {new Date(comment.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <p className="mt-1 text-muted-foreground">{comment.content}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground italic">No comments yet</p>
                )}
              </div>
            </div>
          </div>

          {/* Meta Info Sidebar (Right 1 col) */}
          <div className="space-y-5 border-l border-border/40 pl-5">
            {/* Assignee */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-muted-foreground uppercase">
                Assignee
              </span>
              <div className="flex items-center gap-2 pt-1">
                <Avatar className="h-7 w-7">
                  <AvatarImage src={task.assignee?.image || ""} />
                  <AvatarFallback className="text-xs bg-primary/10 text-primary font-bold">
                    {task.assignee?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-xs font-medium text-foreground">
                    {task.assignee?.name || "Unassigned"}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {task.assignee?.email || "No email"}
                  </p>
                </div>
              </div>
            </div>

            {/* Due Date */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-muted-foreground uppercase">
                Due Date
              </span>
              <div className="flex items-center gap-1.5 text-xs text-foreground pt-1">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>
                  {task.dueDate
                    ? new Date(task.dueDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "No due date set"}
                </span>
              </div>
            </div>

            <Separator />

            {/* Actions */}
            <div className="space-y-2 pt-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                disabled={isPending}
                className="w-full justify-start text-xs gap-2 h-8"
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete Task
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleSaveDetails} disabled={isPending}>
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
