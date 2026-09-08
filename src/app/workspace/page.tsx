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
  TrendingUp,
  TrendingDown,
  UserPlus,
  ExternalLink,
} from "lucide-react";
import {
  getWorkspaces as getWorkspacesAction,
  createWorkspace as createWorkspaceAction,
  updateWorkspaceName as updateWorkspaceNameAction,
  createProject as createProjectAction,
  deleteProject as deleteProjectAction,
  deleteWorkspace as deleteWorkspaceAction,
} from "@/actions/workspace";

// Brand Logo Component
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

export interface SubtaskItem {
  priority: string;
  priorityColor: string;
  title: string;
  progress: string;
  date: string;
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

export default function OrbitaskWorkspacePage() {
  // Navigation & View state
  const [currentView, setCurrentView] = useState<"workspaces_grid" | "project_dashboard">("workspaces_grid");
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string>("ws-amazon");
  const [activeProjectId, setActiveProjectId] = useState<string>("proj-amz-1");
  const [sidebarActiveTab, setSidebarActiveTab] = useState<string>("overview"); // Defaults to Overview matching screenshot!

  // Sidebar accordions & dropdowns (closed/hidden by default on refresh)
  const [isProjectsExpanded, setIsProjectsExpanded] = useState(false);
  const [isProjectViewExpanded, setIsProjectViewExpanded] = useState(true);
  const [isProjectMgmtExpanded, setIsProjectMgmtExpanded] = useState(false);
  const [isWorkspaceDropdownOpen, setIsWorkspaceDropdownOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  // Workspaces list matching Figma
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
          members: [{ initials: "S", bg: "bg-orange-100 text-orange-800" }],
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

  // Modals state
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [targetWorkspaceId, setTargetWorkspaceId] = useState<string | null>(null);
  const [isCreateWorkspaceOpen, setIsCreateWorkspaceOpen] = useState(false);

  // 3-Dots project card menu & color submenu
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

  // Task reminders in Overview (My Tasks Card)
  const [myReminders, setMyReminders] = useState([
    { id: 1, text: "Release the latest newsletter and promo...", url: "qvik-www-bellman-hunters.com", checked: false },
    { id: 2, text: "Release the latest newsletter and promo...", url: "qvik-www-bellman-hunters.com", checked: true },
    { id: 3, text: "Release the latest newsletter and promo...", url: "qvik-www-bellman-hunters.com", checked: true },
    { id: 4, text: "Release the latest newsletter and promo...", url: "qvik-www-bellman-hunters.com", checked: true },
  ]);

  // Click outside handler for dropdowns
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
    setSidebarActiveTab("overview");
    setCurrentView("project_dashboard");
  };

  const handleOpenProjectView = (workspaceId: string, projectId: string) => {
    setActiveWorkspaceId(workspaceId);
    setActiveProjectId(projectId);
    setSidebarActiveTab("overview");
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
            <div className="flex items-center gap-2 select-none">
              <div className="relative flex items-center justify-center">
                <svg className="w-8 h-8 text-[#0284C7]" viewBox="0 0 36 36" fill="none">
                  <circle cx="18" cy="18" r="6" fill="#0284C7" />
                  <ellipse cx="18" cy="18" rx="14" ry="5.5" stroke="#0284C7" strokeWidth="2.4" strokeLinecap="round" transform="rotate(-38 18 18)" />
                  <ellipse cx="18" cy="18" rx="14" ry="5.5" stroke="#38BDF8" strokeWidth="2.4" strokeDasharray="20 40" strokeLinecap="round" transform="rotate(-38 18 18)" />
                </svg>
              </div>
              <span className="text-[19px] font-bold tracking-tight text-[#0F172A] font-poppins lowercase">
                orbitask
              </span>
            </div>

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
                  <span className="text-[9.5px] font-medium font-inter text-[#94A3B8] leading-tight mt-0.5">
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
                    <div className="flex items-center gap-8 flex-wrap">
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
                                      <div
                                        className="h-[76px] rounded-t-[5px] relative flex items-start justify-end p-2.5 gap-1 shrink-0"
                                        style={{ backgroundColor: project.bannerColor }}
                                      >
                                        <div className="absolute inset-0 overflow-hidden rounded-t-[5px] pointer-events-none">
                                          <svg className="w-full h-full opacity-40" viewBox="0 0 320 76" fill="none" preserveAspectRatio="none">
                                            <path d="M-20 15 C50 0 110 35 180 10 C240 -8 290 25 350 12" stroke="white" strokeWidth="1.25" fill="none" />
                                            <path d="M-20 30 C40 18 130 50 200 25 C260 8 300 38 350 30" stroke="white" strokeWidth="1.25" fill="none" />
                                            <path d="M-20 48 C30 38 120 68 190 42 C270 20 300 55 350 48" stroke="white" strokeWidth="1.25" fill="none" />
                                            <path d="M-20 65 C60 52 140 82 220 60 C280 38 320 72 350 65" stroke="white" strokeWidth="1.25" fill="none" />
                                            <ellipse cx="260" cy="30" rx="35" ry="15" stroke="white" strokeWidth="1.25" fill="none" />
                                            <ellipse cx="85" cy="42" rx="40" ry="18" stroke="white" strokeWidth="1.25" fill="none" />
                                          </svg>
                                        </div>

                                        <button
                                          type="button"
                                          onClick={(e) => handleToggleFavorite(ws.id, project.id, e)}
                                          className="relative z-10 p-1 text-white/90 hover:text-white transition-colors cursor-pointer rounded-[5px]"
                                          title="Star project"
                                        >
                                          <Star className={`w-3.5 h-3.5 stroke-[1.75] ${project.isFavorite ? "fill-amber-300 text-amber-300" : ""}`} />
                                        </button>

                                        <div className="relative" data-menu-container="true" onClick={(e) => e.stopPropagation()}>
                                          <button
                                            type="button"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setActiveMenuProjectId((prev) => prev === project.id ? null : project.id);
                                              setIsColorSubmenuOpen(null);
                                            }}
                                            className="relative z-20 p-1.5 text-white hover:text-white/80 transition-colors cursor-pointer rounded-[5px]"
                                            title="Project options"
                                          >
                                            <MoreVertical className="w-4 h-4 stroke-[2]" />
                                          </button>

