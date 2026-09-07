"use client";

import React, { useState } from "react";
import { User, Workspace } from "@/types/taskflow";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Save, User as UserIcon, Building, Bell, Moon, Sun } from "lucide-react";

interface SettingsViewProps {
  currentUser: User;
  workspace: Workspace;
}

export function SettingsView({ currentUser, workspace }: SettingsViewProps) {
  const [activeTab, setActiveTab] = useState<"profile" | "workspace" | "notifications" | "theme">("profile");

  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [jobTitle, setJobTitle] = useState(currentUser.jobTitle || "");
  const [workspaceName, setWorkspaceName] = useState(workspace.name);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [assignmentAlerts, setAssignmentAlerts] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-base font-bold text-[#1F2A2E]">Settings & Preferences</h2>
        <p className="text-xs text-[#6B7A80]">
          Manage your personal account, workspace configuration, and notification alerts.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        {/* Settings Navigation Tabs */}
        <div className="bg-white rounded-lg border border-[#E3E8E6] p-1.5 space-y-0.5">
          <button
            type="button"
            onClick={() => setActiveTab("profile")}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-colors text-left ${
              activeTab === "profile"
                ? "bg-[#E6F2F0] text-[#0F766E] font-bold"
                : "text-[#3D4A4F] hover:bg-[#EFF2F1]"
            }`}
          >
            <UserIcon className="h-3.5 w-3.5" /> Profile & Account
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("workspace")}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-colors text-left ${
              activeTab === "workspace"
                ? "bg-[#E6F2F0] text-[#0F766E] font-bold"
                : "text-[#3D4A4F] hover:bg-[#EFF2F1]"
            }`}
          >
            <Building className="h-3.5 w-3.5" /> Workspace
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("notifications")}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-colors text-left ${
              activeTab === "notifications"
                ? "bg-[#E6F2F0] text-[#0F766E] font-bold"
                : "text-[#3D4A4F] hover:bg-[#EFF2F1]"
            }`}
          >
            <Bell className="h-3.5 w-3.5" /> Notifications
          </button>
        </div>

        {/* Settings Form Card */}
        <div className="md:col-span-3 bg-white rounded-lg border border-[#E3E8E6] p-6 shadow-2xs space-y-5">
          {activeTab === "profile" && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-[#1F2A2E] border-b border-[#E3E8E6] pb-2">
                Personal Information
              </h3>

              <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14 border-2 border-[#E3E8E6]">
                  <AvatarImage src={currentUser.avatarUrl} alt={name} />
                  <AvatarFallback className="bg-[#E6F2F0] text-[#0F766E] font-bold">
                    BK
                  </AvatarFallback>
                </Avatar>
                <div>
                  <button
                    type="button"
                    className="px-3 py-1.5 text-xs font-semibold rounded-md border border-[#E3E8E6] hover:bg-[#EFF2F1] text-[#1F2A2E]"
                  >
                    Change avatar
                  </button>
                  <p className="text-[10px] text-[#6B7A80] mt-1">JPG, PNG or GIF up to 5MB.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#6B7A80]">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white border border-[#E3E8E6] rounded-md px-3 py-1.5 text-xs text-[#1F2A2E] focus:outline-none focus:border-[#0F766E]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#6B7A80]">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border border-[#E3E8E6] rounded-md px-3 py-1.5 text-xs text-[#1F2A2E] focus:outline-none focus:border-[#0F766E]"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-semibold text-[#6B7A80]">Job Title / Role</label>
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="w-full bg-white border border-[#E3E8E6] rounded-md px-3 py-1.5 text-xs text-[#1F2A2E] focus:outline-none focus:border-[#0F766E]"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "workspace" && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-[#1F2A2E] border-b border-[#E3E8E6] pb-2">
                Workspace Settings
              </h3>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#6B7A80]">Workspace Name</label>
                  <input
                    type="text"
                    value={workspaceName}
                    onChange={(e) => setWorkspaceName(e.target.value)}
                    className="w-full bg-white border border-[#E3E8E6] rounded-md px-3 py-1.5 text-xs text-[#1F2A2E] focus:outline-none focus:border-[#0F766E]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#6B7A80]">Workspace Slug / URL</label>
                  <div className="flex items-center rounded-md border border-[#E3E8E6] overflow-hidden bg-[#F6F8F7]">
                    <span className="px-3 text-xs text-[#6B7A80] border-r border-[#E3E8E6]">
                      taskflow.app/
                    </span>
                    <input
                      type="text"
                      defaultValue={workspace.slug}
                      readOnly
                      className="w-full bg-transparent px-3 py-1.5 text-xs text-[#1F2A2E] outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-[#1F2A2E] border-b border-[#E3E8E6] pb-2">
                Notification Preferences
              </h3>

              <div className="space-y-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={emailNotifications}
                    onChange={(e) => setEmailNotifications(e.target.checked)}
                    className="mt-0.5 rounded border-[#CBD4D1] text-[#0F766E] focus:ring-[#0F766E]"
                  />
                  <div>
                    <span className="text-xs font-bold text-[#1F2A2E] block">
                      Email task assignments and @mentions
                    </span>
                    <span className="text-[11px] text-[#6B7A80]">
                      Receive immediate emails when teammates assign you or mention your name.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={assignmentAlerts}
                    onChange={(e) => setAssignmentAlerts(e.target.checked)}
                    className="mt-0.5 rounded border-[#CBD4D1] text-[#0F766E] focus:ring-[#0F766E]"
                  />
                  <div>
                    <span className="text-xs font-bold text-[#1F2A2E] block">
                      Nightly 08:00 AM deadline reminders
                    </span>
                    <span className="text-[11px] text-[#6B7A80]">
                      Get a summary alert for tasks due in the next 24 hours.
                    </span>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-4 border-t border-[#E3E8E6] flex items-center justify-between">
            {savedSuccess ? (
              <span className="text-xs text-[#15803D] font-bold">✓ Preferences saved successfully!</span>
            ) : (
              <span />
            )}

            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-1.5 bg-[#0F766E] hover:bg-[#0C5F58] text-white text-xs font-semibold px-4 py-2 rounded-md shadow-xs transition-all active:scale-95"
            >
              <Save className="h-3.5 w-3.5" /> Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
