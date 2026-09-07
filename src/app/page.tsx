"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Navbar } from "@/components/dashboard/Navbar";
import { StatCards } from "@/components/dashboard/StatCards";
import { ChartsSection } from "@/components/dashboard/ChartsSection";
import { MyTasksSection } from "@/components/dashboard/MyTasksSection";
import { ProjectsSection } from "@/components/dashboard/ProjectsSection";
import { TeamMembersSection } from "@/components/dashboard/TeamMembersSection";
import { QuickStatsSection } from "@/components/dashboard/QuickStatsSection";
import { RightSidebar } from "@/components/dashboard/RightSidebar";
import { Calendar, Plus } from "lucide-react";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("Home");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex font-sans antialiased selection:bg-[#F95738]/20 selection:text-[#F95738]">
      {/* 1. Left Sidebar */}
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* 2. Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <Navbar onSearchChange={setSearchQuery} />

        {/* Dashboard Main Workspace */}
        <div className="flex-1 p-6 lg:p-8 max-w-[1750px] w-full mx-auto space-y-6">
          {/* Header Greeting & Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
                Good Morning, Bilal <span className="text-2xl">👋</span>
              </h1>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                Here&apos;s what&apos;s happening with your team today.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Date Pill */}
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200/80 text-xs font-semibold text-slate-700 shadow-xs">
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                <span>Sep 7, 2025</span>
              </div>

              {/* Create Task Button */}
              <button
                type="button"
                className="flex items-center gap-1.5 bg-[#F95738] hover:bg-[#e44a2c] text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-sm transition-all hover:shadow-md active:scale-95"
              >
                <Plus className="h-4 w-4 stroke-[2.5]" /> Create Task
              </button>
            </div>
          </div>

          {/* Core Grid Layout (Center Content + Right Sidebar) */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
            {/* Center Area (8 or 9 cols on XL) */}
            <div className="xl:col-span-8 space-y-6">
              {/* Row 1: 4 Stat Cards */}
              <StatCards />

              {/* Row 2: Charts (Task Overview + Task Status) */}
              <ChartsSection />

              {/* Row 3: Two Column Split for Tasks & Projects */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column: My Tasks + Quick Stats */}
                <div className="space-y-6">
                  <MyTasksSection />
                  <QuickStatsSection />
                </div>

                {/* Right Column: Projects + Team Members */}
                <div className="space-y-6">
                  <ProjectsSection />
                  <TeamMembersSection />
                </div>
              </div>
            </div>

            {/* Right Sidebar (4 cols on XL) */}
            <div className="xl:col-span-4">
              <RightSidebar />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
