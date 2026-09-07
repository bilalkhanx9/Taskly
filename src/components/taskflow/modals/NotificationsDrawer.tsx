"use client";

import React, { useState } from "react";
import { NotificationItem, Task } from "@/types/taskflow";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Bell, Check, UserCheck, MessageSquare, AlertTriangle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  tasks: Task[];
  onSelectTask: (task: Task) => void;
  onMarkAllAsRead: () => void;
  onMarkAsRead: (id: string) => void;
}

export function NotificationsDrawer({
  isOpen,
  onClose,
  notifications,
  tasks,
  onSelectTask,
  onMarkAllAsRead,
  onMarkAsRead,
}: NotificationsDrawerProps) {
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const filtered = notifications.filter((n) => {
    if (filter === "unread") return !n.isRead;
    return true;
  });

  const getIcon = (type: NotificationItem["type"]) => {
    switch (type) {
      case "assignment":
        return <UserCheck className="h-4 w-4 text-[#0F766E]" />;
      case "mention":
        return <MessageSquare className="h-4 w-4 text-[#2E7CD6]" />;
      case "due_soon":
      case "overdue":
        return <AlertTriangle className="h-4 w-4 text-[#C0342B]" />;
      case "status_change":
        return <CheckCircle2 className="h-4 w-4 text-[#15803D]" />;
      default:
        return <Bell className="h-4 w-4 text-[#6B7A80]" />;
    }
  };

  const handleNotificationClick = (notif: NotificationItem) => {
    onMarkAsRead(notif.id);
    if (notif.relatedTaskId) {
      const task = tasks.find((t) => t.id === notif.relatedTaskId);
      if (task) {
        onSelectTask(task);
        onClose();
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md p-0 overflow-hidden bg-white border border-[#E3E8E6] rounded-xl shadow-xl">
        <DialogHeader className="p-4 border-b border-[#E3E8E6] bg-[#F6F8F7] flex flex-row items-center justify-between space-y-0">
          <DialogTitle className="text-sm font-bold text-[#1F2A2E] flex items-center gap-2">
            <Bell className="h-4 w-4 text-[#0F766E]" /> Notifications
          </DialogTitle>
          <button
            type="button"
            onClick={onMarkAllAsRead}
            className="text-[11px] font-semibold text-[#0F766E] hover:underline"
          >
            Mark all as read
          </button>
        </DialogHeader>

        {/* Filter Buttons */}
        <div className="flex items-center gap-2 px-4 py-2 border-b border-[#E3E8E6] bg-white">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={cn(
              "px-2.5 py-1 text-xs font-semibold rounded-md transition-all",
              filter === "all" ? "bg-[#E6F2F0] text-[#0F766E]" : "text-[#6B7A80] hover:bg-[#F6F8F7]"
            )}
          >
            All ({notifications.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("unread")}
            className={cn(
              "px-2.5 py-1 text-xs font-semibold rounded-md transition-all",
              filter === "unread" ? "bg-[#E6F2F0] text-[#0F766E]" : "text-[#6B7A80] hover:bg-[#F6F8F7]"
            )}
          >
            Unread ({notifications.filter((n) => !n.isRead).length})
          </button>
        </div>

        {/* Notifications List */}
        <div className="max-h-80 overflow-y-auto divide-y divide-[#EFF2F1] p-1">
          {filtered.map((notif) => (
            <div
              key={notif.id}
              onClick={() => handleNotificationClick(notif)}
              className={cn(
                "p-3 rounded-lg flex items-start gap-3 hover:bg-[#F6F8F7] cursor-pointer transition-colors text-xs",
                !notif.isRead && "bg-[#E6F2F0]/30"
              )}
            >
              <div className="h-8 w-8 rounded-full bg-white border border-[#E3E8E6] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                {getIcon(notif.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-[#1F2A2E] leading-tight">{notif.title}</h4>
                  <span className="text-[10px] text-[#9AA7AC]">
                    {notif.createdAt.slice(11, 16)}
                  </span>
                </div>
                <p className="text-[#3D4A4F] mt-0.5 leading-snug">{notif.message}</p>
              </div>

              {!notif.isRead && (
                <span className="h-2 w-2 rounded-full bg-[#0F766E] shrink-0 mt-1.5" />
              )}
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="py-10 text-center text-xs text-[#9AA7AC]">
              No notifications to display.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