                                          {activeMenuProjectId === project.id && (
                                            <div onClick={(e) => e.stopPropagation()} className="absolute right-0 top-8 w-48 bg-white rounded-[8px] border border-[#F1F5F9] shadow-2xl z-50 py-2 px-1 text-[12.5px] font-inter animate-in fade-in zoom-in-95">
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
                                                <svg className="w-4 h-4 text-[#475569] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
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
                                                <svg className="w-4 h-4 text-[#475569] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                                                  <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                                                </svg>
                                                <span>Edit description</span>
                                              </button>

                                              <div className="relative" onMouseEnter={() => setIsColorSubmenuOpen(project.id)}>
                                                <button
                                                  type="button"
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    setIsColorSubmenuOpen((prev) => prev === project.id ? null : project.id);
                                                  }}
                                                  className="w-full px-3 py-2 text-left hover:bg-[#F8FAFC] flex items-center justify-between rounded-[5px] text-[#334155] cursor-pointer transition-colors"
                                                >
                                                  <div className="flex items-center gap-3">
                                                    <svg className="w-4 h-4 text-[#475569] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                                                      <rect x="2" y="3" width="16" height="5" rx="1" />
                                                      <path d="M10 8v3a2 2 0 0 0 2 2h2a2 2 0 0 1 2 2v4" />
                                                    </svg>
                                                    <span>change color</span>
                                                  </div>
                                                  <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8] shrink-0" />
                                                </button>

                                                {isColorSubmenuOpen === project.id && (
                                                  <div onClick={(e) => e.stopPropagation()} className="absolute left-full top-0 ml-1.5 min-w-[125px] bg-white rounded-[8px] border border-[#F1F5F9] shadow-2xl p-2 z-50 animate-in fade-in">
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
                                                        onClick={(e) => handleChangeColor(ws.id, project.id, c.color, e)}
                                                        className="w-full px-2.5 py-1.5 text-left hover:bg-[#F8FAFC] flex items-center gap-3 rounded-[4px] cursor-pointer transition-colors text-[12.5px] font-normal text-[#334155]"
                                                      >
                                                        <span className="w-3.5 h-3.5 rounded-full shrink-0 shadow-2xs" style={{ backgroundColor: c.color }} />
                                                        <span>{c.label}</span>
                                                      </button>
                                                    ))}
                                                  </div>
                                                )}
                                              </div>

                                              <button
                                                type="button"
                                                onClick={(e) => handleDeleteProject(ws.id, project.id, e)}
                                                className="w-full px-3 py-2 text-left hover:bg-red-50/70 text-[#EF4444] flex items-center gap-3 rounded-[5px] cursor-pointer transition-colors mt-0.5"
                                              >
                                                <Trash2 className="w-4 h-4 text-[#EF4444] shrink-0 stroke-[1.75]" />
                                                <span>Delete Permanently</span>
                                              </button>
                                            </div>
                                          )}
                                        </div>
                                      </div>

                                      <div className="p-4 pb-2">
                                        <div className="flex items-start justify-between gap-2">
                                          <div className="flex-1 min-w-0">
                                            <h3 className="text-[15px] font-bold text-[#0F172A] leading-snug font-poppins truncate group-hover:text-[#2563EB] transition-colors">
                                              {project.name}
                                            </h3>
                                            <p className="text-[10.5px] font-medium font-inter text-[#64748B] leading-relaxed mt-1 line-clamp-2">
                                              {project.description}
                                            </p>
                                          </div>

                                          <div className="flex items-center -space-x-1.5 shrink-0 ml-2 mt-0.5">
                                            {project.members.map((m, idx) => (
                                              <div
                                                key={idx}
                                                className={`w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-[9.5px] font-bold overflow-hidden shadow-2xs ${m.bg || "bg-slate-100"}`}
                                              >
                                                {m.img ? <img src={m.img} alt="Member" className="w-full h-full object-cover" /> : m.initials}
                                              </div>
                                            ))}
                                            <span className="text-[10.5px] font-medium font-inter text-[#64748B] pl-2.5">12+</span>
                                          </div>
                                        </div>

                                        <div className="flex items-center gap-1.5 text-xs font-medium font-inter text-[#64748B] mt-3">
                                          <CheckSquare className="w-3.5 h-3.5 text-[#64748B] stroke-[1.75]" />
                                          <span>Tasks: {project.tasksCompleted}/{project.tasksTotal}</span>
                                        </div>
                                      </div>
                                    </div>

                                    <div onClick={(e) => e.stopPropagation()} className="px-4 py-3 border-t border-[#F1F5F9] flex items-center justify-between gap-2">
                                      <button
                                        type="button"
                                        onClick={(e) => handleSubtaskPrev(ws.id, project.id, e)}
                                        className="p-1 text-[#94A3B8] hover:text-[#0F172A] transition-colors cursor-pointer rounded"
                                        title="Previous milestone"
                                      >
                                        <ChevronLeft className="w-4 h-4 stroke-[2]" />
                                      </button>

                                      {activeSubtask ? (
                                        <div className="flex items-center gap-3 text-xs font-medium font-inter text-[#64748B] flex-1 justify-center truncate">
                                          <span className={`px-1.5 py-0.5 rounded text-[9.5px] font-bold shrink-0 ${activeSubtask.priorityColor}`}>
                                            {activeSubtask.priority}
                                          </span>
                                          <span className="font-bold text-[#0F172A] truncate">{activeSubtask.title}</span>
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
                                        <span className="text-xs text-[#94A3B8]">No subtasks</span>
                                      )}

                                      <button
                                        type="button"
                                        onClick={(e) => handleSubtaskNext(ws.id, project.id, e)}
                                        className="p-1 text-[#94A3B8] hover:text-[#0F172A] transition-colors cursor-pointer rounded"
                                        title="Next milestone"
                                      >
                                        <ChevronRight className="w-4 h-4 stroke-[2]" />
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}

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

                    {ws.activeTab === "settings" && (
                      <div className="max-w-xl bg-white p-6 rounded-[5px] border border-[#E2E8F0] shadow-xs space-y-6">
                        <div>
                          <h3 className="text-base font-bold text-[#0F172A] font-poppins">Workspace Settings</h3>
                          <p className="text-xs font-medium font-inter text-[#64748B] mt-1">Manage your workspace identity and preferences.</p>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-[#F1F5F9]">
                          <div className="relative border border-[#CBD5E1] rounded-[5px] px-3.5 pt-2.5 pb-2.5 focus-within:border-[#2563EB] focus-within:ring-1 focus-within:ring-[#2563EB] transition-all bg-white">
                            <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10.5px] font-medium text-[#475569] font-inter select-none">
                              Workspace Name
                            </label>
                            <input
                              type="text"
                              value={ws.name}
                              onChange={(e) => handleUpdateWorkspaceName(ws.id, e.target.value)}
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
                              <span className="text-xs font-medium font-inter text-[#64748B]">Changes are saved automatically.</span>
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
              isSidebarCollapsed ? "w-18" : "w-[240px]"
            } bg-white border-r border-[#F1F5F9] flex flex-col h-full transition-all duration-300 shrink-0 select-none z-30`}
          >
            <div className="p-4 flex flex-col gap-4 overflow-y-auto overflow-x-hidden h-full">
              {/* 1. Brand Header */}
              <div className="flex items-center justify-between">
                <div
                  onClick={() => setCurrentView("workspaces_grid")}
                  className="flex items-center gap-2 cursor-pointer select-none"
                  title="Return to workspaces overview"
                >
                  <div className="relative flex items-center justify-center">
                    <svg className="w-7 h-7 text-[#0284C7]" viewBox="0 0 36 36" fill="none">
                      <circle cx="18" cy="18" r="6" fill="#0284C7" />
                      <ellipse cx="18" cy="18" rx="14" ry="5.5" stroke="#0284C7" strokeWidth="2.4" strokeLinecap="round" transform="rotate(-38 18 18)" />
                      <ellipse cx="18" cy="18" rx="14" ry="5.5" stroke="#38BDF8" strokeWidth="2.4" strokeDasharray="20 40" strokeLinecap="round" transform="rotate(-38 18 18)" />
                    </svg>
                  </div>
                  {!isSidebarCollapsed && (
                    <span className="text-[19px] font-bold tracking-tight text-[#0F172A] font-poppins lowercase">
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
                  {isSidebarCollapsed ? <PanelLeft className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
                </button>
              </div>

              {/* 2. Workspace Selector Button with Dropdown */}
              {!isSidebarCollapsed && (
                <div className="relative" data-menu-container="true">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsWorkspaceDropdownOpen(!isWorkspaceDropdownOpen);
                    }}
                    className="w-full h-11 px-3 border border-[#E2E8F0] rounded-[8px] flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors shadow-2xs"
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
                  </button>

                  {isWorkspaceDropdownOpen && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="absolute top-12 left-0 right-0 bg-white rounded-[8px] border border-[#E2E8F0] shadow-xl py-1 z-50 text-xs font-inter animate-in fade-in zoom-in-95"
                    >
                      <div className="px-3 py-1.5 text-[9.5px] font-semibold text-[#94A3B8] uppercase tracking-wider">
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
                            ws.id === activeWorkspaceId ? "bg-blue-50/60 text-[#2563EB] font-medium" : "text-[#334155]"
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
                          {ws.id === activeWorkspaceId && <Check className="w-3.5 h-3.5 text-[#2563EB]" />}
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

              {/* 3. Main menu Section */}
              <div className="space-y-1">
                {!isSidebarCollapsed && (
                  <span className="text-xs font-medium text-[#94A3B8] font-inter px-2">Main menu</span>
                )}

                {/* Overview button (Active rounded pill in screenshot) */}
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
                  {!isSidebarCollapsed && <span className="text-sm font-medium font-inter">Overview</span>}
                </button>

                {/* Projects accordion */}
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
                      {!isSidebarCollapsed && <span className="text-sm font-medium font-inter text-[#0F172A]">Projects</span>}
                    </div>
                    {!isSidebarCollapsed && (
                      <ChevronDown className={`w-4 h-4 text-[#94A3B8] transition-transform ${isProjectsExpanded ? "rotate-180" : ""}`} />
                    )}
                  </div>

                  {!isSidebarCollapsed && isProjectsExpanded && (
                    <div className="border-l-2 border-[#E2E8F0] ml-6 pl-4 space-y-2.5 pt-1 pb-1 text-sm font-inter">
                      {activeWorkspace?.projects.map((proj) => (
                        <div
                          key={proj.id}
                          onClick={() => {
                            setActiveProjectId(proj.id);
                            setSidebarActiveTab("overview");
                          }}
                          className={`cursor-pointer transition-colors ${
                            proj.id === activeProjectId ? "text-[#2563EB] font-semibold" : "text-[#64748B] hover:text-[#0F172A]"
                          }`}
                        >
                          {proj.name}
                        </div>
                      ))}

                      {(!activeWorkspace?.projects || activeWorkspace.projects.length === 0) && (
                        <>
                          <div className="text-[#2563EB] font-semibold cursor-pointer">Marketing</div>
                          <div className="text-[#64748B] hover:text-[#0F172A] cursor-pointer">Development</div>
                          <div className="text-[#64748B] hover:text-[#0F172A] cursor-pointer">Support</div>
                        </>
                      )}

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

              {/* 4. Project view Section */}
              <div className="space-y-1 pt-2">
                {!isSidebarCollapsed && (
                  <div
                    onClick={() => setIsProjectViewExpanded(!isProjectViewExpanded)}
                    className="flex items-center justify-between text-xs font-medium text-[#94A3B8] font-inter px-2 pb-1 cursor-pointer"
                  >
                    <span>Project view</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isProjectViewExpanded ? "rotate-180" : ""}`} />
                  </div>
                )}

                {isProjectViewExpanded && (
                  <div className="space-y-1">
                    <button
                      type="button"
                      onClick={() => setSidebarActiveTab("tasks")}
                      className={`w-full flex items-center gap-3 px-2 py-1.5 rounded-[8px] transition-colors cursor-pointer ${
                        sidebarActiveTab === "tasks" ? "bg-slate-100 text-[#0F172A] font-semibold" : "text-[#334155] hover:bg-slate-50"
                      }`}
                      title="Tasks"
                    >
                      <div className="w-8 h-8 rounded-[8px] bg-slate-50 border border-slate-100 flex items-center justify-center text-[#64748B] shrink-0">
                        <CheckSquare className="w-4 h-4 stroke-[1.75]" />
                      </div>
                      {!isSidebarCollapsed && <span className="text-sm font-medium font-inter">Tasks</span>}
                    </button>

                    <button
                      type="button"
                      onClick={() => setSidebarActiveTab("planner")}
                      className={`w-full flex items-center gap-3 px-2 py-1.5 rounded-[8px] transition-colors cursor-pointer ${
                        sidebarActiveTab === "planner" ? "bg-slate-100 text-[#0F172A] font-semibold" : "text-[#334155] hover:bg-slate-50"
                      }`}
                      title="Planner"
                    >
                      <div className="w-8 h-8 rounded-[8px] bg-slate-50 border border-slate-100 flex items-center justify-center text-[#64748B] shrink-0">
                        <Timer className="w-4 h-4 stroke-[1.75]" />
                      </div>
                      {!isSidebarCollapsed && <span className="text-sm font-medium font-inter">Planner</span>}
                    </button>

                    <button
                      type="button"
                      onClick={() => setSidebarActiveTab("ai_assistant")}
                      className={`w-full flex items-center gap-3 px-2 py-1.5 rounded-[8px] transition-colors cursor-pointer ${
                        sidebarActiveTab === "ai_assistant" ? "bg-slate-100 text-[#0F172A] font-semibold" : "text-[#334155] hover:bg-slate-50"
                      }`}
                      title="AI Assistant"
                    >
                      <div className="w-8 h-8 rounded-[8px] bg-slate-50 border border-slate-100 flex items-center justify-center text-[#64748B] shrink-0">
                        <Sparkles className="w-4 h-4 stroke-[1.75]" />
                      </div>
                      {!isSidebarCollapsed && <span className="text-sm font-medium font-inter">AI Assistant</span>}
                    </button>

                    <button
                      type="button"
                      onClick={() => setSidebarActiveTab("chat")}
                      className={`w-full flex items-center gap-3 px-2 py-1.5 rounded-[8px] transition-colors cursor-pointer ${
                        sidebarActiveTab === "chat" ? "bg-slate-100 text-[#0F172A] font-semibold" : "text-[#334155] hover:bg-slate-50"
                      }`}
                      title="Chat"
                    >
                      <div className="w-8 h-8 rounded-[8px] bg-slate-50 border border-slate-100 flex items-center justify-center text-[#64748B] shrink-0">
                        <MessageSquare className="w-4 h-4 stroke-[1.75]" />
                      </div>
                      {!isSidebarCollapsed && <span className="text-sm font-medium font-inter">Chat</span>}
                    </button>

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
                              Project Management
                            </span>
                          )}
                        </div>
                        {!isSidebarCollapsed && (
                          <ChevronDown
                            className={`w-4 h-4 text-[#94A3B8] transition-transform ${
                              isProjectMgmtExpanded ? "rotate-180" : ""
                            }`}
                          />
                        )}
                      </div>

                      {!isSidebarCollapsed && isProjectMgmtExpanded && (
                        <div className="border-l-2 border-[#E2E8F0] ml-6 pl-4 space-y-2.5 pt-1 pb-1 text-sm font-inter">
                          <div onClick={() => setSidebarActiveTab("team")} className={`cursor-pointer transition-colors ${sidebarActiveTab === "team" ? "text-[#2563EB] font-semibold" : "text-[#64748B] hover:text-[#0F172A]"}`}>
                            Team
                          </div>
                          <div onClick={() => setSidebarActiveTab("files")} className={`cursor-pointer transition-colors ${sidebarActiveTab === "files" ? "text-[#2563EB] font-semibold" : "text-[#64748B] hover:text-[#0F172A]"}`}>
                            Files
                          </div>
                          <div onClick={() => setSidebarActiveTab("automation")} className={`cursor-pointer transition-colors ${sidebarActiveTab === "automation" ? "text-[#2563EB] font-semibold" : "text-[#64748B] hover:text-[#0F172A]"}`}>
                            Automation
                          </div>
                          <div onClick={() => setSidebarActiveTab("settings")} className={`cursor-pointer transition-colors ${sidebarActiveTab === "settings" ? "text-[#2563EB] font-semibold" : "text-[#64748B] hover:text-[#0F172A]"}`}>
                            Settings
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* 5. Help & Support - Scrollable with sidebar */}
              <div className="pt-2 border-t border-[#F1F5F9]">
                <button
                  type="button"
                  onClick={() => setSidebarActiveTab("help")}
                  className={`w-full flex items-center gap-3 px-2 py-1.5 rounded-[8px] transition-colors cursor-pointer ${
                    sidebarActiveTab === "help" ? "bg-slate-100 text-[#0F172A] font-semibold" : "text-[#334155] hover:bg-slate-50"
                  }`}
                  title="Help & Support"
                >
                  <div className="w-8 h-8 rounded-[8px] bg-slate-50 border border-slate-100 flex items-center justify-center text-[#64748B] shrink-0">
                    <HelpCircle className="w-4 h-4 stroke-[1.75]" />
                  </div>
                  {!isSidebarCollapsed && <span className="text-sm font-medium font-inter">Help & Support</span>}
                </button>
              </div>
            </div>
          </aside>

          {/* ================= MAIN DASHBOARD CANVAS ================= */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            {/* Top Bar */}
            <header className="h-16 px-8 border-b border-[#E2E8F0] bg-white flex items-center justify-between shrink-0">
              <div>
                <h1 className="text-xl font-bold text-[#0F172A] font-poppins">Overview</h1>
                <div className="flex items-center gap-1.5 text-[10.5px] font-medium font-inter text-[#64748B]">
                  <span>{activeWorkspace?.name || "Amazon"}</span>
                  <ChevronRight className="w-3 h-3 text-[#94A3B8]" />
                  <span className="text-[#0F172A]">Overview</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="relative w-56 hidden md:block">
                  <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2 stroke-[1.75]" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full h-8 pl-8 pr-3 bg-white border border-[#E2E8F0] rounded-[5px] text-xs font-inter text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#2563EB]"
                  />
                </div>

                {/* 1. Messaging Icon */}
                <button
                  type="button"
                  onClick={() => setSidebarActiveTab("chat")}
                  className="w-8 h-8 rounded-[5px] border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:text-[#0F172A] hover:bg-slate-50 transition-colors cursor-pointer"
                  title="Messages"
                >
                  <MessageSquare className="w-4 h-4 stroke-[1.75]" />
                </button>

                {/* 2. Notification Icon */}
                <button
                  type="button"
                  className="w-8 h-8 rounded-[5px] border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:text-[#0F172A] hover:bg-slate-50 transition-colors cursor-pointer"
                  title="Notifications"
                >
                  <Bell className="w-4 h-4 stroke-[1.75]" />
                </button>

                {/* 3. Admin Profile on Right */}
                <div className="flex items-center gap-2 cursor-pointer">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                    alt="Moni Roy"
                    className="w-8 h-8 rounded-[5px] object-cover"
                  />
                  <div className="hidden lg:flex flex-col text-left">
                    <span className="text-xs font-semibold font-inter text-[#0F172A] leading-tight">Moni Roy</span>
                    <span className="text-[9.5px] font-medium font-inter text-[#94A3B8] leading-tight">Admin</span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8] hidden lg:block" />
                </div>
              </div>
            </header>

            {/* Dashboard Scrollable Body */}
            <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
              {/* Top Sub-bar with Avatars & Add Member */}
              <div className="flex items-center justify-end gap-3 -mt-2">
                <div className="flex items-center -space-x-1.5">
                  <div className="w-7 h-7 rounded-full border-2 border-white overflow-hidden shadow-2xs">
                    <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80" alt="Moni" className="w-full h-full object-cover" />
                  </div>
                  <div className="w-7 h-7 rounded-full border-2 border-white overflow-hidden shadow-2xs">
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80" alt="Alex" className="w-full h-full object-cover" />
                  </div>
                  <div className="w-7 h-7 rounded-full border-2 border-white bg-blue-100 text-blue-700 font-bold text-[9.5px] flex items-center justify-center shadow-2xs">
                    P
                  </div>
                  <div className="w-7 h-7 rounded-full border-2 border-white bg-emerald-100 text-emerald-700 font-bold text-[9.5px] flex items-center justify-center shadow-2xs">
                    H
                  </div>
                  <span className="text-[10.5px] font-medium font-inter text-[#64748B] pl-2.5">+12</span>
                </div>

                <button
                  type="button"
                  onClick={() => openCreateProjectModal(activeWorkspace.id)}
                  className="h-8 px-3 rounded-[5px] border border-[#CBD5E1] text-xs font-medium font-inter text-[#334155] hover:bg-slate-50 flex items-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2]" />
                  <span>Add Member</span>
                </button>
              </div>

              {/* ================= SECTION 1: TASK SUMMARY (4 COLOR METRICS) ================= */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-[#0F172A] font-poppins">Task Summary</h2>
                  <div className="flex items-center gap-2">
                    <div className="h-8 px-2.5 rounded-[5px] border border-[#E2E8F0] text-xs font-medium font-inter text-[#334155] flex items-center gap-2 bg-white cursor-pointer">
                      <span>Marketing project</span>
                      <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8]" />
                    </div>
                    <div className="h-8 px-2.5 rounded-[5px] border border-[#E2E8F0] text-xs font-medium font-inter text-[#334155] flex items-center gap-2 bg-white cursor-pointer">
                      <span>Monthly</span>
                      <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8]" />
                    </div>
                  </div>
                </div>

                {/* 4 Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {/* Card 1: Completed Tasks (Green) */}
                  <div className="bg-[#ECFDF5]/80 border border-emerald-100 rounded-[10px] p-5 space-y-3 shadow-2xs">
                    <div className="w-9 h-9 rounded-full bg-[#10B981] text-white flex items-center justify-center shadow-xs">
                      <Check className="w-5 h-5 stroke-[2.5]" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-[#374151] font-inter">Completed Tasks</span>
                      <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-2xl font-bold text-[#111827] font-poppins">12</span>
                        <span className="text-xs font-medium text-[#6B7280]">/35</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-[10.5px] font-medium text-emerald-600 font-inter">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>12% increase from last month</span>
                    </div>
                  </div>

                  {/* Card 2: In Progress Tasks (Indigo) */}
                  <div className="bg-[#EEF2FF]/80 border border-indigo-100 rounded-[10px] p-5 space-y-3 shadow-2xs">
                    <div className="w-9 h-9 rounded-full bg-[#6366F1] text-white flex items-center justify-center shadow-xs">
                      <Clock className="w-5 h-5 stroke-[2]" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-[#374151] font-inter">In Progress Tasks</span>
                      <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-2xl font-bold text-[#111827] font-poppins">12</span>
                        <span className="text-xs font-medium text-[#6B7280]">/35</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-[10.5px] font-medium text-indigo-600 font-inter">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>12% increase from last month</span>
                    </div>
                  </div>

                  {/* Card 3: Tasks Pending Approval (Amber) */}
                  <div className="bg-[#FFFBEB]/90 border border-amber-100 rounded-[10px] p-5 space-y-3 shadow-2xs">
                    <div className="w-9 h-9 rounded-full bg-[#F59E0B] text-white flex items-center justify-center shadow-xs">
                      <Timer className="w-5 h-5 stroke-[2]" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-[#374151] font-inter">Tasks Pending Approval</span>
                      <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-2xl font-bold text-[#111827] font-poppins">12</span>
                        <span className="text-xs font-medium text-[#6B7280]">/35</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-[10.5px] font-medium text-amber-600 font-inter">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>2% increase from last month</span>
                    </div>
                  </div>

                  {/* Card 4: Upcoming Tasks (Rose) */}
                  <div className="bg-[#FFF1F2]/80 border border-rose-100 rounded-[10px] p-5 space-y-3 shadow-2xs">
                    <div className="w-9 h-9 rounded-full bg-[#F43F5E] text-white flex items-center justify-center shadow-xs">
                      <Calendar className="w-5 h-5 stroke-[2]" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-[#374151] font-inter">Upcoming Tasks</span>
                      <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-2xl font-bold text-[#111827] font-poppins">12</span>
                        <span className="text-xs font-medium text-[#6B7280]">/35</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-[10.5px] font-medium text-rose-600 font-inter">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>2% increase from last month</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ================= SECTION 2: 2 LINE CHARTS ================= */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Chart 1: Weekly Task Load */}
                <div className="bg-white rounded-[10px] border border-[#E2E8F0] p-5 shadow-2xs space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-[#0F172A] font-poppins">Weekly Task Load</h3>
                    <p className="text-[10.5px] text-[#64748B] font-inter">3 Projects &bull; 32 Tasks</p>
                  </div>

                  {/* SVG Spline Chart */}
                  <div className="relative h-[200px] w-full">
                    <svg className="w-full h-full" viewBox="0 0 500 180" fill="none">
                      {/* Grid lines */}
                      <line x1="35" y1="20" x2="490" y2="20" stroke="#F1F5F9" strokeDasharray="3 3" />
                      <line x1="35" y1="55" x2="490" y2="55" stroke="#F1F5F9" strokeDasharray="3 3" />
                      <line x1="35" y1="90" x2="490" y2="90" stroke="#F1F5F9" strokeDasharray="3 3" />
                      <line x1="35" y1="125" x2="490" y2="125" stroke="#F1F5F9" strokeDasharray="3 3" />
                      <line x1="35" y1="160" x2="490" y2="160" stroke="#E2E8F0" />

                      {/* Y-axis values */}
                      <text x="15" y="24" fill="#94A3B8" fontSize="10" fontFamily="sans-serif">25</text>
                      <text x="15" y="59" fill="#94A3B8" fontSize="10" fontFamily="sans-serif">20</text>
                      <text x="15" y="94" fill="#94A3B8" fontSize="10" fontFamily="sans-serif">15</text>
                      <text x="15" y="129" fill="#94A3B8" fontSize="10" fontFamily="sans-serif">10</text>
                      <text x="15" y="163" fill="#94A3B8" fontSize="10" fontFamily="sans-serif">0</text>

                      {/* Curve 1: Completed Tasks (Blue) */}
                      <path
                        d="M 50 145 C 90 150, 120 100, 160 85 C 200 70, 230 115, 270 110 C 310 105, 340 140, 380 135 C 420 130, 450 95, 485 100"
                        stroke="#2563EB"
                        strokeWidth="2.5"
                        fill="none"
                      />

                      {/* Curve 2: New Tasks (Amber) */}
                      <path
                        d="M 50 125 C 90 115, 120 145, 170 65 C 210 15, 240 135, 280 120 C 320 105, 350 45, 390 38 C 430 30, 460 105, 485 115"
                        stroke="#F59E0B"
                        strokeWidth="2.5"
                        fill="none"
                      />

                      {/* Tooltip on Sept 12, 2026 */}
                      <line x1="200" y1="15" x2="200" y2="160" stroke="#94A3B8" strokeWidth="1" strokeDasharray="3 3" />
                      <circle cx="200" cy="74" r="4" fill="#2563EB" stroke="white" strokeWidth="2" />
                      <g transform="translate(170, 40)">
                        <rect width="78" height="24" rx="4" fill="#0F172A" />
                        <text x="39" y="15" fill="white" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">Sept 12, 2026</text>
                      </g>
                    </svg>

                    {/* X-axis labels */}
                    <div className="flex justify-between pl-9 pr-3 text-[9.5px] text-[#94A3B8] font-inter mt-1">
                      <span>Mon</span>
                      <span>Tue</span>
                      <span>Wed</span>
                      <span>Thu</span>
                      <span>Fri</span>
                      <span>Sat</span>
                      <span>Sun</span>
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="flex items-center justify-center gap-6 text-xs font-medium font-inter pt-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB]" />
                      <span className="text-[#334155]">Completed Tasks</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
                      <span className="text-[#334155]">New Tasks</span>
                    </div>
                  </div>
                </div>

                {/* Chart 2: Project Progress */}
                <div className="bg-white rounded-[10px] border border-[#E2E8F0] p-5 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-[#0F172A] font-poppins">Project Progress</h3>
                      <p className="text-[10.5px] text-[#64748B] font-inter">3 Projects &bull; 32 Tasks</p>
                    </div>
                    <div className="h-7 px-2 rounded-[5px] border border-[#E2E8F0] text-xs font-medium font-inter text-[#334155] flex items-center gap-1.5 bg-white cursor-pointer">
                      <span>Monthly</span>
                      <ChevronDown className="w-3 h-3 text-[#94A3B8]" />
                    </div>
                  </div>

                  {/* SVG Multi-curve */}
                  <div className="relative h-[200px] w-full">
                    <svg className="w-full h-full" viewBox="0 0 500 180" fill="none">
                      <line x1="35" y1="20" x2="490" y2="20" stroke="#F1F5F9" strokeDasharray="3 3" />
                      <line x1="35" y1="55" x2="490" y2="55" stroke="#F1F5F9" strokeDasharray="3 3" />
                      <line x1="35" y1="90" x2="490" y2="90" stroke="#F1F5F9" strokeDasharray="3 3" />
                      <line x1="35" y1="125" x2="490" y2="125" stroke="#F1F5F9" strokeDasharray="3 3" />
                      <line x1="35" y1="160" x2="490" y2="160" stroke="#E2E8F0" />

                      <text x="10" y="24" fill="#94A3B8" fontSize="10" fontFamily="sans-serif">8k</text>
                      <text x="10" y="59" fill="#94A3B8" fontSize="10" fontFamily="sans-serif">6k</text>
                      <text x="10" y="94" fill="#94A3B8" fontSize="10" fontFamily="sans-serif">4k</text>
                      <text x="10" y="129" fill="#94A3B8" fontSize="10" fontFamily="sans-serif">2k</text>
                      <text x="10" y="163" fill="#94A3B8" fontSize="10" fontFamily="sans-serif">0k</text>

                      {/* Cyan curve (Marketing) */}
                      <path
                        d="M 50 110 C 100 125, 140 30, 200 45 C 260 60, 310 140, 370 120 C 420 100, 450 40, 485 55"
                        stroke="#00A3A6"
                        strokeWidth="2.5"
                        fill="none"
                      />

                      {/* Blue curve (Support) */}
                      <path
                        d="M 50 80 C 100 60, 140 110, 200 100 C 260 90, 310 30, 370 70 C 420 110, 460 75, 485 85"
                        stroke="#2563EB"
                        strokeWidth="2.5"
                        fill="none"
                      />

                      {/* Amber curve (Development) */}
                      <path
                        d="M 50 145 C 90 140, 130 90, 180 120 C 230 145, 270 90, 320 60 C 370 40, 420 135, 485 105"
                        stroke="#F59E0B"
                        strokeWidth="2.5"
                        fill="none"
                      />

                      {/* Tooltip */}
                      <line x1="280" y1="20" x2="280" y2="160" stroke="#94A3B8" strokeWidth="1" strokeDasharray="3 3" />
                      <circle cx="280" cy="84" r="4" fill="#00A3A6" stroke="white" strokeWidth="2" />
                      <g transform="translate(245, 30)">
                        <rect width="75" height="22" rx="4" fill="#0F172A" />
                        <text x="37.5" y="14" fill="white" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">Sept 12, 2026</text>
                      </g>
                    </svg>

                    <div className="flex justify-between pl-8 pr-2 text-[9.5px] text-[#94A3B8] font-inter mt-1">
                      <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span>
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="flex items-center justify-center gap-6 text-xs font-medium font-inter pt-1">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#00A3A6]" />
                      <span className="text-[#334155]">Marketing project</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB]" />
                      <span className="text-[#334155]">Support</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
                      <span className="text-[#334155]">Development</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ================= SECTION 3: WORKLOAD BAR CHART & RADIAL GAUGE ================= */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 12-Month Grouped Bar Chart */}
                <div className="lg:col-span-2 bg-white rounded-[10px] border border-[#E2E8F0] p-5 shadow-2xs space-y-4">
                  <h3 className="text-sm font-bold text-[#0F172A] font-poppins">Project Workload</h3>

                  <div className="relative h-[220px] w-full">
                    <svg className="w-full h-full" viewBox="0 0 600 200" fill="none">
                      <line x1="30" y1="20" x2="590" y2="20" stroke="#F1F5F9" strokeDasharray="3 3" />
                      <line x1="30" y1="60" x2="590" y2="60" stroke="#F1F5F9" strokeDasharray="3 3" />
                      <line x1="30" y1="100" x2="590" y2="100" stroke="#F1F5F9" strokeDasharray="3 3" />
                      <line x1="30" y1="140" x2="590" y2="140" stroke="#F1F5F9" strokeDasharray="3 3" />
                      <line x1="30" y1="180" x2="590" y2="180" stroke="#E2E8F0" />

                      <text x="10" y="24" fill="#94A3B8" fontSize="10">100</text>
                      <text x="10" y="64" fill="#94A3B8" fontSize="10">75</text>
                      <text x="10" y="104" fill="#94A3B8" fontSize="10">50</text>
                      <text x="10" y="144" fill="#94A3B8" fontSize="10">25</text>
                      <text x="10" y="183" fill="#94A3B8" fontSize="10">0</text>

                      {/* 12 Month Bar Groups */}
                      {[
                        { m: "Jan", b1: 40, b2: 25, b3: 60 },
                        { m: "Feb", b1: 30, b2: 50, b3: 45 },
                        { m: "Mar", b1: 55, b2: 35, b3: 70 },
                        { m: "Apr", b1: 85, b2: 60, b3: 40 },
                        { m: "May", b1: 60, b2: 45, b3: 65 },
                        { m: "Jun", b1: 80, b2: 70, b3: 50 },
                        { m: "Jul", b1: 45, b2: 65, b3: 75 },
                        { m: "Aug", b1: 85, b2: 70, b3: 40 },
                        { m: "Sep", b1: 70, b2: 55, b3: 85 },
                        { m: "Oct", b1: 30, b2: 40, b3: 65 },
                        { m: "Nov", b1: 50, b2: 75, b3: 60 },
                        { m: "Dec", b1: 75, b2: 65, b3: 45 },
                      ].map((grp, i) => {
                        const xBase = 50 + i * 45;
                        return (
                          <g key={grp.m}>
                            <rect x={xBase} y={180 - grp.b1 * 1.5} width="6" height={grp.b1 * 1.5} rx="2" fill="#00A3A6" />
                            <rect x={xBase + 8} y={180 - grp.b2 * 1.5} width="6" height={grp.b2 * 1.5} rx="2" fill="#2563EB" />
                            <rect x={xBase + 16} y={180 - grp.b3 * 1.5} width="6" height={grp.b3 * 1.5} rx="2" fill="#F59E0B" />
                          </g>
                        );
                      })}

                      {/* Tooltip Badge on April */}
                      <g transform="translate(160, 25)">
                        <rect width="115" height="28" rx="5" fill="#0F172A" />
                        <text x="57" y="17" fill="white" fontSize="9" fontWeight="bold" textAnchor="middle">
                          M: 26 &bull; S: 18 &bull; D: 12
                        </text>
                      </g>
                    </svg>

                    <div className="flex justify-between pl-11 pr-4 text-[9.5px] text-[#94A3B8] font-inter">
                      <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-6 text-xs font-medium font-inter pt-1">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#00A3A6]" />
                      <span className="text-[#334155]">Marketing project</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB]" />
                      <span className="text-[#334155]">Support</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
                      <span className="text-[#334155]">Development</span>
                    </div>
                  </div>
                </div>

                {/* Semi-Circle Gauge Radial Meter (Task Completion Rate) */}
                <div className="bg-white rounded-[10px] border border-[#E2E8F0] p-5 shadow-2xs space-y-4 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-[#0F172A] font-poppins">Task Completion Rate</h3>
                    <div className="h-7 px-2 rounded-[5px] border border-[#E2E8F0] text-xs font-medium font-inter text-[#334155] flex items-center gap-1 bg-white cursor-pointer">
                      <span>All</span>
                      <ChevronDown className="w-3 h-3 text-[#94A3B8]" />
                    </div>
                  </div>

                  {/* Radial Gauge SVG */}
                  <div className="flex flex-col items-center justify-center pt-2">
                    <div className="relative w-48 h-28 flex items-end justify-center">
                      <svg className="w-48 h-28" viewBox="0 0 160 90">
                        {/* Background Arch */}
                        <path
                          d="M 15 85 A 65 65 0 0 1 145 85"
                          stroke="#E2E8F0"
                          strokeWidth="10"
                          strokeLinecap="round"
                          fill="none"
                        />
                        {/* Dotted rainbow outer ring */}
                        <path
                          d="M 10 85 A 72 72 0 0 1 150 85"
                          stroke="#CBD5E1"
                          strokeWidth="3"
                          strokeDasharray="2 6"
                          strokeLinecap="round"
                          fill="none"
                        />
                        {/* Active Progress Arch (Cyan -> Blue -> Amber gradient) */}
                        <path
                          d="M 15 85 A 65 65 0 0 1 125 35"
                          stroke="#00A3A6"
                          strokeWidth="10"
                          strokeLinecap="round"
                          fill="none"
                        />
                      </svg>
                      <div className="absolute bottom-1 text-center">
                        <span className="text-2xl font-bold text-[#00A3A6] font-poppins">72%</span>
                        <p className="text-[9.5px] font-medium text-[#64748B]">Completed</p>
                      </div>
                    </div>

                    {/* Bottom Stats Breakdown */}
                    <div className="grid grid-cols-4 gap-2 w-full pt-4 border-t border-[#F1F5F9] text-center">
                      <div>
                        <span className="text-base font-bold text-[#0F172A]">62</span>
                        <p className="text-[9.5px] text-[#94A3B8] font-inter">Total Task</p>
                      </div>
                      <div>
                        <span className="text-base font-bold text-[#00A3A6]">15</span>
                        <p className="text-[9.5px] text-[#94A3B8] font-inter">Completed</p>
                      </div>
                      <div>
                        <span className="text-base font-bold text-[#F59E0B]">35</span>
                        <p className="text-[9.5px] text-[#94A3B8] font-inter">Pending</p>
                      </div>
                      <div>
                        <span className="text-base font-bold text-[#EF4444]">12</span>
                        <p className="text-[9.5px] text-[#94A3B8] font-inter">Upcoming</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ================= SECTION 4: TABLE & DONUT CHART ================= */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Project Overview Table */}
                <div className="lg:col-span-2 bg-white rounded-[10px] border border-[#E2E8F0] p-5 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <h3 className="text-sm font-bold text-[#0F172A] font-poppins">Project Overview</h3>
                    <div className="flex items-center gap-2">
                      <div className="h-7 px-2 rounded-[5px] border border-[#E2E8F0] text-xs font-medium font-inter text-[#334155] flex items-center gap-1 bg-white cursor-pointer">
                        <span>Project</span>
                        <ChevronDown className="w-3 h-3 text-[#94A3B8]" />
                      </div>
                      <div className="h-7 px-2 rounded-[5px] border border-[#E2E8F0] text-xs font-medium font-inter text-[#334155] flex items-center gap-1 bg-white cursor-pointer">
                        <span>Status</span>
                        <ChevronDown className="w-3 h-3 text-[#94A3B8]" />
                      </div>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-inter">
                      <thead className="text-[#94A3B8] font-medium border-b border-[#F1F5F9]">
                        <tr>
                          <th className="pb-3">Project Name</th>
                          <th className="pb-3">Team</th>
                          <th className="pb-3">Deadline</th>
                          <th className="pb-3">Status</th>
                          <th className="pb-3">Progress</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#F1F5F9]">
                        {[
                          { name: "Support", deadline: "Jun 20, 2023", status: "Completed", statusColor: "bg-emerald-50 text-emerald-700 border-emerald-200", pct: 100 },
                          { name: "Marketing project", deadline: "Jun 20, 2023", status: "In Progress", statusColor: "bg-blue-50 text-blue-700 border-blue-200", pct: 65 },
                          { name: "Curtex iOS app developm...", deadline: "Jun 20, 2023", status: "In Progress", statusColor: "bg-blue-50 text-blue-700 border-blue-200", pct: 40 },
                          { name: "Website builder developm...", deadline: "Jun 20, 2023", status: "Upcoming", statusColor: "bg-rose-50 text-rose-700 border-rose-200", pct: 10 },
                          { name: "Development", deadline: "Jun 20, 2023", status: "Upcoming", statusColor: "bg-rose-50 text-rose-700 border-rose-200", pct: 10 },
                        ].map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50">
                            <td className="py-3 font-semibold text-[#0F172A]">{row.name}</td>
                            <td className="py-3">
                              <div className="flex items-center -space-x-1.5">
                                <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-[9px] font-bold flex items-center justify-center border border-white">P</div>
                                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 text-[9px] font-bold flex items-center justify-center border border-white">H</div>
                                <div className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 text-[9px] font-bold flex items-center justify-center border border-white">Z</div>
                              </div>
                            </td>
                            <td className="py-3 text-[#64748B]">{row.deadline}</td>
                            <td className="py-3">
                              <span className={`px-2 py-0.5 rounded text-[9.5px] font-semibold border ${row.statusColor}`}>
                                {row.status}
                              </span>
                            </td>
                            <td className="py-3">
                              <div className="flex items-center gap-2">
                                <div className="w-24 h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden">
                                  <div className="h-full bg-[#2563EB] rounded-full" style={{ width: `${row.pct}%` }} />
                                </div>
                                <span className="text-[9.5px] font-semibold text-[#64748B]">{row.pct}%</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Projects Allocation Donut Chart */}
                <div className="bg-white rounded-[10px] border border-[#E2E8F0] p-5 shadow-2xs space-y-4 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-[#0F172A] font-poppins">Projects Allocation</h3>
                      <p className="text-[10.5px] text-[#64748B]">3 Projects &bull; 32 Tasks</p>
                    </div>
                    <div className="h-7 px-2 rounded-[5px] border border-[#E2E8F0] text-xs font-medium font-inter text-[#334155] flex items-center gap-1 bg-white cursor-pointer">
                      <span>Monthly</span>
                      <ChevronDown className="w-3 h-3 text-[#94A3B8]" />
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-6 py-4">
                    {/* SVG Donut */}
                    <div className="relative w-32 h-32">
                      <svg className="w-32 h-32 -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="38" stroke="#E2E8F0" strokeWidth="12" fill="none" />
                        <circle cx="50" cy="50" r="38" stroke="#00A3A6" strokeWidth="12" strokeDasharray="100 150" strokeDashoffset="0" fill="none" />
                        <circle cx="50" cy="50" r="38" stroke="#2563EB" strokeWidth="12" strokeDasharray="75 165" strokeDashoffset="-100" fill="none" />
                        <circle cx="50" cy="50" r="38" stroke="#F59E0B" strokeWidth="12" strokeDasharray="45 195" strokeDashoffset="-175" fill="none" />
                      </svg>
                    </div>

                    {/* Donut Legend */}
                    <div className="space-y-2 text-xs font-medium font-inter">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#00A3A6]" />
                        <span className="text-[#334155]">Marketing project</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB]" />
                        <span className="text-[#334155]">Support</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
                        <span className="text-[#334155]">Development</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ================= SECTION 5: 3 CARDS (MY TASKS, OVERALL PROGRESS, MESSAGES) ================= */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Card 1: My Tasks */}
                <div className="bg-white rounded-[10px] border border-[#E2E8F0] p-5 shadow-2xs space-y-4 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-[#0F172A] font-poppins">My Tasks</h3>
                    <MoreHorizontal className="w-4 h-4 text-[#94A3B8] cursor-pointer" />
                  </div>
                  <span className="text-[10.5px] font-semibold text-[#64748B]">September 2026</span>

                  <div className="space-y-3">
                    {myReminders.map((rem) => (
                      <div key={rem.id} className="flex items-center justify-between gap-2 text-xs font-inter">
                        <div className="flex items-center gap-2 min-w-0">
                          <button
                            type="button"
                            onClick={() =>
                              setMyReminders((prev) =>
                                prev.map((r) => (r.id === rem.id ? { ...r, checked: !r.checked } : r))
                              )
                            }
                            className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 border ${
                              rem.checked ? "bg-[#2563EB] border-[#2563EB] text-white" : "border-[#CBD5E1]"
                            }`}
                          >
                            {rem.checked && <Check className="w-3 h-3 stroke-[3]" />}
                          </button>
                          <div className="min-w-0">
                            <p className={`truncate font-medium ${rem.checked ? "text-[#94A3B8] line-through" : "text-[#0F172A]"}`}>
                              {rem.text}
                            </p>
                            <span className="text-[9.5px] text-[#94A3B8] truncate block">{rem.url}</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setMyReminders((prev) => prev.filter((r) => r.id !== rem.id))}
                          className="text-[10.5px] text-[#94A3B8] hover:text-red-600 shrink-0 cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const text = prompt("New reminder text:");
                      if (text?.trim()) {
                        setMyReminders((prev) => [
                          ...prev,
                          { id: Date.now(), text: text.trim(), url: "orbitask-workspace.io", checked: false },
                        ]);
                      }
                    }}
                    className="w-full h-9 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-medium font-inter rounded-[5px] flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[2]" />
                    <span>Add new Reminder</span>
                  </button>
                </div>

                {/* Card 2: Overall Progress (Concentric Rings) */}
                <div className="bg-white rounded-[10px] border border-[#E2E8F0] p-5 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-[#0F172A] font-poppins">Overall Progress</h3>
                    <MoreHorizontal className="w-4 h-4 text-[#94A3B8] cursor-pointer" />
                  </div>

                  {/* Concentric 3-Ring SVG */}
                  <div className="flex flex-col items-center justify-center py-1">
                    <div className="relative w-36 h-36 flex items-center justify-center">
                      <svg className="w-36 h-36 -rotate-90" viewBox="0 0 100 100">
                        {/* Ring 1 (Outer Cyan) */}
                        <circle cx="50" cy="50" r="42" stroke="#F1F5F9" strokeWidth="6" fill="none" />
                        <circle cx="50" cy="50" r="42" stroke="#00A3A6" strokeWidth="6" strokeDasharray="165 264" strokeLinecap="round" fill="none" />
                        {/* Ring 2 (Middle Blue) */}
                        <circle cx="50" cy="50" r="33" stroke="#F1F5F9" strokeWidth="6" fill="none" />
                        <circle cx="50" cy="50" r="33" stroke="#2563EB" strokeWidth="6" strokeDasharray="130 207" strokeLinecap="round" fill="none" />
                        {/* Ring 3 (Inner Orange) */}
                        <circle cx="50" cy="50" r="24" stroke="#F1F5F9" strokeWidth="6" fill="none" />
                        <circle cx="50" cy="50" r="24" stroke="#F59E0B" strokeWidth="6" strokeDasharray="95 150" strokeLinecap="round" fill="none" />
                      </svg>
                      <div className="absolute text-center px-1">
                        <span className="text-[9.5px] font-bold text-[#0F172A] block leading-tight">All Tasks Progress</span>
                        <span className="text-[9px] text-[#94A3B8]">52 Total Task</span>
                      </div>
                    </div>
                  </div>

                  {/* Legend list */}
                  <div className="space-y-2 pt-2 border-t border-[#F1F5F9] text-xs font-inter">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
                        <span className="text-[#334155] font-medium">Support</span>
                      </div>
                      <span className="text-[#64748B]">28 Tasks</span>
                      <span className="font-bold text-[#0F172A]">62.5%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#00A3A6]" />
                        <span className="text-[#334155] font-medium">Marketing pr...</span>
                      </div>
                      <span className="text-[#64748B]">28 Tasks</span>
                      <span className="font-bold text-[#0F172A]">62.5%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB]" />
                        <span className="text-[#334155] font-medium">Development</span>
                      </div>
                      <span className="text-[#64748B]">28 Tasks</span>
                      <span className="font-bold text-[#0F172A]">62.5%</span>
                    </div>
                  </div>
                </div>

                {/* Card 3: New Messages */}
                <div className="bg-white rounded-[10px] border border-[#E2E8F0] p-5 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-sm font-bold text-[#0F172A] font-poppins">New Messages</h3>
                      <span className="w-2 h-2 rounded-full bg-red-500" />
                    </div>
                    <MoreHorizontal className="w-4 h-4 text-[#94A3B8] cursor-pointer" />
                  </div>

                  <div className="space-y-3.5 text-xs font-inter">
                    {[
                      { name: "Henry Mason", text: "is typing...", time: "9:00 AM", unread: 1, img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80" },
                      { name: "Moni Roy", text: "Online", time: "9:00 AM", unread: 0, img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80" },
                      { name: "Liam Parker", text: "Hey, are we still on track for to...", time: "9:00 AM", unread: 1, img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=80" },
                      { name: "Emma Collins", text: "Online", time: "9:00 AM", unread: 0, img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=80" },
                      { name: "Moni Roy", text: "Online", time: "9:00 AM", unread: 0, img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80" },
                    ].map((msg, i) => (
                      <div key={i} className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img src={msg.img} alt={msg.name} className="w-8 h-8 rounded-full object-cover shrink-0" />
                          <div className="min-w-0">
                            <span className="font-bold text-[#0F172A] block leading-tight">{msg.name}</span>
                            <span className="text-[10.5px] text-[#64748B] truncate block">{msg.text}</span>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-1 shrink-0">
                          {msg.unread > 0 ? (
                            <span className="w-4 h-4 rounded-full bg-red-500 text-white text-[9.5px] font-bold flex items-center justify-center">
                              {msg.unread}
                            </span>
                          ) : (
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                          )}
                          <span className="text-[9.5px] text-[#94A3B8]">{msg.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ================= SECTION 6: ALL MEMBERS TABLE ================= */}
              <div className="bg-white rounded-[10px] border border-[#E2E8F0] p-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#0F172A] font-poppins">All Members</h3>
                  <button type="button" className="h-8 px-3 rounded-[5px] border border-[#E2E8F0] text-xs font-medium font-inter text-[#334155] flex items-center gap-1.5 bg-white cursor-pointer hover:bg-slate-50">
                    <Filter className="w-3.5 h-3.5 text-[#64748B]" />
                    <span>Filter</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-inter">
                    <thead className="text-[#94A3B8] font-semibold border-b border-[#F1F5F9]">
                      <tr>
                        <th className="pb-3.5">Name</th>
                        <th className="pb-3.5">Project Name</th>
                        <th className="pb-3.5">Role</th>
                        <th className="pb-3.5">Approval</th>
                        <th className="pb-3.5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F1F5F9]">
                      {[
                        { name: "Emma Collins", email: "emma.collins@orbitask.com", project: "Marketing project", role: "Software Engineer", status: "Approved", statusColor: "bg-emerald-50 text-emerald-700 border-emerald-200", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=80" },
                        { name: "Liam Parker", email: "liam.parker@orbitask.com", project: "Marketing project", role: "Software Engineer", status: "Pending", statusColor: "bg-amber-50 text-amber-700 border-amber-200", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=80" },
                        { name: "Peter Howard", email: "peter.howard@orbitask.com", project: "Marketing project", role: "Network Architect", status: "Pending", statusColor: "bg-amber-50 text-amber-700 border-amber-200", initials: "P", bg: "bg-blue-100 text-blue-800" },
                        { name: "Henry Mason", email: "henry.mason@orbitask.com", project: "Support", role: "Data Scientist", status: "Denied", statusColor: "bg-rose-50 text-rose-700 border-rose-200", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80" },
                        { name: "Zoey Mitchell", email: "zoey.mitchell@orbitask.com", project: "Support", role: "Web Developer", status: "Pending", statusColor: "bg-amber-50 text-amber-700 border-amber-200", initials: "Z", bg: "bg-amber-100 text-amber-800" },
                      ].map((mem, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="py-3.5">
                            <div className="flex items-center gap-2.5">
                              {mem.img ? (
                                <img src={mem.img} alt={mem.name} className="w-8 h-8 rounded-full object-cover shrink-0" />
                              ) : (
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${mem.bg}`}>
                                  {mem.initials}
                                </div>
                              )}
                              <div>
                                <span className="font-semibold text-[#0F172A] block leading-snug">{mem.name}</span>
                                <span className="text-[10.5px] text-[#64748B]">{mem.email}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 text-[#334155] font-medium">{mem.project}</td>
                          <td className="py-3.5 text-[#64748B]">{mem.role}</td>
                          <td className="py-3.5">
                            <span className={`px-2.5 py-0.5 rounded text-[10.5px] font-semibold border ${mem.statusColor}`}>
                              {mem.status}
                            </span>
                          </td>
                          <td className="py-3.5 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button type="button" className="p-1 text-[#64748B] hover:text-[#2563EB] transition-colors cursor-pointer" title="Edit">
                                <Edit2 className="w-3.5 h-3.5 stroke-[1.75]" />
                              </button>
                              <button type="button" className="p-1 text-[#64748B] hover:text-red-600 transition-colors cursor-pointer" title="Delete">
                                <Trash2 className="w-3.5 h-3.5 stroke-[1.75]" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-[#F1F5F9] text-xs font-inter">
                  <span className="text-[#64748B]">Showing 1-5 from 100</span>
                  <div className="flex items-center gap-1.5">
                    <button type="button" className="w-7 h-7 rounded-[4px] bg-[#2563EB] text-white font-bold text-xs flex items-center justify-center">1</button>
                    <button type="button" className="w-7 h-7 rounded-[4px] border border-[#E2E8F0] hover:bg-slate-50 text-[#334155] font-medium text-xs flex items-center justify-center">2</button>
                    <button type="button" className="w-7 h-7 rounded-[4px] border border-[#E2E8F0] hover:bg-slate-50 text-[#334155] font-medium text-xs flex items-center justify-center">3</button>
                    <button type="button" className="w-7 h-7 rounded-[4px] border border-[#E2E8F0] hover:bg-slate-50 text-[#334155] font-medium text-xs flex items-center justify-center">4</button>
                    <span className="text-[#94A3B8] px-1">&bull;&bull;&bull;</span>
                    <button type="button" className="w-7 h-7 rounded-[4px] border border-[#E2E8F0] hover:bg-slate-50 text-[#334155] font-medium text-xs flex items-center justify-center">
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      )}

      {/* ================= CREATE WORKSPACE MODAL ================= */}
      {isCreateWorkspaceOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-[5px] shadow-2xl p-8 relative animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-6">
              <h3 className="text-lg font-bold text-[#0F172A] font-poppins">Create a new workspace</h3>
              <button type="button" onClick={() => setIsCreateWorkspaceOpen(false)} className="p-1 rounded-[5px] text-[#94A3B8] hover:text-[#0F172A] hover:bg-slate-100 transition-colors cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateWorkspaceSubmit} className="space-y-6">
              <div className="text-center">
                <input ref={logoInputRef} type="file" accept="image/*" onChange={handleLogoFileChange} className="hidden" />
                <div
                  onClick={() => logoInputRef.current?.click()}
                  className="w-16 h-16 mx-auto rounded-full bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center cursor-pointer hover:bg-blue-100 transition-colors shadow-2xs border border-blue-100/60 group overflow-hidden"
                >
                  {wsUploadedLogo ? (
                    <img src={wsUploadedLogo} alt="Workspace Logo" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-7 h-7 text-[#2563EB] group-hover:scale-105 transition-transform stroke-[1.75]" />
                  )}
                </div>
                <p className="text-xs font-medium font-inter text-[#64748B] mt-2.5">Upload your workspace logo or image</p>
              </div>

              <div className="relative border border-[#CBD5E1] rounded-[5px] px-3.5 pt-3 pb-3 focus-within:border-[#2563EB] focus-within:ring-1 focus-within:ring-[#2563EB] transition-all bg-white">
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10.5px] font-medium text-[#475569] font-inter select-none">
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
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10.5px] font-medium text-[#475569] font-inter select-none">
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
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10.5px] font-medium text-[#475569] font-inter select-none">
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

              <button type="submit" className="w-full h-11 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-medium text-xs font-inter rounded-[5px] shadow-xs transition-colors cursor-pointer mt-4">
                Create Workspace
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ================= CREATE PROJECT MODAL ================= */}
      {isCreateProjectOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-[5px] shadow-2xl p-8 relative animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-6">
              <h3 className="text-lg font-bold text-[#0F172A] font-poppins">Create Project</h3>
              <button type="button" onClick={() => setIsCreateProjectOpen(false)} className="p-1 rounded-[5px] text-[#94A3B8] hover:text-[#0F172A] hover:bg-slate-100 transition-colors cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProjectSubmit} className="space-y-6">
              <div className="relative border border-[#CBD5E1] rounded-[5px] px-3.5 pt-3 pb-3 focus-within:border-[#2563EB] focus-within:ring-1 focus-within:ring-[#2563EB] transition-all bg-white">
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10.5px] font-medium text-[#475569] font-inter select-none">
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
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10.5px] font-medium text-[#475569] font-inter select-none">
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
                  <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10.5px] font-medium text-[#475569] font-inter select-none">
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
                <p className="text-[10.5px] font-medium font-inter text-[#64748B] flex items-center gap-1.5 mt-1.5">
                  <Info className="w-3.5 h-3.5 text-[#94A3B8] shrink-0 stroke-[1.75]" />
                  <span>A default board named “Deafult Board” will be created automatically</span>
                </p>
              </div>

              <div className="space-y-2">
                <span className="block text-xs font-semibold text-[#334155] font-inter">Invite Member</span>
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
                      <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10.5px] font-medium text-[#475569] font-inter select-none">
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
                      <button type="button" onClick={handleAddInvitedEmail} className="text-xs font-semibold font-inter text-[#2563EB] hover:underline shrink-0 cursor-pointer ml-1">
                        Invite
                      </button>
                    </div>

                    {invitedEmails.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {invitedEmails.map((email) => (
                          <span key={email} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[5px] bg-blue-50 text-[#2563EB] text-[10.5px] font-medium font-inter border border-blue-100">
                            {email}
                            <button type="button" onClick={() => handleRemoveInvitedEmail(email)} className="hover:text-blue-900 cursor-pointer ml-0.5">
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <button type="submit" className="w-full h-11 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-medium text-xs font-inter rounded-[5px] shadow-xs transition-colors cursor-pointer mt-4">
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
              <h3 className="text-sm font-bold text-[#0F172A] font-poppins">Edit Project</h3>
              <button type="button" onClick={() => setEditingProject(null)} className="p-1 rounded-[5px] text-[#94A3B8] hover:text-[#0F172A] hover:bg-slate-100 transition-colors cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditProject} className="space-y-4 pt-4">
              <div className="relative border border-[#CBD5E1] rounded-[5px] px-3.5 pt-2.5 pb-2.5 focus-within:border-[#2563EB] focus-within:ring-1 focus-within:ring-[#2563EB] transition-all bg-white">
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10.5px] font-medium text-[#475569] font-inter select-none">
                  Project Name
                </label>
                <input
                  type="text"
                  required
                  value={editingProject.name}
                  onChange={(e) => setEditingProject({ ...editingProject, name: e.target.value })}
                  className="w-full bg-transparent text-xs font-medium font-inter text-[#0F172A] focus:outline-none"
                />
              </div>

              <div className="relative border border-[#CBD5E1] rounded-[5px] px-3.5 pt-2.5 pb-2.5 focus-within:border-[#2563EB] focus-within:ring-1 focus-within:ring-[#2563EB] transition-all bg-white">
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10.5px] font-medium text-[#475569] font-inter select-none">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editingProject.description}
                  onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                  className="w-full bg-transparent text-xs font-medium font-inter text-[#0F172A] focus:outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button type="button" onClick={() => setEditingProject(null)} className="h-9 px-4 text-xs font-medium font-inter text-[#64748B] hover:text-[#0F172A] rounded-[5px] transition-colors cursor-pointer">
                  Cancel
                </button>
                <button type="submit" className="h-9 px-5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-medium font-inter rounded-[5px] transition-colors shadow-xs cursor-pointer">
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
