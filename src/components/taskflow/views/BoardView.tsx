"use client";

import React, { useState, useMemo } from "react";
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
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task, TaskStatus, TaskPriority, Project, User } from "@/types/taskflow";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Calendar,
  CheckSquare,
  MessageSquare,
  Paperclip,
  Plus,
  GripVertical,
  MoreHorizontal,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface BoardViewProps {
  tasks: Task[];
  projects: Project[];
  selectedProjectId: string | null;
  onSelectProject: (id: string | null) => void;
  onTaskClick: (task: Task) => void;
  onQuickAdd: (status: TaskStatus) => void;
  onTasksReorder: (newTasks: Task[]) => void;
}

const columnConfig: { id: TaskStatus; label: string; bg: string; dot: string }[] = [
  { id: "backlog", label: "Backlog", bg: "bg-[#F1F3F2]", dot: "#6B7A80" },
  { id: "todo", label: "To Do", bg: "bg-[#F2F4F7]", dot: "#475467" },
  { id: "in_progress", label: "In Progress", bg: "bg-[#FEF6E7]", dot: "#B45309" },
  { id: "in_review", label: "In Review", bg: "bg-[#F4F0FE]", dot: "#6941C6" },
  { id: "done", label: "Done", bg: "bg-[#ECFAF0]", dot: "#15803D" },
];

const priorityLeftBorders: Record<TaskPriority, string> = {
  low: "border-l-[#8B98A0]",
  medium: "border-l-[#2E7CD6]",
  high: "border-l-[#D97706]",
  urgent: "border-l-[#C0342B]",
};

// ----------------------------------------------------
// Draggable Sortable Task Card
// ----------------------------------------------------
function KanbanCard({
  task,
  onClick,
  isOverlay = false,
}: {
  task: Task;
  onClick?: () => void;
  isOverlay?: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: { type: "Task", task },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  const completedSubtasks = task.subtasks.filter((s) => s.isCompleted).length;
  const isOverdue = task.dueDate && task.dueDate < "2026-09-07" && task.status !== "done";

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative bg-white rounded-lg p-3 border border-[#E3E8E6] border-l-4 shadow-2xs select-none transition-all duration-150",
        priorityLeftBorders[task.priority],
        isDragging && "opacity-30 ring-2 ring-[#0F766E]/40",
        isOverlay && "rotate-2 scale-105 shadow-xl ring-2 ring-[#0F766E] cursor-grabbing opacity-95",
        !isDragging && !isOverlay && "hover:border-[#CBD4D1] hover:shadow-xs"
      )}
    >
      {/* Top row: labels & drag handle */}
      <div className="flex items-center justify-between gap-1.5 mb-1.5">
        <div className="flex flex-wrap items-center gap-1">
          {task.labels.map((lbl) => (
            <span
              key={lbl.id}
              className="text-[9px] font-bold px-1.5 py-0.2 rounded-sm"
              style={{
                backgroundColor: `${lbl.color}15`,
                color: lbl.color,
              }}
            >
              {lbl.name}
            </span>
          ))}
        </div>

        <button
          {...attributes}
          {...listeners}
          type="button"
          aria-label="Drag card"
          className="text-[#9AA7AC] hover:text-[#1F2A2E] cursor-grab active:cursor-grabbing p-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <GripVertical className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Title & Click Trigger */}
      <div onClick={onClick} className="cursor-pointer">
        <h4 className="text-xs font-semibold text-[#1F2A2E] line-clamp-2 leading-snug">
          {task.title}
        </h4>
      </div>

      {/* Meta Footer: Subtasks, Due Date, Comments, Assignee */}
      <div className="mt-3 flex items-center justify-between border-t border-[#EFF2F1] pt-2 text-[11px] text-[#6B7A80]">
        <div className="flex items-center gap-2.5">
          {/* Subtasks Count (e.g. 3/7 done) */}
          {task.subtasks.length > 0 && (
            <span className="flex items-center gap-1 tabular-nums font-medium text-[10px] text-[#3D4A4F]">
              <CheckSquare className="h-3 w-3 text-[#0F766E]" />
              {completedSubtasks}/{task.subtasks.length}
            </span>
          )}

          {/* Due date */}
          {task.dueDate && (
            <span
              className={cn(
                "flex items-center gap-0.5 text-[10px] font-mono",
                isOverdue ? "text-[#C0342B] font-bold" : "text-[#6B7A80]"
              )}
            >
              <Calendar className="h-3 w-3" />
              {task.dueDate.slice(5)}
            </span>
          )}

          {/* Comments count */}
          {task.comments.length > 0 && (
            <span className="flex items-center gap-0.5 text-[10px]">
              <MessageSquare className="h-3 w-3" />
              {task.comments.length}
            </span>
          )}

          {/* Attachments */}
          {task.attachments.length > 0 && (
            <span className="flex items-center gap-0.5 text-[10px]">
              <Paperclip className="h-3 w-3" />
              {task.attachments.length}
            </span>
          )}
        </div>

        {/* Assignee Avatar */}
        {task.assignee && (
          <Avatar className="h-5 w-5 border border-white shrink-0">
            <AvatarImage src={task.assignee.avatarUrl} alt={task.assignee.name} />
            <AvatarFallback className="text-[8px] bg-[#E6F2F0] text-[#0F766E] font-bold">
              {task.assignee.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    </div>
  );
}

// ----------------------------------------------------
// Droppable Kanban Column
// ----------------------------------------------------
function KanbanColumn({
  column,
  tasks,
  onTaskClick,
  onQuickAdd,
}: {
  column: { id: TaskStatus; label: string; bg: string; dot: string };
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onQuickAdd: (status: TaskStatus) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: { type: "Column", status: column.id },
  });

  const taskIds = useMemo(() => tasks.map((t) => t.id), [tasks]);

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex flex-col w-72 shrink-0 rounded-lg p-2.5 bg-[#EFF2F1] border border-[#E3E8E6] transition-colors max-h-[calc(100vh-10rem)]",
        isOver && "ring-2 ring-[#0F766E] bg-[#E6F2F0]/60"
      )}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between px-2 py-1.5 mb-2">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: column.dot }} />
          <h3 className="font-bold text-xs text-[#1F2A2E]">{column.label}</h3>
          <span className="text-[10px] font-mono text-[#6B7A80] bg-white px-1.5 py-0.2 rounded border border-[#E3E8E6] tabular-nums">
            {tasks.length}
          </span>
        </div>

        <button
          type="button"
          onClick={() => onQuickAdd(column.id)}
          className="p-1 rounded text-[#6B7A80] hover:text-[#0F766E] hover:bg-white transition-colors"
          title="Add task"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Tasks List */}
      <div className="flex-1 overflow-y-auto space-y-2 p-1 pr-1.5 scrollbar-thin">
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <KanbanCard key={task.id} task={task} onClick={() => onTaskClick(task)} />
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 border border-dashed border-[#CBD4D1] rounded-lg text-center px-3 bg-white/40">
            <p className="text-[11px] text-[#9AA7AC]">No tasks yet</p>
            <button
              type="button"
              onClick={() => onQuickAdd(column.id)}
              className="mt-1.5 text-[11px] text-[#0F766E] font-semibold hover:underline flex items-center gap-1"
            >
              <Plus className="h-3 w-3" /> Add task
            </button>
          </div>
        )}
      </div>

      {/* Quick Add at Column Bottom */}
      {tasks.length > 0 && (
        <button
          type="button"
          onClick={() => onQuickAdd(column.id)}
          className="mt-2 w-full py-1.5 px-2 flex items-center gap-1.5 text-[11px] font-medium text-[#6B7A80] hover:text-[#0F766E] hover:bg-white rounded-md border border-transparent hover:border-[#E3E8E6] transition-all text-left"
        >
          <Plus className="h-3 w-3 text-[#0F766E]" />
          <span>Add task</span>
        </button>
      )}
    </div>
  );
}

