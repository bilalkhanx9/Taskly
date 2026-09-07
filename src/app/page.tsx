"use client";

import React, { useState, useEffect } from "react";
import {
  User,
  Workspace,
  Project,
  Task,
  NotificationItem,
  ActivityLogItem,
  TaskStatus,
  UserRole,
} from "@/types/taskflow";
import {
  currentUser as initialCurrentUser,
  teamMembers as initialTeamMembers,
  workspaces as initialWorkspaces,
  initialProjects,
  initialTasks,
  initialNotifications,
  initialActivityLogs,
} from "@/lib/taskflow-data";
import { Sidebar, NavTab } from "@/components/taskflow/Sidebar";
import { Topbar } from "@/components/taskflow/Topbar";
import { CommandPalette } from "@/components/taskflow/CommandPalette";
import { DashboardView } from "@/components/taskflow/views/DashboardView";
import { BoardView } from "@/components/taskflow/views/BoardView";
import { ListView } from "@/components/taskflow/views/ListView";
import { CalendarView } from "@/components/taskflow/views/CalendarView";
import { MyTasksView } from "@/components/taskflow/views/MyTasksView";
import { ProjectsView } from "@/components/taskflow/views/ProjectsView";
import { TeamView } from "@/components/taskflow/views/TeamView";
import { SettingsView } from "@/components/taskflow/views/SettingsView";
import { TaskDetailModal } from "@/components/taskflow/modals/TaskDetailModal";
import { QuickAddModal } from "@/components/taskflow/modals/QuickAddModal";
import { NewProjectModal } from "@/components/taskflow/modals/NewProjectModal";
import { InviteMemberModal } from "@/components/taskflow/modals/InviteMemberModal";
import { NotificationsDrawer } from "@/components/taskflow/modals/NotificationsDrawer";

