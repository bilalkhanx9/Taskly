"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Kanban,
  Calendar as CalendarIcon,
  Users,
  Shield,
  Clock,
  Command,
  Layers,
  ChevronDown,
  ChevronUp,
  Check,
  Building2,
  Lock,
  ListTodo,
  ExternalLink,
  PlayCircle
} from "lucide-react";

interface LandingPageViewProps {
  onGetStarted: () => void;
  onLogIn?: () => void;
  onSignIn?: () => void;
  onExploreDemo?: () => void;
}

export function LandingPageView({
  onGetStarted,
  onLogIn,
  onSignIn,
  onExploreDemo,
}: LandingPageViewProps) {
  // Navigation active tab / smooth scroll
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Preview tab switcher (Board, List, Calendar)
  const [previewTab, setPreviewTab] = useState<"board" | "list" | "calendar">("board");

  // Roles Showcase interactive state
  const [selectedRole, setSelectedRole] = useState<"owner" | "manager" | "member" | "viewer">("owner");

  // Pricing annual billing toggle
  const [isAnnual, setIsAnnual] = useState(false);

  // FAQ open index
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const roleDetails = {
    owner: {
      title: "Workspace Owner",
      badge: "Full Organization Control",
      landingRoute: "/w/:slug/home",
      description: "Company founders and directors who need complete visibility across projects, billing control, and team management.",
      features: [
        "Create, manage, and archive workspace projects",
        "Invite team members and assign/modify user roles",
        "Configure allowed email domains (e.g. @novastudio.pk)",
        "Inspect full security audit logs and workspace activity",
        "Manage billing plans and workspace settings"
      ],
      previewHeadline: "Workspace Home & Workload Balancing",
      previewStats: "4 Active Projects • 18 Open Deliverables • 0 Blockers"
    },
    manager: {
      title: "Project Manager",
      badge: "Sprint & Workload Lead",
      landingRoute: "/w/:slug/home",
      description: "Team leads and project managers who organize sprints, assign deliverables, balance capacity, and eliminate blockers.",
      features: [
        "Create deliverables, set priorities, and assign deadlines",
        "Monitor individual team capacity and workload ratios",
        "Track sprint velocity charts and status distributions",
        "Manage 5-column Kanban boards and structured list views",
        "Invite collaborators to specific project teams"
      ],
      previewHeadline: "Project Dashboard & Sprint Velocity",
      previewStats: "85% Sprint Velocity • Team Capacity: 74% Balanced"
    },
    member: {
      title: "Team Member",
      badge: "Focus & Execution Mode",
      landingRoute: "/w/:slug/my-tasks",
      description: "Designers, developers, and writers who need an uncluttered view of what they personally need to complete today.",
      features: [
        "Dedicated 'My Tasks' view split into Today, Upcoming, and Overdue",
        "Inline 1-click subtask checklist completion",
        "Instant task completion with a 5-second reversible Undo toast",
        "Rich comment discussions with team @mentions",
        "Drag and drop cards across Kanban stages"
      ],
      previewHeadline: "Personal 'My Tasks' Focus Board",
      previewStats: "3 Tasks Due Today • 2 In Review • All Caught Up"
    },
    viewer: {
      title: "Client & Stakeholder (Viewer)",
      badge: "Read-Only Milestone Visibility",
      landingRoute: "/w/:slug/projects",
      description: "External clients, executive stakeholders, or partners who need milestone progress without permission to alter work.",
      features: [
        "Real-time visual access to project boards and roadmaps",
        "Calendar view with delivery milestone dates",
        "Zero edit capability: task cards and statuses remain protected",
        "Inspect completed deliverables and project attachments",
        "Clean, professional client dashboard"
      ],
      previewHeadline: "Client Milestone Transparency View",
      previewStats: "Read-Only Mode Active • Live Status Updates"
    }
  };

  const faqs = [
    {
      q: "Why do I need a work email to sign up?",
      a: "Taskly is purpose-built for verified corporate organisations. Free generic webmail addresses (like @gmail.com or @yahoo.com) are restricted during registration so that your workspace domain automatically groups your team and prevents unauthorized external access."
    },
    {
      q: "Can I invite external clients or freelancers outside my organisation?",
      a: "Yes! While organization registration requires a work email, Workspace Owners and Managers can invite external contributors using the 'Viewer' role for clients (read-only visibility) or 'Member' for contracted specialists."
    },
    {
      q: "How does the workspace hierarchy work?",
      a: "An Organisation is identified by its verified corporate domain. Inside it, you can create multiple Workspaces (e.g. 'Engineering', 'Design', 'Marketing'). Workspaces contain Projects, and Projects hold Tasks with strictly 1-level Subtasks."
    },
    {
      q: "Why does Taskly limit subtasks to only one level?",
      a: "Deeply nested subtask trees create confusing mazes where progress cannot be trusted. By enforcing a single level of subtasks, team members get a clean checklist, managers get honest completion percentages, and nothing gets lost in the dark."
    },
    {
      q: "What happens when our team exceeds the free starter plan?",
      a: "The Starter plan is free forever for teams up to 5 members and 3 active projects. If you need unlimited projects, advanced analytics, custom label managers, and security audit logs, you can upgrade to Pro at any time with 1 click."
    },
    {
      q: "Can I export our project deliverables and data?",
      a: "Absolutely. All project data, task lists, comments, and audit logs can be exported in CSV and JSON formats at any time from Workspace Settings."
    }
  ];

  return (
    <div className="min-h-screen bg-[var(--canvas)] text-[var(--ink)] font-sans antialiased selection:bg-orange-100 selection:text-orange-900">
      
      {/* ========================================================================= */}
      {/* 1. NAVBAR — Taskly Branding & Navigation Links */}
      {/* ========================================================================= */}
      <header className="h-16 bg-white/90 backdrop-blur-md border-b border-[var(--line)] sticky top-0 z-40 px-6">
        <div className="max-w-6xl mx-auto h-full flex items-center justify-between">
          
          {/* Logo Mark: Taskly */}
          <div 
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <div className="w-8 h-8 rounded-lg bg-[var(--accent-700)] group-hover:bg-[var(--accent-600)] text-white font-bold flex items-center justify-center text-sm shadow-xs transition-colors">
              <span className="font-extrabold text-base tracking-tighter">T</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-extrabold text-xl tracking-tight text-[var(--ink)]">
                Taskly<span className="text-[var(--accent-700)]">.</span>
              </span>
              <span className="text-[10px] font-mono font-medium px-1.5 py-0.2 rounded bg-[var(--surface-sunken)] border border-[var(--line)] text-[var(--ink-muted)]">
                v2.0
              </span>
            </div>
          </div>

          {/* Center Navbar Links: Features, How it works, Roles, Pricing, FAQ */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-[var(--ink-muted)]">
            <a 
              href="#features" 
              onClick={(e) => handleNavClick(e, "features")} 
              className="hover:text-[var(--accent-700)] transition-colors py-1 relative hover:after:content-[''] hover:after:absolute hover:after:bottom-0 hover:after:left-0 hover:after:w-full hover:after:h-[2px] hover:after:bg-[var(--accent-700)]"
            >
              Features
            </a>
            <a 
              href="#how-it-works" 
              onClick={(e) => handleNavClick(e, "how-it-works")} 
              className="hover:text-[var(--accent-700)] transition-colors py-1 relative hover:after:content-[''] hover:after:absolute hover:after:bottom-0 hover:after:left-0 hover:after:w-full hover:after:h-[2px] hover:after:bg-[var(--accent-700)]"
            >
              How it works
            </a>
            <a 
              href="#roles" 
              onClick={(e) => handleNavClick(e, "roles")} 
              className="hover:text-[var(--accent-700)] transition-colors py-1 relative hover:after:content-[''] hover:after:absolute hover:after:bottom-0 hover:after:left-0 hover:after:w-full hover:after:h-[2px] hover:after:bg-[var(--accent-700)]"
            >
              Roles
            </a>
            <a 
              href="#pricing" 
              onClick={(e) => handleNavClick(e, "pricing")} 
              className="hover:text-[var(--accent-700)] transition-colors py-1 relative hover:after:content-[''] hover:after:absolute hover:after:bottom-0 hover:after:left-0 hover:after:w-full hover:after:h-[2px] hover:after:bg-[var(--accent-700)]"
            >
              Pricing
            </a>
            <a 
              href="#faq" 
              onClick={(e) => handleNavClick(e, "faq")} 
              className="hover:text-[var(--accent-700)] transition-colors py-1 relative hover:after:content-[''] hover:after:absolute hover:after:bottom-0 hover:after:left-0 hover:after:w-full hover:after:h-[2px] hover:after:bg-[var(--accent-700)]"
            >
              FAQ
            </a>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onLogIn || onSignIn}
              className="h-[38px] px-3.5 text-xs font-semibold text-[var(--ink)] hover:text-[var(--accent-700)] transition-colors"
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={onGetStarted}
              className="h-[38px] px-4 rounded-lg bg-[var(--accent-700)] hover:bg-[var(--accent-800)] text-white text-xs font-semibold shadow-xs transition-all flex items-center gap-1.5"
            >
              Get started free <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. HERO SECTION */}
      {/* ========================================================================= */}
      <section className="pt-16 pb-12 md:pt-24 md:pb-16 px-6 text-center max-w-4xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--accent-50)] border border-[var(--accent-100)] text-[var(--accent-800)] text-xs font-semibold shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-[var(--accent-700)]" />
          <span>Taskly Version 2.0 is live • Built on Warm Stone aesthetics</span>
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-[var(--ink)] tracking-tight leading-tight">
          Where teams know who is doing what, and when it is due.
        </h1>

        <p className="text-sm md:text-base text-[var(--ink-body)] max-w-2xl mx-auto leading-relaxed">
          No scattered WhatsApp threads, no forgotten spreadsheet rows. Taskly replaces chaos with one unified workspace designed with warm stone surfaces, sub-second keyboard shortcuts, and strict role permissions.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
          <button
            type="button"
            onClick={onGetStarted}
            className="w-full sm:w-auto h-[44px] px-6 rounded-lg bg-[var(--accent-700)] hover:bg-[var(--accent-800)] text-white text-sm font-semibold shadow-sm flex items-center justify-center gap-2 transition-all"
          >
            Start free workspace <ArrowRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onExploreDemo}
            className="w-full sm:w-auto h-[44px] px-5 rounded-lg bg-[var(--surface)] border border-[var(--line-strong)] hover:bg-[var(--surface-hover)] text-[var(--ink)] text-sm font-semibold flex items-center justify-center gap-2 transition-colors shadow-2xs"
          >
            <PlayCircle className="w-4 h-4 text-[var(--accent-700)]" />
            Explore interactive demo
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-[var(--ink-muted)] pt-3">
          <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600" /> Verified corporate email</span>
          <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600" /> Free for teams up to 5</span>
          <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600" /> Set up in 60 seconds</span>
        </div>

        {/* Customer Social Proof Badges */}
        <div className="pt-10 border-t border-[var(--line)]">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--ink-muted)] mb-4">
            Trusted by 400+ fast-moving product and engineering squads
          </div>
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-70 grayscale hover:grayscale-0 transition-all text-xs font-bold text-[var(--ink-body)]">
            <span className="flex items-center gap-1.5">⚡ Nova Studio PK</span>
            <span className="flex items-center gap-1.5">💳 FinTech PK Solutions</span>
            <span className="flex items-center gap-1.5">🌐 Nexus Core</span>
            <span className="flex items-center gap-1.5">☁️ CloudScale Dynamics</span>
            <span className="flex items-center gap-1.5">🚀 DevSphere Labs</span>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. PRODUCT PREVIEW — Interactive Kanban / List / Calendar Mockup */}
      {/* ========================================================================= */}
      <section className="px-6 max-w-5xl mx-auto pb-20">
        <div className="bg-[var(--surface)] rounded-2xl border border-[var(--line-strong)] shadow-xl overflow-hidden">
          
          {/* Mock Browser Header */}
          <div className="h-11 bg-[var(--surface-sunken)] border-b border-[var(--line)] px-4 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-400/80" />
              <span className="w-3 h-3 rounded-full bg-amber-400/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-400/80" />
              <span className="font-mono text-[11px] text-[var(--ink-muted)] ml-2 bg-[var(--surface)] px-2.5 py-0.5 rounded border border-[var(--line)]">
                app.taskly.io/w/nova-studio/brand-refresh
              </span>
            </div>

            <div className="flex items-center gap-1 bg-[var(--surface)] p-0.5 rounded-lg border border-[var(--line)]">
              <button
                type="button"
                onClick={() => setPreviewTab("board")}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-colors ${
                  previewTab === "board" ? "bg-[var(--accent-50)] text-[var(--accent-700)]" : "text-[var(--ink-muted)]"
                }`}
              >
                Board
              </button>
              <button
                type="button"
                onClick={() => setPreviewTab("list")}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-colors ${
                  previewTab === "list" ? "bg-[var(--accent-50)] text-[var(--accent-700)]" : "text-[var(--ink-muted)]"
                }`}
              >
                List
              </button>
              <button
                type="button"
                onClick={() => setPreviewTab("calendar")}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-colors ${
                  previewTab === "calendar" ? "bg-[var(--accent-50)] text-[var(--accent-700)]" : "text-[var(--ink-muted)]"
                }`}
              >
                Calendar
              </button>
            </div>
          </div>

          {/* Mock Content based on active tab */}
          <div className="p-6 bg-[var(--canvas)]">
            {previewTab === "board" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Column 1: To Do */}
                <div className="bg-[var(--surface)] p-4 rounded-xl border border-[var(--line)] space-y-3 shadow-2xs">
                  <div className="flex items-center justify-between text-xs font-bold text-[var(--ink)]">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-slate-500" /> To Do
                    </span>
                    <span className="px-1.5 py-0.2 rounded bg-[var(--surface-sunken)] text-[10px] text-[var(--ink-muted)]">2</span>
                  </div>
                  <div className="p-3 rounded-lg border border-[var(--line)] border-l-4 border-l-amber-500 bg-[var(--surface)] space-y-2 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded">High</span>
                      <span className="text-[10px] text-[var(--ink-muted)]">Sep 15</span>
                    </div>
                    <p className="text-xs font-semibold text-[var(--ink)]">Figma Component Tokens &amp; Button Scale</p>
                    <div className="flex items-center justify-between text-[10px] text-[var(--ink-muted)] pt-1 border-t border-[var(--line)]">
                      <span>✓ 2/3 subtasks</span>
                      <span className="w-4 h-4 rounded-full bg-orange-100 text-[var(--accent-700)] flex items-center justify-center font-bold text-[9px]">A</span>
                    </div>
                  </div>
                </div>

                {/* Column 2: In Progress */}
                <div className="bg-[var(--surface)] p-4 rounded-xl border border-[var(--line)] space-y-3 shadow-2xs">
                  <div className="flex items-center justify-between text-xs font-bold text-[var(--accent-700)]">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[var(--accent-700)]" /> In Progress
                    </span>
                    <span className="px-1.5 py-0.2 rounded bg-[var(--accent-50)] text-[10px] text-[var(--accent-800)] font-bold">1</span>
                  </div>
                  <div className="p-3 rounded-lg border border-[var(--line)] border-l-4 border-l-[var(--accent-700)] bg-[var(--surface)] space-y-2 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase text-[var(--accent-700)] bg-[var(--accent-50)] px-1.5 py-0.2 rounded">Urgent</span>
                      <span className="text-[10px] text-orange-700 font-bold">Tomorrow</span>
                    </div>
                    <p className="text-xs font-semibold text-[var(--ink)]">Deploy Taskly v2.0 Warm Stone UI</p>
                    <div className="flex items-center justify-between text-[10px] text-[var(--ink-muted)] pt-1 border-t border-[var(--line)]">
                      <span>✓ 4/4 subtasks</span>
                      <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[9px]">Z</span>
                    </div>
                  </div>
                </div>

                {/* Column 3: Done */}
                <div className="bg-[var(--surface)] p-4 rounded-xl border border-[var(--line)] space-y-3 shadow-2xs">
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-700">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-600" /> Done
                    </span>
                    <span className="px-1.5 py-0.2 rounded bg-emerald-50 text-[10px] text-emerald-800 font-bold">4</span>
                  </div>
                  <div className="p-3 rounded-lg border border-[var(--line)] border-l-4 border-l-emerald-600 bg-[var(--surface)] space-y-2 shadow-2xs opacity-90">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">Done</span>
                      <span className="text-[10px] text-[var(--ink-muted)]">Delivered</span>
                    </div>
                    <p className="text-xs font-semibold text-[var(--ink)] line-through text-[var(--ink-muted)]">Work Email Authentication Guard</p>
                    <div className="flex items-center justify-between text-[10px] text-[var(--ink-muted)] pt-1 border-t border-[var(--line)]">
                      <span>✓ 100% complete</span>
                      <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[9px]">T</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {previewTab === "list" && (
              <div className="bg-[var(--surface)] rounded-xl border border-[var(--line)] overflow-hidden text-xs">
                <div className="bg-[var(--surface-sunken)] px-4 py-2 border-b border-[var(--line)] font-bold text-[10px] uppercase text-[var(--ink-muted)] flex justify-between">
                  <span>Task Title</span>
                  <span>Status &amp; Priority</span>
                </div>
                <div className="divide-y divide-[var(--line)]">
                  <div className="p-3 flex items-center justify-between">
                    <span className="font-semibold text-[var(--ink)]">Figma Component Tokens &amp; Button Scale</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">High</span>
                  </div>
                  <div className="p-3 flex items-center justify-between bg-orange-50/20">
                    <span className="font-semibold text-[var(--ink)]">Deploy Taskly v2.0 Warm Stone UI</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[var(--accent-50)] text-[var(--accent-700)] border border-orange-200">In Progress</span>
                  </div>
                  <div className="p-3 flex items-center justify-between">
                    <span className="font-semibold text-[var(--ink-muted)] line-through">Work Email Authentication Guard</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">Done</span>
                  </div>
                </div>
              </div>
            )}

            {previewTab === "calendar" && (
              <div className="bg-[var(--surface)] p-4 rounded-xl border border-[var(--line)] text-center space-y-3">
                <div className="text-xs font-bold text-[var(--ink)]">September 2026 Deliverables Grid</div>
                <div className="grid grid-cols-7 gap-1 text-[11px] font-semibold text-[var(--ink-muted)]">
                  <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
                </div>
                <div className="grid grid-cols-7 gap-1 text-xs">
                  {Array.from({ length: 14 }).map((_, i) => (
                    <div key={i} className={`p-2 rounded border border-[var(--line)] text-left min-h-[50px] ${i === 7 ? "bg-[var(--accent-50)] border-[var(--accent-500)]" : "bg-[var(--surface-sunken)]"}`}>
                      <span className="font-bold text-[10px] text-[var(--ink)]">{i + 1}</span>
                      {i === 7 && <span className="block mt-1 text-[9px] bg-[var(--accent-700)] text-white px-1 py-0.2 rounded font-bold truncate">Launch v2</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. SECTION: FEATURES (id="features") */}
      {/* ========================================================================= */}
      <section id="features" className="py-20 bg-[var(--surface)] border-t border-[var(--line)] px-6 scroll-mt-16">
        <div className="max-w-6xl mx-auto space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-[var(--accent-700)]">
              Core Capabilities
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[var(--ink)] tracking-tight">
              Crafted for serious engineering &amp; design squads
            </h2>
            <p className="text-xs sm:text-sm text-[var(--ink-muted)] leading-relaxed">
              Every pixel, interaction, and button height is engineered to make work visible in 5 seconds without decorative clutter.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Feature 1 */}
            <div className="p-6 rounded-xl border border-[var(--line)] bg-[var(--canvas)] hover:border-[var(--accent-600)] transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-[var(--accent-700)] flex items-center justify-center font-bold">
                <Kanban className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[var(--ink)]">5-Column Kanban Board</h3>
              <p className="text-xs text-[var(--ink-body)] leading-relaxed">
                Backlog, To Do, In Progress, In Review, and Done. Shift cards between stages effortlessly with priority border indicators and quick column additions.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-xl border border-[var(--line)] bg-[var(--canvas)] hover:border-[var(--accent-600)] transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <ListTodo className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[var(--ink)]">1-Level Subtasks (Honest Progress)</h3>
              <p className="text-xs text-[var(--ink-body)] leading-relaxed">
                Say goodbye to unreadable infinite trees. One level of subtasks provides clear checklists with verifiable completion percentages you can trust.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-xl border border-[var(--line)] bg-[var(--canvas)] hover:border-[var(--accent-600)] transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[var(--ink)]">Dual Shell Architecture</h3>
              <p className="text-xs text-[var(--ink-body)] leading-relaxed">
                Workspaces for teams (Shell A) and Platform Administration (Shell B) are completely segregated with a distinct dark top bar (`#1C1917`) for administrators.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-xl border border-[var(--line)] bg-[var(--canvas)] hover:border-[var(--accent-600)] transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                <Command className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[var(--ink)]">Keyboard-First Productivity</h3>
              <p className="text-xs text-[var(--ink-body)] leading-relaxed">
                Instant search with <kbd className="px-1.5 py-0.2 bg-[var(--surface)] border rounded text-[10px] font-mono">⌘K</kbd> / <kbd className="px-1.5 py-0.2 bg-[var(--surface)] border rounded text-[10px] font-mono">Ctrl+K</kbd> across all tasks and projects, and press <kbd className="px-1.5 py-0.2 bg-[var(--surface)] border rounded text-[10px] font-mono">N</kbd> for sub-5-second task creation.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-xl border border-[var(--line)] bg-[var(--canvas)] hover:border-[var(--accent-600)] transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center font-bold">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[var(--ink)]">Nothing Slips Deadlines</h3>
              <p className="text-xs text-[var(--ink-body)] leading-relaxed">
                Visual urgency tags (Urgent, High, Medium, Low), automated reminders before milestones, and unmissable overdue alert banners.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-xl border border-[var(--line)] bg-[var(--canvas)] hover:border-[var(--accent-600)] transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[var(--ink)]">Zero-Overlay Button Scale</h3>
              <p className="text-xs text-[var(--ink-body)] leading-relaxed">
                Strict button heights (`xs`: 26px, `sm`: 32px, `md`: 38px, `lg`: 44px) ensure no forms ever overlay or wrap awkwardly across any device.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. SECTION: HOW IT WORKS (id="how-it-works") */}
      {/* ========================================================================= */}
      <section id="how-it-works" className="py-20 px-6 max-w-6xl mx-auto space-y-12 scroll-mt-16">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-[var(--accent-700)]">
            Streamlined Onboarding
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[var(--ink)] tracking-tight">
            How Taskly works in 3 simple steps
          </h2>
          <p className="text-xs sm:text-sm text-[var(--ink-muted)]">
            From work email verification to full team velocity in under 2 minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Step 1 */}
          <div className="bg-[var(--surface)] p-6 rounded-xl border border-[var(--line)] space-y-4 shadow-sm relative">
            <div className="w-10 h-10 rounded-full bg-[var(--accent-50)] text-[var(--accent-700)] border border-[var(--accent-100)] flex items-center justify-center font-extrabold text-base">
              1
            </div>
            <h3 className="text-base font-bold text-[var(--ink)]">Create your workspace</h3>
            <p className="text-xs text-[var(--ink-body)] leading-relaxed">
              Sign up with your corporate email domain (e.g. <span className="font-mono text-[var(--accent-700)]">@novastudio.pk</span>), verify with a 6-digit code, and establish your team&apos;s custom workspace URL in seconds.
            </p>
            <div className="pt-2 text-[11px] text-[var(--ink-muted)] font-mono bg-[var(--surface-sunken)] p-2 rounded border border-[var(--line)]">
              taskly.io/w/your-team
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-[var(--surface)] p-6 rounded-xl border border-[var(--line)] space-y-4 shadow-sm relative">
            <div className="w-10 h-10 rounded-full bg-[var(--accent-50)] text-[var(--accent-700)] border border-[var(--accent-100)] flex items-center justify-center font-extrabold text-base">
              2
            </div>
            <h3 className="text-base font-bold text-[var(--ink)]">Add projects &amp; invite team</h3>
            <p className="text-xs text-[var(--ink-body)] leading-relaxed">
              Organise work into distinct projects with color codes and target deadlines. Invite developers, designers, and managers with appropriate access roles.
            </p>
            <div className="pt-2 text-[11px] text-[var(--ink-muted)] font-mono bg-[var(--surface-sunken)] p-2 rounded border border-[var(--line)]">
              + Brand Refresh • Mobile Client
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-[var(--surface)] p-6 rounded-xl border border-[var(--line)] space-y-4 shadow-sm relative">
            <div className="w-10 h-10 rounded-full bg-[var(--accent-50)] text-[var(--accent-700)] border border-[var(--accent-100)] flex items-center justify-center font-extrabold text-base">
              3
            </div>
            <h3 className="text-base font-bold text-[var(--ink)]">Assign, ship &amp; hit deadlines</h3>
            <p className="text-xs text-[var(--ink-body)] leading-relaxed">
              Team members focus on their personalized &ldquo;My Tasks&rdquo; queue, managers balance capacity without asking for status, and founders track delivery rate.
            </p>
            <div className="pt-2 text-[11px] text-emerald-700 font-bold bg-emerald-50 p-2 rounded border border-emerald-200">
              ✓ 100% On-Time Delivery
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. SECTION: ROLES (id="roles") — Interactive Role Showcase */}
      {/* ========================================================================= */}
      <section id="roles" className="py-20 bg-[var(--surface)] border-t border-[var(--line)] px-6 scroll-mt-16">
        <div className="max-w-5xl mx-auto space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-[var(--accent-700)]">
              Role-Based Architecture (Section 3.1 &amp; 7.1.8)
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[var(--ink)] tracking-tight">
              Roles that make sense for every teammate
            </h2>
            <p className="text-xs sm:text-sm text-[var(--ink-muted)]">
              Owners plan, managers assign, members execute, and clients watch. Nobody sees more or less than they need.
            </p>
          </div>

          {/* Role Navigation Tabs */}
          <div className="flex justify-center">
            <div className="inline-flex p-1 bg-[var(--surface-sunken)] border border-[var(--line)] rounded-xl gap-1">
              {(["owner", "manager", "member", "viewer"] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setSelectedRole(r)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    selectedRole === r
                      ? "bg-[var(--surface)] text-[var(--accent-700)] shadow-xs"
                      : "text-[var(--ink-muted)] hover:text-[var(--ink)]"
                  }`}
                >
                  {roleDetails[r].title}
                </button>
              ))}
            </div>
          </div>

          {/* Role Showcase Display Panel */}
          <div className="bg-[var(--canvas)] border border-[var(--line)] rounded-2xl p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center shadow-sm">
            {/* Left Column: Details & Capabilities */}
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[var(--accent-50)] text-[var(--accent-700)] border border-[var(--accent-200)]">
                {roleDetails[selectedRole].badge}
              </div>
              <h3 className="text-2xl font-bold text-[var(--ink)]">
                {roleDetails[selectedRole].title}
              </h3>
              <p className="text-xs text-[var(--ink-body)] leading-relaxed">
                {roleDetails[selectedRole].description}
              </p>

              <div className="pt-2 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--ink-muted)] block">
                  Permissions &amp; Capabilities:
                </span>
                {roleDetails[selectedRole].features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-[var(--ink)]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 text-xs text-[var(--ink-muted)]">
                <strong>Landing Route:</strong> <code className="text-[11px] font-mono bg-[var(--surface)] px-2 py-0.5 rounded border border-[var(--line)]">{roleDetails[selectedRole].landingRoute}</code>
              </div>
            </div>

            {/* Right Column: Interactive Role Mockup Card */}
            <div className="bg-[var(--surface)] border border-[var(--line-strong)] rounded-xl p-6 shadow-md space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
                <div className="font-bold text-xs text-[var(--ink)]">
                  {roleDetails[selectedRole].previewHeadline}
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>

              <div className="p-3 bg-[var(--surface-sunken)] rounded-lg text-xs font-medium text-[var(--ink)] border border-[var(--line)]">
                {roleDetails[selectedRole].previewStats}
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded bg-[var(--surface)] border border-[var(--line)] flex items-center justify-between">
                  <span className="font-medium text-[var(--ink)]">Figma Design Token Migration</span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">Done</span>
                </div>
                <div className="p-2.5 rounded bg-[var(--surface)] border border-[var(--line)] flex items-center justify-between">
                  <span className="font-medium text-[var(--ink)]">Sprint Velocity Review</span>
                  <span className="text-[10px] font-bold text-[var(--accent-700)] bg-[var(--accent-50)] px-1.5 py-0.2 rounded">In Progress</span>
                </div>
              </div>

              <button
                type="button"
                onClick={onExploreDemo}
                className="w-full h-[34px] bg-[var(--accent-700)] hover:bg-[var(--accent-800)] text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors flex items-center justify-center gap-1.5"
              >
                Test {roleDetails[selectedRole].title} Live <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. SECTION: PRICING (id="pricing") */}
      {/* ========================================================================= */}
      <section id="pricing" className="py-20 px-6 max-w-6xl mx-auto space-y-12 scroll-mt-16">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-[var(--accent-700)]">
            Simple, Transparent Pricing
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[var(--ink)] tracking-tight">
            Predictable plans for growing teams
          </h2>
          <p className="text-xs sm:text-sm text-[var(--ink-muted)]">
            Start for free with your work email. Upgrade when your team expands.
          </p>

          {/* Billing Switcher */}
          <div className="flex items-center justify-center gap-3 pt-3">
            <span className={`text-xs font-semibold ${!isAnnual ? "text-[var(--ink)]" : "text-[var(--ink-muted)]"}`}>
              Monthly billing
            </span>
            <button
              type="button"
              onClick={() => setIsAnnual(!isAnnual)}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                isAnnual ? "bg-[var(--accent-700)]" : "bg-[var(--line-strong)]"
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${isAnnual ? "translate-x-5" : "translate-x-0"}`} />
            </button>
            <span className={`text-xs font-semibold flex items-center gap-1.5 ${isAnnual ? "text-[var(--ink)]" : "text-[var(--ink-muted)]"}`}>
              Annual billing
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-full">
                Save 20%
              </span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          
          {/* Plan 1: Free Starter */}
          <div className="bg-[var(--surface)] p-6 rounded-xl border border-[var(--line)] space-y-6 flex flex-col justify-between shadow-2xs">
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-[var(--ink)]">Free Starter</h3>
                <p className="text-xs text-[var(--ink-muted)] mt-1">Best for small teams and founders starting out.</p>
              </div>
              <div>
                <span className="text-3xl font-extrabold text-[var(--ink)]">$0</span>
                <span className="text-xs text-[var(--ink-muted)]"> / user / month</span>
              </div>
              <div className="pt-2 border-t border-[var(--line)] space-y-2.5 text-xs text-[var(--ink-body)]">
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Up to 5 team members</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> 3 active workspace projects</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Kanban board &amp; list views</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> 1-level subtasks checklist</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Community support</div>
              </div>
            </div>
            <button
              type="button"
              onClick={onGetStarted}
              className="w-full h-[38px] rounded-lg border border-[var(--line-strong)] hover:bg-[var(--surface-hover)] text-xs font-semibold text-[var(--ink)] transition-colors"
            >
              Get started free
            </button>
          </div>

          {/* Plan 2: Pro Workspace (Recommended) */}
          <div className="bg-[var(--surface)] p-6 rounded-xl border-2 border-[var(--accent-700)] space-y-6 flex flex-col justify-between relative shadow-lg">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[var(--accent-700)] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full shadow-xs">
              MOST POPULAR
            </span>
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-[var(--ink)]">Pro Workspace</h3>
                <p className="text-xs text-[var(--ink-muted)] mt-1">For growing teams requiring full scale and metrics.</p>
              </div>
              <div>
                <span className="text-3xl font-extrabold text-[var(--accent-700)]">
                  ${isAnnual ? "9.60" : "12"}
                </span>
                <span className="text-xs text-[var(--ink-muted)]"> / user / month</span>
              </div>
              <div className="pt-2 border-t border-[var(--line)] space-y-2.5 text-xs text-[var(--ink-body)]">
                <div className="flex items-center gap-2 font-semibold text-[var(--ink)]"><Check className="w-4 h-4 text-emerald-600" /> Unlimited workspace projects</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Team workload capacity analytics</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Custom labels manager</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Full calendar &amp; sprint velocity reports</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Priority email &amp; Discord support</div>
              </div>
            </div>
            <button
              type="button"
              onClick={onGetStarted}
              className="w-full h-[38px] rounded-lg bg-[var(--accent-700)] hover:bg-[var(--accent-800)] text-white text-xs font-semibold shadow-sm transition-colors"
            >
              Start 14-day free Pro trial
            </button>
          </div>

          {/* Plan 3: Enterprise */}
          <div className="bg-[var(--surface)] p-6 rounded-xl border border-[var(--line)] space-y-6 flex flex-col justify-between shadow-2xs">
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-[var(--ink)]">Enterprise</h3>
                <p className="text-xs text-[var(--ink-muted)] mt-1">For organizations with strict compliance &amp; SSO.</p>
              </div>
              <div>
                <span className="text-3xl font-extrabold text-[var(--ink)]">
                  ${isAnnual ? "24" : "29"}
                </span>
                <span className="text-xs text-[var(--ink-muted)]"> / user / month</span>
              </div>
              <div className="pt-2 border-t border-[var(--line)] space-y-2.5 text-xs text-[var(--ink-body)]">
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Custom email domain enforcement</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Security audit trail &amp; export logs</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Dedicated 99.98% uptime SLA</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Single Sign-On (SAML / Okta)</div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Dedicated account manager</div>
              </div>
            </div>
            <button
              type="button"
              onClick={onGetStarted}
              className="w-full h-[38px] rounded-lg border border-[var(--line-strong)] hover:bg-[var(--surface-hover)] text-xs font-semibold text-[var(--ink)] transition-colors"
            >
              Contact Enterprise Sales
            </button>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. SECTION: FAQ (id="faq") */}
      {/* ========================================================================= */}
      <section id="faq" className="py-20 bg-[var(--surface)] border-t border-[var(--line)] px-6 scroll-mt-16">
        <div className="max-w-3xl mx-auto space-y-8">
          
          <div className="text-center space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-[var(--accent-700)]">
              Got Questions?
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--ink)] tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-[var(--ink-muted)]">
              Everything you need to know about Taskly workspaces, roles, and security.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="border border-[var(--line)] rounded-xl overflow-hidden bg-[var(--surface)] transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-4 text-left text-xs font-bold text-[var(--ink)] flex items-center justify-between hover:bg-[var(--surface-hover)] transition-colors"
                >
                  <span className="pr-4">{faq.q}</span>
                  {openFaq === idx ? (
                    <ChevronUp className="w-4 h-4 text-[var(--accent-700)] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[var(--ink-muted)] shrink-0" />
                  )}
                </button>
                {openFaq === idx && (
                  <div className="p-4 pt-0 text-xs text-[var(--ink-body)] leading-relaxed border-t border-[var(--line)] bg-[var(--canvas)]">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. SECTION: FINAL CTA BANNER */}
      {/* ========================================================================= */}
      <section className="py-16 bg-[var(--accent-50)] border-t border-b border-[var(--accent-100)] px-6 text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--ink)] tracking-tight">
            Ready to bring clarity and speed to your team?
          </h2>
          <p className="text-xs sm:text-sm text-[var(--ink-body)] max-w-xl mx-auto">
            Set up your organization workspace in 60 seconds. Free forever for teams up to 5 with no credit card required.
          </p>
          <div className="pt-2 flex justify-center">
            <button
              type="button"
              onClick={onGetStarted}
              className="h-[44px] px-6 rounded-lg bg-[var(--accent-700)] hover:bg-[var(--accent-800)] text-white text-sm font-semibold shadow-sm flex items-center gap-2 transition-all"
            >
              Start Free with Taskly <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 10. SECTION: FOOTER */}
      {/* ========================================================================= */}
      <footer className="bg-[var(--canvas)] border-t border-[var(--line)] py-12 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8 text-xs">
          
          {/* Col 1: Brand Info */}
          <div className="col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[var(--accent-700)] text-white font-bold flex items-center justify-center text-xs">
                T
              </div>
              <span className="font-extrabold text-lg tracking-tight text-[var(--ink)]">
                Taskly<span className="text-[var(--accent-700)]">.</span>
              </span>
            </div>
            <p className="text-xs text-[var(--ink-muted)] max-w-sm leading-relaxed">
              Taskly is a work management system built for verified corporate teams to plan deliverables, balance capacity, and ship on time.
            </p>
            <div className="text-[11px] text-[var(--ink-faint)]">
              Designed with Warm Stone neutrals &amp; Warm Orange accents.
            </div>
          </div>

          {/* Col 2: Product */}
          <div className="space-y-2">
            <div className="font-bold text-[10px] uppercase tracking-wider text-[var(--ink-muted)]">Product</div>
            <ul className="space-y-1.5 text-[var(--ink-body)]">
              <li><a href="#features" onClick={(e) => handleNavClick(e, "features")} className="hover:text-[var(--accent-700)]">Features</a></li>
              <li><a href="#how-it-works" onClick={(e) => handleNavClick(e, "how-it-works")} className="hover:text-[var(--accent-700)]">How It Works</a></li>
              <li><a href="#roles" onClick={(e) => handleNavClick(e, "roles")} className="hover:text-[var(--accent-700)]">Roles &amp; Access</a></li>
              <li><a href="#pricing" onClick={(e) => handleNavClick(e, "pricing")} className="hover:text-[var(--accent-700)]">Pricing Tiers</a></li>
            </ul>
          </div>

          {/* Col 3: Solutions */}
          <div className="space-y-2">
            <div className="font-bold text-[10px] uppercase tracking-wider text-[var(--ink-muted)]">Solutions</div>
            <ul className="space-y-1.5 text-[var(--ink-body)]">
              <li><a href="#roles" onClick={(e) => handleNavClick(e, "roles")} className="hover:text-[var(--accent-700)]">Engineering Teams</a></li>
              <li><a href="#roles" onClick={(e) => handleNavClick(e, "roles")} className="hover:text-[var(--accent-700)]">Design Squads</a></li>
              <li><a href="#roles" onClick={(e) => handleNavClick(e, "roles")} className="hover:text-[var(--accent-700)]">Client Portals</a></li>
              <li><a href="#roles" onClick={(e) => handleNavClick(e, "roles")} className="hover:text-[var(--accent-700)]">Product Managers</a></li>
            </ul>
          </div>

          {/* Col 4: Legal & Security */}
          <div className="space-y-2">
            <div className="font-bold text-[10px] uppercase tracking-wider text-[var(--ink-muted)]">Security &amp; Legal</div>
            <ul className="space-y-1.5 text-[var(--ink-body)]">
              <li><a href="#faq" onClick={(e) => handleNavClick(e, "faq")} className="hover:text-[var(--accent-700)]">Work Email Guard</a></li>
              <li><a href="#faq" onClick={(e) => handleNavClick(e, "faq")} className="hover:text-[var(--accent-700)]">Privacy Policy</a></li>
              <li><a href="#faq" onClick={(e) => handleNavClick(e, "faq")} className="hover:text-[var(--accent-700)]">Terms of Service</a></li>
              <li><a href="#faq" onClick={(e) => handleNavClick(e, "faq")} className="hover:text-[var(--accent-700)]">Security Audits</a></li>
            </ul>
          </div>

        </div>

        <div className="max-w-6xl mx-auto pt-8 mt-8 border-t border-[var(--line)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--ink-muted)]">
          <div>
            &copy; 2026 Taskly Work Management System. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>Built with precision</span>
            <span>•</span>
            <span className="font-mono">v2.0 Build-Ready</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
