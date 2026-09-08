"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  Plus,
  Home,
  Settings,
  Star,
  MoreVertical,
  Trash2,
  Copy,
  Edit2,
  X,
  Check,
  Building2,
  FolderPlus,
  Sparkles,
  ArrowRight,
  User,
  LogOut,
  ChevronDown,
  Mail,
  Shield
} from "lucide-react";
import {
  getWorkspaces as getWorkspacesAction,
  createWorkspace as createWorkspaceAction,
  updateWorkspaceName as updateWorkspaceNameAction,
  createProject as createProjectAction,
  deleteProject as deleteProjectAction,
  deleteWorkspace as deleteWorkspaceAction,
} from "@/actions/workspace";

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  bannerColor: string;
  isFavorite: boolean;
  createdAt: string;
}

export interface WorkspaceItem {
  id: string;
  name: string;
  activeTab: "overview" | "settings";
  projects: ProjectItem[];
}

export default function OrbitaskHome() {
  // Search query
  const [searchQuery, setSearchQuery] = useState("");

  // Workspaces list with default initial sample workspace matching screenshot (3 projects)
  const [workspaces, setWorkspaces] = useState<WorkspaceItem[]>([
    {
      id: "ws-sample",
      name: "Sample Workspace",
      activeTab: "overview",
      projects: [
        {
          id: "proj-1",
          name: "Sample Project",
          description:
            "A sample project to help you explore tasks, boards, and team collaboration.",
          bannerColor: "#2563EB",
          isFavorite: false,
          createdAt: "2026-09-08",
        },
        {
          id: "proj-2",
          name: "xgdg",
          description:
            "A new project created to organize tasks and team workflows.",
          bannerColor: "#2563EB",
          isFavorite: false,
          createdAt: "2026-09-08",
        },
        {
          id: "proj-3",
          name: "adadf",
          description:
            "A new project created to organize tasks and team workflows.",
          bannerColor: "#2563EB",
          isFavorite: false,
          createdAt: "2026-09-08",
        },
      ],
    },
  ]);

  // Modals state
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [targetWorkspaceId, setTargetWorkspaceId] = useState<string | null>(null);
  const [isCreateWorkspaceOpen, setIsCreateWorkspaceOpen] = useState(false);
  const [activeMenuProjectId, setActiveMenuProjectId] = useState<string | null>(null);

  // Profile dropdown & modal states
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch workspaces from database if available on mount
  useEffect(() => {
    async function loadWorkspaces() {
      try {
        const res = await getWorkspacesAction();
        if (res?.success && res?.data && res.data.length > 0) {
          const dbWorkspaces: WorkspaceItem[] = res.data.map((w: any) => ({
            id: w.id,
            name: w.name,
            activeTab: "overview",
            projects: (w.projects || []).map((p: any) => ({
              id: p.id,
              name: p.name,
              description:
                p.description ||
                "A new project created to organize tasks and team workflows.",
              bannerColor: p.bannerColor || "#2563EB",
              isFavorite: p.isFavorite || false,
              createdAt: p.createdAt
                ? new Date(p.createdAt).toISOString()
                : new Date().toISOString(),
            })),
          }));
          setWorkspaces(dbWorkspaces);
        }
      } catch (err) {
        console.warn("Could not load from DB, continuing with initial state:", err);
      }
    }
    loadWorkspaces();
  }, []);

  // Form states
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDesc, setNewProjectDesc] = useState("");
  const [newProjectColor, setNewProjectColor] = useState("#2563EB");
  const [newWorkspaceName, setNewWorkspaceName] = useState("");

  // Handlers for Project
  const openCreateProjectModal = (workspaceId: string) => {
    setTargetWorkspaceId(workspaceId);
    setNewProjectName("");
    setNewProjectDesc("");
    setNewProjectColor("#2563EB");
    setIsCreateProjectOpen(true);
  };

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

  const handleDuplicateProject = (workspaceId: string, projectId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setWorkspaces((prev) =>
      prev.map((ws) => {
        if (ws.id !== workspaceId) return ws;
        const original = ws.projects.find((p) => p.id === projectId);
        if (!original) return ws;
        const duplicated: ProjectItem = {
          ...original,
          id: `proj-${Date.now()}`,
          name: `${original.name} (Copy)`,
        };
        return {
          ...ws,
          projects: [...ws.projects, duplicated],
        };
      })
    );
    setActiveMenuProjectId(null);
  };

  const handleCreateProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    const targetWsId = targetWorkspaceId || workspaces[0]?.id;
    if (!targetWsId) return;

    const newProj: ProjectItem = {
      id: `proj-${Date.now()}`,
      name: newProjectName.trim(),
      description:
        newProjectDesc.trim() ||
        "A new project created to organize tasks and team workflows.",
      bannerColor: newProjectColor,
      isFavorite: false,
      createdAt: new Date().toISOString(),
    };

    setWorkspaces((prev) =>
      prev.map((ws) =>
        ws.id === targetWsId
          ? { ...ws, projects: [...ws.projects, newProj] }
          : ws
      )
    );

    setIsCreateProjectOpen(false);
    setNewProjectName("");
    setNewProjectDesc("");

    try {
      await createProjectAction({
        workspaceId: targetWsId,
        name: newProj.name,
        description: newProj.description,
        bannerColor: newProj.bannerColor,
      });
    } catch (err) {
      console.warn("Project created locally, backend sync warning:", err);
    }
  };

  // Handlers for Workspace
  const handleCreateWorkspaceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWorkspaceName.trim()) return;

    const newWsId = `ws-${Date.now()}`;
    const wsName = newWorkspaceName.trim();

    const newWs: WorkspaceItem = {
      id: newWsId,
      name: wsName,
      activeTab: "overview",
      projects: [],
    };

    // New workspace appears directly below the existing ones
    setWorkspaces((prev) => [...prev, newWs]);
    setNewWorkspaceName("");
    setIsCreateWorkspaceOpen(false);

    try {
      const res = await createWorkspaceAction(wsName);
      if (res?.success && res.data?.id) {
        setWorkspaces((prev) =>
          prev.map((ws) => (ws.id === newWsId ? { ...ws, id: res.data.id } : ws))
        );
      }
    } catch (err) {
      console.warn("Workspace created locally, backend sync warning:", err);
    }
  };

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

  // Helper to filter projects for a workspace
  const getFilteredProjects = (ws: WorkspaceItem) => {
    if (!searchQuery.trim()) return ws.projects;
    const q = searchQuery.toLowerCase();
    return ws.projects.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  };

  // Target workspace name for create project modal title
  const targetWsObj = workspaces.find((w) => w.id === targetWorkspaceId) || workspaces[0];

  return (
    <div className="min-h-screen bg-white text-[#0F172A] font-sans antialiased flex flex-col selection:bg-blue-100 selection:text-blue-900">
      {/* ================= 1. TOP NAVBAR ================= */}
      <header className="w-full px-8 py-4 flex items-center justify-between border-b border-[#F1F5F9] bg-white sticky top-0 z-30">
        {/* Left: Brand Logo (Orbitask) */}
        <div className="flex items-center gap-1.5 select-none">
          <div className="relative flex items-center justify-center">
            {/* Custom SVG Orbit Logo Icon */}
            <svg
              className="w-9 h-9 text-[#0284C7]"
              viewBox="0 0 36 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
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
          <span className="text-[22px] font-bold tracking-tight text-[#0F172A] -ml-0.5 font-poppins">
            rbitask
          </span>
        </div>

        {/* Center: Search Field */}
        <div className="flex-1 max-w-[440px] mx-8">
          <div className="relative">
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2 stroke-[1.75]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects..."
              className="w-full h-10 pl-10 pr-4 bg-white border border-[#E2E8F0] rounded-[5px] text-xs font-medium font-inter text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-all"
            />
          </div>
        </div>

        {/* Right: Admin Profile with Clickable Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
            className="flex items-center gap-3 p-1.5 rounded-[5px] hover:bg-slate-100/70 transition-colors cursor-pointer"
            aria-expanded={isProfileDropdownOpen}
          >
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                alt="Bilal Khan"
                className="w-9 h-9 rounded-[5px] object-cover"
              />
              <span className="w-2.5 h-2.5 bg-[#3B82F6] rounded-full border-2 border-white absolute -top-1 -right-1 shadow-2xs" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-medium font-inter text-[#0F172A] leading-tight">
                Bilal Khan
              </span>
              <span className="text-[11px] font-medium font-inter text-[#94A3B8] leading-tight mt-0.5">
                Admin
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8] ml-0.5" />
          </button>

          {/* Profile Dropdown Menu */}
          {isProfileDropdownOpen && (
            <div className="absolute right-0 top-12 w-56 bg-white rounded-[5px] border border-[#E2E8F0] shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 text-xs font-medium font-inter text-[#334155]">
              <div className="p-3 border-b border-[#F1F5F9] flex items-center gap-3 bg-slate-50/50">
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                    alt="Bilal Khan"
                    className="w-10 h-10 rounded-[5px] object-cover"
                  />
                  <span className="w-2 h-2 bg-[#3B82F6] rounded-full border border-white absolute -top-0.5 -right-0.5" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-medium font-inter text-[#0F172A] leading-tight">
                    Bilal Khan
                  </span>
                  <span className="text-[11px] font-medium font-inter text-[#64748B] leading-tight mt-0.5">
                    Admin
                  </span>
                </div>
              </div>

              <div className="py-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsProfileDropdownOpen(false);
                    setIsProfileModalOpen(true);
                  }}
                  className="w-full px-3.5 py-2 text-left hover:bg-[#F8FAFC] flex items-center gap-2.5 text-[#334155] transition-colors cursor-pointer"
                >
                  <User className="w-4 h-4 text-[#64748B]" />
                  <span className="font-medium">My Profile</span>
                </button>
              </div>

              <div className="border-t border-[#F1F5F9]" />

              <div className="py-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsProfileDropdownOpen(false);
                    window.location.reload();
                  }}
                  className="w-full px-3.5 py-2 text-left hover:bg-red-50 text-red-600 flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-red-500" />
                  <span className="font-medium">Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* ================= 2. MAIN CONTENT (WORKSPACES STACKED) ================= */}
      <main className="flex-1 w-full px-8 md:px-12 pt-8 pb-16">
        <div className="space-y-12">
          {/* Loop over each Workspace */}
          {workspaces.map((ws) => {
            const filteredProjects = getFilteredProjects(ws);

            return (
              <section
                key={ws.id}
                className="space-y-6 pb-6 border-b border-[#F1F5F9] last:border-b-0"
              >
                {/* Workspace Header Bar */}
                <div className="flex items-center gap-8 flex-wrap">
                  {/* Workspace Icon & Name */}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-[5px] bg-blue-50/70 border border-blue-100 flex items-center justify-center text-[#0284C7] shadow-2xs">
                      <svg
                        className="w-5 h-5 text-[#0284C7]"
                        viewBox="0 0 32 32"
                        fill="none"
                      >
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
                    <h1 className="text-xl font-bold tracking-tight text-[#0F172A] font-poppins">
                      {ws.name}
                    </h1>
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
                      <Home className="w-4 h-4 stroke-[1.75]" />
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

                  {/* Action Button: Create Project (Aligned to the right) */}
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

                {/* OVERVIEW TAB: EXACT 3 PROJECTS PER LINE GRID */}
                {ws.activeTab === "overview" && (
                  <div className="pt-2">
                    {/* Grid with exactly 3 columns on lg:, 2 on md:, 1 on mobile */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* Existing Project Cards */}
                      {filteredProjects.map((project) => (
                        <div
                          key={project.id}
                          className="w-full h-[178px] min-h-[178px] rounded-[5px] bg-white border border-[#E2E8F0] shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden group relative flex flex-col"
                        >
                          {/* Topographic Wave Graphic Banner */}
                          <div
                            className="h-[76px] relative overflow-hidden flex items-start justify-end p-2.5 gap-1 shrink-0"
                            style={{ backgroundColor: project.bannerColor }}
                          >
                            {/* Topographic organic contour pattern */}
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
                                cx="260"
                                cy="30"
                                rx="20"
                                ry="8"
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
                              <ellipse
                                cx="85"
                                cy="42"
                                rx="22"
                                ry="10"
                                stroke="white"
                                strokeWidth="1.25"
                                fill="none"
                              />
                            </svg>

                            {/* Star project button */}
                            <button
                              type="button"
                              onClick={(e) => handleToggleFavorite(ws.id, project.id, e)}
                              className="relative z-10 p-1 text-white/90 hover:text-white transition-colors cursor-pointer rounded-[5px]"
                              title="Star project"
                            >
                              <Star
                                className={`w-3.5 h-3.5 stroke-[1.75] ${
                                  project.isFavorite ? "fill-amber-300 text-amber-300" : ""
                                }`}
                              />
                            </button>

                            {/* Menu button */}
                            <div className="relative">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveMenuProjectId(
                                    activeMenuProjectId === project.id ? null : project.id
                                  );
                                }}
                                className="relative z-10 p-1 text-white/90 hover:text-white transition-colors cursor-pointer rounded-[5px]"
                                title="Project options"
                              >
                                <MoreVertical className="w-3.5 h-3.5 stroke-[1.75]" />
                              </button>

                              {/* Dropdown Menu */}
                              {activeMenuProjectId === project.id && (
                                <div
                                  onClick={(e) => e.stopPropagation()}
                                  className="absolute right-0 top-7 w-44 bg-white rounded-[5px] border border-[#E2E8F0] shadow-xl z-20 py-1 text-xs text-[#334155] animate-in fade-in zoom-in-95"
                                >
                                  <button
                                    type="button"
                                    onClick={(e) => handleDuplicateProject(ws.id, project.id, e)}
                                    className="w-full px-3 py-2 text-left hover:bg-[#F8FAFC] flex items-center gap-2"
                                  >
                                    <Copy className="w-3.5 h-3.5 text-[#64748B]" />
                                    <span>Duplicate Project</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={(e) => handleDeleteProject(ws.id, project.id, e)}
                                    className="w-full px-3 py-2 text-left hover:bg-red-50 text-red-600 flex items-center gap-2 border-t border-[#F1F5F9] mt-1"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span>Delete Project</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Card Content */}
                          <div className="p-4 flex-1 flex flex-col justify-between overflow-hidden">
                            <div>
                              <h3 className="text-[15px] font-bold text-[#0F172A] leading-snug font-poppins truncate">
                                {project.name}
                              </h3>
                              <p className="text-[11px] font-medium font-inter text-[#64748B] leading-relaxed mt-2 line-clamp-3">
                                {project.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Add New Projects Empty State Dotted Card (4th or next position) */}
                      <button
                        type="button"
                        onClick={() => openCreateProjectModal(ws.id)}
                        className="w-full h-[178px] min-h-[178px] rounded-[5px] border-2 border-dashed border-[#CBD5E1] hover:border-[#2563EB] hover:bg-blue-50/20 flex flex-col items-center justify-center gap-2.5 transition-all duration-200 group cursor-pointer text-center bg-transparent"
                      >
                        <Plus className="w-5 h-5 text-[#64748B] group-hover:text-[#2563EB] group-hover:scale-110 transition-all stroke-[2]" />
                        <span className="text-xs font-medium font-inter text-[#475569] group-hover:text-[#2563EB] transition-colors">
                          Add New Projects
                        </span>
                      </button>
                    </div>
                  </div>
                )}

                {/* SETTINGS TAB: WORKSPACE SETTINGS PANEL */}
                {ws.activeTab === "settings" && (
                  <div className="max-w-2xl bg-white p-6 rounded-[5px] border border-[#E2E8F0] shadow-xs space-y-6">
                    <div>
                      <h2 className="text-base font-bold text-[#0F172A] font-poppins">
                        Workspace Settings
                      </h2>
                      <p className="text-xs font-medium font-inter text-[#64748B] mt-1">
                        Manage your workspace identity, name, and preferences.
                      </p>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-[#F1F5F9]">
                      <div>
                        <label className="block text-xs font-medium font-inter text-[#334155] mb-1.5">
                          Workspace Name
                        </label>
                        <input
                          type="text"
                          value={ws.name}
                          onChange={(e) => handleUpdateWorkspaceName(ws.id, e.target.value)}
                          className="w-full h-10 px-3.5 bg-white border border-[#CBD5E1] rounded-[5px] text-xs font-medium font-inter text-[#0F172A] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
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

          {/* ================= 3. CREATE WORKSPACE BUTTON (Directly below workspaces) ================= */}
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

      {/* ================= CREATE PROJECT MODAL ================= */}
      {isCreateProjectOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-[5px] shadow-2xl border border-[#E2E8F0] overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 border-b border-[#F1F5F9] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FolderPlus className="w-4 h-4 text-[#2563EB]" />
                <div>
                  <h3 className="text-sm font-medium font-inter text-[#0F172A]">
                    Create New Project
                  </h3>
                  {targetWsObj && (
                    <p className="text-[11px] font-medium font-inter text-[#64748B]">
                      in {targetWsObj.name}
                    </p>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateProjectOpen(false)}
                className="p-1 rounded-[5px] text-[#94A3B8] hover:text-[#0F172A] hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProjectSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium font-inter text-[#334155] mb-1.5">
                  Project Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Website Redesign, Mobile App"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="w-full h-10 px-3.5 border border-[#CBD5E1] rounded-[5px] text-xs font-medium font-inter text-[#0F172A] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium font-inter text-[#334155] mb-1.5">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Briefly describe what this project covers..."
                  value={newProjectDesc}
                  onChange={(e) => setNewProjectDesc(e.target.value)}
                  className="w-full p-3 border border-[#CBD5E1] rounded-[5px] text-xs font-medium font-inter text-[#0F172A] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium font-inter text-[#334155] mb-2">
                  Banner Color
                </label>
                <div className="flex items-center gap-3">
                  {[
                    "#2563EB", // Royal Blue (Default)
                    "#0284C7", // Cyan Blue
                    "#4F46E5", // Indigo
                    "#7C3AED", // Purple
                    "#059669", // Emerald
                    "#EA580C", // Orange
                  ].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setNewProjectColor(c)}
                      className={`w-7 h-7 rounded-full transition-transform flex items-center justify-center cursor-pointer ${
                        newProjectColor === c ? "scale-115 ring-2 ring-offset-2 ring-[#2563EB]" : "hover:scale-105"
                      }`}
                      style={{ backgroundColor: c }}
                    >
                      {newProjectColor === c && <Check className="w-3.5 h-3.5 text-white" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-[#F1F5F9]">
                <button
                  type="button"
                  onClick={() => setIsCreateProjectOpen(false)}
                  className="h-9 px-4 text-xs font-medium font-inter text-[#64748B] hover:text-[#0F172A] hover:bg-slate-50 rounded-[5px] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-9 px-5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-medium font-inter rounded-[5px] transition-colors shadow-xs cursor-pointer"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= CREATE WORKSPACE MODAL ================= */}
      {isCreateWorkspaceOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-[5px] shadow-2xl border border-[#E2E8F0] overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 border-b border-[#F1F5F9] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#2563EB]" />
                <h3 className="text-sm font-medium font-inter text-[#0F172A]">New Workspace</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateWorkspaceOpen(false)}
                className="p-1 rounded-[5px] text-[#94A3B8] hover:text-[#0F172A] hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateWorkspaceSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium font-inter text-[#334155] mb-1.5">
                  Workspace Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Design Studio, Marketing HQ"
                  value={newWorkspaceName}
                  onChange={(e) => setNewWorkspaceName(e.target.value)}
                  className="w-full h-10 px-3.5 border border-[#CBD5E1] rounded-[5px] text-xs font-medium font-inter text-[#0F172A] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#F1F5F9]">
                <button
                  type="button"
                  onClick={() => setIsCreateWorkspaceOpen(false)}
                  className="h-9 px-4 text-xs font-medium font-inter text-[#64748B] hover:text-[#0F172A] hover:bg-slate-50 rounded-[5px] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-9 px-5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-medium font-inter rounded-[5px] transition-colors shadow-xs cursor-pointer"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MY PROFILE MODAL ================= */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-[5px] shadow-2xl border border-[#E2E8F0] overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 border-b border-[#F1F5F9] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#2563EB]" />
                <h3 className="text-sm font-medium font-inter text-[#0F172A]">My Profile</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsProfileModalOpen(false)}
                className="p-1 rounded-[5px] text-[#94A3B8] hover:text-[#0F172A] hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-5 text-xs font-medium font-inter">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                    alt="Bilal Khan"
                    className="w-14 h-14 rounded-[5px] object-cover"
                  />
                  <span className="w-3 h-3 bg-[#3B82F6] rounded-full border-2 border-white absolute -top-1 -right-1 shadow-2xs" />
                </div>
                <div>
                  <h4 className="text-sm font-medium font-inter text-[#0F172A]">Bilal Khan</h4>
                  <p className="text-[#64748B] flex items-center gap-1.5 mt-0.5 text-[11px] font-medium font-inter">
                    <Shield className="w-3.5 h-3.5 text-[#2563EB]" />
                    Platform Admin
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-3 border-t border-[#F1F5F9]">
                <div>
                  <span className="text-[#94A3B8] block text-[11px] font-medium font-inter">Email Address</span>
                  <span className="font-medium font-inter text-[#0F172A] flex items-center gap-1.5 mt-0.5">
                    <Mail className="w-3.5 h-3.5 text-[#64748B]" />
                    bilalrauf.ds@gmail.com
                  </span>
                </div>
                <div>
                  <span className="text-[#94A3B8] block text-[11px] font-medium font-inter">Total Workspaces</span>
                  <span className="font-medium font-inter text-[#0F172A] flex items-center gap-1.5 mt-0.5">
                    <Building2 className="w-3.5 h-3.5 text-[#64748B]" />
                    {workspaces.length} Active Workspaces
                  </span>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsProfileModalOpen(false)}
                  className="h-9 px-4 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-medium font-inter text-xs rounded-[5px] transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