export default function TaskFlowApp() {
  // State
  const [currentUser] = useState<User>(initialCurrentUser);
  const [workspaces, setWorkspaces] = useState<Workspace[]>(initialWorkspaces);
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace>(initialWorkspaces[0]);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [teamMembers, setTeamMembers] = useState<User[]>(initialTeamMembers);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [activityLogs, setActivityLogs] = useState<ActivityLogItem[]>(initialActivityLogs);

  // Active View Tab
  const [currentTab, setCurrentTab] = useState<NavTab>("dashboard");

  // Modals
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [quickAddStatus, setQuickAddStatus] = useState<TaskStatus>("todo");
  const [quickAddDate, setQuickAddDate] = useState<string>("2026-09-08");

  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Keyboard Shortcuts: 'Ctrl + K' for search, 'N' for quick add
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Ignore when typing inside an input/textarea
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT") {
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      } else if (e.key === "n" || e.key === "N") {
        e.preventDefault();
        setQuickAddStatus("todo");
        setQuickAddDate("2026-09-08");
        setIsQuickAddOpen(true);
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, []);

  // Handlers for Task Operations
  const handleOpenTask = (task: Task) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
    setSelectedTask(updatedTask);

    // Record activity log
    const newAct: ActivityLogItem = {
      id: `act-${Date.now()}`,
      user: currentUser,
      action: "updated",
      details: `updated task '${updatedTask.title}'`,
      projectName: projects.find((p) => p.id === updatedTask.projectId)?.name,
      createdAt: "Just now",
    };
    setActivityLogs((prev) => [newAct, ...prev]);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    setIsTaskModalOpen(false);
  };

  const handleTaskCreated = (newTask: Task) => {
    setTasks((prev) => [newTask, ...prev]);

    // Record activity
    const newAct: ActivityLogItem = {
      id: `act-${Date.now()}`,
      user: currentUser,
      action: "created",
      details: `created task '${newTask.title}'`,
      projectName: projects.find((p) => p.id === newTask.projectId)?.name,
      createdAt: "Just now",
    };
    setActivityLogs((prev) => [newAct, ...prev]);
  };

  const handleProjectCreated = (newProject: Project) => {
    setProjects((prev) => [...prev, newProject]);
    setSelectedProjectId(newProject.id);
    setCurrentTab("board");
  };

  const handleInviteSent = (newMember: User) => {
    setTeamMembers((prev) => [...prev, newMember]);
  };

  const handleUpdateRole = (userId: string, role: UserRole) => {
    setTeamMembers((prev) => prev.map((m) => (m.id === userId ? { ...m, role } : m)));
  };

  const handleToggleTaskComplete = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              status: t.status === "done" ? "todo" : "done",
              completedAt: t.status === "done" ? null : new Date().toISOString(),
            }
          : t
      )
    );
  };

  const handleUpdateTaskStatus = (taskId: string, status: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status } : t))
    );
  };

  const handleQuickAddWithStatus = (status: TaskStatus) => {
    setQuickAddStatus(status);
    setQuickAddDate("2026-09-08");
    setIsQuickAddOpen(true);
  };

  const handleQuickAddWithDate = (dateStr: string) => {
    setQuickAddStatus("todo");
    setQuickAddDate(dateStr);
    setIsQuickAddOpen(true);
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleMarkNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.isRead).length;
  const myTasksCount = tasks.filter(
    (t) => t.assignee?.id === currentUser.id && t.status !== "done"
  ).length;

  const currentSelectedProject = projects.find((p) => p.id === selectedProjectId) || null;

  return (
    <div className="min-h-screen bg-[#F6F8F7] text-[#1F2A2E] flex font-sans antialiased selection:bg-[#E6F2F0] selection:text-[#0F766E]">
      {/* 1. Left Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        selectedProjectId={selectedProjectId}
        onSelectProject={setSelectedProjectId}
        workspaces={workspaces}
        currentWorkspace={currentWorkspace}
        onWorkspaceChange={setCurrentWorkspace}
        projects={projects}
        onNewProjectClick={() => setIsNewProjectOpen(true)}
        currentUser={currentUser}
        unreadNotificationsCount={unreadNotificationsCount}
        myTasksCount={myTasksCount}
      />

      {/* 2. Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <Topbar
          currentTab={currentTab}
          selectedProject={currentSelectedProject}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          onQuickAddClick={() => {
            setQuickAddStatus("todo");
            setQuickAddDate("2026-09-08");
            setIsQuickAddOpen(true);
          }}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          unreadNotificationsCount={unreadNotificationsCount}
          currentUser={currentUser}
        />

        {/* Dynamic Main Workspace Canvas */}
        <main className="flex-1 p-6 max-w-[1600px] w-full mx-auto overflow-y-auto">
          {currentTab === "dashboard" && (
            <DashboardView
              projects={projects}
              tasks={tasks}
              activityLogs={activityLogs}
              onTaskClick={handleOpenTask}
              onProjectClick={(pId) => {
                setSelectedProjectId(pId);
                setCurrentTab("board");
              }}
              onNavigateToTab={setCurrentTab}
            />
          )}

          {currentTab === "board" && (
            <BoardView
              tasks={tasks}
              projects={projects}
              selectedProjectId={selectedProjectId}
              onSelectProject={setSelectedProjectId}
              onTaskClick={handleOpenTask}
              onQuickAdd={handleQuickAddWithStatus}
              onTasksReorder={setTasks}
            />
          )}

          {currentTab === "list" && (
            <ListView
              tasks={tasks}
              projects={projects}
              onTaskClick={handleOpenTask}
              onUpdateTaskStatus={handleUpdateTaskStatus}
            />
          )}

          {currentTab === "calendar" && (
            <CalendarView
              tasks={tasks}
              projects={projects}
              onTaskClick={handleOpenTask}
              onQuickAddDate={handleQuickAddWithDate}
            />
          )}

          {currentTab === "my_tasks" && (
            <MyTasksView
              tasks={tasks}
              projects={projects}
              currentUserId={currentUser.id}
              onTaskClick={handleOpenTask}
              onToggleTaskComplete={handleToggleTaskComplete}
            />
          )}

          {currentTab === "projects" && (
            <ProjectsView
              projects={projects}
              tasks={tasks}
              onProjectClick={(pId) => {
                setSelectedProjectId(pId);
                setCurrentTab("board");
              }}
              onNewProjectClick={() => setIsNewProjectOpen(true)}
            />
          )}

          {currentTab === "team" && (
            <TeamView
              members={teamMembers}
              onInviteClick={() => setIsInviteModalOpen(true)}
              onUpdateRole={handleUpdateRole}
            />
          )}

          {currentTab === "notifications" && (
            <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg border border-[#E3E8E6] shadow-2xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E3E8E6]">
                <h2 className="text-base font-bold text-[#1F2A2E]">All Notifications</h2>
                <button
                  type="button"
                  onClick={handleMarkAllNotificationsRead}
                  className="text-xs font-semibold text-[#0F766E] hover:underline"
                >
                  Mark all as read
                </button>
              </div>
              <div className="divide-y divide-[#EFF2F1]">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => {
                      handleMarkNotificationRead(notif.id);
                      if (notif.relatedTaskId) {
                        const t = tasks.find((item) => item.id === notif.relatedTaskId);
                        if (t) handleOpenTask(t);
                      }
                    }}
                    className={`py-3 flex items-start justify-between gap-4 cursor-pointer hover:bg-[#F6F8F7] px-2 rounded-md transition-colors ${
                      !notif.isRead ? "bg-[#E6F2F0]/40" : ""
                    }`}
                  >
                    <div>
                      <h4 className="text-xs font-bold text-[#1F2A2E]">{notif.title}</h4>
                      <p className="text-xs text-[#3D4A4F] mt-0.5">{notif.message}</p>
                    </div>
                    <span className="text-[10px] text-[#9AA7AC] shrink-0 font-mono">
                      {notif.createdAt.slice(11, 16)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentTab === "settings" && (
            <SettingsView currentUser={currentUser} workspace={currentWorkspace} />
          )}
        </main>
      </div>

      {/* 3. Interactive Modals Layer */}
      <TaskDetailModal
        task={selectedTask}
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        projects={projects}
        teamMembers={teamMembers}
        currentUser={currentUser}
        onUpdateTask={handleUpdateTask}
        onDeleteTask={handleDeleteTask}
      />

      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        defaultStatus={quickAddStatus}
        defaultDueDate={quickAddDate}
        projects={projects}
        teamMembers={teamMembers}
        onTaskCreated={handleTaskCreated}
      />

      <NewProjectModal
        isOpen={isNewProjectOpen}
        onClose={() => setIsNewProjectOpen(false)}
        workspaceId={currentWorkspace.id}
        currentUser={currentUser}
        onProjectCreated={handleProjectCreated}
      />

      <InviteMemberModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onInviteSent={handleInviteSent}
      />

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        tasks={tasks}
        projects={projects}
        members={teamMembers}
        onSelectTask={handleOpenTask}
        onSelectProject={(pId) => {
          setSelectedProjectId(pId);
          setCurrentTab("board");
        }}
      />

      <NotificationsDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        tasks={tasks}
        onSelectTask={handleOpenTask}
        onMarkAllAsRead={handleMarkAllNotificationsRead}
        onMarkAsRead={handleMarkNotificationRead}
      />
    </div>
  );
}
