"use client";

import React, { useState } from "react";
import { Notification, User } from "@/types/taskflow-v2";
import { 
  Bell, 
  CheckCheck, 
  MessageSquare, 
  UserCheck, 
  Clock, 
  ArrowRight,
  Filter
} from "lucide-react";

interface NotificationsViewProps {
  currentUser: User;
  notifications: Notification[];
  onOpenTask: (taskId: string) => void;
  onMarkAllRead: () => void;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({
  currentUser,
  notifications,
  onOpenTask,
  onMarkAllRead
}) => {
  const [activeFilter, setActiveFilter] = useState<"all" | "unread" | "mentions" | "assignments">("all");

  const filteredNotifications = notifications.filter(n => {
    if (activeFilter === "unread") return !n.read;
    if (activeFilter === "mentions") return n.type === "comment_mention";
    if (activeFilter === "assignments") return n.type === "task_assigned";
    return true;
  });

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "task_assigned":
        return <UserCheck className="w-4 h-4 text-blue-600" />;
      case "comment_mention":
        return <MessageSquare className="w-4 h-4 text-[var(--accent-700)]" />;
      case "deadline_approaching":
      default:
        return <Clock className="w-4 h-4 text-amber-600" />;
    }
  };

  return (
    <div className="w-full space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--ink)]">Notifications</h1>
          <p className="text-xs text-[var(--ink-muted)] mt-1">
            Stay updated with task assignments, team @mentions, and approaching deadlines.
          </p>
        </div>

        <button
          onClick={onMarkAllRead}
          className="h-[32px] px-3 border border-[var(--line-strong)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] text-xs font-semibold text-[var(--ink)] rounded-lg flex items-center gap-1.5 transition-colors"
        >
          <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
          Mark all as read
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-[var(--line)] pb-3">
        {(["all", "unread", "mentions", "assignments"] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
              activeFilter === tab
                ? "bg-[var(--accent-50)] text-[var(--accent-800)] border border-[var(--accent-100)]"
                : "text-[var(--ink-muted)] hover:text-[var(--ink)]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Notification List */}
      <div className="bg-[var(--surface)] border border-[var(--line)] rounded-xl divide-y divide-[var(--line)] shadow-2xs overflow-hidden">
        {filteredNotifications.length === 0 ? (
          <div className="p-12 text-center text-xs text-[var(--ink-muted)]">
            <Bell className="w-8 h-8 text-[var(--ink-faint)] mx-auto mb-2 opacity-50" />
            No notifications in this category.
          </div>
        ) : (
          filteredNotifications.map(n => (
            <div
              key={n.id}
              onClick={() => {
                if (n.targetTaskId) onOpenTask(n.targetTaskId);
              }}
              className={`p-4 hover:bg-[var(--surface-hover)] transition-colors flex items-start gap-3.5 cursor-pointer ${
                !n.read ? "bg-orange-50/20" : ""
              }`}
            >
              <div className="p-2 rounded-lg bg-[var(--surface-sunken)] border border-[var(--line)] flex-shrink-0 mt-0.5">
                {getIcon(n.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="text-xs text-[var(--ink)] leading-snug">
                    <strong className="font-semibold text-[var(--ink)]">{n.actorName}</strong> {n.title}
                  </div>
                  {!n.read && (
                    <span className="w-2 h-2 rounded-full bg-[var(--accent-700)] flex-shrink-0" />
                  )}
                </div>

                {n.body && (
                  <p className="text-xs text-[var(--ink-muted)] mt-1 line-clamp-2">
                    &ldquo;{n.body}&rdquo;
                  </p>
                )}

                <div className="flex items-center gap-2 mt-2 text-[10px] text-[var(--ink-faint)] font-mono">
                  <span>{new Date(n.timestamp || n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  {n.targetTaskId && (
                    <span className="text-[var(--accent-700)] hover:underline flex items-center gap-0.5 font-sans font-medium">
                      View Task <ArrowRight className="w-2.5 h-2.5" />
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
