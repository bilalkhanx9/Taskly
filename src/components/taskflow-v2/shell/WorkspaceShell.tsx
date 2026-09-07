"use client";

import React, { useState } from "react";
import {
  Workspace,
  Project,
  User,
  UserRole,
} from "@/types/taskflow-v2";
import {
  LayoutDashboard,
  CheckSquare,
  FolderKanban,
  Calendar as CalendarIcon,
  Users,
  TrendingUp,
  Settings,
  Plus,
  Search,
  Bell,
  HelpCircle,
  ChevronsLeft,
  ChevronsRight,
  ChevronDown,
  Check,
  Building,
  UserPlus,
  Link,
  LogOut,
  Moon,
  Sun,
  Shield,
  KeyRound,
} from "lucide-react";

export type WorkspaceTab =
  | "home"
  | "my_tasks"
  | "projects"
  | "project_dashboard"
  | "board"
  | "list"
  | "calendar"
  | "team"
  | "reports"
  | "notifications"
  | "settings";

interface WorkspaceShellProps {
  currentTab?: WorkspaceTab | string;
  onTabChange?: (tab: WorkspaceTab) => void;
  workspaces?: Workspace[];
  currentWorkspace?: Workspace;
  workspace?: Workspace;
  onWorkspaceChange?: (ws: Workspace) => void;
  onSwitchWorkspace?: (wsId: string) => void;
  onCreateWorkspace?: () => void;
  projects?: Project[];
  currentProject?: Project | null;
  onSelectProject?: ((proj: Project) => void) | ((projId: string) => void);
  onNewProjectClick?: () => void;
  onNewTask?: () => void;
  currentUser: User;
  onSwitchRole?: (role: UserRole) => void;
  unreadNotificationsCount?: number;
  unreadNotificationCount?: number;
  myTasksCount?: number;
  onOpenCommandPalette?: () => void;
  onOpenSearch?: () => void;
  onQuickAddClick?: () => void;
  onOpenNotifications?: () => void;
  onNavigate?: (screen: string) => void;
  onSignOut?: () => void;
  activeScreen?: string;
  children: React.ReactNode;
}

