"use client";

import React, { useState } from "react";
import {
  LayoutDashboard,
  Kanban,
  ListTodo,
  CalendarDays,
  CheckSquare,
  FolderKanban,
  Users,
  Bell,
  Settings,
  Plus,
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
  Sparkles,
  Layers,
  CircleDot,
} from "lucide-react";
import { Workspace, Project, User } from "@/types/taskflow";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export type NavTab =
  | "dashboard"
  | "board"
  | "list"
  | "calendar"
  | "my_tasks"
  | "projects"
  | "team"
  | "notifications"
  | "settings";

interface SidebarProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  selectedProjectId?: string | null;
  onSelectProject?: (projectId: string | null) => void;
  workspaces: Workspace[];
  currentWorkspace: Workspace;
  onWorkspaceChange: (ws: Workspace) => void;
  projects: Project[];
  onNewProjectClick: () => void;
  currentUser: User;
  unreadNotificationsCount: number;
  myTasksCount: number;
}

export function Sidebar({
  currentTab,
  onTabChange,
  selectedProjectId,
  onSelectProject,
  workspaces,
  currentWorkspace,
  onWorkspaceChange,
  projects,
  onNewProjectClick,
  currentUser,
  unreadNotificationsCount,
  myTasksCount,
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const mainNavItems = [
    { id: "dashboard" as NavTab, label: "Dashboard", icon: LayoutDashboard },
    { id: "my_tasks" as NavTab, label: "My Tasks", icon: CheckSquare, count: myTasksCount },
    { id: "board" as NavTab, label: "Board (Kanban)", icon: Kanban },
    { id: "list" as NavTab, label: "List View", icon: ListTodo },
    { id: "calendar" as NavTab, label: "Calendar", icon: CalendarDays },
    { id: "projects" as NavTab, label: "Projects", icon: FolderKanban, count: projects.length },
    { id: "team" as NavTab, label: "Team Members", icon: Users },
    { id: "notifications" as NavTab, label: "Notifications", icon: Bell, count: unreadNotificationsCount },
  ];

  return (
    <aside
      className={cn(
        "bg-white border-r border-[#E3E8E6] flex flex-col justify-between shrink-0 transition-all duration-200 select-none z-30 min-h-screen",
        isCollapsed ? "w-16 p-2" : "w-60 p-3"
      )}
    >
      <div className="space-y-4">
        {/* Workspace Selector / Brand Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E3E8E6]">
          {!isCollapsed ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-[#EFF2F1] transition-colors w-full text-left outline-none group">
                <div className="h-7 w-7 rounded-md bg-[#0F766E] flex items-center justify-center text-white font-bold text-xs shadow-xs shrink-0">
                  TF
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-xs font-bold text-[#1F2A2E] truncate leading-tight">
                    {currentWorkspace.name}
                  </h2>
                  <span className="text-[10px] text-[#6B7A80] font-medium block">
                    {currentWorkspace.membersCount} members
                  </span>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-[#6B7A80] group-hover:text-[#1F2A2E]" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56 p-1">
                <div className="px-2 py-1.5 text-[10px] font-bold text-[#9AA7AC] uppercase tracking-wider">
                  Workspaces
                </div>
                {workspaces.map((ws) => (
                  <DropdownMenuItem
                    key={ws.id}
                    onClick={() => onWorkspaceChange(ws)}
                    className={cn(
                      "flex items-center justify-between px-2.5 py-1.5 text-xs font-medium cursor-pointer rounded-md",
                      ws.id === currentWorkspace.id ? "bg-[#E6F2F0] text-[#0F766E] font-bold" : ""
                    )}
                  >
                    <span>{ws.name}</span>
                    <span className="text-[10px] text-[#6B7A80]">{ws.projectsCount} projs</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="h-8 w-8 rounded-md bg-[#0F766E] flex items-center justify-center text-white font-bold text-xs mx-auto shadow-xs">
              TF
            </div>
          )}

          {/* Collapse Toggle */}
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded-md text-[#6B7A80] hover:text-[#1F2A2E] hover:bg-[#EFF2F1] transition-colors hidden md:block shrink-0"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronsRight className="h-3.5 w-3.5" />
            ) : (
              <ChevronsLeft className="h-3.5 w-3.5" />
            )}
          </button>
        </div>

        {/* Main Navigation Links */}
        <nav className="space-y-0.5">
          {mainNavItems.map((item) => {
            const isActive = currentTab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onTabChange(item.id);
                  if (item.id === "projects") onSelectProject?.(null);
                }}
                className={cn(
                  "w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition-all group",
                  isActive
                    ? "bg-[#E6F2F0] text-[#0F766E] font-semibold"
                    : "text-[#3D4A4F] hover:text-[#1F2A2E] hover:bg-[#EFF2F1]"
                )}
                title={isCollapsed ? item.label : undefined}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon
                    className={cn(
                      "h-4 w-4 shrink-0 transition-colors",
                      isActive ? "text-[#0F766E]" : "text-[#6B7A80] group-hover:text-[#1F2A2E]"
                    )}
                  />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </div>

                {!isCollapsed && item.count !== undefined && item.count > 0 && (
                  <span
                    className={cn(
                      "text-[10px] font-bold px-1.5 py-0.2 rounded-full tabular-nums",
                      isActive ? "bg-[#0F766E] text-white" : "bg-[#EFF2F1] text-[#6B7A80]"
                    )}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Projects Quick Links Section */}
        {!isCollapsed && (
          <div className="pt-2 border-t border-[#E3E8E6] space-y-1">
            <div className="flex items-center justify-between px-2.5 py-1">
              <span className="text-[10px] font-bold text-[#6B7A80] uppercase tracking-wider">
                Projects
              </span>
              <button
                type="button"
                onClick={onNewProjectClick}
                className="text-[#6B7A80] hover:text-[#0F766E] p-0.5 rounded hover:bg-[#EFF2F1] transition-colors"
                title="Create Project"
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>

            <div className="space-y-0.5 max-h-44 overflow-y-auto pr-1">
              {projects.map((proj) => {
                const isSelected = selectedProjectId === proj.id;
                return (
                  <button
                    key={proj.id}
                    type="button"
                    onClick={() => {
                      onSelectProject?.(proj.id);
                      onTabChange("board");
                    }}
                    className={cn(
                      "w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors text-left group",
                      isSelected
                        ? "bg-[#E6F2F0] text-[#0F766E] font-semibold"
                        : "text-[#3D4A4F] hover:text-[#1F2A2E] hover:bg-[#EFF2F1]"
                    )}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="h-2 w-2 rounded-full shrink-0"
                        style={{ backgroundColor: proj.color }}
                      />
                      <span className="truncate">{proj.name}</span>
                    </div>
                    <span className="text-[10px] text-[#6B7A80] tabular-nums font-mono">
                      {proj.completedTasks}/{proj.totalTasks}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Bottom User & Settings Footer */}
      <div className="pt-3 border-t border-[#E3E8E6] space-y-2">
        {!isCollapsed ? (
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2 min-w-0">
              <Avatar className="h-7 w-7 border border-[#E3E8E6]">
                <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} />
                <AvatarFallback className="text-[10px] bg-[#E6F2F0] text-[#0F766E] font-bold">
                  BK
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="text-xs font-bold text-[#1F2A2E] truncate leading-tight">
                  {currentUser.name}
                </p>
                <p className="text-[10px] text-[#6B7A80] truncate">
                  {currentUser.jobTitle}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onTabChange("settings")}
              className={cn(
                "p-1.5 rounded-md text-[#6B7A80] hover:text-[#1F2A2E] hover:bg-[#EFF2F1] transition-colors",
                currentTab === "settings" ? "text-[#0F766E] bg-[#E6F2F0]" : ""
              )}
              title="Settings"
            >
              <Settings className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => onTabChange("settings")}
            className="h-8 w-8 mx-auto flex items-center justify-center text-[#6B7A80] hover:text-[#1F2A2E] hover:bg-[#EFF2F1] rounded-md transition-colors"
          >
            <Settings className="h-4 w-4" />
          </button>
        )}
      </div>
    </aside>
  );
}