// ----------------------------------------------------
// Main Board View Component
// ----------------------------------------------------
export function BoardView({
  tasks,
  projects,
  selectedProjectId,
  onSelectProject,
  onTaskClick,
  onQuickAdd,
  onTasksReorder,
}: BoardViewProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const filteredTasks = useMemo(() => {
    if (!selectedProjectId) return tasks;
    return tasks.filter((t) => t.projectId === selectedProjectId);
  }, [tasks, selectedProjectId]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = active.data.current?.task as Task | undefined;
    if (task) setActiveTask(task);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeTaskObj = tasks.find((t) => t.id === activeId);
    if (!activeTaskObj) return;

    // Check if dragged over a column or another task
    let targetStatus: TaskStatus | null = null;

    if (columnConfig.some((c) => c.id === overId)) {
      targetStatus = overId as TaskStatus;
    } else {
      const overTask = tasks.find((t) => t.id === overId);
      if (overTask) targetStatus = overTask.status;
    }

    if (targetStatus && activeTaskObj.status !== targetStatus) {
      const updated = tasks.map((t) =>
        t.id === activeId ? { ...t, status: targetStatus! } : t
      );
      onTasksReorder(updated);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId !== overId) {
      const oldIndex = tasks.findIndex((t) => t.id === activeId);
      const newIndex = tasks.findIndex((t) => t.id === overId);
      if (oldIndex >= 0 && newIndex >= 0) {
        const reordered = arrayMove(tasks, oldIndex, newIndex);
        onTasksReorder(reordered);
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Project Selector / Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-lg border border-[#E3E8E6] shadow-2xs">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
          <button
            type="button"
            onClick={() => onSelectProject(null)}
            className={cn(
              "px-3 py-1 rounded-md text-xs font-semibold transition-all whitespace-nowrap",
              selectedProjectId === null
                ? "bg-[#0F766E] text-white shadow-xs"
                : "bg-[#EFF2F1] text-[#3D4A4F] hover:bg-[#E6F2F0]"
            )}
          >
            All Projects ({tasks.length})
          </button>
          {projects.map((proj) => {
            const count = tasks.filter((t) => t.projectId === proj.id).length;
            const isSelected = selectedProjectId === proj.id;
            return (
              <button
                key={proj.id}
                type="button"
                onClick={() => onSelectProject(proj.id)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all whitespace-nowrap",
                  isSelected
                    ? "bg-[#0F766E] text-white font-semibold shadow-xs"
                    : "bg-[#EFF2F1] text-[#3D4A4F] hover:bg-[#E6F2F0]"
                )}
              >
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: proj.color }} />
                <span>{proj.name}</span>
                <span className="text-[10px] opacity-75">({count})</span>
              </button>
            );
          })}
        </div>

        <span className="text-[11px] text-[#6B7A80] font-medium hidden sm:inline">
          Tip: Drag cards across columns or press <kbd className="font-mono bg-[#EFF2F1] px-1 py-0.5 rounded border">N</kbd> for quick add
        </span>
      </div>

      {/* Dnd-Kit Kanban Canvas */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-6 items-start scrollbar-thin">
          {columnConfig.map((col) => {
            const colTasks = filteredTasks.filter((t) => t.status === col.id);
            return (
              <KanbanColumn
                key={col.id}
                column={col}
                tasks={colTasks}
                onTaskClick={onTaskClick}
                onQuickAdd={onQuickAdd}
              />
            );
          })}
        </div>

        <DragOverlay>
          {activeTask ? <KanbanCard task={activeTask} isOverlay /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
