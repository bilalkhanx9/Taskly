"use client";

import React from "react";
import { User, Workspace, Project, Task, AuditLog } from "@/types/taskflow-v2";
import { 
  FolderKanban, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ArrowUpRight, 
  Plus, 
  Users, 
  Activity, 
  ChevronRight,
  Sparkles,
  TrendingUp,
  ShieldCheck
} from "lucide-react";

interface WorkspaceHomeViewProps {
  currentUser: User;
  workspace: Workspace;
  projects: Project[];
  tasks: Task[];
  auditLogs: AuditLog[];
  onSelectProject: (projectId: string) => void;
  onOpenTask: (taskId: string) => void;
  onNewTask: () => void;
  onNewProject: () => void;
  onNavigate: (screen: string) => void;
}

export const WorkspaceHomeView: React.FC<WorkspaceHomeViewProps> = ({
  currentUser,
  workspace,
  projects,
  tasks,
  auditLogs,
  onSelectProject,
  onOpenTask,
  onNewTask,
  onNewProject,
  onNavigate
}) => {
  const isOwnerOrManager = currentUser.role === "WORKSPACE_OWNER" || currentUser.role === "MANAGER";

  // Compute workspace metrics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === "done").length;
  const inProgressTasks = tasks.filter(t => t.status === "in_progress" || t.status === "in_review").length;
  const blockedTasks = tasks.filter(t => t.status === "blocked").length;
  const myTasks = tasks.filter(t => t.assignee?.id === currentUser.id);

  // Upcoming deadlines (tasks due soon)
  const upcomingTasks = [...tasks]
    .filter(t => t.status !== "done")
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 4);

  return (
    <div className="w-full space-y-5">
      {/* Top Banner / Welcome Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--surface)] p-6 rounded-xl border border-[var(--line)] shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--ink-muted)]">
              {workspace.name} Workspace
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-orange-50 text-[var(--accent-700)] border border-orange-200">
              {currentUser.role.replace("_", " ")}
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--ink)]">
            Good afternoon, {currentUser.name.split(" ")[0]}
          </h1>
          <p className="text-xs text-[var(--ink-muted)] mt-1">
            You have <strong className="text-[var(--ink)] font-semibold">{myTasks.filter(t => t.status !== "done").length} open tasks</strong> assigned to you today.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {currentUser.role !== "VIEWER" && (
            <button
              onClick={onNewTask}
              className="h-[38px] px-4 bg-[var(--accent-700)] hover:bg-[var(--accent-800)] text-white font-medium text-xs rounded-lg flex items-center gap-2 shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              New Task
            </button>
          )}
          {isOwnerOrManager && (
            <button
              onClick={onNewProject}
              className="h-[38px] px-4 bg-[var(--surface)] hover:bg-[var(--surface-hover)] border border-[var(--line-strong)] text-[var(--ink)] font-medium text-xs rounded-lg flex items-center gap-2 transition-colors"
            >
              <FolderKanban className="w-4 h-4 text-[var(--accent-700)]" />
              New Project
            </button>
          )}
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[var(--surface)] p-4 rounded-xl border border-[var(--line)]">
          <div className="flex items-center justify-between text-xs text-[var(--ink-muted)] mb-1">
            <span>Total Projects</span>
            <FolderKanban className="w-4 h-4 text-[var(--accent-700)]" />
          </div>
          <div className="text-2xl font-bold text-[var(--ink)]">{projects.length}</div>
          <div className="text-[11px] text-emerald-600 mt-1 flex items-center gap-1 font-medium">
            <TrendingUp className="w-3 h-3" /> Active &amp; tracked
          </div>
        </div>

        <div className="bg-[var(--surface)] p-4 rounded-xl border border-[var(--line)]">
          <div className="flex items-center justify-between text-xs text-[var(--ink-muted)] mb-1">
            <span>In Progress</span>
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-[var(--ink)]">{inProgressTasks}</div>
          <div className="text-[11px] text-[var(--ink-muted)] mt-1">
            {totalTasks} total workspace tasks
          </div>
        </div>

        <div className="bg-[var(--surface)] p-4 rounded-xl border border-[var(--line)]">
          <div className="flex items-center justify-between text-xs text-[var(--ink-muted)] mb-1">
            <span>Completed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-[var(--ink)]">{completedTasks}</div>
          <div className="text-[11px] text-emerald-600 mt-1 font-medium">
            {totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}% delivery rate
          </div>
        </div>

        <div className="bg-[var(--surface)] p-4 rounded-xl border border-[var(--line)]">
          <div className="flex items-center justify-between text-xs text-[var(--ink-muted)] mb-1">
            <span>Blocked Tasks</span>
            <AlertCircle className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-2xl font-bold text-[var(--ink)]">{blockedTasks}</div>
          <div className="text-[11px] text-red-600 mt-1 font-medium">
            {blockedTasks > 0 ? "Requires attention" : "No blockers"}
          </div>
        </div>
      </div>

      {/* Main 2-Column Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Active Projects Grid */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[var(--surface)] p-5 rounded-xl border border-[var(--line)] shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FolderKanban className="w-4 h-4 text-[var(--accent-700)]" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--ink)]">
                  Active Projects
                </h2>
              </div>
              <button
                onClick={() => onNavigate("projects-list")}
                className="text-xs font-semibold text-[var(--accent-700)] hover:underline flex items-center gap-1"
              >
                View all ({projects.length}) <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {projects.map((proj) => {
                const total = proj.taskCount ?? proj.totalTasks ?? 0;
                const completed = proj.completedTaskCount ?? proj.completedTasks ?? 0;
                const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

                return (
                  <div
                    key={proj.id}
                    onClick={() => onSelectProject(proj.id)}
                    className="p-4 rounded-lg border border-[var(--line)] hover:border-[var(--accent-600)] hover:shadow-sm bg-[var(--surface)] transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span 
                            className="w-3 h-3 rounded-sm flex-shrink-0"
                            style={{ backgroundColor: proj.color }}
                          />
                          <span className="font-semibold text-sm text-[var(--ink)] group-hover:text-[var(--accent-700)] transition-colors">
                            {proj.name}
                          </span>
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-[var(--ink-faint)] group-hover:text-[var(--accent-700)] transition-colors" />
                      </div>
                      <p className="text-xs text-[var(--ink-muted)] line-clamp-2 mb-3">
                        {proj.description}
                      </p>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-[var(--line)]">
                      <div className="flex items-center justify-between text-[11px] text-[var(--ink-muted)]">
                        <span>{proj.completedTaskCount} of {proj.taskCount} tasks done</span>
                        <span className="font-medium text-[var(--ink)]">{percent}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-[var(--surface-sunken)] rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-300"
                          style={{ 
                            width: `${percent}%`, 
                            backgroundColor: proj.color || "var(--accent-700)" 
                          }}
                        />
                      </div>
                      <div className="flex items-center justify-between pt-1 text-[11px] text-[var(--ink-faint)]">
                        <div className="flex -space-x-1.5">
                          {proj.members.slice(0, 3).map((m, idx) => (
                            <img
                              key={idx}
                              src={m.avatarUrl}
                              alt={m.name}
                              className="w-5 h-5 rounded-full border border-white object-cover"
                              title={m.name}
                            />
                          ))}
                        </div>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> Due {proj.deadline}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Team Workload Balancing Panel (Section 7.10) */}
          <div className="bg-[var(--surface)] p-5 rounded-xl border border-[var(--line)] shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[var(--accent-700)]" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--ink)]">
                  Team Workload
                </h2>
              </div>
              <button
                onClick={() => onNavigate("team-directory")}
                className="text-xs font-semibold text-[var(--accent-700)] hover:underline flex items-center gap-1"
              >
                Team Directory <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {(() => {
                const membersMap = new Map<string, { name: string; role: string; count: number; color: string }>();
                
                // Add current user
                membersMap.set(currentUser.id, {
                  name: currentUser.name,
                  role: currentUser.role === "PLATFORM_ADMIN" ? "Platform Admin" : currentUser.role === "WORKSPACE_OWNER" ? "Workspace Owner" : "Team Member",
                  count: tasks.filter(t => t.assignee?.id === currentUser.id).length,
                  color: "bg-[var(--accent-700)]"
                });

                // Add any other assignees from tasks
                tasks.forEach(t => {
                  if (t.assignee && !membersMap.has(t.assignee.id)) {
                    membersMap.set(t.assignee.id, {
                      name: t.assignee.name,
                      role: t.assignee.role ? t.assignee.role.replace("_", " ") : "Member",
                      count: tasks.filter(tk => tk.assignee?.id === t.assignee?.id).length,
                      color: "bg-blue-500"
                    });
                  }
                });

                const memberList = Array.from(membersMap.values());
                const maxTasks = Math.max(...memberList.map(m => m.count), 1);

                return memberList.map((member, i) => {
                  const pct = Math.min(Math.round((member.count / Math.max(maxTasks, 5)) * 100), 100);
                  return (
                    <div key={i} className="flex items-center justify-between text-xs py-1.5 border-b border-[var(--line)] last:border-0">
                      <div className="flex items-center gap-2.5 w-1/3 min-w-0">
                        <div className="w-6 h-6 rounded-full bg-[var(--surface-sunken)] border border-[var(--line-strong)] flex items-center justify-center font-bold text-[10px] text-[var(--ink)] shrink-0">
                          {member.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="truncate">
                          <div className="font-medium text-[var(--ink)] truncate">{member.name}</div>
                          <div className="text-[10px] text-[var(--ink-muted)] truncate">{member.role}</div>
                        </div>
                      </div>

                      <div className="flex-1 mx-4">
                        <div className="w-full h-1.5 bg-[var(--surface-sunken)] rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${member.color} rounded-full`}
                            style={{ width: `${Math.max(pct, 15)}%` }}
                          />
                        </div>
                      </div>

                      <div className="text-right text-[11px] text-[var(--ink-muted)] w-24 shrink-0">
                        <strong className="text-[var(--ink)]">{member.count}</strong> {member.count === 1 ? "task" : "tasks"} ({pct}%)
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Upcoming Deadlines & Activity Feed */}
        <div className="space-y-6">
          
          {/* Upcoming Deadlines */}
          <div className="bg-[var(--surface)] p-5 rounded-xl border border-[var(--line)] shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[var(--accent-700)]" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--ink)]">
                  Upcoming Deadlines
                </h2>
              </div>
              <button
                onClick={() => onNavigate("calendar")}
                className="text-xs font-semibold text-[var(--accent-700)] hover:underline"
              >
                Calendar
              </button>
            </div>

            <div className="space-y-2.5">
              {upcomingTasks.map((t) => (
                <div
                  key={t.id}
                  onClick={() => onOpenTask(t.id)}
                  className="p-2.5 rounded-lg border border-[var(--line)] hover:border-[var(--accent-600)] bg-[var(--surface-hover)] cursor-pointer transition-colors"
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="text-xs font-medium text-[var(--ink)] hover:text-[var(--accent-700)] line-clamp-1">
                      {t.title}
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                      t.priority === "urgent" ? "bg-red-50 text-red-700 border border-red-200" :
                      t.priority === "high" ? "bg-amber-50 text-amber-700 border border-amber-200" :
                      "bg-stone-50 text-stone-600 border border-stone-200"
                    }`}>
                      {t.priority}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[var(--ink-muted)]">
                    <span className="font-mono text-[10px] text-[var(--ink-faint)]">#{t.id}</span>
                    <span className="flex items-center gap-1 font-medium text-orange-700">
                      <Clock className="w-3 h-3" /> Due {t.dueDate}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Feed (Section 7.10) */}
          <div className="bg-[var(--surface)] p-5 rounded-xl border border-[var(--line)] shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[var(--accent-700)]" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--ink)]">
                  Recent Activity
                </h2>
              </div>
            </div>

            <div className="space-y-3">
              {auditLogs.slice(0, 5).map((log) => (
                <div key={log.id} className="flex items-start gap-2.5 text-xs py-1 border-b border-[var(--line)] last:border-0">
                  <div className="w-5 h-5 rounded-full bg-orange-100 text-[var(--accent-700)] flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                    {(log.actorName || log.actor?.name || "U").charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[var(--ink-body)] line-clamp-2">
                      <strong className="text-[var(--ink)]">{log.actorName || log.actor?.name || "User"}</strong> {log.action.replace("_", " ")} on{" "}
                      <span className="font-semibold text-[var(--ink)]">{log.targetName || log.target || "Workspace"}</span>
                    </div>
                    <div className="text-[10px] text-[var(--ink-faint)] mt-0.5 font-mono">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
