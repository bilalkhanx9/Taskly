"use client";

import React, { useState } from "react";
import { User, UserRole } from "@/types/taskflow";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Search, Shield, MoreHorizontal, Mail, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

interface TeamViewProps {
  members: User[];
  onInviteClick: () => void;
  onUpdateRole: (userId: string, role: UserRole) => void;
}

const roleStyles: Record<UserRole, { label: string; bg: string; text: string }> = {
  owner: { label: "Owner", bg: "bg-[#0F766E]/10", text: "text-[#0F766E]" },
  manager: { label: "Project Manager", bg: "bg-[#2E7CD6]/10", text: "text-[#2E7CD6]" },
  member: { label: "Member", bg: "bg-[#15803D]/10", text: "text-[#15803D]" },
  viewer: { label: "Viewer", bg: "bg-[#6B7A80]/10", text: "text-[#6B7A80]" },
};

export function TeamView({ members, onInviteClick, onUpdateRole }: TeamViewProps) {
  const [search, setSearch] = useState("");

  const filteredMembers = members.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      (m.jobTitle && m.jobTitle.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-lg border border-[#E3E8E6] shadow-2xs">
        <div>
          <h2 className="text-base font-bold text-[#1F2A2E]">Workspace Members</h2>
          <p className="text-xs text-[#6B7A80]">
            Manage permissions, roles, and teammate access across your workspace.
          </p>
        </div>

        <button
          type="button"
          onClick={onInviteClick}
          className="flex items-center gap-1.5 bg-[#0F766E] hover:bg-[#0C5F58] text-white text-xs font-semibold px-3.5 py-2 rounded-md shadow-xs transition-all active:scale-95"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Invite Member</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#6B7A80]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search teammates by name, email, or role..."
          className="w-full bg-white border border-[#E3E8E6] rounded-md pl-9 pr-4 py-2 text-xs text-[#1F2A2E] placeholder:text-[#9AA7AC] focus:outline-none focus:border-[#0F766E]"
        />
      </div>

      {/* Members Table */}
      <div className="bg-white rounded-lg border border-[#E3E8E6] shadow-2xs overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#E3E8E6] text-[11px] font-bold text-[#6B7A80] uppercase tracking-wider bg-[#F6F8F7]">
              <th className="py-2.5 px-4">Member</th>
              <th className="py-2.5 px-4">Role</th>
              <th className="py-2.5 px-4">Timezone</th>
              <th className="py-2.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EFF2F1] text-xs">
            {filteredMembers.map((member) => {
              const roleInfo = roleStyles[member.role || "member"];
              return (
                <tr key={member.id} className="hover:bg-[#F6F8F7] transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 border border-[#E3E8E6]">
                        <AvatarImage src={member.avatarUrl} alt={member.name} />
                        <AvatarFallback className="text-xs bg-[#E6F2F0] text-[#0F766E] font-bold">
                          {member.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <span className="font-bold text-[#1F2A2E] block leading-tight">
                          {member.name}
                        </span>
                        <span className="text-[11px] text-[#6B7A80] block">{member.email}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <select
                      value={member.role || "member"}
                      onChange={(e) => onUpdateRole(member.id, e.target.value as UserRole)}
                      className={cn(
                        "text-[10px] font-bold px-2 py-1 rounded border-0 uppercase cursor-pointer outline-none",
                        roleInfo.bg,
                        roleInfo.text
                      )}
                    >
                      <option value="owner">Owner</option>
                      <option value="manager">Manager</option>
                      <option value="member">Member</option>
                      <option value="viewer">Viewer</option>
                    </select>
                  </td>

                  <td className="py-3 px-4 text-[#3D4A4F] font-mono text-[11px]">
                    {member.timezone || "Asia/Karachi"}
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      className="p-1 rounded text-[#6B7A80] hover:text-[#1F2A2E] hover:bg-[#EFF2F1]"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
