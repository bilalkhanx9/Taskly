"use client";

import React, { useState } from "react";
import { User, Organisation } from "@/types/taskflow-v2";
import {
  Shield,
  Building2,
  Users,
  Globe,
  Activity,
  Megaphone,
  ArrowLeft,
  Server,
  AlertTriangle,
  CheckCircle2,
  LogOut,
} from "lucide-react";

interface AdminShellProps {
  currentUser: User;
  onExitAdmin?: () => void;
  onSignOut?: () => void;
  organisations: Organisation[];
  allUsersList?: User[];
  users?: User[];
  children?: React.ReactNode;
}

export function AdminShell({
  currentUser,
  onExitAdmin,
  onSignOut,
  organisations,
  allUsersList,
  users,
  children,
}: AdminShellProps) {
  const usersList = allUsersList || users || [];
  const handleExit = onExitAdmin || onSignOut || (() => {});
  const [activeAdminTab, setActiveAdminTab] = useState<
    "overview" | "organisations" | "users" | "domains" | "system" | "announcements"
  >("overview");

  const [announcementText, setAnnouncementText] = useState(
    "Scheduled platform maintenance on Sunday Sept 14 at 02:00 UTC."
  );
  const [announcementActive, setAnnouncementActive] = useState(true);

  return (
    <div className="min-h-screen bg-[var(--canvas)] text-[var(--ink)] font-sans antialiased">
      {/* Shell B Dark Top Bar (Section 4.2 / Section 7.22) */}
      <header className="h-14 bg-[#1C1917] text-white px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[var(--accent-700)] flex items-center justify-center font-bold text-xs">
              T
            </div>
            <span className="font-bold text-xs tracking-wider uppercase text-white">
              TASKLY ADMIN
            </span>
          </div>

          {/* Admin Navigation Tabs */}
          <nav className="flex items-center gap-1 text-xs">
            {[
              { id: "overview", label: "Overview" },
              { id: "organisations", label: "Organisations" },
              { id: "users", label: "Users" },
              { id: "domains", label: "Domains" },
              { id: "system", label: "System Health" },
              { id: "announcements", label: "Announcements" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveAdminTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                  activeAdminTab === tab.id
                    ? "bg-[#292524] text-white font-semibold"
                    : "text-[#A8A29E] hover:text-white hover:bg-[#292524]/60"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Exit Admin Mode & User info */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={handleExit}
            className="h-8 px-3 rounded-md bg-[#292524] hover:bg-[#44403C] text-xs font-semibold text-white flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Return to Workspaces
          </button>

          <button
            type="button"
            onClick={onSignOut || handleExit}
            className="h-8 px-3 rounded-md bg-red-950/80 hover:bg-red-900 border border-red-800 text-xs font-semibold text-red-200 flex items-center gap-1.5 transition-colors"
            title="Log out of Taskly Admin"
          >
            <LogOut className="w-3.5 h-3.5" /> Log out
          </button>

          <div className="flex items-center gap-2 pl-2 border-l border-[#44403C]">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="w-7 h-7 rounded-full object-cover border border-[#44403C]"
            />
            <span className="text-xs font-semibold text-white hidden sm:inline">
              {currentUser.name}
            </span>
          </div>
        </div>
      </header>

      {/* Admin Content Area (Section 7.22) */}
      <main className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Active Announcement Banner */}
        {announcementActive && (
          <div className="p-3 bg-[var(--accent-50)] border border-[var(--accent-200)] text-[var(--accent-800)] text-xs rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-[var(--accent-700)] shrink-0" />
              <span>
                <strong>System Announcement:</strong> {announcementText}
              </span>
            </div>
            <button
              onClick={() => setAnnouncementActive(false)}
              className="text-xs font-bold hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* 1. OVERVIEW TAB */}
        {activeAdminTab === "overview" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-xl font-bold text-[var(--ink)]">Platform Overview</h1>
              <p className="text-xs text-[var(--ink-muted)] mt-0.5">
                Multi-tenant health metrics across all verified customer organisations
              </p>
            </div>

            {/* Metric KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-lg border border-[var(--line)] shadow-xs">
                <span className="text-xs text-[var(--ink-muted)] block">Total Organisations</span>
                <p className="text-2xl font-bold text-[var(--ink)] mt-1">{organisations.length}</p>
                <span className="text-[11px] text-[var(--success)] font-medium">All active & verified</span>
              </div>
              <div className="bg-white p-5 rounded-lg border border-[var(--line)] shadow-xs">
                <span className="text-xs text-[var(--ink-muted)] block">Registered Users</span>
                <p className="text-2xl font-bold text-[var(--ink)] mt-1">64</p>
                <span className="text-[11px] text-[var(--ink-muted)]">Across 8 active workspaces</span>
              </div>
              <div className="bg-white p-5 rounded-lg border border-[var(--line)] shadow-xs">
                <span className="text-xs text-[var(--ink-muted)] block">Queue Health</span>
                <p className="text-2xl font-bold text-[var(--success)] mt-1">Optimal</p>
                <span className="text-[11px] text-[var(--success)]">0 failed background jobs</span>
              </div>
              <div className="bg-white p-5 rounded-lg border border-[var(--line)] shadow-xs">
                <span className="text-xs text-[var(--ink-muted)] block">API Error Rate</span>
                <p className="text-2xl font-bold text-[var(--ink)] mt-1">0.02%</p>
                <span className="text-[11px] text-[var(--ink-muted)]">99.98% uptime SLA</span>
              </div>
            </div>

            {/* Quick Organisation Table */}
            <div className="bg-white rounded-lg border border-[var(--line)] shadow-xs p-5 space-y-3">
              <h3 className="text-sm font-bold text-[var(--ink)]">Recent Customer Organisations</h3>
              <div className="divide-y divide-[var(--line)]">
                {organisations.map((org) => (
                  <div key={org.id} className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-[var(--ink)] block">{org.name}</span>
                      <span className="text-[var(--ink-muted)] font-mono text-[11px]">@{org.domain}</span>
                    </div>
                    <div className="flex items-center gap-4 text-[var(--ink-muted)]">
                      <span>{org.workspacesCount} Workspaces</span>
                      <span>{org.usersCount} Users</span>
                      <span className="px-2 py-0.5 rounded bg-[var(--success-bg)] text-[var(--success)] font-semibold text-[10px]">
                        ACTIVE
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 2. ORGANISATIONS TAB */}
        {activeAdminTab === "organisations" && (
          <div className="bg-white rounded-lg border border-[var(--line)] shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
              <div>
                <h3 className="text-sm font-bold text-[var(--ink)]">Organisations Directory</h3>
                <p className="text-xs text-[var(--ink-muted)]">All verified domain tenant spaces</p>
              </div>
            </div>

            <div className="divide-y divide-[var(--line)]">
              {organisations.map((org) => (
                <div key={org.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-bold text-[var(--ink)]">{org.name}</h4>
                    <p className="text-[11px] text-[var(--ink-muted)]">Domain: {org.domain} • Joined {org.createdAt}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 bg-[var(--surface-sunken)] rounded text-[11px] font-mono">
                      {org.usersCount} seats
                    </span>
                    <button className="text-xs font-semibold text-[var(--accent-700)] hover:underline">
                      Manage &rarr;
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. USERS TAB */}
        {activeAdminTab === "users" && (
          <div className="bg-white rounded-lg border border-[var(--line)] shadow-xs p-6 space-y-4">
            <h3 className="text-sm font-bold text-[var(--ink)]">Platform User Registry</h3>
            <div className="divide-y divide-[var(--line)]">
              {usersList.map((u) => (
                <div key={u.id} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <img src={u.avatarUrl} alt={u.name} className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <span className="font-bold text-[var(--ink)] block">{u.name}</span>
                      <span className="text-[11px] text-[var(--ink-muted)]">{u.email}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[var(--surface-sunken)] text-[var(--ink-muted)]">
                      {u.role.replace("_", " ")}
                    </span>
                    <span className="text-xs text-[var(--success)] font-medium">Verified</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. DOMAINS TAB */}
        {activeAdminTab === "domains" && (
          <div className="bg-white rounded-lg border border-[var(--line)] shadow-xs p-6 space-y-4">
            <h3 className="text-sm font-bold text-[var(--ink)]">Domain Allowlist & Blacklist</h3>
            <p className="text-xs text-[var(--ink-muted)]">
              Work email policy enforces non-disposable domains for sign up.
            </p>
            <div className="p-4 bg-[var(--surface-sunken)] rounded-lg text-xs space-y-2">
              <div className="flex items-center gap-2 text-[var(--success)] font-semibold">
                <CheckCircle2 className="w-4 h-4" /> 2,400+ disposable email domains blocked automatically (mailinator, 10minutemail, etc.)
              </div>
            </div>
          </div>
        )}

        {/* 5. SYSTEM HEALTH */}
        {activeAdminTab === "system" && (
          <div className="bg-white rounded-lg border border-[var(--line)] shadow-xs p-6 space-y-4">
            <h3 className="text-sm font-bold text-[var(--ink)]">System & Background Queue Health</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-[var(--surface-hover)] border border-[var(--line)]">
                <span className="text-xs text-[var(--ink-muted)]">PostgreSQL Connections</span>
                <p className="text-xl font-bold text-[var(--ink)] mt-1">12 / 100 pool</p>
              </div>
              <div className="p-4 rounded-lg bg-[var(--surface-hover)] border border-[var(--line)]">
                <span className="text-xs text-[var(--ink-muted)]">Inngest Queue Latency</span>
                <p className="text-xl font-bold text-[var(--success)] mt-1">24ms</p>
              </div>
              <div className="p-4 rounded-lg bg-[var(--surface-hover)] border border-[var(--line)]">
                <span className="text-xs text-[var(--ink-muted)]">R2 Storage Utilization</span>
                <p className="text-xl font-bold text-[var(--ink)] mt-1">4.2 GB</p>
              </div>
            </div>
          </div>
        )}

        {/* 6. ANNOUNCEMENTS TAB */}
        {activeAdminTab === "announcements" && (
          <div className="bg-white rounded-lg border border-[var(--line)] shadow-xs p-6 space-y-4">
            <h3 className="text-sm font-bold text-[var(--ink)]">Platform Maintenance Announcements</h3>
            <div className="space-y-3">
              <textarea
                rows={3}
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                className="w-full text-xs p-3 border border-[var(--line-strong)] rounded-md focus:border-[var(--accent-500)] outline-none"
              />
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="ann-active"
                  checked={announcementActive}
                  onChange={(e) => setAnnouncementActive(e.target.checked)}
                  className="rounded border-[var(--line-strong)] text-[var(--accent-700)] focus:ring-[var(--accent-500)]"
                />
                <label htmlFor="ann-active" className="text-xs text-[var(--ink)] font-medium">
                  Display announcement banner across all workspace shells
                </label>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
