"use client";

import React, { useState } from "react";
import { User, Workspace, AuditLog } from "@/types/taskflow-v2";
import { 
  User as UserIcon, 
  Lock, 
  Building2, 
  Tag, 
  FileText, 
  ShieldCheck, 
  Plus, 
  Trash2, 
  Save, 
  Check, 
  AlertTriangle 
} from "lucide-react";

interface SettingsViewProps {
  currentUser: User;
  workspace: Workspace;
  auditLogs: AuditLog[];
  onUpdateWorkspaceName: (name: string) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  currentUser,
  workspace,
  auditLogs,
  onUpdateWorkspaceName
}) => {
  const [activeTab, setActiveTab] = useState<"profile" | "security" | "workspace" | "labels" | "audit">("profile");

  // Profile Form
  const [userName, setUserName] = useState(currentUser.name);
  const [userDesignation, setUserDesignation] = useState(currentUser.designation);
  const [profileSaved, setProfileSaved] = useState(false);

  // Workspace Form
  const [wsName, setWsName] = useState(workspace.name);
  const [wsSaved, setWsSaved] = useState(false);

  // Labels Manager
  const [labels, setLabels] = useState([
    { id: "lbl-1", name: "Design", color: "#EA580C" },
    { id: "lbl-2", name: "Backend", color: "#1D4ED8" },
    { id: "lbl-3", name: "Security", color: "#B91C1C" },
    { id: "lbl-4", name: "Marketing", color: "#15803D" },
    { id: "lbl-5", name: "Brand", color: "#7C3AED" }
  ]);
  const [newLabelName, setNewLabelName] = useState("");

  const handleAddLabel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabelName.trim()) return;
    setLabels(prev => [
      ...prev,
      { id: `lbl-${Date.now()}`, name: newLabelName.trim(), color: "#C2410C" }
    ]);
    setNewLabelName("");
  };

  const handleDeleteLabel = (id: string) => {
    setLabels(prev => prev.filter(l => l.id !== id));
  };

  return (
    <div className="w-full space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--ink)]">Settings &amp; Preferences</h1>
        <p className="text-xs text-[var(--ink-muted)] mt-1">
          Manage your personal profile, security credentials, workspace configuration, and audit logs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        {/* Sub-nav sidebar */}
        <div className="bg-[var(--surface)] border border-[var(--line)] rounded-xl p-2 space-y-1">
          <button
            onClick={() => setActiveTab("profile")}
            className={`w-full px-3 py-2 rounded-lg text-xs font-semibold text-left flex items-center gap-2.5 transition-colors ${
              activeTab === "profile"
                ? "bg-[var(--accent-50)] text-[var(--accent-800)]"
                : "text-[var(--ink-body)] hover:bg-[var(--surface-hover)]"
            }`}
          >
            <UserIcon className="w-4 h-4 text-[var(--accent-700)]" />
            My Profile
          </button>

          <button
            onClick={() => setActiveTab("security")}
            className={`w-full px-3 py-2 rounded-lg text-xs font-semibold text-left flex items-center gap-2.5 transition-colors ${
              activeTab === "security"
                ? "bg-[var(--accent-50)] text-[var(--accent-800)]"
                : "text-[var(--ink-body)] hover:bg-[var(--surface-hover)]"
            }`}
          >
            <Lock className="w-4 h-4 text-[var(--accent-700)]" />
            Security &amp; 2FA
          </button>

          <button
            onClick={() => setActiveTab("workspace")}
            className={`w-full px-3 py-2 rounded-lg text-xs font-semibold text-left flex items-center gap-2.5 transition-colors ${
              activeTab === "workspace"
                ? "bg-[var(--accent-50)] text-[var(--accent-800)]"
                : "text-[var(--ink-body)] hover:bg-[var(--surface-hover)]"
            }`}
          >
            <Building2 className="w-4 h-4 text-[var(--accent-700)]" />
            Workspace
          </button>

          <button
            onClick={() => setActiveTab("labels")}
            className={`w-full px-3 py-2 rounded-lg text-xs font-semibold text-left flex items-center gap-2.5 transition-colors ${
              activeTab === "labels"
                ? "bg-[var(--accent-50)] text-[var(--accent-800)]"
                : "text-[var(--ink-body)] hover:bg-[var(--surface-hover)]"
            }`}
          >
            <Tag className="w-4 h-4 text-[var(--accent-700)]" />
            Labels Manager
          </button>

          <button
            onClick={() => setActiveTab("audit")}
            className={`w-full px-3 py-2 rounded-lg text-xs font-semibold text-left flex items-center gap-2.5 transition-colors ${
              activeTab === "audit"
                ? "bg-[var(--accent-50)] text-[var(--accent-800)]"
                : "text-[var(--ink-body)] hover:bg-[var(--surface-hover)]"
            }`}
          >
            <FileText className="w-4 h-4 text-[var(--accent-700)]" />
            Audit Logs
          </button>
        </div>

        {/* Content Area */}
        <div className="md:col-span-3 bg-[var(--surface)] border border-[var(--line)] rounded-xl p-6 shadow-2xs">
          
          {/* PROFILE TAB */}
          {activeTab === "profile" && (
            <div className="space-y-5">
              <h2 className="text-base font-bold text-[var(--ink)]">Profile Details</h2>

              <div className="flex items-center gap-4 pb-4 border-b border-[var(--line)]">
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  className="w-16 h-16 rounded-full border-2 border-[var(--line-strong)] object-cover"
                />
                <div>
                  <div className="text-xs font-bold text-[var(--ink)]">{currentUser.name}</div>
                  <div className="text-[11px] text-[var(--ink-muted)]">{currentUser.email}</div>
                  <button 
                    onClick={() => alert("Avatar upload simulated.")}
                    className="mt-2 text-xs font-semibold text-[var(--accent-700)] hover:underline"
                  >
                    Change photo
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[var(--ink-body)] mb-1">Full Name</label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full px-3 py-2 bg-[var(--surface)] border border-[var(--line-strong)] rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--ink-body)] mb-1">Corporate Email</label>
                  <input
                    type="text"
                    disabled
                    value={currentUser.email}
                    className="w-full px-3 py-2 bg-[var(--surface-sunken)] border border-[var(--line)] rounded-lg text-xs text-[var(--ink-muted)] cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--ink-body)] mb-1">Role / Designation</label>
                  <input
                    type="text"
                    value={userDesignation}
                    onChange={(e) => setUserDesignation(e.target.value)}
                    className="w-full px-3 py-2 bg-[var(--surface)] border border-[var(--line-strong)] rounded-lg text-xs"
                  />
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setProfileSaved(true);
                      setTimeout(() => setProfileSaved(false), 2000);
                    }}
                    className="h-[34px] px-4 bg-[var(--accent-700)] hover:bg-[var(--accent-800)] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-sm"
                  >
                    <Save className="w-3.5 h-3.5" />
                    Save Changes
                  </button>
                  {profileSaved && (
                    <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Saved
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* SECURITY TAB */}
          {activeTab === "security" && (
            <div className="space-y-5">
              <h2 className="text-base font-bold text-[var(--ink)]">Security &amp; Authentication</h2>
              
              <div className="space-y-4 max-w-md">
                <div>
                  <label className="block text-xs font-semibold text-[var(--ink-body)] mb-1">Current Password</label>
                  <input type="password" placeholder="••••••••••••" className="w-full px-3 py-2 bg-[var(--surface)] border border-[var(--line-strong)] rounded-lg text-xs" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--ink-body)] mb-1">New Password (min 8 chars)</label>
                  <input type="password" placeholder="••••••••••••" className="w-full px-3 py-2 bg-[var(--surface)] border border-[var(--line-strong)] rounded-lg text-xs" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--ink-body)] mb-1">Confirm New Password</label>
                  <input type="password" placeholder="••••••••••••" className="w-full px-3 py-2 bg-[var(--surface)] border border-[var(--line-strong)] rounded-lg text-xs" />
                </div>
                <button
                  type="button"
                  onClick={() => alert("Password updated.")}
                  className="h-[34px] px-4 bg-[var(--accent-700)] text-white text-xs font-semibold rounded-lg shadow-sm"
                >
                  Update Password
                </button>
              </div>

              <div className="pt-4 border-t border-[var(--line)]">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-[var(--ink)]">Two-Factor Authentication (2FA)</div>
                    <div className="text-[11px] text-[var(--ink-muted)]">Secure your account with TOTP authenticator app.</div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-stone-100 text-stone-600 border border-stone-200">
                    Not Enabled
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* WORKSPACE TAB */}
          {activeTab === "workspace" && (
            <div className="space-y-5">
              <h2 className="text-base font-bold text-[var(--ink)]">Workspace Configuration</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[var(--ink-body)] mb-1">Workspace Name</label>
                  <input
                    type="text"
                    value={wsName}
                    onChange={(e) => setWsName(e.target.value)}
                    className="w-full px-3 py-2 bg-[var(--surface)] border border-[var(--line-strong)] rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--ink-body)] mb-1">Allowed Email Domains</label>
                  <div className="p-3 bg-[var(--surface-sunken)] rounded-lg text-xs font-mono text-[var(--ink)] border border-[var(--line)]">
                    @novastudio.pk
                  </div>
                  <span className="text-[11px] text-[var(--ink-muted)] mt-1 block">
                    Anyone signing up with this domain is automatically granted access.
                  </span>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      onUpdateWorkspaceName(wsName);
                      setWsSaved(true);
                      setTimeout(() => setWsSaved(false), 2000);
                    }}
                    className="h-[34px] px-4 bg-[var(--accent-700)] text-white text-xs font-semibold rounded-lg shadow-sm"
                  >
                    Save Workspace Settings
                  </button>
                  {wsSaved && (
                    <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Saved
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* LABELS TAB */}
          {activeTab === "labels" && (
            <div className="space-y-5">
              <h2 className="text-base font-bold text-[var(--ink)]">Manage Task Labels</h2>
              <p className="text-xs text-[var(--ink-muted)]">
                Create and manage shared label tags for your workspace.
              </p>

              <form onSubmit={handleAddLabel} className="flex gap-2">
                <input
                  type="text"
                  placeholder="New label name..."
                  value={newLabelName}
                  onChange={(e) => setNewLabelName(e.target.value)}
                  className="flex-1 px-3 py-1.5 bg-[var(--surface)] border border-[var(--line-strong)] rounded-lg text-xs"
                />
                <button
                  type="submit"
                  className="h-[32px] px-3 bg-[var(--accent-700)] text-white text-xs font-semibold rounded-lg flex items-center gap-1 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </form>

              <div className="divide-y divide-[var(--line)] border border-[var(--line)] rounded-lg overflow-hidden">
                {labels.map((lbl) => (
                  <div key={lbl.id} className="p-2.5 flex items-center justify-between text-xs hover:bg-[var(--surface-hover)]">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: lbl.color }} />
                      <span className="font-semibold text-[var(--ink)]">{lbl.name}</span>
                    </div>
                    <button
                      onClick={() => handleDeleteLabel(lbl.id)}
                      className="text-[var(--ink-muted)] hover:text-red-600 p-1"
                      title="Delete label"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AUDIT LOG TAB */}
          {activeTab === "audit" && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-[var(--ink)]">Security Audit Trail</h2>
              <p className="text-xs text-[var(--ink-muted)]">
                Chronological log of administrative actions, permission changes, and security events.
              </p>

              <div className="divide-y divide-[var(--line)] border border-[var(--line)] rounded-xl overflow-hidden text-xs">
                {auditLogs.map((log) => (
                  <div key={log.id} className="p-3 hover:bg-[var(--surface-hover)] flex items-start justify-between gap-3">
                    <div>
                      <div className="font-semibold text-[var(--ink)]">
                        {log.actorName} <span className="font-normal text-[var(--ink-muted)]">performed</span> {log.action.replace("_", " ")}
                      </div>
                      <div className="text-[11px] text-[var(--ink-muted)]">
                        Target: <span className="font-mono text-[var(--ink)]">{log.targetName}</span>
                      </div>
                    </div>
                    <div className="text-[10px] font-mono text-[var(--ink-faint)] flex-shrink-0">
                      {new Date(log.timestamp).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
