"use client";

import React, { useState } from "react";
import { User, UserRole } from "@/types/taskflow-v2";
import { X, UserPlus, Copy, Check, Send } from "lucide-react";

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (email: string, role: UserRole) => void;
}

export const InviteMemberModal: React.FC<InviteMemberModalProps> = ({
  isOpen,
  onClose,
  onInvite
}) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("MEMBER");
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    onInvite(email.trim(), role);
    setEmail("");
    onClose();
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText("https://taskflow.io/join/nova-studio-invite-token");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div 
        className="bg-[var(--surface)] border border-[var(--line-strong)] rounded-2xl w-full max-w-md shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-orange-50 text-[var(--accent-700)] flex items-center justify-center">
              <UserPlus className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-[var(--ink)]">Invite to Workspace</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded text-[var(--ink-muted)] hover:text-[var(--ink)]">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--ink-body)] uppercase tracking-wider mb-1">
              Colleague Email Address
            </label>
            <input
              type="email"
              required
              autoFocus
              placeholder="colleague@novastudio.pk"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-[var(--surface)] border border-[var(--line-strong)] rounded-lg text-xs text-[var(--ink)] focus:outline-none focus:border-[var(--accent-600)]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--ink-body)] uppercase tracking-wider mb-1">
              Assigned Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full px-3 py-2 bg-[var(--surface)] border border-[var(--line-strong)] rounded-lg text-xs text-[var(--ink)]"
            >
              <option value="MANAGER">Manager (Can manage projects and tasks)</option>
              <option value="MEMBER">Member (Can create, edit, and complete tasks)</option>
              <option value="VIEWER">Viewer (Read-only access)</option>
            </select>
          </div>

          <div className="p-3 bg-[var(--surface-sunken)] border border-[var(--line)] rounded-xl flex items-center justify-between text-xs">
            <div>
              <div className="font-semibold text-[var(--ink)]">Direct Join Link</div>
              <div className="text-[10px] text-[var(--ink-muted)]">Anyone with verified domain can join</div>
            </div>
            <button
              type="button"
              onClick={handleCopyLink}
              className="h-[28px] px-2.5 bg-[var(--surface)] border border-[var(--line-strong)] hover:border-[var(--ink-faint)] rounded-md text-[11px] font-semibold text-[var(--ink)] flex items-center gap-1"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>

          <div className="pt-3 border-t border-[var(--line)] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="h-[38px] px-4 border border-[var(--line-strong)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] text-xs font-semibold text-[var(--ink)] rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-[38px] px-5 bg-[var(--accent-700)] hover:bg-[var(--accent-800)] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              Send Invitation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
