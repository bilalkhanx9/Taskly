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
  CheckSquare,
  Calendar,
  Image as ImageIcon,
  Mail,
  Info,
  Palette,
  RefreshCw,
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

// Brand Logo Helper matching Figma screenshot
function WorkspaceBrandLogo({
  type,
  name,
  customLogo,
}: {
  type?: string;
  name: string;
  customLogo?: string;
}) {
  if (customLogo) {
    return (
      <img
        src={customLogo}
        alt={name}
        className="w-7 h-7 rounded-[5px] object-cover border border-[#E2E8F0]"
      />
    );
  }

  if (type === "airbnb" || name.toLowerCase().includes("airbnb")) {
    return (
      <svg className="w-6 h-6 text-[#FF5A5F]" viewBox="0 0 32 32" fill="currentColor">
        <path d="M16 1c-4.2 0-7.8 2.7-9.4 6.6-2.1 5.3-.7 11.5 3.7 15.6 1.6 1.5 3.5 2.9 5.7 4.8 2.2-1.9 4.1-3.3 5.7-4.8 4.4-4.1 5.8-10.3 3.7-15.6C23.8 3.7 20.2 1 16 1zm0 21.2c-2.4-2.1-4.7-4.1-6.1-6.7-1.3-2.4-1.5-4.8-.5-7.3 1-2.5 3.3-4.2 6.6-4.2s5.6 1.7 6.6 4.2c1 2.5.8 4.9-.5 7.3-1.4 2.6-3.7 4.6-6.1 6.7zM16 7c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
      </svg>
    );
  }

  if (type === "amazon" || name.toLowerCase().includes("amazon")) {
    return (
      <svg className="w-6 h-6 text-[#111827]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M13.9 14.6c-.6.5-1.4.8-2.3.8-1.7 0-2.8-1.1-2.8-2.8 0-1.8 1.2-2.8 3-2.8.7 0 1.5.2 2.1.5v4.3zm2.5 2.8c-.2.2-.4.2-.6.1-.8-.6-1.1-.9-2.1-1.6-.9.9-1.9 1.3-3.2 1.3-2.3 0-4.1-1.6-4.1-4.2 0-2.4 1.6-4.1 4.1-4.1.9 0 1.7.2 2.5.6V9c0-1.8-1.2-2.7-3.1-2.7-1.1 0-2.1.4-2.8 1-.2.2-.4.1-.5-.1l-.8-1.2c-.1-.2 0-.4.2-.5 1.1-.9 2.5-1.4 4.2-1.4 2.9 0 5 1.5 5 4.7v5.6c0 .8.3 1.1.7 1.6.2.2.2.4 0 .6l-1.5 1.4zm6.6 2c-.2.2-.5.2-.7.1-2.9-2.2-6.5-3.4-10.2-3.4-3.5 0-7 1.1-9.9 3.2-.2.2-.5.1-.6 0-.2-.2-.1-.5.1-.7 3.1-2.2 6.8-3.4 10.4-3.4 3.9 0 7.7 1.3 10.8 3.6.2.2.3.4.1.6zm-1.8-1.5c-.1.2-.4.2-.6.1-.5-.4-1.2-.7-2-.8-.2 0-.3-.3-.2-.5.1-.2.3-.3.5-.2.9.2 1.7.5 2.2 1 .2.1.2.3.1.4z" />
      </svg>
    );
  }

  // Default Orbitask Orbit Disc
  return (
    <div className="w-7 h-7 rounded-[5px] bg-blue-50/70 border border-blue-100 flex items-center justify-center text-[#0284C7] shadow-2xs">
      <svg className="w-5 h-5 text-[#0284C7]" viewBox="0 0 32 32" fill="none">
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
  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  // Workspaces list seeded matching Figma exactly: Airbnb (empty), Orbitask (2 cards), Amazon (1 card)
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
          name: "Marketing Team",
          description: "The development team builds and maintains the product.",
          bannerColor: "#0D9488",
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
            {
              priority: "P3",
              priorityColor: "bg-blue-100 text-blue-800 border border-blue-200",
              title: "Testing QA",
              progress: "8/8",
              date: "Jun 28, 2023",
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

  // Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside() {
      setActiveMenuProjectId(null);
      setIsColorSubmenuOpen(null);
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

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

    const targetWsId = targetWorkspaceId || workspaces[0]?.id;
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

    // Stacks directly below existing workspaces
    setWorkspaces((prev) => [...prev, newWs]);
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

  return (
    <div className="min-h-screen bg-white text-[#0F172A] font-sans antialiased flex flex-col selection:bg-blue-100 selection:text-blue-900">
      {/* ================= 1. TOP NAVBAR (EXACT MATCH TO FIGMA) ================= */}
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
          {/* Moni Roy Profile Badge */}
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

          {/* Notification Bell */}
          <button
            type="button"
            className="w-8 h-8 rounded-[5px] border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:text-[#0F172A] hover:bg-slate-50 transition-colors cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4 stroke-[1.75]" />
          </button>

          {/* Global Settings Gear */}
          <button
            type="button"
            className="w-8 h-8 rounded-[5px] border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:text-[#0F172A] hover:bg-slate-50 transition-colors cursor-pointer"
            title="Settings"
          >
            <Settings className="w-4 h-4 stroke-[1.75]" />
          </button>
        </div>
      </header>

      {/* ================= 2. MAIN CONTENT (WORKSPACES LIST) ================= */}
      <main className="flex-1 w-full px-8 md:px-12 pt-8 pb-16">
        <div className="space-y-12">
          {workspaces.map((ws) => {
            const filteredProjects = getFilteredProjects(ws);

            return (
              <section key={ws.id} className="space-y-6">
                {/* Workspace Header Bar */}
                <div className="flex items-center gap-8 flex-wrap">
                  {/* Brand Icon & Title */}
                  <div className="flex items-center gap-3">
                    <WorkspaceBrandLogo
                      type={ws.logoType}
                      name={ws.name}
                      customLogo={ws.customLogo}
                    />
                    <h2 className="text-xl font-bold tracking-tight text-[#0F172A] font-poppins">
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
                    {/* Case A: Workspace has No Projects (Airbnb empty state from Image 1) */}
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
                      /* Case B: Workspace has projects (Orbitask & Amazon in Image 1) */
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
                                className="w-full rounded-[5px] bg-white border border-[#E2E8F0] shadow-xs hover:shadow-md transition-all duration-200 overflow-visible group relative flex flex-col justify-between"
                              >
                                <div>
                                  {/* Topographic Wave Graphic Banner */}
                                  <div
                                    className="h-[76px] rounded-t-[5px] relative overflow-hidden flex items-start justify-end p-2.5 gap-1 shrink-0"
                                    style={{ backgroundColor: project.bannerColor }}
                                  >
                                    <svg
                                      className="absolute inset-0 w-full h-full opacity-40 pointer-events-none"
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
                                    <div className="relative">
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setActiveMenuProjectId(
                                            activeMenuProjectId === project.id
                                              ? null
                                              : project.id
                                          );
                                          setIsColorSubmenuOpen(null);
                                        }}
                                        className="relative z-10 p-1 text-white/90 hover:text-white transition-colors cursor-pointer rounded-[5px]"
                                        title="Project options"
                                      >
                                        <MoreVertical className="w-3.5 h-3.5 stroke-[1.75]" />
                                      </button>

                                      {/* Dropdown Menu (Exact match to Image 1) */}
                                      {activeMenuProjectId === project.id && (
                                        <div
                                          onClick={(e) => e.stopPropagation()}
                                          className="absolute right-0 top-7 w-48 bg-white rounded-[5px] border border-[#E2E8F0] shadow-xl z-40 py-1 text-xs text-[#334155] animate-in fade-in zoom-in-95 font-inter"
                                        >
                                          {/* Rename project */}
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
                                            className="w-full px-3.5 py-2 text-left hover:bg-[#F8FAFC] flex items-center gap-2.5 text-[#334155] cursor-pointer"
                                          >
                                            <Edit2 className="w-3.5 h-3.5 text-[#64748B] stroke-[1.75]" />
                                            <span>Rename project</span>
                                          </button>

                                          {/* Edit description */}
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
                                            className="w-full px-3.5 py-2 text-left hover:bg-[#F8FAFC] flex items-center gap-2.5 text-[#334155] cursor-pointer"
                                          >
                                            <RefreshCw className="w-3.5 h-3.5 text-[#64748B] stroke-[1.75]" />
                                            <span>Edit description</span>
                                          </button>

                                          {/* change color > */}
                                          <div
                                            className="relative"
                                            onMouseEnter={() =>
                                              setIsColorSubmenuOpen(project.id)
                                            }
                                            onMouseLeave={() =>
                                              setIsColorSubmenuOpen(null)
                                            }
                                          >
                                            <button
                                              type="button"
                                              onClick={() =>
                                                setIsColorSubmenuOpen(
                                                  isColorSubmenuOpen === project.id
                                                    ? null
                                                    : project.id
                                                )
                                              }
                                              className="w-full px-3.5 py-2 text-left hover:bg-[#F8FAFC] flex items-center justify-between text-[#334155] cursor-pointer"
                                            >
                                              <div className="flex items-center gap-2.5">
                                                <Palette className="w-3.5 h-3.5 text-[#64748B] stroke-[1.75]" />
                                                <span>change color</span>
                                              </div>
                                              <ChevronRight className="w-3 h-3 text-[#94A3B8]" />
                                            </button>

                                            {/* Submenu with color dots from Image 1 */}
                                            {isColorSubmenuOpen === project.id && (
                                              <div className="absolute left-full top-0 ml-1 w-32 bg-white rounded-[5px] border border-[#E2E8F0] shadow-xl py-1 text-xs text-[#334155] animate-in fade-in z-50">
                                                {[
                                                  { label: "Blue", color: "#2563EB" },
                                                  { label: "Teal", color: "#0D9488" },
                                                  { label: "Yellow", color: "#F59E0B" },
                                                  { label: "Red", color: "#EF4444" },
                                                  { label: "Green", color: "#10B981" },
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
                                                    className="w-full px-3 py-1.5 text-left hover:bg-[#F8FAFC] flex items-center gap-2.5 cursor-pointer"
                                                  >
                                                    <span
                                                      className="w-2.5 h-2.5 rounded-full shrink-0"
                                                      style={{
                                                        backgroundColor: c.color,
                                                      }}
                                                    />
                                                    <span className="text-xs font-medium">
                                                      {c.label}
                                                    </span>
                                                  </button>
                                                ))}
                                              </div>
                                            )}
                                          </div>

                                          {/* Delete Permanently */}
                                          <button
                                            type="button"
                                            onClick={(e) =>
                                              handleDeleteProject(
                                                ws.id,
                                                project.id,
                                                e
                                              )
                                            }
                                            className="w-full px-3.5 py-2 text-left hover:bg-red-50 text-red-600 flex items-center gap-2.5 border-t border-[#F1F5F9] mt-1 cursor-pointer"
                                          >
                                            <Trash2 className="w-3.5 h-3.5 stroke-[1.75]" />
                                            <span>Delete Permanently</span>
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  {/* Card Body: Title, Description, Avatar Stack */}
                                  <div className="p-4 pb-2">
                                    <div className="flex items-start justify-between gap-2">
                                      <div className="flex-1 min-w-0">
                                        <h3 className="text-[16px] font-bold text-[#0F172A] leading-snug font-poppins truncate">
                                          {project.name}
                                        </h3>
                                        <p className="text-[11px] font-medium font-inter text-[#64748B] leading-relaxed mt-1 line-clamp-2">
                                          {project.description}
                                        </p>
                                      </div>

                                      {/* Member Avatars Stack */}
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

                                    {/* Task Counter */}
                                    <div className="flex items-center gap-1.5 text-xs font-medium font-inter text-[#64748B] mt-3">
                                      <CheckSquare className="w-3.5 h-3.5 text-[#64748B] stroke-[1.75]" />
                                      <span>
                                        Tasks: {project.tasksCompleted}/
                                        {project.tasksTotal}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {/* Card Bottom Subtask Carousel Bar */}
                                <div className="px-4 py-3 border-t border-[#F1F5F9] flex items-center justify-between gap-2">
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

                        {/* View All Projects Button (Centered below cards) */}
                        <div className="flex justify-center pt-2">
                          <button
                            type="button"
                            className="h-9 px-6 bg-white border border-[#E2E8F0] hover:bg-slate-50 text-[#334155] rounded-[5px] text-xs font-medium font-inter shadow-2xs transition-colors cursor-pointer"
                          >
                            View All Projects
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

          {/* ================= 3. CREATE WORKSPACE BUTTON (BOTTOM LEFT) ================= */}
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

      {/* ================= CREATE WORKSPACE MODAL (EXACT MATCH TO IMAGE 2) ================= */}
      {isCreateWorkspaceOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-[5px] shadow-2xl p-8 relative animate-in fade-in zoom-in-95">
            {/* Header: Title and Close X */}
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
              {/* Logo Upload Circle */}
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

              {/* Field 1: Workspace Name * */}
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

              {/* Field 2: Custom workspace URL */}
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

              {/* Field 3: Description */}
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

              {/* Full Width Submit Button */}
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

      {/* ================= CREATE PROJECT MODAL (EXACT MATCH TO IMAGES 3 & 4) ================= */}
      {isCreateProjectOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-[5px] shadow-2xl p-8 relative animate-in fade-in zoom-in-95">
            {/* Header: Title and Close X */}
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
              {/* Field 1: Project Name * */}
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

              {/* Field 2: Description */}
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

              {/* Field 3: Board */}
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

              {/* Field 4: Invite Member (Image 3 collapsed vs Image 4 expanded) */}
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

              {/* Full Width Submit Button */}
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

      {/* ================= EDIT PROJECT MODAL (RENAME / EDIT DESCRIPTION) ================= */}
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
