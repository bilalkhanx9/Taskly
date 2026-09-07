"use client";

import React from "react";
import { Search, Bell, Plus, Sparkles, Filter, CheckCircle2 } from "lucide-react";
import { User, Project } from "@/types/taskflow";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { NavTab } from "./Sidebar";
import { cn } from "@/lib/utils";

interface TopbarProps {
  currentTab: NavTab;
  selectedProject?: Project | null;
  onOpenCommandPalette: () => void;
  onQuickAddClick: () => void;
  onOpenNotifications: () => void;
  unreadNotificationsCount: number;
  currentUser: User;
}

export function Topbar({
  currentTab,
  selectedProject,
  onOpenCommandPalette,
  onQuickAddClick,
  onOpenNotifications,
  unreadNotificationsCount,
  currentUser,
}: TopbarProps) {
  const getTabTitle = () => {
    if (selectedProject && (currentTab === "board" || currentTab === "list" || currentTab === "calendar")) {
      return selectedProject.name;
    }
    switch (currentTab) {
      case "dashboard":
        return "Dashboard Overview";
      case "my_tasks":
        return "My Tasks";
      case "board":
        return "Kanban Board";
      case "list":
        return "List View";
      case "calendar":
        return "Calendar";
      case "projects":
        return "All Projects";
      case "team":
        return "Team & Permissions";
      case "notifications":
        return "Notifications";
      case "settings":
        return "Settings & Preferences";
      default:
        return "TaskFlow";
    }
  };

  return (
    <header className="h-14 bg-white border-b border-[#E3E8E6] px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Left: Dynamic Title & Context */}
      <div className="flex items-center gap-3">
        {selectedProject && (
          <span
            className="h-3 w-3 rounded-full shrink-0"
            style={{ backgroundColor: selectedProject.color }}
          />
        )}
        <h1 className="text-sm font-bold text-[#1F2A2E] tracking-tight">
          {getTabTitle()}
        </h1>

        {selectedProject && (
          <span className="text-[11px] font-semibold text-[#0F766E] bg-[#E6F2F0] px-2 py-0.5 rounded-full">
            {selectedProject.status.toUpperCase()}
          </span>
        )}
      </div>

      {/* Right Controls: Search, Notifications, Quick Add, Avatar */}
      <div className="flex items-center gap-3">
        {/* Global Search Button (Ctrl + K) */}
        <button
          type="button"
          onClick={onOpenCommandPalette}
          className="flex items-center gap-3 px-3 py-1.5 rounded-md border border-[#E3E8E6] bg-[#F6F8F7] hover:bg-[#EFF2F1] text-xs text-[#6B7A80] transition-colors shadow-2xs"
        >
          <div className="flex items-center gap-2">
            <Search className="h-3.5 w-3.5 text-[#6B7A80]" />
            <span className="hidden sm:inline">Search tasks, projects...</span>
          </div>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.2 bg-white border border-[#CBD4D1] text-[10px] font-mono text-[#6B7A80] rounded">
            ⌘K
          </kbd>
        </button>

        {/* Notifications Icon Button with Unread Badge */}
        <button
          type="button"
          onClick={onOpenNotifications}
          className="relative p-2 rounded-md text-[#3D4A4F] hover:bg-[#EFF2F1] hover:text-[#1F2A2E] transition-colors"
          title="Notification Center"
        >
          <Bell className="h-4 w-4" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute top-1 right-1 h-4 min-w-4 px-1 rounded-full bg-[#C0342B] text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white">
              {unreadNotificationsCount}
            </span>
          )}
        </button>

        {/* Quick Add Task Button (N shortcut) */}
        <button
          type="button"
          onClick={onQuickAddClick}
          className="flex items-center gap-1.5 bg-[#0F766E] hover:bg-[#0C5F58] text-white text-xs font-semibold px-3 py-1.5 rounded-md shadow-xs transition-all active:scale-95"
        >
          <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
          <span>New task</span>
          <kbd className="hidden md:inline-block ml-1 px-1 bg-[#0C5F58] text-[9px] font-mono rounded text-white/80">
            N
          </kbd>
        </button>

        {/* User Profile Avatar */}
        <Avatar className="h-7 w-7 border border-[#E3E8E6]">
          <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} />
          <AvatarFallback className="text-[10px] bg-[#E6F2F0] text-[#0F766E] font-bold">
            BK
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
