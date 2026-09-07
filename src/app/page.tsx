"use client";

import React, { useState, useEffect } from "react";
import { 
  User, 
  UserRole, 
  Workspace, 
  Project, 
  Task, 
  TaskStatus, 
  TaskPriority,
  AuditLog,
  Notification 
} from "@/types/taskflow-v2";
import { 
  mockUsers, 
  mockWorkspaces, 
  mockProjects, 
  mockTasks, 
  mockAuditLogs, 
  mockNotifications 
} from "@/lib/taskflow-v2-data";

// Shells
import { WorkspaceShell } from "@/components/taskflow-v2/shell/WorkspaceShell";
import { AdminShell } from "@/components/taskflow-v2/shell/AdminShell";

// Screens
import { LandingPageView } from "@/components/taskflow-v2/screens/LandingPageView";
import { AuthViews } from "@/components/taskflow-v2/screens/AuthViews";
import { OnboardingViews } from "@/components/taskflow-v2/screens/OnboardingViews";
import { WorkspaceHomeView } from "@/components/taskflow-v2/screens/WorkspaceHomeView";
import { ProjectsListView } from "@/components/taskflow-v2/screens/ProjectsListView";
import { ProjectDashboardView } from "@/components/taskflow-v2/screens/ProjectDashboardView";
import { CalendarView } from "@/components/taskflow-v2/screens/CalendarView";
import { MyTasksView } from "@/components/taskflow-v2/screens/MyTasksView";
import { TeamDirectoryView } from "@/components/taskflow-v2/screens/TeamDirectoryView";
import { ReportsView } from "@/components/taskflow-v2/screens/ReportsView";
import { NotificationsView } from "@/components/taskflow-v2/screens/NotificationsView";
import { SettingsView } from "@/components/taskflow-v2/screens/SettingsView";

// Modals
import { CommandPalette } from "@/components/taskflow-v2/modals/CommandPalette";
import { TaskDetailModal } from "@/components/taskflow-v2/modals/TaskDetailModal";
import { QuickAddModal } from "@/components/taskflow-v2/modals/QuickAddModal";
import { NewProjectModal } from "@/components/taskflow-v2/modals/NewProjectModal";
import { InviteMemberModal } from "@/components/taskflow-v2/modals/InviteMemberModal";

// Server Actions (Full-Stack Backend Integration)
import { 
  createTaskAction, 
  updateTaskStatusAction, 
  updateTaskPriorityAction, 
  updateTaskDetailsAction,
  deleteTaskAction 
} from "@/actions/task-actions";
import { 
  createProjectAction, 
  deleteProjectAction 
} from "@/actions/project-actions";
import { 
  inviteWorkspaceMemberAction, 
  updateWorkspaceSettingsAction 
} from "@/actions/workspace-actions";
import { getInitialBootstrapData } from "@/actions/auth-actions";

// Icons for Navigator
import { 
  Compass, 
  ChevronDown, 
  ChevronUp, 
  ShieldCheck, 
  UserCheck, 
  Layout, 
  Sparkles,
  Kanban,
  CheckCircle2
} from "lucide-react";

