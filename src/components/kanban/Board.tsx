"use client";

import React, { useState, useTransition } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { BoardData, ColumnItem, TaskItem, Priority } from "@/types/kanban";
import { Column } from "./Column";
import { TaskCard } from "./TaskCard";
import { TaskModal } from "./TaskModal";
import { NewTaskDialog } from "./NewTaskDialog";
import { NewColumnDialog } from "./NewColumnDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Filter, Sparkles, Layers, ShieldCheck, Zap } from "lucide-react";
import { reorderTaskAction, deleteColumnAction } from "@/actions/kanban-actions";

interface BoardProps {
  initialBoard: BoardData;
}

export function Board({ initialBoard }: BoardProps) {
  const [board, setBoard] = useState<BoardData>(initialBoard);
  const [activeTask, setActiveTask] = useState<TaskItem | null>(null);
  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  // New task/column dialog states
  const [targetColumnId, setTargetColumnId] = useState<string | null>(null);
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const [isNewColumnOpen, setIsNewColumnOpen] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPriority, setSelectedPriority] = useState<Priority | "ALL">("ALL");

  const [, startTransition] = useTransition();

  // Configure Sensors with 5px drag distance to allow normal clicks without triggering drag
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const findColumnOfTask = (taskId: string): ColumnItem | undefined => {
    return board.columns.find((col) => col.tasks.some((t) => t.id === taskId));
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = active.data.current?.task as TaskItem | undefined;
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeColumn = findColumnOfTask(activeId);
    const overColumn =
      board.columns.find((col) => col.id === overId) || findColumnOfTask(overId);

    if (!activeColumn || !overColumn || activeColumn.id === overColumn.id) {
      return;
    }

    setBoard((prev) => {
      const activeTasks = [...activeColumn.tasks];
      const overTasks = [...overColumn.tasks];

      const activeIndex = activeTasks.findIndex((t) => t.id === activeId);
      const [movedTask] = activeTasks.splice(activeIndex, 1);

      if (!movedTask) return prev;

      movedTask.columnId = overColumn.id;

      const overIndex = overTasks.findIndex((t) => t.id === overId);
      const newIndex = overIndex >= 0 ? overIndex : overTasks.length;

      overTasks.splice(newIndex, 0, movedTask);

      return {
        ...prev,
        columns: prev.columns.map((col) => {
          if (col.id === activeColumn.id) return { ...col, tasks: activeTasks };
          if (col.id === overColumn.id) return { ...col, tasks: overTasks };
          return col;
        }),
      };
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const column = findColumnOfTask(activeId);
    if (!column) return;

    const oldIndex = column.tasks.findIndex((t) => t.id === activeId);
    const newIndex = column.tasks.findIndex((t) => t.id === overId);

    if (oldIndex !== newIndex && newIndex >= 0) {
      const reorderedTasks = arrayMove(column.tasks, oldIndex, newIndex);

      setBoard((prev) => ({
        ...prev,
        columns: prev.columns.map((col) =>
          col.id === column.id ? { ...col, tasks: reorderedTasks } : col
        ),
      }));

      // Persist to database via Server Action
      startTransition(async () => {
        await reorderTaskAction({
          taskId: activeId,
          sourceColumnId: column.id,
          destinationColumnId: column.id,
          newOrder: newIndex,
        });
      });
    }
  };

  // Task open handler
  const handleTaskClick = (task: TaskItem) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };

  const handleTaskUpdated = (updatedTask: TaskItem) => {
    setBoard((prev) => ({
      ...prev,
      columns: prev.columns.map((col) => ({
        ...col,
        tasks: col.tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)),
      })),
    }));
    setSelectedTask(updatedTask);
  };

  const handleTaskDeleted = (taskId: string) => {
    setBoard((prev) => ({
      ...prev,
      columns: prev.columns.map((col) => ({
        ...col,
        tasks: col.tasks.filter((t) => t.id !== taskId),
      })),
    }));
    setIsTaskModalOpen(false);
  };

  const handleTaskCreated = (newTask: TaskItem) => {
    setBoard((prev) => ({
      ...prev,
      columns: prev.columns.map((col) =>
        col.id === newTask.columnId
          ? { ...col, tasks: [...col.tasks, newTask] }
          : col
      ),
    }));
  };

  const handleColumnCreated = (newColumn: ColumnItem) => {
    setBoard((prev) => ({
      ...prev,
      columns: [...prev.columns, newColumn],
    }));
  };

  const handleDeleteColumn = (columnId: string) => {
    setBoard((prev) => ({
      ...prev,
      columns: prev.columns.filter((col) => col.id !== columnId),
    }));
    startTransition(async () => {
      await deleteColumnAction({ id: columnId });
    });
  };

  // Filter columns and tasks by search & priority
  const filteredColumns = board.columns.map((col) => ({
    ...col,
    tasks: col.tasks.filter((t) => {
      const matchesSearch =
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesPriority =
        selectedPriority === "ALL" || t.priority === selectedPriority;
      return matchesSearch && matchesPriority;
    }),
  }));

  const totalTasks = board.columns.reduce((acc, col) => acc + col.tasks.length, 0);

  return (
    <div className="flex flex-col h-full w-full">
      {/* Board Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/50 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            {board.title}
          </h2>
          <Badge variant="outline" className="font-mono text-xs">
            {totalTasks} Tasks
          </Badge>
        </div>

        {/* Filter Controls & Add Actions */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Input */}
          <div className="relative w-56">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks..."
              className="pl-8 h-9 text-xs"
            />
          </div>

          {/* Priority Quick Filter */}
          <div className="flex items-center bg-muted/60 p-1 rounded-lg border border-border/40 text-xs">
            {(["ALL", "LOW", "MEDIUM", "HIGH", "URGENT"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setSelectedPriority(p)}
                className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                  selectedPriority === p
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Add Column Button */}
          <Button
            size="sm"
            onClick={() => setIsNewColumnOpen(true)}
            variant="outline"
            className="h-9 gap-1.5 text-xs font-semibold"
          >
            <Plus className="h-4 w-4" /> Add Column
          </Button>

          {/* New Task Button */}
          <Button
            size="sm"
            onClick={() => {
              setTargetColumnId(board.columns[0]?.id || null);
              setIsNewTaskOpen(true);
            }}
            className="h-9 gap-1.5 text-xs font-semibold shadow-xs"
          >
            <Plus className="h-4 w-4" /> New Task
          </Button>
        </div>
      </div>

      {/* Main Drag & Drop Kanban Canvas */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex flex-1 gap-5 overflow-x-auto pb-6 items-start scrollbar-thin">
          {filteredColumns.map((column) => (
            <Column
              key={column.id}
              column={column}
              onTaskClick={handleTaskClick}
              onAddTask={(colId) => {
                setTargetColumnId(colId);
                setIsNewTaskOpen(true);
              }}
              onDeleteColumn={handleDeleteColumn}
            />
          ))}

          {/* Add Column Ghost Box at End */}
          <button
            onClick={() => setIsNewColumnOpen(true)}
            className="flex flex-col items-center justify-center w-72 shrink-0 h-32 rounded-2xl border-2 border-dashed border-border/60 hover:border-primary/50 text-muted-foreground hover:text-foreground hover:bg-muted/20 transition-all text-xs font-semibold gap-2"
          >
            <Plus className="h-5 w-5 text-primary" /> Add another list
          </button>
        </div>

        {/* Drag Overlay for Smooth Visual Representation */}
        <DragOverlay>
          {activeTask ? <TaskCard task={activeTask} isOverlay /> : null}
        </DragOverlay>
      </DndContext>

      {/* Dialogs */}
      <TaskModal
        task={selectedTask}
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onTaskUpdated={handleTaskUpdated}
        onTaskDeleted={handleTaskDeleted}
      />

      <NewTaskDialog
        boardId={board.id}
        columnId={targetColumnId}
        isOpen={isNewTaskOpen}
        onClose={() => setIsNewTaskOpen(false)}
        onTaskCreated={handleTaskCreated}
      />

      <NewColumnDialog
        boardId={board.id}
        isOpen={isNewColumnOpen}
        onClose={() => setIsNewColumnOpen(false)}
        onColumnCreated={handleColumnCreated}
      />
    </div>
  );
}