export function WorkspaceShell({
  currentTab,
  onTabChange,
  workspaces = [],
  currentWorkspace,
  workspace,
  onWorkspaceChange,
  onSwitchWorkspace,
  onCreateWorkspace,
  projects = [],
  currentProject,
  onSelectProject,
  onNewProjectClick,
  onNewTask,
  currentUser,
  onSwitchRole,
  unreadNotificationsCount,
  unreadNotificationCount,
  myTasksCount = 0,
  onOpenCommandPalette,
  onOpenSearch,
  onQuickAddClick,
  onOpenNotifications,
  onNavigate,
  onSignOut,
  activeScreen,
  children,
}: WorkspaceShellProps) {
  const activeWs = currentWorkspace || workspace || workspaces[0] || ({ id: "ws-1", name: "Nova Studio", slug: "nova-studio" } as Workspace);
  const unreadCount = unreadNotificationsCount ?? unreadNotificationCount ?? 0;
  const activeTabName = (activeScreen || currentTab || "home") as WorkspaceTab;

  const handleTabChange = (tab: WorkspaceTab) => {
    if (onTabChange) onTabChange(tab);
    if (onNavigate) {
      if (tab === "my_tasks") onNavigate("my-tasks");
      else if (tab === "team") onNavigate("team-directory");
      else if (tab === "projects") onNavigate("projects-list");
      else onNavigate(tab);
    }
  };

  const handleQuickAdd = onQuickAddClick || onNewTask || (() => {});
  const handleOpenSearch = onOpenCommandPalette || onOpenSearch || (() => {});
  const handleOpenNotifications = onOpenNotifications || (() => onNavigate?.("notifications"));

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isWsDropdownOpen, setIsWsDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const mainNavItems = [
    { id: "home" as WorkspaceTab, label: "Home", icon: LayoutDashboard },
    { id: "my_tasks" as WorkspaceTab, label: "My tasks", icon: CheckSquare, count: myTasksCount },
    { id: "projects" as WorkspaceTab, label: "Projects", icon: FolderKanban, count: projects.length },
    { id: "calendar" as WorkspaceTab, label: "Calendar", icon: CalendarIcon },
    { id: "team" as WorkspaceTab, label: "Team", icon: Users },
    { id: "reports" as WorkspaceTab, label: "Reports", icon: TrendingUp },
  ];

  // Breadcrumb generator
  const getBreadcrumb = () => {
    if (activeTabName === "project_dashboard" || activeTabName === "board" || activeTabName === "list") {
      return (
        <div className="flex items-center gap-1.5 text-xs">
          <span
            onClick={() => handleTabChange("home")}
            className="text-[var(--ink-muted)] hover:text-[var(--ink)] cursor-pointer"
          >
            {activeWs.name}
          </span>
          <span className="text-[var(--ink-faint)]">›</span>
          <span className="font-semibold text-[var(--ink)]">
            {currentProject ? currentProject.name : "Project"}
          </span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-1.5 text-xs">
        <span className="text-[var(--ink-muted)]">{activeWs.name}</span>
        <span className="text-[var(--ink-faint)]">›</span>
        <span className="font-semibold text-[var(--ink)] capitalize">
          {String(activeTabName).replace("_", " ")}
        </span>
      </div>
    );
  };

  return (
    <div className="h-screen h-[100dvh] bg-[var(--canvas)] text-[var(--ink)] flex font-sans antialiased overflow-hidden">
      {/* 1. SIDEBAR (Section 4.4 - Fixed Height & Independently Scrollable) */}
      <aside
        className={`h-full bg-[var(--surface)] border-r border-[var(--line)] flex flex-col justify-between shrink-0 transition-all duration-200 select-none z-30 overflow-hidden ${
          isCollapsed ? "w-16 p-2" : "w-[248px] p-3"
        }`}
      >
        {/* Top Fixed Section: Brand & Workspace Switcher */}
        <div className="shrink-0 space-y-2 pb-2">
          {/* Taskly Brand Header */}
          {!isCollapsed ? (
            <div 
              onClick={() => onNavigate && onNavigate("landing")}
              className="flex items-center justify-between px-2 pt-1 pb-1 cursor-pointer group"
              title="Taskly Home"
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#EA580C] to-[#C2410C] flex items-center justify-center text-white font-black text-xs shadow-xs">
                  T
                </div>
                <span className="font-bold text-sm tracking-tight text-[var(--ink)] group-hover:text-[var(--accent-700)] transition-colors">
                  Taskly<span className="text-[var(--accent-700)]">.</span>
                </span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[var(--surface-sunken)] border border-[var(--line)] text-[var(--ink-muted)]">
                v2.0
              </span>
            </div>
          ) : (
            <div 
              onClick={() => onNavigate && onNavigate("landing")}
              className="w-8 h-8 mx-auto rounded-md bg-gradient-to-br from-[#EA580C] to-[#C2410C] flex items-center justify-center text-white font-black text-xs shadow-xs cursor-pointer mb-2"
              title="Taskly Home"
            >
              T
            </div>
          )}

          {/* Workspace Switcher (Section 4.3) */}
          <div className="relative">
            {!isCollapsed ? (
              <button
                type="button"
                onClick={() => setIsWsDropdownOpen(!isWsDropdownOpen)}
                className="w-full h-9 px-2 flex items-center justify-between rounded-md hover:bg-[var(--surface-hover)] transition-colors border border-transparent hover:border-[var(--line)]"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-6 h-6 rounded bg-[var(--accent-100)] text-[var(--accent-700)] flex items-center justify-center font-bold text-xs shrink-0">
                    {activeWs.logoUrl || activeWs.name.charAt(0)}
                  </div>
                  <span className="text-xs font-bold text-[var(--ink)] truncate max-w-[130px] leading-tight">
                    {activeWs.name}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-[var(--ink-muted)] shrink-0" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsWsDropdownOpen(!isWsDropdownOpen)}
                className="w-9 h-9 mx-auto rounded-md bg-[var(--accent-100)] text-[var(--accent-700)] flex items-center justify-center font-bold text-xs shadow-xs"
                title={activeWs.name}
              >
                {activeWs.name.charAt(0)}
              </button>
            )}

            {/* Switcher Dropdown (280px wide) */}
            {isWsDropdownOpen && (
              <div className="absolute top-11 left-0 w-[280px] bg-white rounded-lg border border-[var(--line)] shadow-xl z-50 p-2 text-xs space-y-1 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-2.5 py-1 text-[11px] text-[var(--ink-muted)] border-b border-[var(--line)] pb-1.5">
                  Signed in as <strong className="text-[var(--ink)] block truncate">{currentUser.email}</strong>
                </div>

                <div className="py-1 space-y-0.5 max-h-48 overflow-y-auto">
                  {workspaces.map((ws) => (
                    <button
                      key={ws.id}
                      type="button"
                      onClick={() => {
                        if (onWorkspaceChange) onWorkspaceChange(ws);
                        if (onSwitchWorkspace) onSwitchWorkspace(ws.id);
                        setIsWsDropdownOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-[var(--surface-hover)] text-left transition-colors"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-5 h-5 rounded bg-[var(--accent-100)] text-[var(--accent-700)] text-[10px] font-bold flex items-center justify-center shrink-0">
                          {ws.logoUrl || ws.name.charAt(0)}
                        </div>
                        <span className="truncate font-medium text-[var(--ink)]">{ws.name}</span>
                      </div>
                      {ws.id === activeWs.id && (
                        <Check className="w-3.5 h-3.5 text-[var(--accent-700)] shrink-0" />
                      )}
                    </button>
                  ))}
                </div>

                <div className="border-t border-[var(--line)] pt-1 space-y-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      setIsWsDropdownOpen(false);
                      if (onCreateWorkspace) onCreateWorkspace();
                      else handleTabChange("settings");
                    }}
                    className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-[var(--accent-700)] hover:bg-[var(--accent-50)] rounded-md font-medium"
                  >
                    <Plus className="w-3.5 h-3.5" /> Create workspace
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsWsDropdownOpen(false);
                      handleTabChange("settings");
                    }}
                    className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-[var(--ink-body)] hover:bg-[var(--surface-hover)] rounded-md"
                  >
                    <Settings className="w-3.5 h-3.5 text-[var(--ink-muted)]" /> Workspace settings
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Middle Scrollable Section: Navigation & Projects */}
        <div className="flex-1 min-h-0 overflow-y-auto space-y-3 pr-1 py-1">
          {/* Primary Navigation Links */}
          <nav className="space-y-0.5">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTabName === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleTabChange(item.id)}
                  className={`w-full h-9 flex items-center justify-between px-2.5 rounded-md text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-[var(--accent-50)] text-[var(--accent-700)] font-semibold"
                      : "text-[var(--ink-muted)] hover:text-[var(--ink)] hover:bg-[var(--surface-hover)]"
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-[var(--accent-700)]" : "text-[var(--ink-muted)]"}`} />
                    {!isCollapsed && <span className="truncate">{item.label}</span>}
                  </div>

                  {!isCollapsed && item.count !== undefined && item.count > 0 && (
                    <span
                      className={`text-[11px] font-bold px-1.5 py-0.2 rounded-full tabular-nums ${
                        isActive
                          ? "bg-[var(--accent-700)] text-white"
                          : "bg-[var(--surface-sunken)] text-[var(--ink-muted)]"
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Projects Section */}
          {!isCollapsed && (
            <div className="pt-2 border-t border-[var(--line)] space-y-1">
              <div className="flex items-center justify-between px-2 py-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--ink-faint)]">
                  PROJECTS
                </span>
                <button
                  type="button"
                  onClick={onNewProjectClick || onNewTask}
                  className="p-1 text-[var(--ink-muted)] hover:text-[var(--ink)] rounded transition-colors"
                  title="New project"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-0.5">
                {projects.map((p) => {
                  const isSelected = currentProject?.id === p.id && (activeTabName === "project_dashboard" || activeTabName === "board" || activeTabName === "list");
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        if (onSelectProject) (onSelectProject as any)(p);
                        handleTabChange("project_dashboard");
                      }}
                      className={`w-full h-8 flex items-center gap-2 px-2 rounded-md text-xs transition-colors text-left truncate ${
                        isSelected
                          ? "bg-[var(--accent-50)] text-[var(--accent-700)] font-semibold"
                          : "text-[var(--ink-body)] hover:bg-[var(--surface-hover)]"
                      }`}
                    >
                      <span className="w-2 h-2 rounded-xs shrink-0" style={{ backgroundColor: p.color }} />
                      <span className="truncate">{p.name}</span>
                    </button>
                  );
                })}

                <button
                  type="button"
                  onClick={onNewProjectClick || onNewTask}
                  className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-[var(--ink-muted)] hover:text-[var(--accent-700)] hover:bg-[var(--surface-hover)] rounded-md transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  <span>+ New project</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Fixed Section: Settings & User Account */}
        <div className="shrink-0 pt-2 border-t border-[var(--line)] space-y-1 bg-[var(--surface)]">
          {/* Collapse toggle */}
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full h-8 flex items-center gap-2 px-2 rounded-md text-xs text-[var(--ink-muted)] hover:text-[var(--ink)] hover:bg-[var(--surface-hover)] transition-colors"
            title={isCollapsed ? "Expand sidebar (Cmd+\\)" : "Collapse sidebar (Cmd+\\)"}
          >
            {isCollapsed ? <ChevronsRight className="w-4 h-4 mx-auto" /> : (
              <>
                <ChevronsLeft className="w-4 h-4" />
                <span className="text-xs">Collapse sidebar</span>
              </>
            )}
          </button>

          {/* Platform Admin Console Switcher */}
          {currentUser.role === "PLATFORM_ADMIN" && (
            <button
              type="button"
              onClick={() => onNavigate && onNavigate("admin")}
              className="w-full h-8 flex items-center gap-2 px-2 rounded-md text-xs font-bold text-orange-800 bg-orange-100/80 hover:bg-orange-200/80 transition-colors"
              title={isCollapsed ? "Platform Admin Console" : undefined}
            >
              <Shield className="w-4 h-4 text-orange-700 shrink-0" />
              {!isCollapsed && <span>Admin Console</span>}
            </button>
          )}

          {/* Settings Row */}
          <button
            type="button"
            onClick={() => handleTabChange("settings")}
            className={`w-full h-8 flex items-center gap-2 px-2 rounded-md text-xs font-medium transition-colors ${
              activeTabName === "settings"
                ? "bg-[var(--accent-50)] text-[var(--accent-700)] font-semibold"
                : "text-[var(--ink-muted)] hover:text-[var(--ink)] hover:bg-[var(--surface-hover)]"
            }`}
          >
            <Settings className="w-4 h-4" />
            {!isCollapsed && <span>Settings</span>}
          </button>

          {/* Direct Sign Out / Log Out Button */}
          <button
            type="button"
            onClick={onSignOut || (() => onNavigate && onNavigate("landing"))}
            className="w-full h-8 flex items-center gap-2 px-2 rounded-md text-xs font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
            title="Log out of Taskly"
          >
            <LogOut className="w-4 h-4" />
            {!isCollapsed && <span>Log out</span>}
          </button>

          {/* User Row with popup */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="w-full h-9 flex items-center gap-2 px-2 rounded-md hover:bg-[var(--surface-hover)] transition-colors text-left"
            >
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-6 h-6 rounded-full object-cover border border-[var(--line)]"
              />
              {!isCollapsed && (
                <div className="min-w-0 flex-1 flex items-center justify-between">
                  <span className="text-xs font-semibold text-[var(--ink)] truncate">
                    {currentUser.name}
                  </span>
                  <ChevronDown className="w-3 h-3 text-[var(--ink-muted)]" />
                </div>
              )}
            </button>

            {/* User Dropdown */}
            {isUserMenuOpen && (
              <div className="absolute bottom-11 left-0 w-[240px] bg-white rounded-lg border border-[var(--line)] shadow-xl z-50 p-2 text-xs space-y-1 animate-in fade-in zoom-in-95">
                <div className="px-2 py-1 border-b border-[var(--line)] pb-1.5">
                  <span className="font-bold text-[var(--ink)] block">{currentUser.name}</span>
                  <span className="text-[10px] text-[var(--ink-muted)] block truncate">{currentUser.email}</span>
                  <span className="inline-block mt-1 text-[9px] font-bold uppercase px-1.5 py-0.2 rounded bg-[var(--accent-50)] text-[var(--accent-700)]">
                    {currentUser.role.replace("_", " ")}
                  </span>
                </div>

                <div className="py-1 space-y-0.5">
                  {currentUser.role === "PLATFORM_ADMIN" && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        if (onNavigate) onNavigate("admin");
                      }}
                      className="w-full text-left px-2 py-1.5 rounded bg-orange-50 hover:bg-orange-100 text-orange-900 font-bold flex items-center gap-1.5"
                    >
                      <Shield className="w-3.5 h-3.5 text-orange-700" />
                      <span>Admin Console</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      handleTabChange("settings");
                    }}
                    className="w-full text-left px-2 py-1 rounded hover:bg-[var(--surface-hover)] text-[var(--ink-body)]"
                  >
                    Profile settings
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      handleTabChange("notifications");
                    }}
                    className="w-full text-left px-2 py-1 rounded hover:bg-[var(--surface-hover)] text-[var(--ink-body)]"
                  >
                    Notifications
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      if (onSignOut) onSignOut();
                      else if (onNavigate) onNavigate("landing");
                    }}
                    className="w-full text-left px-2 py-1.5 rounded hover:bg-red-50 text-red-600 font-semibold flex items-center gap-2 border-t border-[var(--line)] mt-1 pt-1.5 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* 2. MAIN CONTENT WRAPPER */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {/* Top bar (Section 4.5: 56px fixed header, breadcrumb, search, help, bell, CTA, avatar) */}
        <header className="h-14 shrink-0 bg-[var(--surface)] border-b border-[var(--line)] px-5 flex items-center justify-between z-20">
          {/* Breadcrumb */}
          <div className="flex items-center gap-3">{getBreadcrumb()}</div>

          {/* Search bar & Global Controls */}
          <div className="flex items-center gap-3">
            {/* Search field (max 420px) */}
            <div
              onClick={handleOpenSearch}
              className="hidden sm:flex items-center justify-between w-64 md:w-80 h-9 px-3 rounded-md border border-[var(--line-strong)] bg-white hover:border-[var(--accent-500)] cursor-pointer transition-colors text-xs text-[var(--ink-muted)]"
            >
              <div className="flex items-center gap-2">
                <Search className="w-3.5 h-3.5 text-[var(--ink-muted)]" />
                <span className="text-[var(--ink-faint)]">Search tasks, projects, people...</span>
              </div>
              <kbd className="px-1.5 py-0.2 bg-[var(--surface-sunken)] border border-[var(--line)] text-[10px] font-mono text-[var(--ink-muted)] rounded">
                ⌘K
              </kbd>
            </div>

            {/* Help Button */}
            <button
              type="button"
              onClick={handleOpenSearch}
              className="p-1.5 text-[var(--ink-muted)] hover:text-[var(--ink)] hover:bg-[var(--surface-hover)] rounded-md transition-colors"
              title="Help & Shortcuts"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            {/* Notification Bell with Badge */}
            <button
              type="button"
              onClick={handleOpenNotifications}
              className="relative p-1.5 text-[var(--ink-muted)] hover:text-[var(--ink)] hover:bg-[var(--surface-hover)] rounded-md transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 rounded-full bg-[var(--danger)] text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {/* Primary Action Button (Section 5.7.1 Button scale: md = 38px, px-4) */}
            {currentUser.role !== "VIEWER" && (
              <button
                type="button"
                onClick={handleQuickAdd}
                className="h-[38px] px-4 rounded-md bg-[var(--accent-700)] hover:bg-[var(--accent-600)] active:bg-[var(--accent-800)] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>New task</span>
              </button>
            )}

            {/* Avatar */}
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              onClick={() => handleTabChange("settings")}
              className="w-7 h-7 rounded-full object-cover border border-[var(--line)] cursor-pointer hover:ring-2 hover:ring-[var(--accent-500)] transition-all"
            />

            {/* Direct Header Log out button */}
            <button
              type="button"
              onClick={onSignOut || (() => onNavigate && onNavigate("landing"))}
              className="h-8 px-2.5 rounded-md border border-[var(--line-strong)] hover:border-red-200 hover:bg-red-50 text-xs font-semibold text-red-600 flex items-center gap-1.5 transition-colors ml-1"
              title="Log out of Taskly"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Log out</span>
            </button>
          </div>
        </header>

        {/* Dynamic Workspace Canvas: independently scrollable */}
        <main className="flex-1 min-h-0 overflow-y-auto px-5 py-4 w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
