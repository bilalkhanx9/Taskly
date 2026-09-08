"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  Plus,
  Compass,
  Settings,
  Star,
  MoreVertical,
  Trash2,
  Edit2,
  X,
  Check,
  Bell,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  CheckSquare,
  Calendar,
  Image as ImageIcon,
  Mail,
  Info,
  Palette,
  RefreshCw,
  Layers,
  Timer,
  Sparkles,
  MessageSquare,
  Folder,
  Users,
  FileText,
  Sliders,
  HelpCircle,
  PanelLeftClose,
  PanelLeft,
  ArrowLeft,
  Filter,
  MoreHorizontal,
  Clock,
  Send,
  UploadCloud,
  CheckCircle2,
  ListTodo,
} from "lucide-react";
import {
  getWorkspaces as getWorkspacesAction,
  createWorkspace as createWorkspaceAction,
  updateWorkspaceName as updateWorkspaceNameAction,
  createProject as createProjectAction,
  deleteProject as deleteProjectAction,
  deleteWorkspace as deleteWorkspaceAction,
} from "@/actions/workspace";

export interface SubtaskItem {
  priority: string;
  priorityColor: string;
  title: string;
  progress: string;
  date: string;
}

export interface TaskCardItem {
  id: string;
  title: string;
  description: string;
  priority: "P1" | "P2" | "P3";
  status: "todo" | "in_progress" | "in_review" | "done";
  progress: string;
  dueDate: string;
  assignee: {
    name: string;
    initials: string;
    bg: string;
    img?: string;
  };
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  bannerColor: string;
  isFavorite: boolean;
  tasksCompleted: number;
  tasksTotal: number;
  members: Array<{
    initials?: string;
    bg?: string;
    img?: string;
  }>;
  subtasks: SubtaskItem[];
  currentSubtaskIdx: number;
  createdAt: string;
}

export interface WorkspaceItem {
  id: string;
  name: string;
  logoType?: "airbnb" | "orbitask" | "amazon" | "custom";
  customLogo?: string;
  activeTab: "overview" | "settings";
  projects: ProjectItem[];
}

// Brand Logo Component matching Figma
function WorkspaceBrandLogo({
  type,
  name,
  customLogo,
  className = "w-6 h-6",
}: {
  type?: string;
  name: string;
  customLogo?: string;
  className?: string;
}) {
  if (customLogo) {
    return (
      <img
        src={customLogo}
        alt={name}
        className={`${className} rounded-[5px] object-cover border border-[#E2E8F0]`}
      />
    );
  }

  if (type === "airbnb" || name.toLowerCase().includes("airbnb")) {
    return (
      <svg className={`${className} text-[#FF5A5F]`} viewBox="0 0 32 32" fill="currentColor">
        <path d="M16 1c-4.2 0-7.8 2.7-9.4 6.6-2.1 5.3-.7 11.5 3.7 15.6 1.6 1.5 3.5 2.9 5.7 4.8 2.2-1.9 4.1-3.3 5.7-4.8 4.4-4.1 5.8-10.3 3.7-15.6C23.8 3.7 20.2 1 16 1zm0 21.2c-2.4-2.1-4.7-4.1-6.1-6.7-1.3-2.4-1.5-4.8-.5-7.3 1-2.5 3.3-4.2 6.6-4.2s5.6 1.7 6.6 4.2c1 2.5.8 4.9-.5 7.3-1.4 2.6-3.7 4.6-6.1 6.7zM16 7c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
      </svg>
    );
  }

  if (type === "amazon" || name.toLowerCase().includes("amazon")) {
    return (
      <svg className={`${className} text-[#111827]`} viewBox="0 0 24 24" fill="currentColor">
        <path d="M13.9 14.6c-.6.5-1.4.8-2.3.8-1.7 0-2.8-1.1-2.8-2.8 0-1.8 1.2-2.8 3-2.8.7 0 1.5.2 2.1.5v4.3zm2.5 2.8c-.2.2-.4.2-.6.1-.8-.6-1.1-.9-2.1-1.6-.9.9-1.9 1.3-3.2 1.3-2.3 0-4.1-1.6-4.1-4.2 0-2.4 1.6-4.1 4.1-4.1.9 0 1.7.2 2.5.6V9c0-1.8-1.2-2.7-3.1-2.7-1.1 0-2.1.4-2.8 1-.2.2-.4.1-.5-.1l-.8-1.2c-.1-.2 0-.4.2-.5 1.1-.9 2.5-1.4 4.2-1.4 2.9 0 5 1.5 5 4.7v5.6c0 .8.3 1.1.7 1.6.2.2.2.4 0 .6l-1.5 1.4zm6.6 2c-.2.2-.5.2-.7.1-2.9-2.2-6.5-3.4-10.2-3.4-3.5 0-7 1.1-9.9 3.2-.2.2-.5.1-.6 0-.2-.2-.1-.5.1-.7 3.1-2.2 6.8-3.4 10.4-3.4 3.9 0 7.7 1.3 10.8 3.6.2.2.3.4.1.6zm-1.8-1.5c-.1.2-.4.2-.6.1-.5-.4-1.2-.7-2-.8-.2 0-.3-.3-.2-.5.1-.2.3-.3.5-.2.9.2 1.7.5 2.2 1 .2.1.2.3.1.4z" />
      </svg>
    );
  }

  // Default Orbit Logo Icon
  return (
    <div className="w-6 h-6 rounded-[5px] bg-blue-50/70 border border-blue-100 flex items-center justify-center text-[#0284C7] shadow-2xs">
      <svg className="w-4 h-4 text-[#0284C7]" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="5" fill="#0284C7" />
        <ellipse
          cx="16"
          cy="16"
          rx="12"
          ry="4.8"
          stroke="#0284C7"
          strokeWidth="2"
          strokeLinecap="round"
          transform="rotate(-38 16 16)"
        />
      </svg>
    </div>
  );
}

