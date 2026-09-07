"use client";

import React, { useState } from "react";
import { User, UserRole, Workspace } from "@/types/taskflow-v2";
import { 
  Users, 
  UserPlus, 
  Mail, 
  ShieldCheck, 
  MoreHorizontal, 
  Clock, 
  Check, 
  Trash2,
  Send,
  HelpCircle
} from "lucide-react";

interface TeamDirectoryViewProps {
  currentUser: User;
  workspace: Workspace;
  members: User[];
  onInviteMember: () => void;
  onUpdateRole?: (userId: string, newRole: UserRole) => void;
  onRemoveMember?: (userId: string) => void;
}

export const TeamDirectoryView: React.FC<TeamDirectoryViewProps> = ({
  currentUser,
  workspace,
  members,
  onInviteMember,
  onUpdateRole,
  onRemoveMember
}) => {
  const [activeTab, setActiveTab] = useState<"members" | "invites" | "permissions">("members");
  const [searchFilter, setSearchFilter] = useState("");

  const isOwnerOrManager = currentUser.role === "WORKSPACE_OWNER" || currentUser.role === "MANAGER";

  const [pendingInvites, setPendingInvites] = useState<
    { id: string; email: string; role: string; sentAt: string }[]
  >([]);

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(searchFilter.toLowerCase()) || 
    m.email.toLowerCase().includes(searchFilter.toLowerCase()) ||
    (m.designation || m.jobTitle || "").toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="w-full space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--ink)]">Team Directory</h1>
          <p className="text-xs text-[var(--ink-muted)] mt-1">
            Manage teammates, roles, access permissions, and pending invitations for {workspace.name}.
          </p>
        </div>

        {isOwnerOrManager && (
          <button
            onClick={onInviteMember}
            className="h-[38px] px-4 bg-[var(--accent-700)] hover:bg-[var(--accent-800)] text-white font-medium text-xs rounded-lg flex items-center gap-2 shadow-sm transition-all"
          >
            <UserPlus className="w-4 h-4" />
            Invite Teammate
          </button>
        )}
      </div>

      {/* Tabs Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-[var(--line)] pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("members")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              activeTab === "members"
                ? "bg-[var(--accent-50)] text-[var(--accent-800)] border border-[var(--accent-100)]"
                : "text-[var(--ink-muted)] hover:text-[var(--ink)]"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Members ({members.length})
          </button>

          <button
            onClick={() => setActiveTab("invites")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              activeTab === "invites"
                ? "bg-[var(--accent-50)] text-[var(--accent-800)] border border-[var(--accent-100)]"
                : "text-[var(--ink-muted)] hover:text-[var(--ink)]"
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            Pending Invites ({pendingInvites.length})
          </button>

          <button
            onClick={() => setActiveTab("permissions")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              activeTab === "permissions"
                ? "bg-[var(--accent-50)] text-[var(--accent-800)] border border-[var(--accent-100)]"
                : "text-[var(--ink-muted)] hover:text-[var(--ink)]"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Roles &amp; Permissions
          </button>
        </div>

        {activeTab === "members" && (
          <input
            type="text"
            placeholder="Search by name, email, or role..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full sm:w-64 px-3 py-1.5 bg-[var(--surface)] border border-[var(--line-strong)] rounded-lg text-xs text-[var(--ink)] focus:outline-none focus:border-[var(--accent-600)]"
          />
        )}
      </div>

      {/* Active Tab Content */}
      {activeTab === "members" && (
        <div className="bg-[var(--surface)] border border-[var(--line)] rounded-xl overflow-hidden shadow-2xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-[var(--surface-sunken)] text-[var(--ink-muted)] border-b border-[var(--line)] uppercase tracking-wider font-semibold text-[10px]">
              <tr>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Title / Role</th>
                <th className="py-3 px-4">Workspace Access Role</th>
                <th className="py-3 px-4">Email Verification</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--line)]">
              {filteredMembers.map((m) => (
                <tr key={m.id} className="hover:bg-[var(--surface-hover)] transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={m.avatarUrl}
                        alt={m.name}
                        className="w-8 h-8 rounded-full border border-white object-cover"
                      />
                      <div>
                        <div className="font-bold text-xs text-[var(--ink)] flex items-center gap-1.5">
                          {m.name}
                          {m.id === currentUser.id && (
                            <span className="text-[10px] font-normal text-[var(--ink-muted)]">(You)</span>
                          )}
                        </div>
                        <div className="text-[11px] text-[var(--ink-muted)]">{m.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-[var(--ink-body)] font-medium">
                    {m.designation || m.jobTitle || "Team Member"}
                  </td>
                  <td className="py-3 px-4">
                    {isOwnerOrManager && m.role !== "WORKSPACE_OWNER" ? (
                      <select
                        value={m.role}
                        onChange={(e) => onUpdateRole && onUpdateRole(m.id, e.target.value as UserRole)}
                        className="px-2.5 py-1 bg-[var(--surface-sunken)] border border-[var(--line-strong)] rounded text-xs font-semibold text-[var(--ink)] focus:outline-none"
                      >
                        <option value="MANAGER">Manager</option>
                        <option value="MEMBER">Member</option>
                        <option value="VIEWER">Viewer</option>
                      </select>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-orange-50 text-[var(--accent-700)] border border-orange-200">
                        {m.role.replace("_", " ")}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                      <Check className="w-3.5 h-3.5 text-emerald-600" /> Verified
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {isOwnerOrManager && m.id !== currentUser.id && m.role !== "WORKSPACE_OWNER" && (
                      <button
                        onClick={() => onRemoveMember && onRemoveMember(m.id)}
                        className="text-xs text-red-600 hover:text-red-700 font-medium"
                      >
                        Remove
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pending Invites Tab */}
      {activeTab === "invites" && (
        <div className="bg-[var(--surface)] border border-[var(--line)] rounded-xl overflow-hidden shadow-2xs">
          {pendingInvites.length === 0 ? (
            <div className="p-8 text-center text-xs text-[var(--ink-muted)]">
              No pending invitations. All invited members have accepted.
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-[var(--surface-sunken)] text-[var(--ink-muted)] border-b border-[var(--line)] uppercase tracking-wider font-semibold text-[10px]">
                <tr>
                  <th className="py-3 px-4">Invited Email</th>
                  <th className="py-3 px-4">Invited As</th>
                  <th className="py-3 px-4">Sent Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line)]">
                {pendingInvites.map((inv) => (
                  <tr key={inv.id} className="hover:bg-[var(--surface-hover)]">
                    <td className="py-3 px-4 font-semibold text-[var(--ink)]">{inv.email}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-stone-100 text-stone-700">
                        {inv.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[var(--ink-muted)]">{inv.sentAt}</td>
                    <td className="py-3 px-4 text-right space-x-3">
                      <button
                        onClick={() => alert(`Resent invitation to ${inv.email}`)}
                        className="text-xs font-semibold text-[var(--accent-700)] hover:underline"
                      >
                        Resend
                      </button>
                      <button
                        onClick={() => setPendingInvites(prev => prev.filter(i => i.id !== inv.id))}
                        className="text-xs text-red-600 hover:underline"
                      >
                        Revoke
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Permissions Matrix Tab (Section 3.1 & 7.18) */}
      {activeTab === "permissions" && (
        <div className="bg-[var(--surface)] border border-[var(--line)] rounded-xl p-5 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-[var(--ink)]">Workspace Role Permissions Breakdown</h3>
          <table className="w-full text-left text-xs border border-[var(--line)] rounded-lg overflow-hidden">
            <thead className="bg-[var(--surface-sunken)] text-[var(--ink-muted)] font-semibold text-[10px] uppercase border-b border-[var(--line)]">
              <tr>
                <th className="p-3">Capability</th>
                <th className="p-3 text-center">Owner</th>
                <th className="p-3 text-center">Manager</th>
                <th className="p-3 text-center">Member</th>
                <th className="p-3 text-center">Viewer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--line)]">
              {[
                { cap: "Create & delete projects", owner: true, manager: true, member: false, viewer: false },
                { cap: "Create, assign & edit tasks", owner: true, manager: true, member: true, viewer: false },
                { cap: "Add comments and subtasks", owner: true, manager: true, member: true, viewer: false },
                { cap: "Invite members to workspace", owner: true, manager: true, member: false, viewer: false },
                { cap: "Change member roles", owner: true, manager: false, member: false, viewer: false },
                { cap: "Workspace settings & billing", owner: true, manager: false, member: false, viewer: false },
                { cap: "View tasks and dashboards", owner: true, manager: true, member: true, viewer: true }
              ].map((row, idx) => (
                <tr key={idx} className="hover:bg-[var(--surface-hover)]">
                  <td className="p-3 font-medium text-[var(--ink)]">{row.cap}</td>
                  <td className="p-3 text-center">{row.owner ? "✓" : "—"}</td>
                  <td className="p-3 text-center">{row.manager ? "✓" : "—"}</td>
                  <td className="p-3 text-center">{row.member ? "✓" : "—"}</td>
                  <td className="p-3 text-center">{row.viewer ? "✓" : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