export default function Home() {
  // Global State
  const [currentUser, setCurrentUser] = useState<User>(mockUsers[0]);
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace>(mockWorkspaces[0]);
  const [workspaces, setWorkspaces] = useState<Workspace[]>(mockWorkspaces);
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(mockAuditLogs);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  
  // Navigation & Screen routing (Default: Public Landing Page)
  const [currentScreen, setCurrentScreen] = useState<string>("landing");
  const [selectedProjectId, setSelectedProjectId] = useState<string>(mockProjects[0]?.id || "proj-core-platform");
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  // Modals state
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const [isInviteMemberOpen, setIsInviteMemberOpen] = useState(false);
  const [quickAddDefaultStatus, setQuickAddDefaultStatus] = useState<TaskStatus>("todo");

  // Global Keyboard Shortcuts (Section 7.20)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input or textarea
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
        return;
      }

      // Cmd+K or Ctrl+K -> Command Palette
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }

      // N -> Quick Add Task Modal
      if (e.key.toLowerCase() === "n" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        if (currentUser.role !== "VIEWER") {
          setIsQuickAddOpen(true);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentUser]);

  // Bootstrap full database state from SQLite on mount
  useEffect(() => {
    async function loadBackendData() {
      try {
        const res = await getInitialBootstrapData();
        if (res.success && res.tasks && res.tasks.length > 0) {
          const mappedTasks: Task[] = res.tasks.map((t: any) => ({
            id: t.id,
            projectId: t.projectId,
            title: t.title,
            description: t.description || "",
            status: (t.status as TaskStatus) || "todo",
            priority: (t.priority as TaskPriority) || "medium",
            dueDate: t.dueDate || "2026-09-30",
            startDate: "2026-09-07",
            position: t.order || 0,
            assignee: t.assignee
              ? {
                  id: t.assignee.id,
                  name: t.assignee.name || "User",
                  email: t.assignee.email || "",
                  avatarUrl: t.assignee.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100",
                  role: (t.assignee.role as UserRole) || "MEMBER",
                  timezone: "UTC+5",
                }
              : mockUsers[0],
            labels: ["Taskly"],
            subtasks: (t.subtasks || []).map((st: any) => ({
              id: st.id,
              title: st.title,
              completed: st.completed,
            })),
            comments: (t.comments || []).map((c: any) => ({
              id: c.id,
              taskId: t.id,
              userId: c.userId,
              user: {
                id: c.user?.id || c.userId,
                name: c.user?.name || "User",
                email: c.user?.email || "",
                avatarUrl: c.user?.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100",
                role: (c.user?.role as UserRole) || "MEMBER",
              },
              userName: c.user?.name || "User",
              userAvatar: c.user?.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100",
              content: c.content,
              body: c.content,
              createdAt: c.createdAt ? new Date(c.createdAt).toISOString() : new Date().toISOString(),
              timestamp: new Date(c.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            })),
            attachments: [],
            createdAt: t.createdAt ? new Date(t.createdAt).toISOString() : new Date().toISOString(),
            updatedAt: t.updatedAt ? new Date(t.updatedAt).toISOString() : new Date().toISOString(),
          }));

          setTasks(mappedTasks);
        }

        if (res.success && res.projects && res.projects.length > 0) {
          const mappedProjects: Project[] = res.projects.map((p: any) => ({
            id: p.id,
            workspaceId: p.workspaceId,
            name: p.name,
            slug: p.slug || p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
            description: p.description || "",
            color: p.color || "#EA580C",
            deadline: p.deadline || "2026-09-30",
            taskCount: p.tasks?.length || 0,
            completedTaskCount: p.tasks?.filter((t: any) => t.status === "done").length || 0,
            members: mockUsers.slice(0, 3),
            defaultView: "board",
            status: (p.status as any) || "active",
          }));
          setProjects(mappedProjects);
        }

        if (res.success && res.users && res.users.length > 0) {
          const dbAdmin = res.users.find((u: any) => u.email === "bilalrauf.ds@gmail.com") || res.users[0];
          if (dbAdmin) {
            setCurrentUser({
              id: dbAdmin.id,
              name: dbAdmin.name || "Bilal Rauf",
              email: dbAdmin.email || "bilalrauf.ds@gmail.com",
              role: (dbAdmin.role as UserRole) || "PLATFORM_ADMIN",
              avatarUrl: dbAdmin.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
              designation: dbAdmin.role === "PLATFORM_ADMIN" ? "Platform Administrator" : "Workspace Owner",
              isEmailVerified: true,
            });
          }
        }
      } catch (err) {
        console.error("Error loading bootstrap data:", err);
      }
    }
    loadBackendData();
  }, []);

  // Role Switcher Handler (Landing route per role according to Section 3.2)
  const handleSwitchRole = (role: UserRole) => {
    setCurrentUser(prev => ({
      ...prev,
      role,
      designation: role === "PLATFORM_ADMIN" ? "Platform Administrator" : role.replace("_", " "),
    }));

    if (role === "PLATFORM_ADMIN") {
      setCurrentScreen("admin");
    } else if (role === "WORKSPACE_OWNER" || role === "MANAGER") {
      setCurrentScreen("home");
    } else if (role === "MEMBER") {
      setCurrentScreen("my-tasks");
    } else if (role === "VIEWER") {
      setCurrentScreen("projects-list");
    }
  };

  // Task Mutations (Optimistic UI + Live Server Action Persistence)
  const handleUpdateTask = async (updatedTask: Task) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      action: "task_updated",
      actorId: currentUser.id,
      actorName: currentUser.name,
      targetType: "task",
      targetId: updatedTask.id,
      targetName: updatedTask.title,
      timestamp: new Date().toISOString()
    };
    setAuditLogs(prev => [newLog, ...prev]);

    if (!updatedTask.id.startsWith("task-")) {
      try {
        await updateTaskDetailsAction(updatedTask.id, {
          title: updatedTask.title,
          description: updatedTask.description,
          status: updatedTask.status,
          priority: updatedTask.priority,
          dueDate: updatedTask.dueDate,
          assigneeId: updatedTask.assignee?.id,
        });
      } catch (err) {
        console.error("Error updating task in DB:", err);
      }
    }
  };

  const handleUpdateTaskStatus = async (taskId: string, newStatus: TaskStatus) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    const updated = { ...task, status: newStatus };
    handleUpdateTask(updated);

    try {
      await updateTaskStatusAction(taskId, newStatus, currentUser.id);
    } catch (err) {
      console.error("Error updating task status in DB:", err);
    }
  };

  const handleUpdateTaskPriority = async (taskId: string, newPriority: TaskPriority) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    const updated = { ...task, priority: newPriority };
    handleUpdateTask(updated);

    try {
      await updateTaskPriorityAction(taskId, newPriority);
    } catch (err) {
      console.error("Error updating task priority in DB:", err);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    setTasks(prev => prev.filter(t => t.id !== taskId));
    if (selectedTaskId === taskId) {
      setSelectedTaskId(null);
    }
    if (task) {
      const newLog: AuditLog = {
        id: `log-${Date.now()}`,
        action: "task_deleted",
        actorId: currentUser.id,
        actorName: currentUser.name,
        targetType: "task",
        targetId: taskId,
        targetName: task.title,
        timestamp: new Date().toISOString()
      };
      setAuditLogs(prev => [newLog, ...prev]);
    }

    try {
      await deleteTaskAction(taskId);
    } catch (err) {
      console.error("Error deleting task in DB:", err);
    }
  };

  const handleCreateTask = async (newTaskData: Partial<Task>) => {
    const tempId = `task-${Date.now()}`;
    const newTask: Task = {
      id: tempId,
      projectId: newTaskData.projectId || selectedProjectId,
      title: newTaskData.title || "Untitled Task",
      description: newTaskData.description || "",
      status: newTaskData.status || "todo",
      priority: newTaskData.priority || "medium",
      assignee: newTaskData.assignee || currentUser,
      position: tasks.length + 1,
      labels: newTaskData.labels || ["New"],
      subtasks: newTaskData.subtasks || [],
      attachments: [],
      comments: [],
      dueDate: newTaskData.dueDate || "2026-09-30",
      startDate: "2026-09-07",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setTasks(prev => [newTask, ...prev]);
    // update project task count
    setProjects(prev => prev.map(p => 
      p.id === newTask.projectId ? { ...p, taskCount: (p.taskCount ?? 0) + 1 } : p
    ));

    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      action: "task_created",
      actorId: currentUser.id,
      actorName: currentUser.name,
      targetType: "task",
      targetId: newTask.id,
      targetName: newTask.title,
      timestamp: new Date().toISOString()
    };
    setAuditLogs(prev => [newLog, ...prev]);

    // Asynchronously persist to SQLite via Server Action
    try {
      const res = await createTaskAction({
        title: newTask.title,
        projectId: newTask.projectId,
        description: newTask.description,
        status: newTask.status,
        priority: newTask.priority,
        dueDate: newTask.dueDate,
        assigneeId: newTask.assignee?.id,
        creatorId: currentUser.id,
        subtasks: newTask.subtasks?.map(s => s.title) || [],
      });
      if (res.success && res.task) {
        setTasks(prev => prev.map(t => t.id === tempId ? { ...t, id: res.task.id } : t));
      }
    } catch (err) {
      console.error("Error creating task in DB:", err);
    }
  };

  const handleToggleTaskComplete = (taskId: string, currentStatus: TaskStatus) => {
    const newStatus: TaskStatus = currentStatus === "done" ? "todo" : "done";
    handleUpdateTaskStatus(taskId, newStatus);
  };

  // Project Mutations
  const handleAddProject = async (newProject: Project) => {
    setProjects(prev => [newProject, ...prev]);
    setSelectedProjectId(newProject.id);
    setCurrentScreen("project-dashboard");

    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      action: "project_created",
      actorId: currentUser.id,
      actorName: currentUser.name,
      targetType: "project",
      targetId: newProject.id,
      targetName: newProject.name,
      timestamp: new Date().toISOString()
    };
    setAuditLogs(prev => [newLog, ...prev]);

    try {
      await createProjectAction({
        workspaceId: currentWorkspace.id,
        name: newProject.name,
        description: newProject.description,
        color: newProject.color,
        deadline: newProject.deadline,
      });
    } catch (err) {
      console.error("Error creating project in DB:", err);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    const proj = projects.find(p => p.id === projectId);
    setProjects(prev => prev.filter(p => p.id !== projectId));
    setTasks(prev => prev.filter(t => t.projectId !== projectId));
    if (selectedProjectId === projectId) {
      setSelectedProjectId(projects[0]?.id || "");
    }
    if (proj) {
      const newLog: AuditLog = {
        id: `log-${Date.now()}`,
        action: "project_deleted",
        actorId: currentUser.id,
        actorName: currentUser.name,
        targetType: "project",
        targetId: projectId,
        targetName: proj.name,
        timestamp: new Date().toISOString()
      };
      setAuditLogs(prev => [newLog, ...prev]);
    }

    try {
      await deleteProjectAction(projectId);
    } catch (err) {
      console.error("Error deleting project in DB:", err);
    }
  };

  // Member Invitation
  const handleInviteMember = async (email: string, role: UserRole) => {
    alert(`Invitation sent to ${email} as ${role}. Direct link ready.`);
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      action: "member_invited",
      actorId: currentUser.id,
      actorName: currentUser.name,
      targetType: "workspace",
      targetId: currentWorkspace.id,
      targetName: email,
      timestamp: new Date().toISOString()
    };
    setAuditLogs(prev => [newLog, ...prev]);

    try {
      await inviteWorkspaceMemberAction(currentWorkspace.id, email, role, currentUser.name);
    } catch (err) {
      console.error("Error inviting member in DB:", err);
    }
  };

  const selectedProject = projects.find(p => p.id === selectedProjectId) || projects[0];
  const selectedTask = tasks.find(t => t.id === selectedTaskId);

  // RENDER SCREEN DISPATCHER
  const isAuthOrLanding = [
    "landing", 
    "login", 
    "register", 
    "verify-email", 
    "forgot-password", 
    "reset-password",
    "onboarding-workspace"
  ].includes(currentScreen);

  return (
    <div className="min-h-screen bg-[var(--canvas)] text-[var(--ink)] font-sans antialiased selection:bg-orange-100 selection:text-orange-900">
      
      {/* 1. PUBLIC MARKETING LANDING (Section 7.1) */}
      {currentScreen === "landing" && (
        <LandingPageView
          onGetStarted={() => setCurrentScreen("register")}
          onSignIn={() => setCurrentScreen("login")}
          onLogIn={() => setCurrentScreen("login")}
          onExploreDemo={() => setCurrentScreen("login")}
        />
      )}

      {/* 2. AUTHENTICATION SCREENS (Sections 7.2 - 7.6) */}
      {[
        "login", 
        "register", 
        "verify-email", 
        "forgot-password", 
        "reset-password"
      ].includes(currentScreen) && (
        <AuthViews
          initialScreen={
            currentScreen === "register" ? "register" :
            currentScreen === "verify-email" ? "verify" :
            currentScreen === "forgot-password" ? "forgot" :
            currentScreen === "reset-password" ? "reset" : "login"
          }
          onLoginSuccess={(user, newWs, newProj) => {
            setCurrentUser(user);
            if (newWs) {
              setWorkspaces(prev => [newWs, ...prev.filter(w => w.id !== newWs.id)]);
              setCurrentWorkspace(newWs);
            }
            if (newProj) {
              setProjects(prev => [newProj, ...prev.filter(p => p.id !== newProj.id)]);
              setSelectedProjectId(newProj.id);
            }
            if (user.role === "PLATFORM_ADMIN") {
              setCurrentScreen("admin");
            } else if (user.role === "MEMBER") {
              setCurrentScreen("my-tasks");
            } else if (user.role === "VIEWER") {
              setCurrentScreen("project-dashboard");
            } else {
              setCurrentScreen("home");
            }
          }}
          onNavigate={(s) => setCurrentScreen(s)}
        />
      )}

      {/* 3. ONBOARDING FLOW (Sections 7.7 - 7.9) */}
      {currentScreen === "onboarding-workspace" && (
        <OnboardingViews
          currentUser={currentUser}
          onComplete={(newWs, newProj) => {
            setWorkspaces(prev => [newWs, ...prev]);
            setCurrentWorkspace(newWs);
            setProjects(prev => [newProj, ...prev]);
            setSelectedProjectId(newProj.id);
            setCurrentScreen("home");
          }}
          onNavigate={(s) => setCurrentScreen(s)}
        />
      )}

      {/* 4. PLATFORM ADMIN CONSOLE - SHELL B (Section 4.2 & Section 7.22) */}
      {!isAuthOrLanding && currentScreen === "admin" && (
        <AdminShell
          currentUser={currentUser}
          organisations={[
            {
              id: "org-taskly",
              name: "Taskly Global Inc.",
              domain: "taskly.io",
              status: "active",
              workspaceCount: workspaces.length,
              userCount: 1,
              plan: "Enterprise",
              createdAt: "2026-01-15"
            }
          ]}
          users={[currentUser]}
          onExitAdmin={() => setCurrentScreen("home")}
          onSignOut={() => setCurrentScreen("landing")}
        />
      )}

      {/* 5. WORKSPACE WORK MANAGEMENT - SHELL A (Sections 4.2 - 4.5 & 7.10 - 7.21) */}
      {!isAuthOrLanding && currentScreen !== "admin" && (
        <WorkspaceShell
          currentUser={currentUser}
          workspace={currentWorkspace}
          workspaces={workspaces}
          projects={projects}
          activeScreen={currentScreen}
          onNavigate={(s: string) => setCurrentScreen(s)}
          onSelectProject={(projOrId: Project | string) => {
            const id = typeof projOrId === "string" ? projOrId : projOrId.id;
            setSelectedProjectId(id);
            setCurrentScreen("project-dashboard");
          }}
          onSwitchWorkspace={(wsId: string) => {
            const found = workspaces.find(w => w.id === wsId);
            if (found) setCurrentWorkspace(found);
          }}
          onCreateWorkspace={() => setCurrentScreen("onboarding-workspace")}
          onNewTask={() => {
            if (currentUser.role !== "VIEWER") {
              setQuickAddDefaultStatus("todo");
              setIsQuickAddOpen(true);
            }
          }}
          onOpenSearch={() => setIsCommandPaletteOpen(true)}
          onSignOut={() => setCurrentScreen("landing")}
          unreadNotificationCount={notifications.filter(n => !n.read).length}
        >
          {/* Main Content Area Routing inside Shell A */}
          {currentScreen === "home" && (
            <WorkspaceHomeView
              currentUser={currentUser}
              workspace={currentWorkspace}
              projects={projects}
              tasks={tasks}
              auditLogs={auditLogs}
              onSelectProject={(id) => {
                setSelectedProjectId(id);
                setCurrentScreen("project-dashboard");
              }}
              onOpenTask={(id) => setSelectedTaskId(id)}
              onNewTask={() => {
                setQuickAddDefaultStatus("todo");
                setIsQuickAddOpen(true);
              }}
              onNewProject={() => setIsNewProjectOpen(true)}
              onNavigate={(s) => setCurrentScreen(s)}
            />
          )}

          {currentScreen === "projects-list" && (
            <ProjectsListView
              currentUser={currentUser}
              projects={projects}
              onSelectProject={(id) => {
                setSelectedProjectId(id);
                setCurrentScreen("project-dashboard");
              }}
              onNewProject={() => setIsNewProjectOpen(true)}
              onDeleteProject={handleDeleteProject}
            />
          )}

          {currentScreen === "project-dashboard" && (
            <ProjectDashboardView
              currentUser={currentUser}
              project={selectedProject}
              tasks={tasks}
              onBackToProjects={() => setCurrentScreen("projects-list")}
              onOpenTask={(id) => setSelectedTaskId(id)}
              onUpdateTaskStatus={handleUpdateTaskStatus}
              onUpdateTaskPriority={handleUpdateTaskPriority}
              onDeleteTask={handleDeleteTask}
              onNewTask={() => {
                setQuickAddDefaultStatus("todo");
                setIsQuickAddOpen(true);
              }}
              onQuickAddStatus={(st) => {
                setQuickAddDefaultStatus(st);
                setIsQuickAddOpen(true);
              }}
            />
          )}

          {currentScreen === "calendar" && (
            <div className="w-full">
              <CalendarView
                currentUser={currentUser}
                tasks={tasks}
                onOpenTask={(id) => setSelectedTaskId(id)}
                onQuickAddDate={(dateStr) => {
                  handleCreateTask({ dueDate: dateStr, title: "New scheduled task" });
                }}
              />
            </div>
          )}

          {currentScreen === "my-tasks" && (
            <MyTasksView
              currentUser={currentUser}
              tasks={tasks}
              projects={projects}
              onOpenTask={(id) => setSelectedTaskId(id)}
              onToggleTaskComplete={handleToggleTaskComplete}
              onInlineAddTask={(title, dueDate) => {
                handleCreateTask({ title, dueDate, projectId: selectedProjectId, assignee: currentUser });
              }}
            />
          )}

          {currentScreen === "team-directory" && (
            <TeamDirectoryView
              currentUser={currentUser}
              workspace={currentWorkspace}
              members={mockUsers.filter(u => u.role !== "PLATFORM_ADMIN")}
              onInviteMember={() => setIsInviteMemberOpen(true)}
            />
          )}

          {currentScreen === "reports" && (
            <ReportsView
              tasks={tasks}
              projects={projects}
              members={mockUsers.filter(u => u.role !== "PLATFORM_ADMIN")}
            />
          )}

          {currentScreen === "notifications" && (
            <NotificationsView
              currentUser={currentUser}
              notifications={notifications}
              onOpenTask={(id) => setSelectedTaskId(id)}
              onMarkAllRead={() => {
                setNotifications(prev => prev.map(n => ({ ...n, read: true })));
              }}
            />
          )}

          {currentScreen === "settings" && (
            <SettingsView
              currentUser={currentUser}
              workspace={currentWorkspace}
              auditLogs={auditLogs}
              onUpdateWorkspaceName={(newName) => {
                setCurrentWorkspace(prev => ({ ...prev, name: newName }));
              }}
            />
          )}
        </WorkspaceShell>
      )}

      {/* ================= MODALS & OVERLAYS ================= */}

      {/* 1. Command Palette (Ctrl+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        projects={projects}
        tasks={tasks}
        members={mockUsers}
        onSelectTask={(item: Task | string) => {
          const id = typeof item === "string" ? item : item.id;
          setSelectedTaskId(id);
        }}
        onSelectProject={(id: string) => {
          setSelectedProjectId(id);
          setCurrentScreen("project-dashboard");
        }}
        onNavigate={(s: string) => setCurrentScreen(s)}
      />

      {/* 2. Task Detail Modal (Section 7.16) */}
      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          project={projects.find(p => p.id === selectedTask.projectId)}
          members={mockUsers.filter(u => u.role !== "PLATFORM_ADMIN")}
          currentUser={currentUser}
          onClose={() => setSelectedTaskId(null)}
          onUpdateTask={handleUpdateTask}
          onDeleteTask={handleDeleteTask}
        />
      )}

      {/* 3. Quick Add Task Modal ('N' shortcut) */}
      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        projects={projects}
        members={mockUsers.filter(u => u.role !== "PLATFORM_ADMIN")}
        defaultStatus={quickAddDefaultStatus}
        defaultProjectId={selectedProjectId}
        onAddTask={handleCreateTask}
      />

      {/* 4. New Project Modal */}
      <NewProjectModal
        isOpen={isNewProjectOpen}
        onClose={() => setIsNewProjectOpen(false)}
        currentUser={currentUser}
        onAddProject={handleAddProject}
      />

      {/* 5. Invite Member Modal */}
      <InviteMemberModal
        isOpen={isInviteMemberOpen}
        onClose={() => setIsInviteMemberOpen(false)}
        onInvite={handleInviteMember}
      />

    </div>
  );
}
