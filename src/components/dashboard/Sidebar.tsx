"use client";

import React, { useState } from "react";
import {
  CheckSquare,
  Home,
  Inbox,
  Bell,
  FolderKanban,
  Users,
  Tag,
  LayoutDashboard,
  BarChart3,
  Clock,
  ShieldAlert,
  Sliders,
  CreditCard,
  Settings,
  HelpCircle,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export function Sidebar({ activeTab = "Home", onTabChange }: SidebarProps) {
  const [currentTab, setCurrentTab] = useState(activeTab);

  const handleSelect = (name: string) => {
    setCurrentTab(name);
    onTabChange?.(name);
  };

  const navItems = [
    { name: "Home", icon: Home, count: null },
    { name: "My Tasks", icon: CheckSquare, count: 5 },
    { name: "Inbox", icon: Inbox, count: 3 },
    { name: "Notifications", icon: Bell, count: 7 },
  ];

  const workspaceItems = [
    { name: "Projects", icon: FolderKanban, hasArrow: true },
    { name: "Team", icon: Users },
    { name: "Tags", icon: Tag },
  ];

  const managementItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Reports", icon: BarChart3 },
    { name: "Time Tracking", icon: Clock },
  ];

  const adminItems = [
    { name: "Users & Roles", icon: ShieldAlert },
    { name: "Workspace Settings", icon: Sliders },
    { name: "Billing", icon: CreditCard },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-100 flex flex-col justify-between p-4 shrink-0 min-h-screen text-slate-700 select-none">
      <div className="space-y-6">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3 px-2 py-1">
          <div className="h-9 w-9 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-sm shadow-emerald-200">
            <CheckSquare className="h-5 w-5 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight tracking-tight text-slate-900">
              TaskFlow
            </h1>
            <p className="text-[10px] text-slate-400 font-medium tracking-tight">
              Plan • Collaborate • Achieve
            </p>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = currentTab === item.name;
            const Icon = item.icon;
            return (
              <button
                key={item.name}
                onClick={() => handleSelect(item.name)}
                className={cn(
                  "w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                  isActive
                    ? "bg-[#FFF2EE] text-[#F95738] font-semibold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon className={cn("h-4 w-4", isActive ? "text-[#F95738]" : "text-slate-400")} />
                  <span>{item.name}</span>
                </div>
                {item.count !== null && (
                  <span
                    className={cn(
                      "h-5 w-5 rounded-full flex items-center justify-center text-[11px] font-bold",
                      isActive
                        ? "bg-[#F95738] text-white"
                        : "bg-[#F95738] text-white"
                    )}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* WORKSPACE Section */}
        <div className="space-y-1">
          <span className="px-3.5 text-[11px] font-bold text-slate-400 tracking-wider uppercase">
            Workspace
          </span>
          <div className="mt-1 space-y-0.5">
            {workspaceItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.name;
              return (
                <button
                  key={item.name}
                  onClick={() => handleSelect(item.name)}
                  className={cn(
                    "w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-sm font-medium transition-all",
                    isActive
                      ? "bg-[#FFF2EE] text-[#F95738] font-semibold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4 text-slate-400" />
                    <span>{item.name}</span>
                  </div>
                  {item.hasArrow && <ChevronRight className="h-3.5 w-3.5 text-slate-400" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* MANAGEMENT Section */}
        <div className="space-y-1">
          <span className="px-3.5 text-[11px] font-bold text-slate-400 tracking-wider uppercase">
            Management
          </span>
          <div className="mt-1 space-y-0.5">
            {managementItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.name;
              return (
                <button
                  key={item.name}
                  onClick={() => handleSelect(item.name)}
                  className={cn(
                    "w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-sm font-medium transition-all",
                    isActive
                      ? "bg-[#FFF2EE] text-[#F95738] font-semibold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4 text-slate-400" />
                    <span>{item.name}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ADMIN Section */}
        <div className="space-y-1">
          <span className="px-3.5 text-[11px] font-bold text-slate-400 tracking-wider uppercase">
            Admin
          </span>
          <div className="mt-1 space-y-0.5">
            {adminItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.name;
              return (
                <button
                  key={item.name}
                  onClick={() => handleSelect(item.name)}
                  className={cn(
                    "w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-sm font-medium transition-all",
                    isActive
                      ? "bg-[#FFF2EE] text-[#F95738] font-semibold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4 text-slate-400" />
                    <span>{item.name}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Settings & Promo Card */}
      <div className="space-y-4 pt-4 border-t border-slate-100">
        <div className="space-y-0.5">
          <button
            onClick={() => handleSelect("Settings")}
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all"
          >
            <Settings className="h-4 w-4 text-slate-400" />
            <span>Settings</span>
          </button>
          <button
            onClick={() => handleSelect("Help & Support")}
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all"
          >
            <HelpCircle className="h-4 w-4 text-slate-400" />
            <span>Help & Support</span>
          </button>
        </div>

        {/* Decorative Quote Card */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#FFF9F6] to-[#FFF1EA] p-4 border border-[#FFE3D8]">
          <div className="flex items-center gap-2 text-amber-500 mb-1">
            <Sparkles className="h-3.5 w-3.5" />
          </div>
          <p className="text-xs font-semibold text-slate-800 leading-snug">
            Better teamwork builds great products
          </p>
          <div className="absolute right-2 bottom-1 opacity-40">
            {/* Plant SVG snippet */}
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="1.5">
              <path d="M12 22V12m0 0C12 7.5 7.5 6 7.5 6S6 10.5 12 12zm0 0c0-4.5 4.5-6 4.5-6s1.5 4.5-4.5 6z" />
            </svg>
          </div>
        </div>
      </div>
    </aside>
  );
}
