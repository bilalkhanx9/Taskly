"use client";

import React, { useState } from "react";
import { User, UserRole } from "@/types/taskflow";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Mail, Shield } from "lucide-react";

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInviteSent: (newMember: User) => void;
}

export function InviteMemberModal({
  isOpen,
  onClose,
  onInviteSent,
}: InviteMemberModalProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<UserRole>("member");
  const [jobTitle, setJobTitle] = useState("");

  const handleInvite = () => {
    if (!email.trim() || !name.trim()) return;

    const newMember: User = {
      id: `u-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      jobTitle: jobTitle.trim() || "Team Member",
      timezone: "Asia/Karachi",
      role,
      avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80",
    };

    onInviteSent(newMember);
    setEmail("");
    setName("");
    setJobTitle("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md p-6 bg-white border border-[#E3E8E6] rounded-xl shadow-xl space-y-4">
        <DialogHeader>
          <DialogTitle className="text-sm font-bold text-[#1F2A2E]">
            Invite Teammates to Workspace
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-[#6B7A80] uppercase text-[10px]">
              Teammate Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Asad Ullah"
              autoFocus
              className="w-full bg-[#F6F8F7] border border-[#E3E8E6] rounded-md px-3 py-2 text-xs text-[#1F2A2E] focus:outline-none focus:border-[#0F766E]"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-[#6B7A80] uppercase text-[10px]">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="asad@example.com"
              className="w-full bg-[#F6F8F7] border border-[#E3E8E6] rounded-md px-3 py-2 text-xs text-[#1F2A2E] focus:outline-none focus:border-[#0F766E]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-[#6B7A80] uppercase text-[10px]">
                Assigned Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full bg-[#F6F8F7] border border-[#E3E8E6] rounded-md px-2.5 py-1.5 text-xs text-[#1F2A2E] focus:outline-none focus:border-[#0F766E]"
              >
                <option value="manager">Manager</option>
                <option value="member">Member</option>
                <option value="viewer">Viewer</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#6B7A80] uppercase text-[10px]">
                Job Title
              </label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. Frontend Dev"
                className="w-full bg-[#F6F8F7] border border-[#E3E8E6] rounded-md px-2.5 py-1.5 text-xs text-[#1F2A2E] focus:outline-none focus:border-[#0F766E]"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-md border border-[#E3E8E6] text-xs font-semibold text-[#3D4A4F] hover:bg-[#F6F8F7]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleInvite}
            disabled={!email.trim() || !name.trim()}
            className="px-4 py-1.5 rounded-md bg-[#0F766E] hover:bg-[#0C5F58] text-white text-xs font-semibold shadow-xs disabled:opacity-50"
          >
            Send Invitation
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
