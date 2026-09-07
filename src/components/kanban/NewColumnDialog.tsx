"use client";

import React, { useState, useTransition } from "react";
import { ColumnItem } from "@/types/kanban";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createColumnAction } from "@/actions/kanban-actions";

interface NewColumnDialogProps {
  boardId: string;
  isOpen: boolean;
  onClose: () => void;
  onColumnCreated: (newColumn: ColumnItem) => void;
}

const colorDots = [
  "#6366F1", // Indigo
  "#06B6D4", // Cyan
  "#F59E0B", // Amber
  "#10B981", // Emerald
  "#EC4899", // Pink
  "#8B5CF6", // Purple
  "#64748B", // Slate
];

export function NewColumnDialog({
  boardId,
  isOpen,
  onClose,
  onColumnCreated,
}: NewColumnDialogProps) {
  const [title, setTitle] = useState("");
  const [colorDot, setColorDot] = useState(colorDots[0]);
  const [isPending, startTransition] = useTransition();

  const handleCreate = () => {
    if (!title.trim()) return;

    startTransition(async () => {
      const res = await createColumnAction({
        boardId,
        title,
        colorDot,
        order: Date.now(),
      });

      if (res.success && res.data) {
        onColumnCreated({
          id: res.data.id,
          boardId: res.data.boardId,
          title: res.data.title,
          colorDot: res.data.colorDot,
          order: res.data.order,
          tasks: [],
        });
        setTitle("");
        onClose();
      } else {
        // Fallback for mock/dev
        onColumnCreated({
          id: `col-${Date.now()}`,
          boardId,
          title,
          colorDot,
          order: Date.now(),
          tasks: [],
        });
        setTitle("");
        onClose();
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-base font-bold">Add New Column</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase">
              Column Title
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. In Review, QA Testing"
              autoFocus
              className="text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase">
              Accent Color
            </label>
            <div className="flex items-center gap-2 pt-1">
              {colorDots.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColorDot(c)}
                  className={`h-6 w-6 rounded-full transition-transform ${
                    colorDot === c ? "scale-125 ring-2 ring-primary ring-offset-2" : "hover:scale-110"
                  }`}
                  style={{ backgroundColor: c }}
                />
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
            {isPending ? "Adding..." : "Add Column"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