export default function OrbitaskWorkspacePage() {
  // Current view mode: "workspaces_grid" (Cards view) or "project_dashboard" (Sidebar detail view from screenshot)
  const [currentView, setCurrentView] = useState<"workspaces_grid" | "project_dashboard">("workspaces_grid");
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string>("ws-amazon");
  const [activeProjectId, setActiveProjectId] = useState<string>("proj-amz-1");
  const [sidebarActiveTab, setSidebarActiveTab] = useState<string>("tasks");

  // Sidebar accordions & dropdowns
  const [isProjectsExpanded, setIsProjectsExpanded] = useState(true);
  const [isProjectViewExpanded, setIsProjectViewExpanded] = useState(true);
  const [isProjectMgmtExpanded, setIsProjectMgmtExpanded] = useState(true);
  const [isWorkspaceDropdownOpen, setIsWorkspaceDropdownOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  // Workspaces list seeded matching Figma
  const [workspaces, setWorkspaces] = useState<WorkspaceItem[]>([
    {
      id: "ws-airbnb",
      name: "Airbnb",
      logoType: "airbnb",
      activeTab: "overview",
      projects: [],
    },
    {
      id: "ws-orbitask",
      name: "Orbitask",
      logoType: "orbitask",
      activeTab: "overview",
      projects: [
        {
          id: "proj-orb-1",
          name: "Marketing Team",
          description: "The development team builds and maintains the product.",
          bannerColor: "#2563EB",
          isFavorite: false,
          tasksCompleted: 50,
          tasksTotal: 64,
          members: [
            { initials: "P", bg: "bg-blue-100 text-blue-800" },
            { img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80" },
            { img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80" },
            { initials: "H", bg: "bg-emerald-100 text-emerald-800" },
          ],
          subtasks: [
            {
              priority: "P2",
              priorityColor: "bg-amber-100 text-amber-800 border border-amber-200",
              title: "Learn Ui",
              progress: "10/13",
              date: "Jun 20, 2023",
            },
            {
              priority: "P1",
              priorityColor: "bg-rose-100 text-rose-800 border border-rose-200",
              title: "Design System",
              progress: "12/15",
              date: "Jun 24, 2023",
            },
          ],
          currentSubtaskIdx: 0,
          createdAt: "2026-09-08",
        },
        {
          id: "proj-orb-2",
          name: "Development",
          description: "Core platform engineering, API integrations, and database schemas.",
          bannerColor: "#0D9488",
          isFavorite: false,
          tasksCompleted: 42,
          tasksTotal: 50,
          members: [
            { initials: "P", bg: "bg-blue-100 text-blue-800" },
            { img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80" },
            { initials: "H", bg: "bg-emerald-100 text-emerald-800" },
          ],
          subtasks: [
            {
              priority: "P1",
              priorityColor: "bg-rose-100 text-rose-800 border border-rose-200",
              title: "Learn Ui",
              progress: "10/13",
              date: "Jun 20, 2023",
            },
          ],
          currentSubtaskIdx: 0,
          createdAt: "2026-09-08",
        },
      ],
    },
    {
      id: "ws-amazon",
      name: "Amazon",
      logoType: "amazon",
      activeTab: "overview",
      projects: [
        {
          id: "proj-amz-1",
          name: "Marketing",
          description: "The development team builds and maintains the product.",
          bannerColor: "#2563EB",
          isFavorite: false,
          tasksCompleted: 50,
          tasksTotal: 64,
          members: [
            { initials: "P", bg: "bg-blue-100 text-blue-800" },
            { img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80" },
            { img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80" },
            { initials: "H", bg: "bg-emerald-100 text-emerald-800" },
          ],
          subtasks: [
            {
              priority: "P1",
              priorityColor: "bg-rose-100 text-rose-800 border border-rose-200",
              title: "Learn Ui",
              progress: "10/13",
              date: "Jun 20, 2023",
            },
          ],
          currentSubtaskIdx: 0,
          createdAt: "2026-09-08",
        },
        {
          id: "proj-amz-2",
          name: "Development",
          description: "Backend microservices and automated build pipelines.",
          bannerColor: "#0D9488",
          isFavorite: false,
          tasksCompleted: 35,
          tasksTotal: 40,
          members: [
            { initials: "H", bg: "bg-emerald-100 text-emerald-800" },
            { initials: "A", bg: "bg-purple-100 text-purple-800" },
          ],
          subtasks: [
            {
              priority: "P2",
              priorityColor: "bg-amber-100 text-amber-800 border border-amber-200",
              title: "API Gateway",
              progress: "8/10",
              date: "Jun 25, 2023",
            },
          ],
          currentSubtaskIdx: 0,
          createdAt: "2026-09-08",
        },
        {
          id: "proj-amz-3",
          name: "Support",
          description: "Customer issue resolution, bug tracking, and live chat monitoring.",
          bannerColor: "#F59E0B",
          isFavorite: false,
          tasksCompleted: 28,
          tasksTotal: 30,
          members: [
            { initials: "S", bg: "bg-orange-100 text-orange-800" },
          ],
          subtasks: [
            {
              priority: "P3",
              priorityColor: "bg-blue-100 text-blue-800 border border-blue-200",
              title: "Helpdesk Setup",
              progress: "5/5",
              date: "Jun 30, 2023",
            },
          ],
          currentSubtaskIdx: 0,
          createdAt: "2026-09-08",
        },
      ],
    },
  ]);

  // Sample tasks for Kanban board in active project view
  const [boardTasks, setBoardTasks] = useState<TaskCardItem[]>([
    {
      id: "t-1",
      title: "Design Onboarding Flow in Figma",
      description: "Complete all 5 screens with pixel-perfect responsive layouts.",
      priority: "P1",
      status: "todo",
      progress: "3/5",
      dueDate: "Sep 12, 2026",
      assignee: { name: "Bilal", initials: "B", bg: "bg-blue-100 text-blue-700" },
    },
    {
      id: "t-2",
      title: "Setup Resend & Cloudflare R2",
      description: "Verify email deliverability and image assets storage bucket.",
      priority: "P2",
      status: "in_progress",
      progress: "8/10",
      dueDate: "Sep 14, 2026",
      assignee: { name: "Moni Roy", initials: "M", bg: "bg-purple-100 text-purple-700" },
    },
    {
      id: "t-3",
      title: "Interactive 3-Dots Color Flyout",
      description: "Support hover & click color change with clean z-indexing.",
      priority: "P1",
      status: "in_review",
      progress: "5/5",
      dueDate: "Sep 09, 2026",
      assignee: { name: "Alex", initials: "A", bg: "bg-emerald-100 text-emerald-700" },
    },
    {
      id: "t-4",
      title: "Landing Page Architecture",
      description: "Hero, Features, Pricing toggle, and FAQ accordion sections.",
      priority: "P2",
      status: "done",
      progress: "12/12",
      dueDate: "Sep 05, 2026",
      assignee: { name: "Sarah", initials: "S", bg: "bg-amber-100 text-amber-700" },
    },
  ]);

  // Modal states
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [targetWorkspaceId, setTargetWorkspaceId] = useState<string | null>(null);
  const [isCreateWorkspaceOpen, setIsCreateWorkspaceOpen] = useState(false);

  // Project card menu & color submenu
  const [activeMenuProjectId, setActiveMenuProjectId] = useState<string | null>(null);
  const [isColorSubmenuOpen, setIsColorSubmenuOpen] = useState<string | null>(null);

  // Edit project modal state (for Rename / Edit Description)
  const [editingProject, setEditingProject] = useState<{
    isOpen: boolean;
    workspaceId: string;
    projectId: string;
    name: string;
    description: string;
  } | null>(null);

  // Form states for Create Workspace (Image 2)
  const [wsFormName, setWsFormName] = useState("");
  const [wsFormUrl, setWsFormUrl] = useState("");
  const [wsFormDesc, setWsFormDesc] = useState("");
  const [wsUploadedLogo, setWsUploadedLogo] = useState<string | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  // Form states for Create Project (Images 3 & 4)
  const [projFormName, setProjFormName] = useState("");
  const [projFormDesc, setProjFormDesc] = useState("");
  const [projFormBoard, setProjFormBoard] = useState("");
  const [isInviteMemberOpen, setIsInviteMemberOpen] = useState(false);
  const [inviteEmailInput, setInviteEmailInput] = useState("");
  const [invitedEmails, setInvitedEmails] = useState<string[]>([]);

  // Close menus when clicking outside (strictly checks data-menu-container)
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement | null;
      if (target && target.closest("[data-menu-container]")) {
        return;
      }
      setActiveMenuProjectId(null);
      setIsColorSubmenuOpen(null);
      setIsWorkspaceDropdownOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handlers for Navigation to Project Detail View
  const handleOpenWorkspaceView = (workspaceId: string) => {
    setActiveWorkspaceId(workspaceId);
    const ws = workspaces.find((w) => w.id === workspaceId);
    if (ws && ws.projects.length > 0) {
      setActiveProjectId(ws.projects[0].id);
    }
    setSidebarActiveTab("tasks");
    setCurrentView("project_dashboard");
  };

  const handleOpenProjectView = (workspaceId: string, projectId: string) => {
    setActiveWorkspaceId(workspaceId);
    setActiveProjectId(projectId);
    setSidebarActiveTab("tasks");
    setCurrentView("project_dashboard");
  };

  // Handlers for Project Creation
  const openCreateProjectModal = (workspaceId: string) => {
    setTargetWorkspaceId(workspaceId);
    setProjFormName("");
    setProjFormDesc("");
    setProjFormBoard("");
    setIsInviteMemberOpen(false);
    setInviteEmailInput("");
    setInvitedEmails([]);
    setIsCreateProjectOpen(true);
  };

  const handleAddInvitedEmail = () => {
    if (!inviteEmailInput.trim()) return;
    if (!invitedEmails.includes(inviteEmailInput.trim())) {
      setInvitedEmails((prev) => [...prev, inviteEmailInput.trim()]);
    }
    setInviteEmailInput("");
  };

  const handleRemoveInvitedEmail = (email: string) => {
    setInvitedEmails((prev) => prev.filter((e) => e !== email));
  };

  const handleCreateProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projFormName.trim()) return;

    const targetWsId = targetWorkspaceId || activeWorkspaceId || workspaces[0]?.id;
    if (!targetWsId) return;

    const newProject: ProjectItem = {
      id: `proj-${Date.now()}`,
      name: projFormName.trim(),
      description:
        projFormDesc.trim() ||
        "The development team builds and maintains the product.",
      bannerColor: "#2563EB",
      isFavorite: false,
      tasksCompleted: 0,
      tasksTotal: 12,
      members: [
        { initials: "P", bg: "bg-blue-100 text-blue-800" },
        { initials: "M", bg: "bg-purple-100 text-purple-800" },
      ],
      subtasks: [
        {
          priority: "P1",
          priorityColor: "bg-rose-100 text-rose-800 border border-rose-200",
          title: projFormBoard.trim() || "Default Board",
          progress: "0/12",
          date: new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
        },
      ],
      currentSubtaskIdx: 0,
      createdAt: new Date().toISOString(),
    };

    setWorkspaces((prev) =>
      prev.map((ws) =>
        ws.id === targetWsId
          ? { ...ws, projects: [...ws.projects, newProject] }
          : ws
      )
    );

    setActiveProjectId(newProject.id);
    setIsCreateProjectOpen(false);

    try {
      await createProjectAction({
        workspaceId: targetWsId,
        name: newProject.name,
        description: newProject.description,
        bannerColor: newProject.bannerColor,
      });
    } catch (err) {
      console.warn("Project created locally:", err);
    }
  };

  // Handlers for Workspace Creation (Image 2)
  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setWsUploadedLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateWorkspaceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wsFormName.trim()) return;

    const newWsId = `ws-${Date.now()}`;
    const wsName = wsFormName.trim();

    const newWs: WorkspaceItem = {
      id: newWsId,
      name: wsName,
      logoType: "custom",
      customLogo: wsUploadedLogo || undefined,
      activeTab: "overview",
      projects: [],
    };

    setWorkspaces((prev) => [...prev, newWs]);
    setActiveWorkspaceId(newWsId);
    setWsFormName("");
    setWsFormUrl("");
    setWsFormDesc("");
    setWsUploadedLogo(null);
    setIsCreateWorkspaceOpen(false);

    try {
      const res = await createWorkspaceAction(wsName);
      if (res?.success && res.data?.id) {
        setWorkspaces((prev) =>
          prev.map((ws) => (ws.id === newWsId ? { ...ws, id: res.data.id } : ws))
        );
      }
    } catch (err) {
      console.warn("Workspace created locally:", err);
    }
  };

  // Subtask slider navigation
  const handleSubtaskPrev = (workspaceId: string, projectId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setWorkspaces((prev) =>
      prev.map((ws) =>
        ws.id === workspaceId
          ? {
              ...ws,
              projects: ws.projects.map((p) => {
                if (p.id !== projectId || p.subtasks.length === 0) return p;
                const nextIdx =
                  (p.currentSubtaskIdx - 1 + p.subtasks.length) % p.subtasks.length;
                return { ...p, currentSubtaskIdx: nextIdx };
              }),
            }
          : ws
      )
    );
  };

  const handleSubtaskNext = (workspaceId: string, projectId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setWorkspaces((prev) =>
      prev.map((ws) =>
        ws.id === workspaceId
          ? {
              ...ws,
              projects: ws.projects.map((p) => {
                if (p.id !== projectId || p.subtasks.length === 0) return p;
                const nextIdx = (p.currentSubtaskIdx + 1) % p.subtasks.length;
                return { ...p, currentSubtaskIdx: nextIdx };
              }),
            }
          : ws
      )
    );
  };

  // Star favorite toggle
  const handleToggleFavorite = (workspaceId: string, projectId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setWorkspaces((prev) =>
      prev.map((ws) =>
        ws.id === workspaceId
          ? {
              ...ws,
              projects: ws.projects.map((p) =>
                p.id === projectId ? { ...p, isFavorite: !p.isFavorite } : p
              ),
            }
          : ws
      )
    );
  };

  // Change project color (Image 1 flyout)
  const handleChangeColor = (
    workspaceId: string,
    projectId: string,
    color: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    setWorkspaces((prev) =>
      prev.map((ws) =>
        ws.id === workspaceId
          ? {
              ...ws,
              projects: ws.projects.map((p) =>
                p.id === projectId ? { ...p, bannerColor: color } : p
              ),
            }
          : ws
      )
    );
    setActiveMenuProjectId(null);
    setIsColorSubmenuOpen(null);
  };

  // Delete project
  const handleDeleteProject = (workspaceId: string, projectId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setWorkspaces((prev) =>
      prev.map((ws) =>
        ws.id === workspaceId
          ? {
              ...ws,
              projects: ws.projects.filter((p) => p.id !== projectId),
            }
          : ws
      )
    );
    setActiveMenuProjectId(null);
    deleteProjectAction(projectId).catch(() => {});
  };

  // Edit project name/desc save
  const handleSaveEditProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    setWorkspaces((prev) =>
      prev.map((ws) =>
        ws.id === editingProject.workspaceId
          ? {
              ...ws,
              projects: ws.projects.map((p) =>
                p.id === editingProject.projectId
                  ? {
                      ...p,
                      name: editingProject.name.trim(),
                      description: editingProject.description.trim(),
                    }
                  : p
              ),
            }
          : ws
      )
    );
    setEditingProject(null);
  };

  // Workspace tab switch
  const handleSetWorkspaceTab = (workspaceId: string, tab: "overview" | "settings") => {
    setWorkspaces((prev) =>
      prev.map((ws) => (ws.id === workspaceId ? { ...ws, activeTab: tab } : ws))
    );
  };

  const handleUpdateWorkspaceName = (workspaceId: string, name: string) => {
    setWorkspaces((prev) =>
      prev.map((ws) => (ws.id === workspaceId ? { ...ws, name } : ws))
    );
    updateWorkspaceNameAction(workspaceId, name).catch(() => {});
  };

  const handleDeleteWorkspace = (workspaceId: string) => {
    setWorkspaces((prev) => prev.filter((ws) => ws.id !== workspaceId));
    deleteWorkspaceAction(workspaceId).catch(() => {});
  };

  // Filter projects helper
  const getFilteredProjects = (ws: WorkspaceItem) => {
    if (!searchQuery.trim()) return ws.projects;
    const q = searchQuery.toLowerCase();
    return ws.projects.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  };

  // Active workspace & active project objects
  const activeWorkspace =
    workspaces.find((w) => w.id === activeWorkspaceId) || workspaces[0];
  const activeProject =
    activeWorkspace?.projects.find((p) => p.id === activeProjectId) ||
    activeWorkspace?.projects[0];

  return (
    <div className="min-h-screen bg-white text-[#0F172A] font-sans antialiased flex flex-col selection:bg-blue-100 selection:text-blue-900">
      {/* ========================================================================= */}
      {/* VIEW A: MULTI-WORKSPACE CARDS VIEW (When currentView === "workspaces_grid") */}
      {/* ========================================================================= */}
      {currentView === "workspaces_grid" && (
        <>
          {/* TOP NAVBAR */}
          <header className="w-full px-8 md:px-12 py-4 flex items-center justify-between border-b border-[#F1F5F9] bg-white sticky top-0 z-30">
            {/* Left: Brand Logo (Orbitask) */}
            <div className="flex items-center gap-2 select-none">
              <div className="relative flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-[#0284C7]"
                  viewBox="0 0 36 36"
                  fill="none"
                >
                  <circle cx="18" cy="18" r="6" fill="#0284C7" />
                  <ellipse
                    cx="18"
                    cy="18"
                    rx="14"
                    ry="5.5"
                    stroke="#0284C7"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    transform="rotate(-38 18 18)"
                  />
                  <ellipse
                    cx="18"
                    cy="18"
                    rx="14"
                    ry="5.5"
                    stroke="#38BDF8"
                    strokeWidth="2.4"
                    strokeDasharray="20 40"
                    strokeLinecap="round"
                    transform="rotate(-38 18 18)"
                  />
                </svg>
              </div>
              <span className="text-[20px] font-bold tracking-tight text-[#0F172A] font-poppins lowercase">
                orbitask
              </span>
            </div>

            {/* Center: Search Field */}
            <div className="flex-1 max-w-[420px] mx-8">
              <div className="relative">
                <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2 stroke-[1.75]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full h-9 pl-10 pr-4 bg-white border border-[#E2E8F0] rounded-[5px] text-xs font-medium font-inter text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-all"
                />
              </div>
            </div>

            {/* Right: Moni Roy Profile, Notification Bell, Settings */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2.5 p-1 rounded-[5px]">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                  alt="Moni Roy"
                  className="w-8 h-8 rounded-[5px] object-cover"
                />
                <div className="flex flex-col text-left">
                  <span className="text-xs font-semibold font-inter text-[#0F172A] leading-tight">
                    Moni Roy
                  </span>
                  <span className="text-[10px] font-medium font-inter text-[#94A3B8] leading-tight mt-0.5">
                    Admin
                  </span>
                </div>
              </div>

              <button
                type="button"
                className="w-8 h-8 rounded-[5px] border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:text-[#0F172A] hover:bg-slate-50 transition-colors cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-4 h-4 stroke-[1.75]" />
              </button>

              <button
                type="button"
                className="w-8 h-8 rounded-[5px] border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:text-[#0F172A] hover:bg-slate-50 transition-colors cursor-pointer"
                title="Settings"
              >
                <Settings className="w-4 h-4 stroke-[1.75]" />
              </button>
            </div>
          </header>

          {/* MAIN CONTENT (WORKSPACES STACKED) */}
          <main className="flex-1 w-full px-8 md:px-12 pt-8 pb-16">
            <div className="space-y-12">
              {workspaces.map((ws) => {
                const filteredProjects = getFilteredProjects(ws);

                return (
                  <section key={ws.id} className="space-y-6">
                    {/* Workspace Header Bar */}
                    <div className="flex items-center gap-8 flex-wrap">
                      {/* Brand Icon & Title */}
                      <div
                        onClick={() => handleOpenWorkspaceView(ws.id)}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <WorkspaceBrandLogo
                          type={ws.logoType}
                          name={ws.name}
                          customLogo={ws.customLogo}
                        />
                        <h2 className="text-xl font-bold tracking-tight text-[#0F172A] font-poppins group-hover:text-[#2563EB] transition-colors">
                          {ws.name}
                        </h2>
                      </div>

                      {/* Inline Navigation Tabs */}
                      <div className="flex items-center gap-6 text-xs font-medium font-inter text-[#64748B]">
                        <button
                          type="button"
                          onClick={() => handleSetWorkspaceTab(ws.id, "overview")}
                          className={`flex items-center gap-1.5 transition-colors cursor-pointer font-medium font-inter ${
                            ws.activeTab === "overview"
                              ? "text-[#0F172A]"
                              : "text-[#64748B] hover:text-[#0F172A]"
                          }`}
                        >
                          <Compass className="w-4 h-4 stroke-[1.75]" />
                          <span>Overview</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleSetWorkspaceTab(ws.id, "settings")}
                          className={`flex items-center gap-1.5 transition-colors cursor-pointer font-medium font-inter ${
                            ws.activeTab === "settings"
                              ? "text-[#0F172A]"
                              : "text-[#64748B] hover:text-[#0F172A]"
                          }`}
                        >
                          <Settings className="w-4 h-4 stroke-[1.75]" />
                          <span>Settings</span>
                        </button>
                      </div>

                      {/* Create Project Button */}
                      <div className="ml-auto">
                        <button
                          type="button"
                          onClick={() => openCreateProjectModal(ws.id)}
                          className="h-9 px-4 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-medium font-inter rounded-[5px] flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                          <span>Create Project</span>
                        </button>
                      </div>
                    </div>

                    {/* OVERVIEW CONTENT */}
                    {ws.activeTab === "overview" && (
                      <div className="space-y-6">
                        {ws.projects.length === 0 ? (
                          <div className="w-full py-12 rounded-[5px] border border-dashed border-[#CBD5E1] flex items-center justify-center text-xs font-medium font-inter text-[#475569] bg-slate-50/30">
                            <span>No Project has been created yet,&nbsp;</span>
                            <button
                              type="button"
                              onClick={() => openCreateProjectModal(ws.id)}
                              className="text-[#2563EB] hover:underline font-semibold cursor-pointer"
                            >
                              make one!
                            </button>
                          </div>
                        ) : (
                          <>
                            {/* 3-COLUMN PROJECTS GRID */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                              {filteredProjects.map((project) => {
                                const activeSubtask =
                                  project.subtasks[
                                    project.currentSubtaskIdx %
                                      (project.subtasks.length || 1)
                                  ];

                                return (
                                  <div
                                    key={project.id}
                                    onClick={() => handleOpenProjectView(ws.id, project.id)}
                                    className={`w-full rounded-[5px] bg-white border border-[#E2E8F0] shadow-xs hover:shadow-md transition-all duration-200 group relative flex flex-col justify-between cursor-pointer ${
                                      activeMenuProjectId === project.id ? "z-40" : "z-10"
                                    }`}
                                  >
                                    <div>
                                      {/* Topographic Wave Graphic Banner */}
                                      <div
                                        className="h-[76px] rounded-t-[5px] relative flex items-start justify-end p-2.5 gap-1 shrink-0"
                                        style={{ backgroundColor: project.bannerColor }}
                                      >
                                        <div className="absolute inset-0 overflow-hidden rounded-t-[5px] pointer-events-none">
                                          <svg
                                            className="w-full h-full opacity-40"
                                            viewBox="0 0 320 76"
                                            fill="none"
                                            preserveAspectRatio="none"
                                          >
                                            <path
                                              d="M-20 15 C50 0 110 35 180 10 C240 -8 290 25 350 12"
                                              stroke="white"
                                              strokeWidth="1.25"
                                              fill="none"
                                            />
                                            <path
                                              d="M-20 30 C40 18 130 50 200 25 C260 8 300 38 350 30"
                                              stroke="white"
                                              strokeWidth="1.25"
                                              fill="none"
                                            />
                                            <path
                                              d="M-20 48 C30 38 120 68 190 42 C270 20 300 55 350 48"
                                              stroke="white"
                                              strokeWidth="1.25"
                                              fill="none"
                                            />
                                            <path
                                              d="M-20 65 C60 52 140 82 220 60 C280 38 320 72 350 65"
                                              stroke="white"
                                              strokeWidth="1.25"
                                              fill="none"
                                            />
                                            <ellipse
                                              cx="260"
                                              cy="30"
                                              rx="35"
                                              ry="15"
                                              stroke="white"
                                              strokeWidth="1.25"
                                              fill="none"
                                            />
                                            <ellipse
                                              cx="85"
                                              cy="42"
                                              rx="40"
                                              ry="18"
                                              stroke="white"
                                              strokeWidth="1.25"
                                              fill="none"
                                            />
                                          </svg>
                                        </div>

                                        {/* Star Button */}
                                        <button
                                          type="button"
                                          onClick={(e) =>
                                            handleToggleFavorite(ws.id, project.id, e)
                                          }
                                          className="relative z-10 p-1 text-white/90 hover:text-white transition-colors cursor-pointer rounded-[5px]"
                                          title="Star project"
                                        >
                                          <Star
                                            className={`w-3.5 h-3.5 stroke-[1.75] ${
                                              project.isFavorite
                                                ? "fill-amber-300 text-amber-300"
                                                : ""
                                            }`}
                                          />
                                        </button>

                                        {/* 3-Dots Action Button */}
                                        <div
                                          className="relative"
                                          data-menu-container="true"
                                          onClick={(e) => e.stopPropagation()}
                                        >
                                          <button
                                            type="button"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setActiveMenuProjectId((prev) =>
                                                prev === project.id ? null : project.id
                                              );
                                              setIsColorSubmenuOpen(null);
                                            }}
                                            className="relative z-20 p-1.5 text-white hover:text-white/80 transition-colors cursor-pointer rounded-[5px]"
                                            title="Project options"
                                          >
                                            <MoreVertical className="w-4 h-4 stroke-[2]" />
                                          </button>

                                          {/* Dropdown Menu (Exact match to User's Screenshot) */}
                                          {activeMenuProjectId === project.id && (
                                            <div
                                              onClick={(e) => e.stopPropagation()}
                                              className="absolute right-0 top-8 w-48 bg-white rounded-[8px] border border-[#F1F5F9] shadow-2xl z-50 py-2 px-1 text-[13px] font-inter animate-in fade-in zoom-in-95"
                                            >
                                              <button
                                                type="button"
                                                onClick={() => {
                                                  setActiveMenuProjectId(null);
                                                  setEditingProject({
                                                    isOpen: true,
                                                    workspaceId: ws.id,
                                                    projectId: project.id,
                                                    name: project.name,
                                                    description: project.description,
                                                  });
                                                }}
                                                className="w-full px-3 py-2 text-left hover:bg-[#F8FAFC] flex items-center gap-3 rounded-[5px] text-[#334155] cursor-pointer transition-colors"
                                              >
                                                <svg
                                                  className="w-4 h-4 text-[#475569] shrink-0"
                                                  viewBox="0 0 24 24"
                                                  fill="none"
                                                  stroke="currentColor"
                                                  strokeWidth="1.75"
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                >
                                                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                                </svg>
                                                <span>Rename project</span>
                                              </button>

                                              <button
                                                type="button"
                                                onClick={() => {
                                                  setActiveMenuProjectId(null);
                                                  setEditingProject({
                                                    isOpen: true,
                                                    workspaceId: ws.id,
                                                    projectId: project.id,
                                                    name: project.name,
                                                    description: project.description,
                                                  });
                                                }}
                                                className="w-full px-3 py-2 text-left hover:bg-[#F8FAFC] flex items-center gap-3 rounded-[5px] text-[#334155] cursor-pointer transition-colors"
                                              >
                                                <svg
                                                  className="w-4 h-4 text-[#475569] shrink-0"
                                                  viewBox="0 0 24 24"
                                                  fill="none"
                                                  stroke="currentColor"
                                                  strokeWidth="1.75"
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                >
                                                  <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                                                </svg>
                                                <span>Edit description</span>
                                              </button>

                                              {/* change color > */}
                                              <div
                                                className="relative"
                                                onMouseEnter={() =>
                                                  setIsColorSubmenuOpen(project.id)
                                                }
                                              >
                                                <button
                                                  type="button"
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    setIsColorSubmenuOpen((prev) =>
                                                      prev === project.id ? null : project.id
                                                    );
                                                  }}
                                                  className="w-full px-3 py-2 text-left hover:bg-[#F8FAFC] flex items-center justify-between rounded-[5px] text-[#334155] cursor-pointer transition-colors"
                                                >
                                                  <div className="flex items-center gap-3">
                                                    <svg
                                                      className="w-4 h-4 text-[#475569] shrink-0"
                                                      viewBox="0 0 24 24"
                                                      fill="none"
                                                      stroke="currentColor"
                                                      strokeWidth="1.75"
                                                      strokeLinecap="round"
                                                      strokeLinejoin="round"
                                                    >
                                                      <rect x="2" y="3" width="16" height="5" rx="1" />
                                                      <path d="M10 8v3a2 2 0 0 0 2 2h2a2 2 0 0 1 2 2v4" />
                                                    </svg>
                                                    <span>change color</span>
                                                  </div>
                                                  <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8] shrink-0" />
                                                </button>

                                                {isColorSubmenuOpen === project.id && (
                                                  <div
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="absolute left-full top-0 ml-1.5 min-w-[125px] bg-white rounded-[8px] border border-[#F1F5F9] shadow-2xl p-2 z-50 animate-in fade-in"
                                                  >
                                                    {[
                                                      { label: "Blue", color: "#2563EB" },
                                                      { label: "Teal", color: "#00A3A6" },
                                                      { label: "Yellow", color: "#D97706" },
                                                      { label: "Red", color: "#EF4444" },
                                                      { label: "Green", color: "#2E7D32" },
                                                    ].map((c) => (
                                                      <button
                                                        key={c.color}
                                                        type="button"
                                                        onClick={(e) =>
                                                          handleChangeColor(
                                                            ws.id,
                                                            project.id,
                                                            c.color,
                                                            e
                                                          )
                                                        }
                                                        className="w-full px-2.5 py-1.5 text-left hover:bg-[#F8FAFC] flex items-center gap-3 rounded-[4px] cursor-pointer transition-colors text-[13px] font-normal text-[#334155]"
                                                      >
                                                        <span
                                                          className="w-3.5 h-3.5 rounded-full shrink-0 shadow-2xs"
                                                          style={{
                                                            backgroundColor: c.color,
                                                          }}
                                                        />
                                                        <span>{c.label}</span>
                                                      </button>
                                                    ))}
                                                  </div>
                                                )}
                                              </div>

                                              <button
                                                type="button"
                                                onClick={(e) =>
                                                  handleDeleteProject(
                                                    ws.id,
                                                    project.id,
                                                    e
                                                  )
                                                }
                                                className="w-full px-3 py-2 text-left hover:bg-red-50/70 text-[#EF4444] flex items-center gap-3 rounded-[5px] cursor-pointer transition-colors mt-0.5"
                                              >
                                                <Trash2 className="w-4 h-4 text-[#EF4444] shrink-0 stroke-[1.75]" />
                                                <span>Delete Permanently</span>
                                              </button>
                                            </div>
                                          )}
                                        </div>
                                      </div>

                                      {/* Card Body */}
                                      <div className="p-4 pb-2">
                                        <div className="flex items-start justify-between gap-2">
                                          <div className="flex-1 min-w-0">
                                            <h3 className="text-[16px] font-bold text-[#0F172A] leading-snug font-poppins truncate group-hover:text-[#2563EB] transition-colors">
                                              {project.name}
                                            </h3>
                                            <p className="text-[11px] font-medium font-inter text-[#64748B] leading-relaxed mt-1 line-clamp-2">
                                              {project.description}
                                            </p>
                                          </div>

                                          <div className="flex items-center -space-x-1.5 shrink-0 ml-2 mt-0.5">
                                            {project.members.map((m, idx) => (
                                              <div
                                                key={idx}
                                                className={`w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold overflow-hidden shadow-2xs ${
                                                  m.bg || "bg-slate-100"
                                                }`}
                                              >
                                                {m.img ? (
                                                  <img
                                                    src={m.img}
                                                    alt="Member"
                                                    className="w-full h-full object-cover"
                                                  />
                                                ) : (
                                                  m.initials
                                                )}
                                              </div>
                                            ))}
                                            <span className="text-[11px] font-medium font-inter text-[#64748B] pl-2.5">
                                              12+
                                            </span>
                                          </div>
                                        </div>

                                        <div className="flex items-center gap-1.5 text-xs font-medium font-inter text-[#64748B] mt-3">
                                          <CheckSquare className="w-3.5 h-3.5 text-[#64748B] stroke-[1.75]" />
                                          <span>
                                            Tasks: {project.tasksCompleted}/
                                            {project.tasksTotal}
                                          </span>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Subtask Carousel Bar */}
                                    <div
                                      onClick={(e) => e.stopPropagation()}
                                      className="px-4 py-3 border-t border-[#F1F5F9] flex items-center justify-between gap-2"
                                    >
                                      <button
                                        type="button"
                                        onClick={(e) =>
                                          handleSubtaskPrev(ws.id, project.id, e)
                                        }
                                        className="p-1 text-[#94A3B8] hover:text-[#0F172A] transition-colors cursor-pointer rounded"
                                        title="Previous milestone"
                                      >
                                        <ChevronLeft className="w-4 h-4 stroke-[2]" />
                                      </button>

                                      {activeSubtask ? (
                                        <div className="flex items-center gap-3 text-xs font-medium font-inter text-[#64748B] flex-1 justify-center truncate">
                                          <span
                                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold shrink-0 ${activeSubtask.priorityColor}`}
                                          >
                                            {activeSubtask.priority}
                                          </span>
                                          <span className="font-bold text-[#0F172A] truncate">
                                            {activeSubtask.title}
                                          </span>
                                          <div className="flex items-center gap-1 shrink-0">
                                            <CheckSquare className="w-3 h-3 text-[#94A3B8]" />
                                            <span>{activeSubtask.progress}</span>
                                          </div>
                                          <div className="flex items-center gap-1 shrink-0 hidden sm:flex">
                                            <Calendar className="w-3 h-3 text-[#94A3B8]" />
                                            <span>{activeSubtask.date}</span>
                                          </div>
                                        </div>
                                      ) : (
                                        <span className="text-xs text-[#94A3B8]">
                                          No subtasks
                                        </span>
                                      )}

                                      <button
                                        type="button"
                                        onClick={(e) =>
                                          handleSubtaskNext(ws.id, project.id, e)
                                        }
                                        className="p-1 text-[#94A3B8] hover:text-[#0F172A] transition-colors cursor-pointer rounded"
                                        title="Next milestone"
                                      >
                                        <ChevronRight className="w-4 h-4 stroke-[2]" />
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}

                              {/* Add New Projects Dotted Card */}
                              <button
                                type="button"
                                onClick={() => openCreateProjectModal(ws.id)}
                                className="w-full min-h-[200px] rounded-[5px] border-2 border-dashed border-[#CBD5E1] hover:border-[#2563EB] hover:bg-blue-50/20 flex flex-col items-center justify-center gap-2.5 transition-all duration-200 group cursor-pointer text-center bg-transparent"
                              >
                                <Plus className="w-6 h-6 text-[#64748B] group-hover:text-[#2563EB] group-hover:scale-110 transition-all stroke-[2]" />
                                <span className="text-xs font-medium font-inter text-[#475569] group-hover:text-[#2563EB] transition-colors">
                                  Add New Projects
                                </span>
                              </button>
                            </div>

                            {/* View All Projects Button (Clicking opens Project Dashboard View!) */}
                            <div className="flex justify-center pt-2">
                              <button
                                type="button"
                                onClick={() => handleOpenWorkspaceView(ws.id)}
                                className="h-9 px-6 bg-white border border-[#E2E8F0] hover:bg-slate-50 text-[#334155] rounded-[5px] text-xs font-medium font-inter shadow-2xs transition-colors cursor-pointer flex items-center gap-2"
                              >
                                <span>View All Projects</span>
                                <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8]" />
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    )}

                    {/* SETTINGS TAB VIEW */}
                    {ws.activeTab === "settings" && (
                      <div className="max-w-xl bg-white p-6 rounded-[5px] border border-[#E2E8F0] shadow-xs space-y-6">
                        <div>
                          <h3 className="text-base font-bold text-[#0F172A] font-poppins">
                            Workspace Settings
                          </h3>
                          <p className="text-xs font-medium font-inter text-[#64748B] mt-1">
                            Manage your workspace identity and preferences.
                          </p>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-[#F1F5F9]">
                          <div className="relative border border-[#CBD5E1] rounded-[5px] px-3.5 pt-2.5 pb-2.5 focus-within:border-[#2563EB] focus-within:ring-1 focus-within:ring-[#2563EB] transition-all bg-white">
                            <label className="absolute -top-2.5 left-3 bg-white px-1 text-[11px] font-medium text-[#475569] font-inter select-none">
                              Workspace Name
                            </label>
                            <input
                              type="text"
                              value={ws.name}
                              onChange={(e) =>
                                handleUpdateWorkspaceName(ws.id, e.target.value)
                              }
                              className="w-full bg-transparent text-xs font-medium font-inter text-[#0F172A] focus:outline-none"
                            />
                          </div>

                          <div className="flex items-center justify-between pt-3">
                            {workspaces.length > 1 ? (
                              <button
                                type="button"
                                onClick={() => handleDeleteWorkspace(ws.id)}
                                className="text-xs font-medium font-inter text-red-600 hover:text-red-700 hover:underline cursor-pointer flex items-center gap-1.5"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Delete this workspace</span>
                              </button>
                            ) : (
                              <span className="text-xs font-medium font-inter text-[#64748B]">
                                Changes are saved automatically.
                              </span>
                            )}

                            <button
                              type="button"
                              onClick={() => handleSetWorkspaceTab(ws.id, "overview")}
                              className="h-9 px-4 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-medium font-inter rounded-[5px] transition-colors cursor-pointer"
                            >
                              Done
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </section>
                );
              })}

              {/* CREATE WORKSPACE BUTTON (BOTTOM LEFT) */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateWorkspaceOpen(true)}
                  className="h-9 px-4 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-medium font-inter rounded-[5px] flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Create Workspace</span>
                </button>
              </div>
            </div>
          </main>
        </>
      )}

      {/* ========================================================================= */}
      {/* VIEW B: SIDEBAR DASHBOARD VIEW (Exact match to User's Latest Screenshot!) */}
      {/* ========================================================================= */}
      {currentView === "project_dashboard" && (
        <div className="flex h-screen overflow-hidden bg-[#F8FAFC]">
          {/* ================= LEFT SIDEBAR (EXACT MATCH TO SCREENSHOT) ================= */}
          <aside
            className={`${
              isSidebarCollapsed ? "w-18" : "w-[260px]"
            } bg-white border-r border-[#F1F5F9] flex flex-col justify-between transition-all duration-300 shrink-0 select-none z-30`}
          >
            <div className="p-4 flex flex-col gap-4 overflow-y-auto max-h-screen">
              {/* 1. Header: Orbitask Logo + Collapse button */}
              <div className="flex items-center justify-between">
                <div
                  onClick={() => setCurrentView("workspaces_grid")}
                  className="flex items-center gap-2 cursor-pointer select-none"
                  title="Return to workspaces overview"
                >
                  <div className="relative flex items-center justify-center">
                    <svg
                      className="w-7 h-7 text-[#0284C7]"
                      viewBox="0 0 36 36"
                      fill="none"
                    >
                      <circle cx="18" cy="18" r="6" fill="#0284C7" />
                      <ellipse
                        cx="18"
                        cy="18"
                        rx="14"
                        ry="5.5"
                        stroke="#0284C7"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                        transform="rotate(-38 18 18)"
                      />
                      <ellipse
                        cx="18"
                        cy="18"
                        rx="14"
                        ry="5.5"
                        stroke="#38BDF8"
                        strokeWidth="2.4"
                        strokeDasharray="20 40"
                        strokeLinecap="round"
                        transform="rotate(-38 18 18)"
                      />
                    </svg>
                  </div>
                  {!isSidebarCollapsed && (
                    <span className="text-[20px] font-bold tracking-tight text-[#0F172A] font-poppins lowercase">
                      orbitask
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                  className="p-1.5 rounded-[5px] text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100 transition-colors cursor-pointer"
                  title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                  {isSidebarCollapsed ? (
                    <PanelLeft className="w-4 h-4" />
                  ) : (
                    <PanelLeftClose className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* 2. Workspace Selector Dropdown (e.g. Amazon / Orbitask / Airbnb) */}
              {!isSidebarCollapsed && (
                <div className="relative" data-menu-container="true">
                  <div
                    onClick={() => setIsWorkspaceDropdownOpen(!isWorkspaceDropdownOpen)}
                    className="h-11 px-3 border border-[#E2E8F0] rounded-[8px] flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors shadow-2xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <WorkspaceBrandLogo
                        type={activeWorkspace?.logoType}
                        name={activeWorkspace?.name || "Workspace"}
                        customLogo={activeWorkspace?.customLogo}
                        className="w-5 h-5 shrink-0"
                      />
                      <span className="text-sm font-semibold text-[#0F172A] font-inter truncate">
                        {activeWorkspace?.name}
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-[#64748B] shrink-0 transition-transform ${
                        isWorkspaceDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </div>

                  {/* Switcher Popup */}
                  {isWorkspaceDropdownOpen && (
                    <div className="absolute top-12 left-0 right-0 bg-white rounded-[8px] border border-[#E2E8F0] shadow-xl py-1 z-50 text-xs font-inter animate-in fade-in zoom-in-95">
                      <div className="px-3 py-1.5 text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider">
                        Switch Workspace
                      </div>
                      {workspaces.map((ws) => (
                        <button
                          key={ws.id}
                          type="button"
                          onClick={() => {
                            setActiveWorkspaceId(ws.id);
                            if (ws.projects.length > 0) {
                              setActiveProjectId(ws.projects[0].id);
                            }
                            setIsWorkspaceDropdownOpen(false);
                          }}
                          className={`w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center justify-between cursor-pointer ${
                            ws.id === activeWorkspaceId
                              ? "bg-blue-50/50 text-[#2563EB] font-medium"
                              : "text-[#334155]"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <WorkspaceBrandLogo
                              type={ws.logoType}
                              name={ws.name}
                              customLogo={ws.customLogo}
                              className="w-4 h-4"
                            />
                            <span>{ws.name}</span>
                          </div>
                          {ws.id === activeWorkspaceId && (
                            <Check className="w-3.5 h-3.5 text-[#2563EB]" />
                          )}
                        </button>
                      ))}

                      <div className="border-t border-[#F1F5F9] my-1" />
                      <button
                        type="button"
                        onClick={() => {
                          setIsWorkspaceDropdownOpen(false);
                          setIsCreateWorkspaceOpen(true);
                        }}
                        className="w-full px-3 py-1.5 text-left text-[#2563EB] font-medium hover:bg-blue-50/40 flex items-center gap-2 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Create new workspace</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* 3. Section: Main menu */}
              <div className="space-y-1">
                {!isSidebarCollapsed && (
                  <span className="text-xs font-medium text-[#94A3B8] font-inter px-2">
                    Main menu
                  </span>
                )}

                {/* Overview */}
                <button
                  type="button"
                  onClick={() => setSidebarActiveTab("overview")}
                  className={`w-full flex items-center gap-3 px-2 py-1.5 rounded-[8px] transition-colors cursor-pointer ${
                    sidebarActiveTab === "overview"
                      ? "bg-slate-100 text-[#0F172A] font-semibold"
                      : "text-[#334155] hover:bg-slate-50"
                  }`}
                  title="Overview"
                >
                  <div className="w-8 h-8 rounded-[8px] bg-slate-50 border border-slate-100 flex items-center justify-center text-[#64748B] shrink-0">
                    <Compass className="w-4 h-4 stroke-[1.75]" />
                  </div>
                  {!isSidebarCollapsed && (
                    <span className="text-sm font-medium font-inter">Overview</span>
                  )}
                </button>

                {/* Projects (Collapsible Section with Sub-items) */}
                <div className="space-y-1">
                  <div
                    onClick={() => setIsProjectsExpanded(!isProjectsExpanded)}
                    className="w-full flex items-center justify-between px-2 py-1.5 rounded-[8px] text-[#334155] hover:bg-slate-50 transition-colors cursor-pointer"
                    title="Projects"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-[8px] bg-slate-50 border border-slate-100 flex items-center justify-center text-[#64748B] shrink-0">
                        <Layers className="w-4 h-4 stroke-[1.75]" />
                      </div>
                      {!isSidebarCollapsed && (
                        <span className="text-sm font-medium font-inter text-[#0F172A]">
                          Projects
                        </span>
                      )}
                    </div>
                    {!isSidebarCollapsed && (
                      <ChevronUp
                        className={`w-4 h-4 text-[#94A3B8] transition-transform ${
                          isProjectsExpanded ? "" : "rotate-180"
                        }`}
                      />
                    )}
                  </div>

                  {/* Sub-projects list with left border line (Exact match to screenshot!) */}
                  {!isSidebarCollapsed && isProjectsExpanded && (
                    <div className="border-l-2 border-[#E2E8F0] ml-6 pl-4 space-y-2.5 pt-1 pb-1 text-sm font-inter">
                      {activeWorkspace?.projects.map((proj) => (
                        <div
                          key={proj.id}
                          onClick={() => setActiveProjectId(proj.id)}
                          className={`cursor-pointer transition-colors ${
                            proj.id === activeProjectId
                              ? "text-[#2563EB] font-semibold"
                              : "text-[#64748B] hover:text-[#0F172A]"
                          }`}
                        >
                          {proj.name}
                        </div>
                      ))}

                      {/* Fallback default list if no projects yet */}
                      {(!activeWorkspace?.projects || activeWorkspace.projects.length === 0) && (
                        <>
                          <div className="text-[#2563EB] font-semibold cursor-pointer">
                            Marketing
                          </div>
                          <div className="text-[#64748B] hover:text-[#0F172A] cursor-pointer">
                            Development
                          </div>
                          <div className="text-[#64748B] hover:text-[#0F172A] cursor-pointer">
                            Support
                          </div>
                        </>
                      )}

                      {/* + Add project link in blue */}
                      <button
                        type="button"
                        onClick={() => openCreateProjectModal(activeWorkspace.id)}
                        className="text-xs font-medium text-[#2563EB] hover:underline flex items-center gap-1 cursor-pointer pt-1"
                      >
                        <Plus className="w-3.5 h-3.5 stroke-[2]" />
                        <span>Add project</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* 4. Section: Project view */}
              <div className="space-y-1 pt-2">
                {!isSidebarCollapsed && (
                  <div
                    onClick={() => setIsProjectViewExpanded(!isProjectViewExpanded)}
                    className="flex items-center justify-between text-xs font-medium text-[#94A3B8] font-inter px-2 pb-1 cursor-pointer"
                  >
                    <span>Project view</span>
                    <ChevronUp
                      className={`w-3.5 h-3.5 transition-transform ${
                        isProjectViewExpanded ? "" : "rotate-180"
                      }`}
                    />
                  </div>
                )}

                {isProjectViewExpanded && (
                  <div className="space-y-1">
                    {/* Tasks */}
                    <button
                      type="button"
                      onClick={() => setSidebarActiveTab("tasks")}
                      className={`w-full flex items-center gap-3 px-2 py-1.5 rounded-[8px] transition-colors cursor-pointer ${
                        sidebarActiveTab === "tasks"
                          ? "bg-slate-100 text-[#0F172A] font-semibold"
                          : "text-[#334155] hover:bg-slate-50"
                      }`}
                      title="Tasks"
                    >
                      <div className="w-8 h-8 rounded-[8px] bg-slate-50 border border-slate-100 flex items-center justify-center text-[#64748B] shrink-0">
                        <CheckSquare className="w-4 h-4 stroke-[1.75]" />
                      </div>
                      {!isSidebarCollapsed && (
                        <span className="text-sm font-medium font-inter">Tasks</span>
                      )}
                    </button>

                    {/* Planner */}
                    <button
                      type="button"
                      onClick={() => setSidebarActiveTab("planner")}
                      className={`w-full flex items-center gap-3 px-2 py-1.5 rounded-[8px] transition-colors cursor-pointer ${
                        sidebarActiveTab === "planner"
                          ? "bg-slate-100 text-[#0F172A] font-semibold"
                          : "text-[#334155] hover:bg-slate-50"
                      }`}
                      title="Planner"
                    >
                      <div className="w-8 h-8 rounded-[8px] bg-slate-50 border border-slate-100 flex items-center justify-center text-[#64748B] shrink-0">
                        <Timer className="w-4 h-4 stroke-[1.75]" />
                      </div>
                      {!isSidebarCollapsed && (
                        <span className="text-sm font-medium font-inter">Planner</span>
                      )}
                    </button>

                    {/* AI Assistant */}
                    <button
                      type="button"
                      onClick={() => setSidebarActiveTab("ai_assistant")}
                      className={`w-full flex items-center gap-3 px-2 py-1.5 rounded-[8px] transition-colors cursor-pointer ${
                        sidebarActiveTab === "ai_assistant"
                          ? "bg-slate-100 text-[#0F172A] font-semibold"
                          : "text-[#334155] hover:bg-slate-50"
                      }`}
                      title="AI Assistant"
                    >
                      <div className="w-8 h-8 rounded-[8px] bg-slate-50 border border-slate-100 flex items-center justify-center text-[#64748B] shrink-0">
                        <Sparkles className="w-4 h-4 stroke-[1.75]" />
                      </div>
                      {!isSidebarCollapsed && (
                        <span className="text-sm font-medium font-inter">
                          AI Assistant
                        </span>
                      )}
                    </button>

                    {/* Chat */}
                    <button
                      type="button"
                      onClick={() => setSidebarActiveTab("chat")}
                      className={`w-full flex items-center gap-3 px-2 py-1.5 rounded-[8px] transition-colors cursor-pointer ${
                        sidebarActiveTab === "chat"
                          ? "bg-slate-100 text-[#0F172A] font-semibold"
                          : "text-[#334155] hover:bg-slate-50"
                      }`}
                      title="Chat"
                    >
                      <div className="w-8 h-8 rounded-[8px] bg-slate-50 border border-slate-100 flex items-center justify-center text-[#64748B] shrink-0">
                        <MessageSquare className="w-4 h-4 stroke-[1.75]" />
                      </div>
                      {!isSidebarCollapsed && (
                        <span className="text-sm font-medium font-inter">Chat</span>
                      )}
                    </button>

                    {/* Project Management (Collapsible with Team, Files, Automation, Settings) */}
                    <div className="space-y-1">
                      <div
                        onClick={() => setIsProjectMgmtExpanded(!isProjectMgmtExpanded)}
                        className="w-full flex items-center justify-between px-2 py-1.5 rounded-[8px] text-[#334155] hover:bg-slate-50 transition-colors cursor-pointer"
                        title="Project Management"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-[8px] bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2563EB] shrink-0">
                            <Folder className="w-4 h-4 fill-[#2563EB]/20 stroke-[1.75]" />
                          </div>
                          {!isSidebarCollapsed && (
                            <span className="text-sm font-medium font-inter text-[#0F172A]">
                              Project Mangement
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Sub-items: Team, Files, Automation, Settings */}
                      {!isSidebarCollapsed && isProjectMgmtExpanded && (
                        <div className="border-l-2 border-[#E2E8F0] ml-6 pl-4 space-y-2.5 pt-1 pb-1 text-sm font-inter">
                          <div
                            onClick={() => setSidebarActiveTab("team")}
                            className={`cursor-pointer transition-colors ${
                              sidebarActiveTab === "team"
                                ? "text-[#2563EB] font-semibold"
                                : "text-[#64748B] hover:text-[#0F172A]"
                            }`}
                          >
                            Team
                          </div>
                          <div
                            onClick={() => setSidebarActiveTab("files")}
                            className={`cursor-pointer transition-colors ${
                              sidebarActiveTab === "files"
                                ? "text-[#2563EB] font-semibold"
                                : "text-[#64748B] hover:text-[#0F172A]"
                            }`}
                          >
                            Files
                          </div>
                          <div
                            onClick={() => setSidebarActiveTab("automation")}
                            className={`cursor-pointer transition-colors ${
                              sidebarActiveTab === "automation"
                                ? "text-[#2563EB] font-semibold"
                                : "text-[#64748B] hover:text-[#0F172A]"
                            }`}
                          >
                            Automation
                          </div>
                          <div
                            onClick={() => setSidebarActiveTab("settings")}
                            className={`cursor-pointer transition-colors ${
                              sidebarActiveTab === "settings"
                                ? "text-[#2563EB] font-semibold"
                                : "text-[#64748B] hover:text-[#0F172A]"
                            }`}
                          >
                            Settings
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 5. Bottom: Help & Support */}
            <div className="p-4 border-t border-[#F1F5F9]">
              <button
                type="button"
                onClick={() => setSidebarActiveTab("help")}
                className={`w-full flex items-center gap-3 px-2 py-1.5 rounded-[8px] transition-colors cursor-pointer ${
                  sidebarActiveTab === "help"
                    ? "bg-slate-100 text-[#0F172A] font-semibold"
                    : "text-[#334155] hover:bg-slate-50"
                }`}
                title="Help & Support"
              >
                <div className="w-8 h-8 rounded-[8px] bg-slate-50 border border-slate-100 flex items-center justify-center text-[#64748B] shrink-0">
                  <HelpCircle className="w-4 h-4 stroke-[1.75]" />
                </div>
                {!isSidebarCollapsed && (
                  <span className="text-sm font-medium font-inter">
                    Help & Support
                  </span>
                )}
              </button>
            </div>
          </aside>

          {/* ================= MAIN CONTENT CANVAS ================= */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            {/* Top Bar inside Project Dashboard */}
            <header className="h-16 px-8 border-b border-[#E2E8F0] bg-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <button
                  type="button"
                  onClick={() => setCurrentView("workspaces_grid")}
                  className="h-8 px-2.5 rounded-[5px] border border-[#E2E8F0] text-xs font-medium font-inter text-[#475569] hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Workspaces</span>
                </button>

                <div className="h-4 w-px bg-[#E2E8F0]" />

                <div className="flex items-center gap-2 text-xs font-inter text-[#64748B] truncate">
                  <span className="font-semibold text-[#0F172A]">
                    {activeWorkspace?.name}
                  </span>
                  <span>/</span>
                  <span className="text-[#2563EB] font-medium truncate">
                    {activeProject?.name || "Project"}
                  </span>
                </div>
              </div>

              {/* Right Side: Profile & Actions */}
              <div className="flex items-center gap-3">
                <div className="relative w-64 hidden md:block">
                  <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2 stroke-[1.75]" />
                  <input
                    type="text"
                    placeholder="Search tasks, docs..."
                    className="w-full h-8 pl-8 pr-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[5px] text-xs font-inter text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#2563EB]"
                  />
                </div>

                <button
                  type="button"
                  className="w-8 h-8 rounded-[5px] border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:text-[#0F172A] hover:bg-slate-50 transition-colors"
                >
                  <Bell className="w-4 h-4 stroke-[1.75]" />
                </button>

                <div className="flex items-center gap-2 p-1">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                    alt="Moni Roy"
                    className="w-8 h-8 rounded-[5px] object-cover"
                  />
                  <div className="hidden lg:flex flex-col text-left">
                    <span className="text-xs font-semibold font-inter text-[#0F172A] leading-tight">
                      Moni Roy
                    </span>
                    <span className="text-[10px] font-medium font-inter text-[#94A3B8] leading-tight">
                      Admin
                    </span>
                  </div>
                </div>
              </div>
            </header>

            {/* Dashboard Content Views */}
            <main className="flex-1 overflow-y-auto p-6 md:p-8">
              {/* TAB 1: TASKS (Kanban Board) */}
              {sidebarActiveTab === "tasks" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <h1 className="text-2xl font-bold text-[#0F172A] font-poppins">
                        {activeProject?.name || "Marketing Team"} Tasks
                      </h1>
                      <p className="text-xs font-medium font-inter text-[#64748B] mt-1">
                        Track progress, assign teammates, and manage project deliverables.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const title = prompt("New Task Title:");
                          if (title?.trim()) {
                            setBoardTasks((prev) => [
                              ...prev,
                              {
                                id: `t-${Date.now()}`,
                                title: title.trim(),
                                description: "New task item added to board.",
                                priority: "P2",
                                status: "todo",
                                progress: "0/5",
                                dueDate: "Sep 20, 2026",
                                assignee: {
                                  name: "Moni",
                                  initials: "M",
                                  bg: "bg-purple-100 text-purple-700",
                                },
                              },
                            ]);
                          }
                        }}
                        className="h-9 px-4 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-medium font-inter rounded-[5px] flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Add Task</span>
                      </button>
                    </div>
                  </div>

                  {/* Kanban Columns */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                    {[
                      { status: "todo", label: "To Do", count: boardTasks.filter((t) => t.status === "todo").length, color: "bg-slate-200" },
                      { status: "in_progress", label: "In Progress", count: boardTasks.filter((t) => t.status === "in_progress").length, color: "bg-blue-500" },
                      { status: "in_review", label: "In Review", count: boardTasks.filter((t) => t.status === "in_review").length, color: "bg-amber-500" },
                      { status: "done", label: "Completed", count: boardTasks.filter((t) => t.status === "done").length, color: "bg-emerald-500" },
                    ].map((col) => (
                      <div
                        key={col.status}
                        className="bg-[#F1F5F9]/50 rounded-[8px] p-3 border border-[#E2E8F0]/70 flex flex-col gap-3 min-h-[420px]"
                      >
                        <div className="flex items-center justify-between pb-1 px-1">
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${col.color}`} />
                            <span className="text-xs font-bold text-[#0F172A] font-inter">
                              {col.label}
                            </span>
                            <span className="text-[11px] font-semibold text-[#64748B] bg-white px-1.5 py-0.5 rounded-[4px] border border-[#E2E8F0]">
                              {col.count}
                            </span>
                          </div>
                        </div>

                        {/* Tasks in Column */}
                        <div className="space-y-3 flex-1">
                          {boardTasks
                            .filter((t) => t.status === col.status)
                            .map((task) => (
                              <div
                                key={task.id}
                                className="bg-white rounded-[6px] border border-[#E2E8F0] p-3.5 shadow-2xs hover:shadow-md transition-all space-y-2.5 group"
                              >
                                <div className="flex items-center justify-between">
                                  <span
                                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                      task.priority === "P1"
                                        ? "bg-rose-100 text-rose-800"
                                        : task.priority === "P2"
                                        ? "bg-amber-100 text-amber-800"
                                        : "bg-blue-100 text-blue-800"
                                    }`}
                                  >
                                    {task.priority}
                                  </span>

                                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const nextStatus: Record<string, any> = {
                                          todo: "in_progress",
                                          in_progress: "in_review",
                                          in_review: "done",
                                          done: "todo",
                                        };
                                        setBoardTasks((prev) =>
                                          prev.map((t) =>
                                            t.id === task.id
                                              ? { ...t, status: nextStatus[t.status] }
                                              : t
                                          )
                                        );
                                      }}
                                      className="text-[10px] font-medium text-[#2563EB] hover:underline"
                                    >
                                      Move
                                    </button>
                                  </div>
                                </div>

                                <h4 className="text-xs font-bold text-[#0F172A] leading-snug font-inter">
                                  {task.title}
                                </h4>
                                <p className="text-[11px] text-[#64748B] line-clamp-2 leading-relaxed">
                                  {task.description}
                                </p>

                                <div className="pt-2 border-t border-[#F1F5F9] flex items-center justify-between text-[11px] text-[#64748B]">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3 text-[#94A3B8]" />
                                    <span>{task.dueDate}</span>
                                  </div>

                                  <div
                                    className={`w-5 h-5 rounded-full ${task.assignee.bg} flex items-center justify-center text-[10px] font-bold`}
                                    title={task.assignee.name}
                                  >
                                    {task.assignee.initials}
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 2: OVERVIEW */}
              {sidebarActiveTab === "overview" && (
                <div className="space-y-6 max-w-4xl">
                  <div>
                    <h1 className="text-2xl font-bold text-[#0F172A] font-poppins">
                      {activeWorkspace?.name} Overview
                    </h1>
                    <p className="text-xs font-medium font-inter text-[#64748B] mt-1">
                      High level workspace telemetry, project health, and activity logs.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white p-5 rounded-[8px] border border-[#E2E8F0] shadow-2xs space-y-1">
                      <span className="text-xs text-[#64748B]">Total Projects</span>
                      <p className="text-2xl font-bold text-[#0F172A]">
                        {activeWorkspace?.projects.length || 0}
                      </p>
                    </div>
                    <div className="bg-white p-5 rounded-[8px] border border-[#E2E8F0] shadow-2xs space-y-1">
                      <span className="text-xs text-[#64748B]">Completed Tasks</span>
                      <p className="text-2xl font-bold text-emerald-600">50 / 64</p>
                    </div>
                    <div className="bg-white p-5 rounded-[8px] border border-[#E2E8F0] shadow-2xs space-y-1">
                      <span className="text-xs text-[#64748B]">Active Members</span>
                      <p className="text-2xl font-bold text-[#2563EB]">14 Teammates</p>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-[8px] border border-[#E2E8F0] shadow-2xs space-y-4">
                    <h3 className="text-sm font-bold text-[#0F172A]">Projects In This Workspace</h3>
                    <div className="divide-y divide-[#F1F5F9]">
                      {activeWorkspace?.projects.map((p) => (
                        <div
                          key={p.id}
                          onClick={() => {
                            setActiveProjectId(p.id);
                            setSidebarActiveTab("tasks");
                          }}
                          className="py-3 flex items-center justify-between cursor-pointer hover:bg-slate-50 px-2 rounded transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className="w-3 h-3 rounded-full shrink-0"
                              style={{ backgroundColor: p.bannerColor }}
                            />
                            <div>
                              <h4 className="text-xs font-semibold text-[#0F172A]">
                                {p.name}
                              </h4>
                              <p className="text-[11px] text-[#64748B]">{p.description}</p>
                            </div>
                          </div>
                          <span className="text-xs text-[#2563EB] font-medium flex items-center gap-1">
                            Open Tasks <ChevronRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: PLANNER */}
              {sidebarActiveTab === "planner" && (
                <div className="space-y-6 max-w-4xl">
                  <div>
                    <h1 className="text-2xl font-bold text-[#0F172A] font-poppins">
                      Release Planner & Timeline
                    </h1>
                    <p className="text-xs font-medium font-inter text-[#64748B] mt-1">
                      Sprint roadmap and milestone scheduling.
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-[8px] border border-[#E2E8F0] shadow-2xs space-y-4">
                    {[
                      { title: "Sprint 1: UI Foundations & Figma Sync", date: "Sep 01 - Sep 10", status: "Done", color: "text-emerald-600 bg-emerald-50" },
                      { title: "Sprint 2: Authentication & Multi-Workspace Engine", date: "Sep 11 - Sep 18", status: "In Progress", color: "text-blue-600 bg-blue-50" },
                      { title: "Sprint 3: Realtime Collaborative Canvas & R2", date: "Sep 19 - Sep 28", status: "Upcoming", color: "text-amber-600 bg-amber-50" },
                    ].map((s, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-[6px] border border-[#F1F5F9] flex items-center justify-between"
                      >
                        <div className="space-y-1">
                          <h4 className="text-xs font-bold text-[#0F172A]">{s.title}</h4>
                          <span className="text-[11px] text-[#64748B] flex items-center gap-1">
                            <Clock className="w-3 h-3 text-[#94A3B8]" />
                            {s.date}
                          </span>
                        </div>
                        <span className={`text-[11px] font-semibold px-2 py-1 rounded-[4px] ${s.color}`}>
                          {s.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: AI ASSISTANT */}
              {sidebarActiveTab === "ai_assistant" && (
                <div className="space-y-6 max-w-3xl">
                  <div>
                    <h1 className="text-2xl font-bold text-[#0F172A] font-poppins flex items-center gap-2">
                      <Sparkles className="w-6 h-6 text-[#2563EB]" />
                      Orbitask AI Copilot
                    </h1>
                    <p className="text-xs font-medium font-inter text-[#64748B] mt-1">
                      Ask Orbitask AI to summarize progress, auto-generate subtasks, or draft client updates.
                    </p>
                  </div>

                  <div className="bg-white rounded-[8px] border border-[#E2E8F0] shadow-2xs overflow-hidden flex flex-col h-[480px]">
                    <div className="flex-1 p-5 overflow-y-auto space-y-4 text-xs font-inter">
                      <div className="flex gap-3">
                        <div className="w-7 h-7 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2563EB] shrink-0">
                          <Sparkles className="w-3.5 h-3.5" />
                        </div>
                        <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-3.5 rounded-[8px] max-w-lg text-[#334155] leading-relaxed">
                          Hello Moni! I am your Orbitask project assistant for{" "}
                          <strong>{activeWorkspace?.name}</strong>. I can break down requirements into Jira/Kanban tasks, optimize deadlines, or review deliverables. How can I help today?
                        </div>
                      </div>
                    </div>

                    <div className="p-3 border-t border-[#F1F5F9] bg-white flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Ask Orbitask AI to generate tasks or draft updates..."
                        className="flex-1 h-10 px-3.5 border border-[#CBD5E1] rounded-[5px] text-xs font-inter focus:outline-none focus:border-[#2563EB]"
                      />
                      <button
                        type="button"
                        className="h-10 px-4 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-[5px] text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Send</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: TEAM */}
              {sidebarActiveTab === "team" && (
                <div className="space-y-6 max-w-4xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-2xl font-bold text-[#0F172A] font-poppins">
                        Project Team & Access
                      </h1>
                      <p className="text-xs font-medium font-inter text-[#64748B] mt-1">
                        Manage contributors, assign roles, and revoke workspace permissions.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => openCreateProjectModal(activeWorkspace.id)}
                      className="h-9 px-4 bg-[#2563EB] text-white rounded-[5px] text-xs font-medium flex items-center gap-1.5 shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Invite Teammate</span>
                    </button>
                  </div>

                  <div className="bg-white rounded-[8px] border border-[#E2E8F0] shadow-2xs overflow-hidden">
                    <table className="w-full text-left text-xs font-inter">
                      <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] font-semibold">
                        <tr>
                          <th className="p-3.5">Name</th>
                          <th className="p-3.5">Email</th>
                          <th className="p-3.5">Role</th>
                          <th className="p-3.5">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#F1F5F9]">
                        {[
                          { name: "Moni Roy", email: "moni.roy@orbitask.com", role: "Owner / Admin", status: "Active" },
                          { name: "Bilal Khan", email: "bilalrauf.ds@gmail.com", role: "Platform Lead", status: "Active" },
                          { name: "Alex Chen", email: "alex@team.io", role: "UI Designer", status: "Active" },
                          { name: "Sarah Connor", email: "sarah@cyber.org", role: "QA Engineer", status: "Invited" },
                        ].map((m, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50">
                            <td className="p-3.5 font-bold text-[#0F172A]">{m.name}</td>
                            <td className="p-3.5 text-[#64748B]">{m.email}</td>
                            <td className="p-3.5 text-[#334155]">{m.role}</td>
                            <td className="p-3.5">
                              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                {m.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 6: FILES */}
              {sidebarActiveTab === "files" && (
                <div className="space-y-6 max-w-4xl">
                  <div>
                    <h1 className="text-2xl font-bold text-[#0F172A] font-poppins">
                      Project Files & Cloud Assets
                    </h1>
                    <p className="text-xs font-medium font-inter text-[#64748B] mt-1">
                      Uploaded project assets backed by Cloudflare R2 enterprise storage.
                    </p>
                  </div>

                  <div className="border-2 border-dashed border-[#CBD5E1] rounded-[8px] p-8 text-center bg-slate-50/40 hover:bg-blue-50/20 hover:border-[#2563EB] transition-colors cursor-pointer space-y-2">
                    <UploadCloud className="w-8 h-8 text-[#2563EB] mx-auto" />
                    <p className="text-xs font-semibold text-[#0F172A]">Click or drag files here to upload</p>
                    <p className="text-[11px] text-[#64748B]">Supports PDF, PNG, JPG, Figma (.fig), up to 50MB</p>
                  </div>
                </div>
              )}

              {/* TAB 7: CHAT / SETTINGS / HELP */}
              {["chat", "automation", "settings", "help"].includes(sidebarActiveTab) && (
                <div className="max-w-2xl bg-white p-6 rounded-[8px] border border-[#E2E8F0] shadow-2xs space-y-4">
                  <h2 className="text-lg font-bold text-[#0F172A] capitalize font-poppins">
                    {sidebarActiveTab.replace("_", " ")}
                  </h2>
                  <p className="text-xs text-[#64748B]">
                    This module is active and synced with your active project{" "}
                    <strong>{activeProject?.name || "Marketing"}</strong>.
                  </p>
                </div>
              )}
            </main>
          </div>
        </div>
      )}

      {/* ================= CREATE WORKSPACE MODAL (IMAGE 2) ================= */}
      {isCreateWorkspaceOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-[5px] shadow-2xl p-8 relative animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-6">
              <h3 className="text-lg font-bold text-[#0F172A] font-poppins">
                Create a new workspace
              </h3>
              <button
                type="button"
                onClick={() => setIsCreateWorkspaceOpen(false)}
                className="p-1 rounded-[5px] text-[#94A3B8] hover:text-[#0F172A] hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateWorkspaceSubmit} className="space-y-6">
              <div className="text-center">
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoFileChange}
                  className="hidden"
                />
                <div
                  onClick={() => logoInputRef.current?.click()}
                  className="w-16 h-16 mx-auto rounded-full bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center cursor-pointer hover:bg-blue-100 transition-colors shadow-2xs border border-blue-100/60 group overflow-hidden"
                >
                  {wsUploadedLogo ? (
                    <img
                      src={wsUploadedLogo}
                      alt="Workspace Logo"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="w-7 h-7 text-[#2563EB] group-hover:scale-105 transition-transform stroke-[1.75]" />
                  )}
                </div>
                <p className="text-xs font-medium font-inter text-[#64748B] mt-2.5">
                  Upload your workspace logo or image
                </p>
              </div>

              <div className="relative border border-[#CBD5E1] rounded-[5px] px-3.5 pt-3 pb-3 focus-within:border-[#2563EB] focus-within:ring-1 focus-within:ring-[#2563EB] transition-all bg-white">
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-[11px] font-medium text-[#475569] font-inter select-none">
                  Workspace Name<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={wsFormName}
                  onChange={(e) => setWsFormName(e.target.value)}
                  placeholder="ex: Orbitask Team"
                  className="w-full bg-transparent text-xs font-medium font-inter text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none"
                />
              </div>

              <div className="relative border border-[#CBD5E1] rounded-[5px] px-3.5 pt-3 pb-3 focus-within:border-[#2563EB] focus-within:ring-1 focus-within:ring-[#2563EB] transition-all bg-white">
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-[11px] font-medium text-[#475569] font-inter select-none">
                  Custom workspace URL
                </label>
                <input
                  type="text"
                  value={wsFormUrl}
                  onChange={(e) => setWsFormUrl(e.target.value)}
                  placeholder="ex: your-workspace ..."
                  className="w-full bg-transparent text-xs font-medium font-inter text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none"
                />
              </div>

              <div className="relative border border-[#CBD5E1] rounded-[5px] px-3.5 pt-3 pb-3 focus-within:border-[#2563EB] focus-within:ring-1 focus-within:ring-[#2563EB] transition-all bg-white">
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-[11px] font-medium text-[#475569] font-inter select-none">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={wsFormDesc}
                  onChange={(e) => setWsFormDesc(e.target.value)}
                  placeholder="ex: A workspace for managing Orbitask projects"
                  className="w-full bg-transparent text-xs font-medium font-inter text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full h-11 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-medium text-xs font-inter rounded-[5px] shadow-xs transition-colors cursor-pointer mt-4"
              >
                Create Workspace
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ================= CREATE PROJECT MODAL (IMAGES 3 & 4) ================= */}
      {isCreateProjectOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-[5px] shadow-2xl p-8 relative animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-6">
              <h3 className="text-lg font-bold text-[#0F172A] font-poppins">
                Create Project
              </h3>
              <button
                type="button"
                onClick={() => setIsCreateProjectOpen(false)}
                className="p-1 rounded-[5px] text-[#94A3B8] hover:text-[#0F172A] hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProjectSubmit} className="space-y-6">
              <div className="relative border border-[#CBD5E1] rounded-[5px] px-3.5 pt-3 pb-3 focus-within:border-[#2563EB] focus-within:ring-1 focus-within:ring-[#2563EB] transition-all bg-white">
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-[11px] font-medium text-[#475569] font-inter select-none">
                  Project Name<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={projFormName}
                  onChange={(e) => setProjFormName(e.target.value)}
                  placeholder="ex: Marketing Website Redesign"
                  className="w-full bg-transparent text-xs font-medium font-inter text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none"
                />
              </div>

              <div className="relative border border-[#CBD5E1] rounded-[5px] px-3.5 pt-3 pb-3 focus-within:border-[#2563EB] focus-within:ring-1 focus-within:ring-[#2563EB] transition-all bg-white">
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-[11px] font-medium text-[#475569] font-inter select-none">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={projFormDesc}
                  onChange={(e) => setProjFormDesc(e.target.value)}
                  placeholder="ex: A project to revamp the company’s website"
                  className="w-full bg-transparent text-xs font-medium font-inter text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none resize-none"
                />
              </div>

              <div>
                <div className="relative border border-[#CBD5E1] rounded-[5px] px-3.5 pt-3 pb-3 focus-within:border-[#2563EB] focus-within:ring-1 focus-within:ring-[#2563EB] transition-all bg-white">
                  <label className="absolute -top-2.5 left-3 bg-white px-1 text-[11px] font-medium text-[#475569] font-inter select-none">
                    Board
                  </label>
                  <input
                    type="text"
                    value={projFormBoard}
                    onChange={(e) => setProjFormBoard(e.target.value)}
                    placeholder="ex: UI Team"
                    className="w-full bg-transparent text-xs font-medium font-inter text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none"
                  />
                </div>
                <p className="text-[11px] font-medium font-inter text-[#64748B] flex items-center gap-1.5 mt-1.5">
                  <Info className="w-3.5 h-3.5 text-[#94A3B8] shrink-0 stroke-[1.75]" />
                  <span>
                    A default board named “Deafult Board” will be created automatically
                  </span>
                </p>
              </div>

              <div className="space-y-2">
                <span className="block text-xs font-semibold text-[#334155] font-inter">
                  Invite Member
                </span>

                {!isInviteMemberOpen ? (
                  <button
                    type="button"
                    onClick={() => setIsInviteMemberOpen(true)}
                    className="h-8 px-3.5 border border-[#CBD5E1] rounded-[5px] text-xs font-medium font-inter text-[#475569] hover:border-[#2563EB] hover:text-[#2563EB] flex items-center gap-1.5 transition-colors cursor-pointer bg-white"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[2]" />
                    <span>Invite Member</span>
                  </button>
                ) : (
                  <div className="space-y-2">
                    <div className="relative border border-[#CBD5E1] rounded-[5px] px-3.5 pt-2.5 pb-2.5 focus-within:border-[#2563EB] focus-within:ring-1 focus-within:ring-[#2563EB] transition-all bg-white flex items-center gap-2">
                      <label className="absolute -top-2.5 left-3 bg-white px-1 text-[11px] font-medium text-[#475569] font-inter select-none">
                        Email<span className="text-red-500">*</span>
                      </label>
                      <Mail className="w-4 h-4 text-[#94A3B8] shrink-0 stroke-[1.75]" />
                      <input
                        type="email"
                        value={inviteEmailInput}
                        onChange={(e) => setInviteEmailInput(e.target.value)}
                        placeholder="Enter your email"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddInvitedEmail();
                          }
                        }}
                        className="w-full bg-transparent text-xs font-medium font-inter text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleAddInvitedEmail}
                        className="text-xs font-semibold font-inter text-[#2563EB] hover:underline shrink-0 cursor-pointer ml-1"
                      >
                        Invite
                      </button>
                    </div>

                    {invitedEmails.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {invitedEmails.map((email) => (
                          <span
                            key={email}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[5px] bg-blue-50 text-[#2563EB] text-[11px] font-medium font-inter border border-blue-100"
                          >
                            {email}
                            <button
                              type="button"
                              onClick={() => handleRemoveInvitedEmail(email)}
                              className="hover:text-blue-900 cursor-pointer ml-0.5"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full h-11 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-medium text-xs font-inter rounded-[5px] shadow-xs transition-colors cursor-pointer mt-4"
              >
                Create Project
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ================= EDIT PROJECT MODAL ================= */}
      {editingProject && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-[5px] shadow-2xl p-6 relative animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-[#F1F5F9]">
              <h3 className="text-sm font-bold text-[#0F172A] font-poppins">
                Edit Project
              </h3>
              <button
                type="button"
                onClick={() => setEditingProject(null)}
                className="p-1 rounded-[5px] text-[#94A3B8] hover:text-[#0F172A] hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditProject} className="space-y-4 pt-4">
              <div className="relative border border-[#CBD5E1] rounded-[5px] px-3.5 pt-2.5 pb-2.5 focus-within:border-[#2563EB] focus-within:ring-1 focus-within:ring-[#2563EB] transition-all bg-white">
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-[11px] font-medium text-[#475569] font-inter select-none">
                  Project Name
                </label>
                <input
                  type="text"
                  required
                  value={editingProject.name}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      name: e.target.value,
                    })
                  }
                  className="w-full bg-transparent text-xs font-medium font-inter text-[#0F172A] focus:outline-none"
                />
              </div>

              <div className="relative border border-[#CBD5E1] rounded-[5px] px-3.5 pt-2.5 pb-2.5 focus-within:border-[#2563EB] focus-within:ring-1 focus-within:ring-[#2563EB] transition-all bg-white">
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-[11px] font-medium text-[#475569] font-inter select-none">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editingProject.description}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      description: e.target.value,
                    })
                  }
                  className="w-full bg-transparent text-xs font-medium font-inter text-[#0F172A] focus:outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="h-9 px-4 text-xs font-medium font-inter text-[#64748B] hover:text-[#0F172A] rounded-[5px] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-9 px-5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-medium font-inter rounded-[5px] transition-colors shadow-xs cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
