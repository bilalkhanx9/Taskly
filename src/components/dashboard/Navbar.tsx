"use client";

import React from "react";
import { Search, Sun, Bell, ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface NavbarProps {
  onSearchChange?: (val: string) => void;
}

export function Navbar({ onSearchChange }: NavbarProps) {
  return (
    <header className="h-16 bg-white border-b border-slate-100 px-8 flex items-center justify-between sticky top-0 z-40">
      {/* Search Input Bar */}
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search tasks, projects, people..."
          onChange={(e) => onSearchChange?.(e.target.value)}
          className="w-full bg-[#F8FAFC] border border-slate-200/80 rounded-xl pl-10 pr-12 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F95738]/20 focus:border-[#F95738] transition-all"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 px-1.5 py-0.5 rounded-md border border-slate-200 bg-white text-[10px] font-medium text-slate-400 shadow-xs">
          <span>⌘</span>
          <span>K</span>
        </div>
      </div>

      {/* Right Controls: Theme Toggle, Notifications & Profile */}
      <div className="flex items-center gap-5">
        {/* Sun Icon */}
        <button
          type="button"
          aria-label="Theme Toggle"
          className="h-8 w-8 rounded-full flex items-center justify-center text-amber-500 hover:bg-slate-100 transition-colors"
        >
          <Sun className="h-4 w-4" />
        </button>

        {/* Notifications with Red Count Badge */}
        <button
          type="button"
          aria-label="Notifications"
          className="relative h-8 w-8 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-[#F95738] text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white">
            7
          </span>
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-2 cursor-pointer hover:opacity-90 transition-opacity">
          <Avatar className="h-9 w-9 bg-[#A05E44] text-white font-semibold text-xs flex items-center justify-center rounded-full">
            <AvatarFallback className="bg-[#9B5338] text-white font-bold">
              BD
            </AvatarFallback>
          </Avatar>
          <div className="text-left hidden sm:block">
            <div className="text-xs font-bold text-slate-900 leading-tight">
              Bilal Durani
            </div>
            <div className="text-[11px] text-slate-400 font-medium">
              Admin
            </div>
          </div>
          <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
        </div>
      </div>
    </header>
  );
}
