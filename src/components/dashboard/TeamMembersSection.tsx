"use client";

import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface MemberItem {
  id: string;
  name: string;
  role: string;
  initials: string;
  bgClass: string;
}

const members: MemberItem[] = [
  {
    id: "m-1",
    name: "Bilal Durani",
    role: "Admin",
    initials: "BD",
    bgClass: "bg-indigo-600 text-white",
  },
  {
    id: "m-2",
    name: "John Doe",
    role: "Manager",
    initials: "JD",
    bgClass: "bg-blue-600 text-white",
  },
  {
    id: "m-3",
    name: "Sarah Khan",
    role: "Member",
    initials: "SK",
    bgClass: "bg-purple-600 text-white",
  },
  {
    id: "m-4",
    name: "Ali Raza",
    role: "Member",
    initials: "AR",
    bgClass: "bg-slate-700 text-white",
  },
];

export function TeamMembersSection() {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-sm text-slate-900 tracking-tight">
          Team Members
        </h3>
        <button
          type="button"
          className="text-xs font-semibold text-[#F95738] hover:underline"
        >
          View All
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-6">
          {members.map((member) => (
            <div key={member.id} className="flex flex-col items-center text-center">
              <Avatar className="h-10 w-10 shadow-xs mb-1.5 ring-2 ring-white">
                <AvatarFallback className={`text-xs font-bold ${member.bgClass}`}>
                  {member.initials}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs font-bold text-slate-800 leading-tight">
                {member.name}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                {member.role}
              </span>
            </div>
          ))}
        </div>

        {/* Plus more pill */}
        <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 hover:bg-slate-200 transition-colors cursor-pointer">
          +4
        </div>
      </div>
    </div>
  );
}
