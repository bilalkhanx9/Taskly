"use client";

import React, { useMemo } from "react";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { ColumnItem, TaskItem } from "@/types/kanban";
import { TaskCard } from "./TaskCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, MoreHorizontal, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface ColumnProps {
  column: ColumnItem;
  onTaskClick: (task: TaskItem) => void;
  onAddTask: (columnId: string) => void;
  onDeleteColumn?: (columnId: string) => void;
}

export function Column({ column, onTaskClick, onAddTask, onDeleteColumn }: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
  });

  const taskIds = useMemo(() => column.tasks.map((t) => t.id), [column.tasks]);

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex flex-col w-80 shrink-0 rounded-2xl bg-muted/50 p-3 border border-border/50 shadow-xs transition-colors max-h-[calc(100vh-12rem)]",
        isOver && "ring-2 ring-primary/40 bg-muted/80 border-primary/30"
      )}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between px-2 py-2 mb-2">
        <div className="flex items-center gap-2.5">
          <span
            className="h-2.5 w-2.5 rounded-full ring-2 ring-background"
            style={{ backgroundColor: column.colorDot || "#6366F1" }}
          />
          <h3 className="font-semibold text-sm tracking-tight text-foreground">
            {column.title}
          </h3>
          <Badge
            variant="secondary"
            className="h-5 px-1.5 text-[11px] font-mono rounded-md bg-background text-muted-foreground border border-border/40"
          >
            {column.tasks.length}
          </Badge>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => onAddTask(column.id)}
            className="h-7 w-7 text-muted-foreground hover:text-foreground"
            title="Add task"
          >
            <Plus className="h-4 w-4" />
          </Button>

          {onDeleteColumn && (
            <DropdownMenu>
              <DropdownMenuTrigger
                className="h-7 w-7 inline-flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <MoreHorizontal className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem
                  onClick={() => onDeleteColumn(column.id)}
                  className="text-destructive focus:text-destructive gap-2 cursor-pointer text-xs"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete Column
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Task List (Sortable Area) */}
      <div className="flex-1 overflow-y-auto space-y-2.5 p-1 pr-1.5 scrollbar-thin">
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {column.tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onClick={() => onTaskClick(task)}
            />
          ))}
        </SortableContext>

        {column.tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 border-2 border-dashed border-border/40 rounded-xl text-center px-4">
            <p className="text-xs text-muted-foreground">No tasks yet</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onAddTask(column.id)}
              className="mt-2 text-xs gap-1 text-primary hover:text-primary hover:bg-primary/10 h-7"
            >
              <Plus className="h-3.5 w-3.5" /> Add Task
            </Button>
          </div>
        )}
      </div>

      {/* Quick Add Button at Bottom */}
      {column.tasks.length > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onAddTask(column.id)}
          className="mt-2 w-full justify-start text-xs text-muted-foreground hover:text-foreground hover:bg-background/80 h-8 gap-1.5 rounded-lg border border-transparent hover:border-border/40 transition-all"
        >
          <Plus className="h-3.5 w-3.5 text-primary" /> Add Card
        </Button>
      )}
    </div>
  );
}
