"use client";

import React, { useState, useTransition } from "react";
import { Priority, TaskItem } from "@/types/kanban";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createTaskAction } from "@/actions/kanban-actions";

interface NewTaskDialogProps {
  boardId: string;
  columnId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onTaskCreated: (newTask: TaskItem) => void;
}

const priorities: Priority[] = ["LOW", "MEDIUM", "HIGH", "URGENT"];

export function NewTaskDialog({
  boardId,
  columnId,
  isOpen,
  onClose,
  onTaskCreated,
}: NewTaskDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("MEDIUM");
  const [isPending, startTransition] = useTransition();

  const handleCreate = () => {
    if (!title.trim() || !columnId) return;

    startTransition(async () => {
      const res = await createTaskAction({
        boardId,
        columnId,
        title,
        description,
        priority,
        order: Date.now(),
      });

      if (res.success && res.data) {
        onTaskCreated({
          id: res.data.id,
          boardId: res.data.boardId,
          columnId: res.data.columnId,
          title: res.data.title,
          description: res.data.description,
          priority: res.data.priority as Priority,
          dueDate: res.data.dueDate,
          order: res.data.order,
          attachments: [],
          comments: [],
        });
        setTitle("");
        setDescription("");
        setPriority("MEDIUM");
        onClose();
      } else {
        // Mock fallback if DB is not connected yet
        const mockTask: TaskItem = {
          id: `task-${Date.now()}`,
          boardId,
          columnId,
          title,
          description,
          priority,
          order: Date.now(),
          attachments: [],
          comments: [],
        };
        onTaskCreated(mockTask);
        setTitle("");
        setDescription("");
        onClose();
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base font-bold">Create New Task</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase">
              Task Title
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Implement Cloudflare R2 Uploads"
              autoFocus
              className="text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add key objectives, criteria or notes..."
              rows={3}
              className="w-full rounded-xl border border-input bg-background/50 p-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase">
              Priority
            </label>
            <div className="grid grid-cols-4 gap-2">
              {priorities.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`text-xs py-1.5 rounded-lg font-medium transition-all text-center ${
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
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleCreate}
            disabled={!title.trim() || isPending}
          >
            {isPending ? "Creating..." : "Create Task"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
