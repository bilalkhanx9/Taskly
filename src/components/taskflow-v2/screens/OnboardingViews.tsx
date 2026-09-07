"use client";

import React, { useState } from "react";
import { User, Workspace, Project } from "@/types/taskflow-v2";
import { 
  Building2, 
  Users, 
  FolderPlus, 
  Check, 
  Copy, 
  ArrowRight, 
  Sparkles,
  Layers,
  Kanban,
  ListTodo,
  Calendar
} from "lucide-react";

interface OnboardingViewsProps {
  currentUser: User;
  onComplete: (workspace: Workspace, project: Project) => void;
  onNavigate: (screen: string) => void;
}

export const OnboardingViews: React.FC<OnboardingViewsProps> = ({
  currentUser,
  onComplete,
  onNavigate
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1: Workspace
  const [wsName, setWsName] = useState(currentUser.name ? `${currentUser.name}'s Workspace` : "My Workspace");
  const [wsSlug, setWsSlug] = useState(currentUser.name ? `${currentUser.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-hq` : "my-workspace");
  const [wsTimezone, setWsTimezone] = useState("Asia/Karachi (UTC+5)");

  // Step 2: Invite Team
  const [invites, setInvites] = useState([
    { email: "", role: "MANAGER" },
    { email: "", role: "MEMBER" }
  ]);
  const [copiedLink, setCopiedLink] = useState(false);

  // Step 3: First Project
  const [projName, setProjName] = useState("Brand Refresh 2026");
  const [projColor, setProjColor] = useState("#C2410C");
  const [projView, setProjView] = useState<"board" | "list" | "calendar">("board");

  const colorPalette = [
    "#C2410C", // Warm Orange
    "#1D4ED8", // Blue
    "#15803D", // Green
    "#7C3AED", // Violet
    "#B45309", // Amber
    "#0E7490"  // Cyan
  ];

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(`https://taskly.io/join/${wsSlug}-invite-token`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleFinish = () => {
    const createdWorkspace: Workspace = {
      id: `ws-${Date.now()}`,
      name: wsName,
      slug: wsSlug,
      timezone: wsTimezone,
      organisationId: currentUser.organisationId,
      ownerId: currentUser.id,
      memberCount: 3,
      createdAt: new Date().toISOString()
    };

    const createdProject: Project = {
      id: `proj-${Date.now()}`,
      workspaceId: createdWorkspace.id,
      name: projName,
      slug: projName.toLowerCase().replace(/\s+/g, "-"),
      description: "First project created during workspace onboarding.",
      color: projColor,
      status: "active",
      taskCount: 5,
      completedTaskCount: 1,
      members: [currentUser],
      deadline: "2026-10-31"
    };

    onComplete(createdWorkspace, createdProject);
  };

  return (
    <div className="min-h-screen bg-[var(--canvas)] flex flex-col justify-between text-[var(--ink)]">
      {/* Top Header */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-[var(--line)] bg-[var(--surface)]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[var(--accent-700)] flex items-center justify-center text-white font-bold text-base shadow-sm">
            TF
          </div>
          <span className="font-semibold text-lg tracking-tight">Taskly Setup</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-[var(--ink-muted)]">
          <span>Step {step} of 3</span>
          <div className="w-24 h-1.5 bg-[var(--surface-sunken)] rounded-full overflow-hidden">
            <div 
              className="h-full bg-[var(--accent-700)] transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>
      </header>

      {/* Main Form Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-4">
        <div className="w-full max-w-lg bg-[var(--surface)] border border-[var(--line)] rounded-xl shadow-sm p-6 sm:p-8">
          
          {/* STEP 1: CREATE WORKSPACE */}
          {step === 1 && (
            <div>
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-[var(--accent-700)] flex items-center justify-center mb-4">
                <Building2 className="w-5 h-5" />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-[var(--ink)]">Name your workspace</h1>
              <p className="text-xs text-[var(--ink-muted)] mt-1 mb-5">
                Workspaces house your organisation&apos;s teams, projects, and tasks.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[var(--ink-body)] uppercase tracking-wider mb-1.5">
                    Workspace Name
                  </label>
                  <input
                    type="text"
                    value={wsName}
                    onChange={(e) => {
                      setWsName(e.target.value);
                      setWsSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, "-"));
                    }}
                    placeholder="e.g. Acme Corporation"
                    className="w-full px-3 py-2 bg-[var(--surface)] border border-[var(--line-strong)] rounded-lg text-sm text-[var(--ink)] focus:outline-none focus:border-[var(--accent-600)] focus:ring-2 focus:ring-[var(--accent-50)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--ink-body)] uppercase tracking-wider mb-1.5">
                    Workspace URL
                  </label>
                  <div className="flex items-center text-xs bg-[var(--surface-sunken)] border border-[var(--line-strong)] rounded-lg overflow-hidden">
                    <span className="px-3 py-2 text-[var(--ink-muted)] bg-[var(--surface-inset)] border-r border-[var(--line)]">
                      taskly.io/w/
                    </span>
                    <input
                      type="text"
                      value={wsSlug}
                      onChange={(e) => setWsSlug(e.target.value)}
                      className="flex-1 px-3 py-2 bg-transparent text-[var(--ink)] focus:outline-none text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--ink-body)] uppercase tracking-wider mb-1.5">
                    Primary Timezone
                  </label>
                  <select
                    value={wsTimezone}
                    onChange={(e) => setWsTimezone(e.target.value)}
                    className="w-full px-3 py-2 bg-[var(--surface)] border border-[var(--line-strong)] rounded-lg text-sm text-[var(--ink)] focus:outline-none focus:border-[var(--accent-600)]"
                  >
                    <option value="Asia/Karachi (UTC+5)">Asia/Karachi (UTC+5)</option>
                    <option value="Asia/Dubai (UTC+4)">Asia/Dubai (UTC+4)</option>
                    <option value="Europe/London (UTC+1)">Europe/London (UTC+1)</option>
                    <option value="America/New_York (UTC-4)">America/New_York (UTC-4)</option>
                  </select>
                </div>

                <div className="pt-3 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="h-[38px] px-5 bg-[var(--accent-700)] hover:bg-[var(--accent-800)] text-white font-medium text-sm rounded-lg flex items-center gap-2 shadow-sm transition-all"
                  >
                    Next: Invite Team <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: INVITE TEAM */}
          {step === 2 && (
            <div>
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-[var(--accent-700)] flex items-center justify-center mb-4">
                <Users className="w-5 h-5" />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-[var(--ink)]">Invite your colleagues</h1>
              <p className="text-xs text-[var(--ink-muted)] mt-1 mb-5">
                Taskly works best with your team. Add their corporate email addresses below.
              </p>

              <div className="space-y-3 mb-5">
                {invites.map((inv, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <input
                      type="email"
                      placeholder="teammate@company.com"
                      value={inv.email}
                      onChange={(e) => {
                        const updated = [...invites];
                        updated[idx].email = e.target.value;
                        setInvites(updated);
                      }}
                      className="flex-1 px-3 py-2 bg-[var(--surface)] border border-[var(--line-strong)] rounded-lg text-xs text-[var(--ink)] focus:outline-none focus:border-[var(--accent-600)]"
                    />
                    <select
                      value={inv.role}
                      onChange={(e) => {
                        const updated = [...invites];
                        updated[idx].role = e.target.value;
                        setInvites(updated);
                      }}
                      className="w-28 px-2 py-2 bg-[var(--surface-sunken)] border border-[var(--line-strong)] rounded-lg text-xs text-[var(--ink)] focus:outline-none"
                    >
                      <option value="MANAGER">Manager</option>
                      <option value="MEMBER">Member</option>
                      <option value="VIEWER">Viewer</option>
                    </select>
                  </div>
                ))}
              </div>

              {/* Shareable Invite Link */}
              <div className="p-3 bg-[var(--surface-sunken)] border border-[var(--line)] rounded-lg mb-5 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-[var(--ink)]">Or share a join link</div>
                  <div className="text-[11px] text-[var(--ink-muted)]">Anyone with @{currentUser.email.split("@")[1] || "domain"} can join</div>
                </div>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="h-[32px] px-3 bg-[var(--surface)] border border-[var(--line-strong)] hover:border-[var(--ink-faint)] text-xs text-[var(--ink)] font-medium rounded-md flex items-center gap-1.5 transition-colors"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedLink ? "Copied" : "Copy Link"}
                </button>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="text-xs text-[var(--ink-muted)] hover:text-[var(--ink)] font-medium"
                >
                  Skip for now
                </button>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="h-[38px] px-4 border border-[var(--line-strong)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] text-xs font-medium text-[var(--ink)] rounded-lg"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="h-[38px] px-5 bg-[var(--accent-700)] hover:bg-[var(--accent-800)] text-white font-medium text-sm rounded-lg flex items-center gap-2 shadow-sm transition-all"
                  >
                    Next: First Project <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: CREATE FIRST PROJECT */}
          {step === 3 && (
            <div>
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-[var(--accent-700)] flex items-center justify-center mb-4">
                <FolderPlus className="w-5 h-5" />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-[var(--ink)]">Create your first project</h1>
              <p className="text-xs text-[var(--ink-muted)] mt-1 mb-5">
                Organise your deliverables, sprint milestones, or team roadmap.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[var(--ink-body)] uppercase tracking-wider mb-1.5">
                    Project Title
                  </label>
                  <input
                    type="text"
                    value={projName}
                    onChange={(e) => setProjName(e.target.value)}
                    placeholder="e.g. Website Redesign Q3"
                    className="w-full px-3 py-2 bg-[var(--surface)] border border-[var(--line-strong)] rounded-lg text-sm text-[var(--ink)] focus:outline-none focus:border-[var(--accent-600)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--ink-body)] uppercase tracking-wider mb-1.5">
                    Accent Colour
                  </label>
                  <div className="flex gap-2">
                    {colorPalette.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setProjColor(c)}
                        style={{ backgroundColor: c }}
                        className={`w-7 h-7 rounded-full border-2 transition-all flex items-center justify-center ${
                          projColor === c ? "border-[var(--ink)] scale-110 shadow-sm" : "border-transparent opacity-80 hover:opacity-100"
                        }`}
                      >
                        {projColor === c && <Check className="w-3.5 h-3.5 text-white" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--ink-body)] uppercase tracking-wider mb-1.5">
                    Default View
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setProjView("board")}
                      className={`p-3 rounded-lg border text-left flex flex-col gap-1 transition-all ${
                        projView === "board"
                          ? "border-[var(--accent-700)] bg-[var(--accent-50)] text-[var(--accent-800)] font-semibold"
                          : "border-[var(--line-strong)] bg-[var(--surface)] text-[var(--ink-body)]"
                      }`}
                    >
                      <Kanban className="w-4 h-4 text-[var(--accent-700)]" />
                      <span className="text-xs">Kanban</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setProjView("list")}
                      className={`p-3 rounded-lg border text-left flex flex-col gap-1 transition-all ${
                        projView === "list"
                          ? "border-[var(--accent-700)] bg-[var(--accent-50)] text-[var(--accent-800)] font-semibold"
                          : "border-[var(--line-strong)] bg-[var(--surface)] text-[var(--ink-body)]"
                      }`}
                    >
                      <ListTodo className="w-4 h-4 text-[var(--accent-700)]" />
                      <span className="text-xs">List</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setProjView("calendar")}
                      className={`p-3 rounded-lg border text-left flex flex-col gap-1 transition-all ${
                        projView === "calendar"
                          ? "border-[var(--accent-700)] bg-[var(--accent-50)] text-[var(--accent-800)] font-semibold"
                          : "border-[var(--line-strong)] bg-[var(--surface)] text-[var(--ink-body)]"
                      }`}
                    >
                      <Calendar className="w-4 h-4 text-[var(--accent-700)]" />
                      <span className="text-xs">Calendar</span>
                    </button>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="h-[38px] px-4 border border-[var(--line-strong)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] text-xs font-medium text-[var(--ink)] rounded-lg"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleFinish}
                    className="h-[38px] px-6 bg-[var(--accent-700)] hover:bg-[var(--accent-800)] text-white font-medium text-sm rounded-lg flex items-center gap-2 shadow-sm transition-all"
                  >
                    <Sparkles className="w-4 h-4" />
                    Launch Workspace
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-[var(--ink-muted)] border-t border-[var(--line)] bg-[var(--surface)]">
        Taskly Work Management System &copy; 2026. Built with Warm Stone aesthetic and role-based integrity.
      </footer>
    </div>
  );
};
