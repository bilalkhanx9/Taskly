# TaskFlow
## Complete Product & Design Documentation — Version 2.0

**Document type:** Functional + technical + design specification
**Status:** Build-ready
**Last updated:** 7 September 2026

---

## How to read this document

| If you are… | Read these sections |
|---|---|
| Product owner / evaluator | 1, 2, 3, 4, 21 |
| UI / UX designer | 5, 6, 7 (every page spec) |
| Frontend developer | 5, 6, 7, 12, 13, 15 |
| Backend developer | 8, 9, 10, 11, 12, 14, 16 |
| QA | 6, 7, 9, 14, 18 |

Every screen in Section 7 follows the same template: **Purpose → Route & access → Layout → Element-by-element spec → Buttons → Dropdowns → States → Validation → Keyboard → Responsive → Permissions.** Nothing is left as "and so on" — if a control exists on screen, it is specified here.

---

# 1. Product Overview

## 1.1 What TaskFlow is

TaskFlow is a browser-based work management application for organisations. A company signs up with a work email, creates a **workspace** for their organisation, creates **projects** inside that workspace, and breaks each project into **tasks** that are assigned, prioritised, tracked, and completed.

## 1.2 The problem

In most small companies, work lives in four places at once: WhatsApp groups, email threads, a shared Excel file, and someone's head. The result is predictable — two people do the same task, one task is forgotten entirely, and the manager has to ask "where are we on this?" three times a day.

TaskFlow replaces all four with one place where the answer to "who is doing what, and when is it due" is always one click away.

## 1.3 Who it is for

| User type | What they need |
|---|---|
| Company owner / founder | Overall visibility, control over who has access, billing |
| Project manager / team lead | Plan work, assign it, spot blockers, report progress |
| Team member (developer, designer, writer) | A clear list of what they personally need to do today |
| Client or stakeholder | Read-only visibility into progress without touching anything |
| Platform administrator (TaskFlow's own staff) | Manage all organisations on the platform, handle abuse, monitor health |

## 1.4 Product principles

These five rules decide every design argument in this document.

**1. The next action is always obvious.** Every screen answers one primary question and offers one primary button. If a screen has two equally weighted primary buttons, the screen is wrong.

**2. Colour means something or it is not there.** The interface is white and warm grey. Orange appears only on interactive elements. Red, blue, violet and green appear only as status or urgency signals. Nothing is coloured for decoration.

**3. Nothing is hidden behind an edit mode.** Fields are edited where they are displayed. There is no "Edit" button that turns a read view into a form.

**4. Destructive actions are always reversible or always confirmed.** Completing a task shows an Undo toast. Deleting a project requires typing its name.

**5. The interface never lies about state.** If something is saving, the UI says "Saving". If it failed, it says so and rolls back. Optimistic updates always have a defined failure path.

## 1.5 Scope

**Version 1 includes:** work-email authentication, role-based access, workspaces, projects, tasks with subtasks, board / list / calendar views, task detail with comments and attachments, assignment, priorities, due dates, labels, dependencies, search, filters, saved views, notifications, dashboards, an admin console, and a full settings area.

**Version 1 excludes:** Gantt/timeline charts, time tracking, custom fields, third-party integrations, public API tokens, native mobile apps, automation rules, and AI features. All are listed in Section 21 with target phases.

---

# 2. Core Concepts

Understanding these five objects is enough to understand the whole product.

```
Organisation (identified by email domain)
   └── Workspace  ────────── a team's container
          ├── Members  ───── people, each with a role
          ├── Labels   ───── shared tags
          └── Project  ───── a body of work with a deadline
                 ├── Project members (subset of workspace members)
                 └── Task  ─────── a single unit of work
                        ├── Subtask
                        ├── Comment
                        ├── Attachment
                        ├── Watcher
                        └── Dependency
```

| Concept | Definition | Rules |
|---|---|---|
| **Organisation** | All users sharing one verified email domain (`@novastudio.pk`) | Created implicitly on first signup from that domain |
| **Workspace** | The top-level container a team works inside | A user can belong to several. Has exactly one Owner. Cannot be deleted while it has active projects unless the Owner confirms cascade |
| **Project** | A group of related tasks with its own members, colour and deadline | Belongs to exactly one workspace. Cannot be moved between workspaces |
| **Task** | One unit of work with an owner, status and due date | Belongs to exactly one project. Can have one parent task |
| **Subtask** | A task whose `parent_task_id` is set | Inherits project from parent. Cannot itself have subtasks (one level only) |

**Why one level of subtasks only:** unlimited nesting produces trees nobody can read and progress percentages nobody trusts. One level covers 95% of real use.

---

# 3. Roles and Permissions

## 3.1 The five roles

| Role | Scope | Who it is | Assigned by |
|---|---|---|---|
| **Platform Admin** | Entire platform | TaskFlow's own staff | Seeded in database; never assignable through the UI |
| **Workspace Owner** | One workspace | The person who created it | Automatic on workspace creation; transferable |
| **Manager** | One workspace | Team lead, project manager | Owner |
| **Member** | One workspace | Designer, developer, writer | Owner or Manager |
| **Viewer** | One workspace | Client, stakeholder, intern | Owner or Manager |

A user holds **one role per workspace**. The same person can be a Manager in "Nova Studio" and a Viewer in "Client Portal". The role is read from `workspace_members.role` on every request.

## 3.2 Where each role lands after login

This is the single most important behaviour in the authentication flow.

| Role | Landing route | What they see first |
|---|---|---|
| Platform Admin | `/admin` | Platform console — organisations, users, system health. **No workspace UI at all** |
| Workspace Owner | `/w/:slug/home` | Workspace home with project grid, member summary, and an admin strip |
| Manager | `/w/:slug/home` | Workspace home, project grid, team workload panel |
| Member | `/w/:slug/my-tasks` | Their own task list — not the project grid |
| Viewer | `/w/:slug/projects` | Read-only project list |

**Reasoning for each:**
- A Platform Admin is not a customer. Dropping them into a workspace dashboard would be meaningless. They get a completely separate shell with its own navigation, its own colour treatment (a dark top bar to make it visually obvious you are in the admin console), and no "New task" button anywhere.
- Owners and Managers plan. They need the wide view — which projects exist, who is overloaded, what is slipping.
- Members execute. Showing a Member the project grid forces them to click twice before seeing their own work. They land on My Tasks.
- Viewers observe. They get the project list, and everything inside it is read-only.

**Edge cases:**
- User belongs to **zero** workspaces → `/onboarding/workspace`
- User belongs to **one** workspace → that workspace, role-based route above
- User belongs to **multiple** workspaces → the last-visited workspace (stored in `users.last_workspace_id`); if that workspace was deleted, the oldest joined workspace
- User is **unverified** → `/verify-email`, regardless of role
- User is **suspended** → `/account-suspended`, a static page with a support contact

## 3.3 Full permission matrix

Legend: ✅ full · 🟡 own items only · 👁 read only · ❌ none

### Workspace level

| Action | Platform Admin | Owner | Manager | Member | Viewer |
|---|:---:|:---:|:---:|:---:|:---:|
| Create workspace | ✅ | ✅ | ✅ | ✅ | ❌ |
| Rename workspace | ✅ | ✅ | ❌ | ❌ | ❌ |
| Change workspace logo | ✅ | ✅ | ❌ | ❌ | ❌ |
| Change workspace timezone | ✅ | ✅ | ✅ | ❌ | ❌ |
| Delete workspace | ✅ | ✅ | ❌ | ❌ | ❌ |
| Transfer ownership | ✅ | ✅ | ❌ | ❌ | ❌ |
| Leave workspace | ❌ | 🟡¹ | ✅ | ✅ | ✅ |
| View billing | ✅ | ✅ | ❌ | ❌ | ❌ |
| Change plan | ✅ | ✅ | ❌ | ❌ | ❌ |
| Manage allowed email domains | ✅ | ✅ | ❌ | ❌ | ❌ |
| View workspace audit log | ✅ | ✅ | 👁² | ❌ | ❌ |

¹ Owner must transfer ownership before leaving.
² Manager sees the audit log filtered to their own projects.

### Member management

| Action | Platform Admin | Owner | Manager | Member | Viewer |
|---|:---:|:---:|:---:|:---:|:---:|
| View member list | ✅ | ✅ | ✅ | ✅ | 👁 |
| Invite Member / Viewer | ✅ | ✅ | ✅ | ❌ | ❌ |
| Invite Manager | ✅ | ✅ | ❌ | ❌ | ❌ |
| Invite Owner | ❌ | ❌ | ❌ | ❌ | ❌ |
| Change a Member's role | ✅ | ✅ | 🟡³ | ❌ | ❌ |
| Remove a Member | ✅ | ✅ | 🟡³ | ❌ | ❌ |
| Remove a Manager | ✅ | ✅ | ❌ | ❌ | ❌ |
| Cancel a pending invite | ✅ | ✅ | 🟡⁴ | ❌ | ❌ |
| Resend an invite | ✅ | ✅ | ✅ | ❌ | ❌ |
| Regenerate the join link | ✅ | ✅ | ❌ | ❌ | ❌ |

³ Manager can only change or remove users whose role is Member or Viewer.
⁴ Manager can only cancel invites they themselves sent.

### Project level

| Action | Platform Admin | Owner | Manager | Member | Viewer |
|---|:---:|:---:|:---:|:---:|:---:|
| View project list | ✅ | ✅ | ✅ | ✅⁵ | 👁⁵ |
| Open a project | ✅ | ✅ | ✅ | ✅⁵ | 👁⁵ |
| Create project | ✅ | ✅ | ✅ | ❌ | ❌ |
| Edit project name / description | ✅ | ✅ | ✅ | ❌ | ❌ |
| Change project colour / icon | ✅ | ✅ | ✅ | ❌ | ❌ |
| Change project status | ✅ | ✅ | ✅ | ❌ | ❌ |
| Set project deadline | ✅ | ✅ | ✅ | ❌ | ❌ |
| Add / remove project members | ✅ | ✅ | ✅ | ❌ | ❌ |
| Configure board columns | ✅ | ✅ | ✅ | ❌ | ❌ |
| Set WIP limits | ✅ | ✅ | ✅ | ❌ | ❌ |
| Duplicate project | ✅ | ✅ | ✅ | ❌ | ❌ |
| Archive project | ✅ | ✅ | ✅ | ❌ | ❌ |
| Restore archived project | ✅ | ✅ | ✅ | ❌ | ❌ |
| Delete project permanently | ✅ | ✅ | ❌ | ❌ | ❌ |
| Export project to CSV | ✅ | ✅ | ✅ | ✅ | ❌ |

⁵ Only projects they have been added to. Owners and Managers see all projects in the workspace.

### Task level

| Action | Platform Admin | Owner | Manager | Member | Viewer |
|---|:---:|:---:|:---:|:---:|:---:|
| View task | ✅ | ✅ | ✅ | ✅ | 👁 |
| Create task | ✅ | ✅ | ✅ | ✅ | ❌ |
| Edit any task's title / description | ✅ | ✅ | ✅ | 🟡⁶ | ❌ |
| Change status of any task | ✅ | ✅ | ✅ | 🟡⁶ | ❌ |
| Change priority | ✅ | ✅ | ✅ | 🟡⁶ | ❌ |
| Assign task to self | ✅ | ✅ | ✅ | ✅ | ❌ |
| Assign task to someone else | ✅ | ✅ | ✅ | ❌ | ❌ |
| Set / change due date | ✅ | ✅ | ✅ | 🟡⁶ | ❌ |
| Add / remove labels | ✅ | ✅ | ✅ | ✅ | ❌ |
| Add subtasks | ✅ | ✅ | ✅ | 🟡⁶ | ❌ |
| Set dependencies | ✅ | ✅ | ✅ | ❌ | ❌ |
| Move task to another project | ✅ | ✅ | ✅ | ❌ | ❌ |
| Archive task | ✅ | ✅ | ✅ | 🟡⁶ | ❌ |
| Delete task | ✅ | ✅ | ✅ | ❌ | ❌ |
| Comment | ✅ | ✅ | ✅ | ✅ | ❌ |
| Edit own comment | ✅ | ✅ | ✅ | ✅ | ❌ |
| Delete any comment | ✅ | ✅ | ✅ | ❌ | ❌ |
| Upload attachment | ✅ | ✅ | ✅ | ✅ | ❌ |
| Delete any attachment | ✅ | ✅ | ✅ | 🟡⁷ | ❌ |
| Watch / unwatch | ✅ | ✅ | ✅ | ✅ | ✅ |
| Bulk edit tasks | ✅ | ✅ | ✅ | ❌ | ❌ |

⁶ Member can edit tasks assigned to them, and tasks they created that are still unassigned.
⁷ Member can delete attachments they uploaded themselves.

### Platform level (Platform Admin only)

| Action | Available |
|---|---|
| View all organisations and workspaces | ✅ |
| Search any user by email | ✅ |
| Suspend / reactivate a user account | ✅ |
| Suspend / reactivate a workspace | ✅ |
| Force-verify an email address | ✅ |
| Impersonate a user (read-only, audit-logged) | ✅ |
| View platform-wide metrics | ✅ |
| Manage the blocked email domain list | ✅ |
| View error and job queue health | ✅ |
| Send a platform-wide announcement banner | ✅ |
| Read task content | ❌ — deliberately blocked. Admins can see counts and metadata, never task titles, descriptions or comments |

**Why Platform Admins cannot read task content:** customers store commercially sensitive work in these tasks. Metadata (counts, timestamps, storage used) is enough to support and bill them. Anything more is a privacy liability with no operational benefit.

## 3.4 How permissions are enforced

Three layers, all three required:

**Layer 1 — Route guard (frontend).** A middleware checks the user's role before rendering a route. Wrong role → redirect to their landing page, do not render.

**Layer 2 — UI gating (frontend).** Controls the user cannot use are **not rendered at all**, not rendered-and-disabled. A greyed-out "Delete project" button teaches a Member that the feature exists and they are not trusted; hiding it keeps their interface simpler. Exception: when hiding a control would make the layout confusing, render it disabled with a tooltip stating who can do it ("Only the workspace owner can change billing").

**Layer 3 — API guard (backend).** Every endpoint runs a `requirePermission(action, resource)` middleware. This is the only layer that actually matters for security. The frontend layers are for user experience.

```ts
// apps/api/src/middleware/permissions.ts
export const requirePermission =
  (action: Action) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const membership = await getMembership(req.user.id, req.params.workspaceId);
    if (!membership) return res.status(403).json(err('NOT_A_MEMBER'));
    if (!can(membership.role, action, req)) {
      return res.status(403).json(err('INSUFFICIENT_ROLE'));
    }
    req.membership = membership;
    next();
  };
```

**403 response rule:** never reveal existence. Requesting a task in a workspace you do not belong to returns **404**, not 403 — otherwise the API confirms that a given task ID exists.

---

# 4. Navigation Model

## 4.1 The workspace-first flow

This is the spine of the product. Every new user walks this exact path.

```
Landing page
     ↓  [Get started]
Sign up  ──── work email only ────→  Email verification
                                            ↓
                                   Create workspace   ← nothing exists yet
                                            ↓
                                     Invite team (skippable)
                                            ↓
                                     Create first project
                                            ↓
                              WORKSPACE HOME — project grid
                                            ↓  click a project card
                              PROJECT VIEW — dashboard, board, list,
                                             calendar, files, settings
```

**The rule:** a user cannot reach any project screen until a workspace exists. There is no "personal" mode without a workspace, no default workspace created silently. The workspace is created explicitly by the user and named by them, because everything else — members, projects, labels, billing — hangs off it.

## 4.2 The two application shells

TaskFlow has exactly two layout shells. Every authenticated screen uses one of them.

### Shell A — Workspace shell
Used by Owner, Manager, Member, Viewer. Sidebar + top bar + content.

```
┌──────────────┬──────────────────────────────────────────┐
│ WORKSPACE    │  Top bar: search · notifications · help  │
│ SWITCHER  ▾  │           · avatar menu                  │
├──────────────┼──────────────────────────────────────────┤
│ Home         │                                          │
│ My tasks  7  │                                          │
│ Projects     │              CONTENT AREA                │
│ Calendar     │                                          │
│ Team         │                                          │
│ Reports      │                                          │
│              │                                          │
│ PROJECTS     │                                          │
│ ● Website    │                                          │
│ ● Mobile app │                                          │
│ ● Q4 mktg    │                                          │
│ + New project│                                          │
│              │                                          │
│ ─────────────│                                          │
│ Settings     │                                          │
│ Ayesha K.    │                                          │
└──────────────┴──────────────────────────────────────────┘
```

### Shell B — Admin shell
Used by Platform Admin only. Dark top bar, no sidebar projects, no "New task" anywhere.

```
┌────────────────────────────────────────────────────────┐
│ ▪ TASKFLOW ADMIN   Organisations Users System Logs  AK │   ← dark bar
├────────────────────────────────────────────────────────┤
│                                                        │
│                    CONTENT AREA                        │
│                                                        │
└────────────────────────────────────────────────────────┘
```

The dark bar is deliberate. It is the only dark surface in the entire product, and it exists so that an admin can never mistake the admin console for a customer workspace.

## 4.3 The workspace switcher

Sits at the very top of the sidebar, above everything else. Clicking it opens a dropdown.

**Collapsed state (the sidebar button):**
- 24×24 workspace avatar — uploaded logo, or initials on an orange-tinted square
- Workspace name, truncated with ellipsis at 140px
- Chevron icon (`chevron-selector-vertical`), 14px, muted
- Whole row is a 36px-tall button with 6px radius; hover fills with `--surface-hover`

**Expanded dropdown (280px wide, opens below and left-aligned):**

| Section | Content |
|---|---|
| Header | Current user's email, 12px muted, non-interactive |
| Workspace list | Every workspace the user belongs to. Each row: avatar, name, role pill (12px), checkmark on the active one. Max height 240px then scrolls |
| Divider | 1px `--line` |
| Action row 1 | `+ Create workspace` — plus icon, orange text. Opens the create-workspace modal |
| Action row 2 | `Join a workspace` — link icon. Opens a modal for pasting an invite code |
| Divider | |
| Action row 3 | `Workspace settings` — cog icon. Owner and Manager only |
| Action row 4 | `Invite people` — user-plus icon. Owner and Manager only |

**Keyboard:** `Cmd/Ctrl + K` then type a workspace name jumps directly. Arrow keys navigate the open dropdown, Enter selects, Escape closes.

**Switching behaviour:** selecting a different workspace performs a full client-side navigation to that workspace's role-appropriate landing route, updates `users.last_workspace_id`, and clears any cached filters from the previous workspace. It does **not** hard-reload the page.

## 4.4 Sidebar specification

| Property | Value |
|---|---|
| Expanded width | 248px |
| Collapsed width | 64px |
| Background | `--surface` (`#FFFFFF`) |
| Right border | 1px `--line` |
| Padding | 12px horizontal, 16px vertical |
| Collapse trigger | Chevron button on the right edge, appears on hover; or `Cmd/Ctrl + \` |
| Collapse persistence | `localStorage` per user per device |
| Auto-collapse | Automatically collapsed on the Board view and on viewports under 1280px |

**Navigation item anatomy:**
- Height 36px, 8px horizontal padding, 6px radius
- Icon 18px on the left, then 10px gap, then 14px label
- Optional count badge on the right: 11px text, `--surface-sunken` background, 10px radius, 2px/7px padding
- **Default:** icon and label in `--ink-muted`
- **Hover:** background `--surface-hover`, label `--ink-body`
- **Active:** background `--accent-50`, icon and label `--accent-700`, weight 500
- **Focus:** 2px `--accent-500` ring, 2px offset

**Project list in the sidebar:**
- Section label "PROJECTS" — 11px, uppercase, letter-spacing 0.06em, `--ink-faint`, 8px left padding
- Each project row: 8px colour square (2px radius) + name at 13px, truncated
- Shows a maximum of 8 projects sorted by most recently opened, then `Show all (14)`
- `+ New project` row at the bottom, muted until hover
- Right-click on a project row opens a context menu: Open, Open in new tab, Copy link, Pin to top, Leave project

**Bottom section** (pushed down with `margin-top: auto`, separated by a 1px top border):
- `Settings` row
- User row: 22px avatar, first name, chevron. Opens the account menu upward.

## 4.5 Top bar specification

| Property | Value |
|---|---|
| Height | 56px |
| Background | `--surface` |
| Bottom border | 1px `--line` |
| Padding | 0 20px |
| Position | Sticky, `z-index: 40` |

Contents, left to right:

1. **Breadcrumb** — Workspace name › Project name › Task ID. 13px, `--ink-muted`, last segment `--ink-body`. Each segment clickable. Collapses to `…` in the middle when over 3 levels.
2. **Search field** — flexible width, max 420px. Magnifier icon, placeholder "Search tasks, projects, people", `⌘K` hint pill on the right. Clicking or pressing the shortcut opens the command palette overlay.
3. **Help button** — question-mark circle icon, 18px. Dropdown: Keyboard shortcuts, Documentation, Contact support, What's new.
4. **Notification bell** — 18px. Unread count badge: 16px circle, `--danger-600` background, white 10px text, positioned top-right with a 2px white ring. Caps at `9+`. Click opens the notification popover.
5. **Primary action button** — context-dependent: `New task` inside a project, `New project` on workspace home, hidden entirely for Viewers.
6. **Avatar menu** — 28px circle. Dropdown: name and email header, Profile settings, Notification preferences, Theme submenu (Light / Dark / System), Keyboard shortcuts, divider, Log out.

## 4.6 Complete route table

| Route | Screen | Shell | Roles |
|---|---|---|---|
| `/` | Landing page | Public | Everyone |
| `/features`, `/pricing`, `/about`, `/contact` | Marketing pages | Public | Everyone |
| `/register` | Sign up | Auth | Logged out |
| `/verify-email` | Email verification | Auth | Unverified |
| `/login` | Log in | Auth | Logged out |
| `/forgot-password` | Request reset | Auth | Logged out |
| `/reset-password?token=` | Set new password | Auth | Logged out |
| `/onboarding/workspace` | Create first workspace | Auth | Verified, 0 workspaces |
| `/onboarding/invite` | Invite team | Auth | New owner |
| `/onboarding/project` | Create first project | Auth | New owner |
| `/join/:token` | Accept invitation | Auth | Invited |
| `/w/:slug/home` | Workspace home | A | Owner, Manager |
| `/w/:slug/my-tasks` | My tasks | A | All workspace roles |
| `/w/:slug/projects` | All projects | A | All workspace roles |
| `/w/:slug/projects/:projectId` | Project dashboard | A | Project members |
| `/w/:slug/projects/:projectId/board` | Board view | A | Project members |
| `/w/:slug/projects/:projectId/list` | List view | A | Project members |
| `/w/:slug/projects/:projectId/calendar` | Calendar view | A | Project members |
| `/w/:slug/projects/:projectId/files` | Files | A | Project members |
| `/w/:slug/projects/:projectId/settings` | Project settings | A | Owner, Manager |
| `/w/:slug/tasks/:taskId` | Task detail | A | Project members |
| `/w/:slug/calendar` | Workspace calendar | A | All |
| `/w/:slug/team` | Team directory | A | All |
| `/w/:slug/reports` | Reports | A | Owner, Manager |
| `/w/:slug/notifications` | Notification centre | A | All |
| `/w/:slug/settings/general` | Workspace settings | A | Owner |
| `/w/:slug/settings/members` | Member management | A | Owner, Manager |
| `/w/:slug/settings/labels` | Label management | A | Owner, Manager |
| `/w/:slug/settings/domains` | Allowed domains | A | Owner |
| `/w/:slug/settings/billing` | Billing | A | Owner |
| `/w/:slug/settings/audit` | Audit log | A | Owner |
| `/settings/profile` | Personal profile | A | All |
| `/settings/security` | Password, sessions | A | All |
| `/settings/notifications` | Notification prefs | A | All |
| `/admin` | Admin overview | B | Platform Admin |
| `/admin/organisations` | Organisation list | B | Platform Admin |
| `/admin/organisations/:id` | Organisation detail | B | Platform Admin |
| `/admin/users` | User search | B | Platform Admin |
| `/admin/users/:id` | User detail | B | Platform Admin |
| `/admin/domains` | Blocked domain list | B | Platform Admin |
| `/admin/system` | Queue and error health | B | Platform Admin |
| `/admin/announcements` | Platform banners | B | Platform Admin |
| `/403` | Forbidden | Minimal | — |
| `/404` | Not found | Minimal | — |
| `/500` | Server error | Minimal | — |
| `/account-suspended` | Suspended notice | Minimal | Suspended users |

---

# 5. Design System

## 5.1 Visual direction

**Warm, white, and quiet.** The interface is built on pure white surfaces sitting on a faintly warm off-white canvas. Structure comes from hairline borders, not from shadows or heavy fills. A single warm orange carries every interactive element — buttons, links, active navigation, focus rings, selection. Status colours (blue, violet, green, red) appear only inside small badges and thin indicator bars.

The reference feeling is a well-printed document: generous whitespace, crisp thin rules, one ink colour for emphasis. Not a dashboard covered in coloured tiles.

**What this direction rules out:** gradients of any kind, coloured page backgrounds, drop shadows on static cards, glassmorphism, illustrated empty states, decorative icons, and more than one primary button per screen.

## 5.2 Colour palette

### 5.2.1 The accent — warm orange

The whole product hangs off one hue. These seven steps are the complete accent ramp; no other orange values appear anywhere.

| Token | Hex | Contrast on white | Use |
|---|---|---|---|
| `--accent-50` | `#FFF7F0` | — | Page-level tint, active nav background, selected table row |
| `--accent-100` | `#FFE9D6` | — | Hover on tinted surfaces, chip backgrounds, avatar fallback |
| `--accent-200` | `#FFD3B0` | — | Chart secondary fills, progress track highlight |
| `--accent-400` | `#FB923C` | 2.1:1 | Icons on tinted backgrounds, chart primary fill, drag outline |
| `--accent-500` | `#F97316` | 2.9:1 | Focus rings, borders on focused inputs, non-text emphasis |
| `--accent-600` | `#EA580C` | 3.6:1 | Primary button hover fill, large heading accents (24px+) |
| `--accent-700` | `#C2410C` | 5.3:1 ✅ | **Primary button fill, links, active nav text, all accent text** |
| `--accent-800` | `#9A3412` | 7.4:1 ✅ | Pressed button state, text on `--accent-100` backgrounds |

**The critical rule:** any orange used as **text** or as a **button fill with white text** must be `--accent-700` or darker. `#F97316` looks better but fails WCAG AA at 2.9:1. Use it for rings and fills, never for words.

**Why warm orange:** it is the only common accent hue that reads as energetic without reading as an alert. Blue is the default of every enterprise tool and disappears; red is reserved for danger; green means "done" and cannot also mean "click here". Orange also pairs naturally with a warm neutral ramp, which is what makes the whole interface feel like paper rather than like a screen.

### 5.2.2 Neutrals — warm stone

Neutrals are warm-tinted, not blue-grey. A cool grey next to orange looks dirty; a warm grey looks intentional.

| Token | Hex | Use |
|---|---|---|
| `--surface` | `#FFFFFF` | Cards, modals, sidebar, top bar, table rows, inputs |
| `--surface-hover` | `#FAF8F6` | Row and nav-item hover |
| `--canvas` | `#FBFAF8` | The page background behind all cards |
| `--surface-sunken` | `#F5F3F0` | Kanban column backgrounds, code blocks, count badges |
| `--surface-inset` | `#EFEBE7` | Progress bar tracks, skeleton blocks, disabled fills |
| `--line` | `#E9E4DE` | Every border and divider by default |
| `--line-strong` | `#D8D1C9` | Input borders, dashed drop zones, stronger separators |
| `--line-heavy` | `#B8AFA5` | Rarely — table header underline, printed rules |

### 5.2.3 Text

| Token | Hex | Contrast | Use |
|---|---|---|---|
| `--ink` | `#1C1917` | 16.9:1 | Page titles, section headings, task titles, numbers in metric cards |
| `--ink-body` | `#44403C` | 10.2:1 | Body copy, descriptions, comment text, table cell values |
| `--ink-muted` | `#78716C` | 4.9:1 ✅ | Labels, metadata, timestamps, inactive nav, helper text |
| `--ink-faint` | `#A8A29E` | 2.7:1 | Placeholders and disabled text **only** — never for content |
| `--ink-inverse` | `#FFFFFF` | — | Text on accent, danger, and dark surfaces |

`--ink-faint` fails AA on purpose — it is only ever used for text that carries no information (input placeholders repeating the label, disabled controls). No real content is ever set in it.

### 5.2.4 Status colours

Applied only to badges, pills, and 3px indicator bars. Each has a text/border value and a background tint.

| Status | Text / border | Background | Meaning |
|---|---|---|---|
| Backlog | `#78716C` | `#F5F3F0` | Captured but not scheduled |
| To Do | `#475569` | `#F1F5F9` | Scheduled, not started |
| In Progress | `#1D4ED8` | `#EFF4FF` | Actively being worked on |
| In Review | `#6D28D9` | `#F5F1FE` | Waiting on someone else's approval |
| Done | `#15803D` | `#EEFAF1` | Complete |
| Blocked | `#B91C1C` | `#FEF1F1` | Cannot proceed |

**Note on In Progress:** in a green-accent design this would be amber. Because the accent is now orange, amber would collide with interactive elements — a user would not know whether an amber pill is a status or a button. In Progress therefore moves to blue.

### 5.2.5 Priority colours

Applied only to 8px dots and 3px card left-borders. Never as a background.

| Priority | Hex | Rationale |
|---|---|---|
| Low | `#A8A29E` | Warm grey — present but recessive |
| Medium | `#0E7490` | Deep cyan — clearly distinct from both orange and status blue |
| High | `#B45309` | Deep amber — warm, urgent, but darker and browner than the accent |
| Urgent | `#B91C1C` | Deep red — the only red used outside error states |

Priority is **never** communicated by colour alone. Every dot has a `title` tooltip, the list view has a sortable priority column, and the task detail shows the word.

### 5.2.6 Feedback colours

| Purpose | Text / icon | Background | Border |
|---|---|---|---|
| Success | `#15803D` | `#EEFAF1` | `#BBE9C9` |
| Warning | `#B45309` | `#FEF6E7` | `#F5DDB0` |
| Danger | `#B91C1C` | `#FEF1F1` | `#F6C9C9` |
| Info | `#1D4ED8` | `#EFF4FF` | `#C3D6FD` |

### 5.2.7 Data visualisation palette

Used for charts and for project colour assignment. Eight hues, all readable at 5px width on white, all distinguishable in the three common colour-blindness types.

| # | Hex | Name |
|---|---|---|
| 1 | `#EA580C` | Orange |
| 2 | `#0E7490` | Teal |
| 3 | `#7C3AED` | Violet |
| 4 | `#B45309` | Amber |
| 5 | `#1D4ED8` | Blue |
| 6 | `#15803D` | Green |
| 7 | `#BE185D` | Pink |
| 8 | `#57534E` | Stone |

Project colours are assigned round-robin from this list at creation and can be changed by the creator.

### 5.2.8 Dark theme mapping

Dark mode is a Phase 4 deliverable. When built, tokens remap as follows and no component code changes.

| Token | Light | Dark |
|---|---|---|
| `--surface` | `#FFFFFF` | `#1C1917` |
| `--canvas` | `#FBFAF8` | `#141210` |
| `--surface-sunken` | `#F5F3F0` | `#262220` |
| `--line` | `#E9E4DE` | `#332E2A` |
| `--ink` | `#1C1917` | `#FAFAF9` |
| `--ink-body` | `#44403C` | `#D6D3D1` |
| `--ink-muted` | `#78716C` | `#A8A29E` |
| `--accent-700` (text) | `#C2410C` | `#FB923C` |
| `--accent-700` (button fill) | `#C2410C` | `#EA580C` |

The accent inverts direction in dark mode: light text needs a *lighter* orange to pass contrast, so `--accent-400` becomes the text value.

### 5.2.9 Token implementation

```css
/* apps/web/src/styles/tokens.css */
:root {
  /* accent */
  --accent-50:  #FFF7F0;
  --accent-100: #FFE9D6;
  --accent-200: #FFD3B0;
  --accent-400: #FB923C;
  --accent-500: #F97316;
  --accent-600: #EA580C;
  --accent-700: #C2410C;
  --accent-800: #9A3412;

  /* neutrals */
  --surface:        #FFFFFF;
  --surface-hover:  #FAF8F6;
  --canvas:         #FBFAF8;
  --surface-sunken: #F5F3F0;
  --surface-inset:  #EFEBE7;
  --line:           #E9E4DE;
  --line-strong:    #D8D1C9;
  --line-heavy:     #B8AFA5;

  /* text */
  --ink:         #1C1917;
  --ink-body:    #44403C;
  --ink-muted:   #78716C;
  --ink-faint:   #A8A29E;
  --ink-inverse: #FFFFFF;

  /* status */
  --status-backlog:     #78716C;  --status-backlog-bg:     #F5F3F0;
  --status-todo:        #475569;  --status-todo-bg:        #F1F5F9;
  --status-progress:    #1D4ED8;  --status-progress-bg:    #EFF4FF;
  --status-review:      #6D28D9;  --status-review-bg:      #F5F1FE;
  --status-done:        #15803D;  --status-done-bg:        #EEFAF1;
  --status-blocked:     #B91C1C;  --status-blocked-bg:     #FEF1F1;

  /* priority */
  --priority-low:    #A8A29E;
  --priority-medium: #0E7490;
  --priority-high:   #B45309;
  --priority-urgent: #B91C1C;

  /* feedback */
  --success: #15803D; --success-bg: #EEFAF1; --success-border: #BBE9C9;
  --warning: #B45309; --warning-bg: #FEF6E7; --warning-border: #F5DDB0;
  --danger:  #B91C1C; --danger-bg:  #FEF1F1; --danger-border:  #F6C9C9;
  --info:    #1D4ED8; --info-bg:    #EFF4FF; --info-border:    #C3D6FD;
}
```

Tailwind config extends `colors` from these variables so classes like `bg-accent-700` and `text-ink-muted` are available throughout.

---

## 5.3 Typography

### 5.3.1 Type families

Three families, each with a defined job. No fourth family is ever introduced.

| Role | Family | Weights loaded | Why |
|---|---|---|---|
| **Display** — page titles, marketing headlines, metric numbers, empty-state headings | **Plus Jakarta Sans** | 500, 600, 700 | Geometric with slightly humanist terminals. Has real personality at 24px+, which is what stops the product looking like a Bootstrap template. Its warmth suits the orange palette |
| **Interface & body** — everything else: nav, labels, buttons, table cells, descriptions, comments, form fields | **Inter** | 400, 500, 600 | Designed for screen UI at small sizes. Tall x-height keeps 12–14px text legible, and its numerals align in tables |
| **Mono** — task IDs, code blocks, API keys, timestamps in the audit log | **JetBrains Mono** | 400, 500 | Clear zero, unambiguous `1`/`l`/`I`, comfortable at 12px |

```css
--font-display: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
--font-ui:      'Inter', system-ui, -apple-system, sans-serif;
--font-mono:    'JetBrains Mono', 'SF Mono', Menlo, monospace;
```

**Loading:** self-host via `next/font/google` with `display: swap` and `preload: true` for Inter 400/500 and Plus Jakarta Sans 600. Subset to `latin`. JetBrains Mono loads lazily — it only appears on a handful of screens. Total font payload target: under 90 KB.

**Fallback ordering matters.** `system-ui` before `-apple-system` means Windows gets Segoe UI and Android gets Roboto — both close enough in metrics that the swap does not cause a visible reflow.

### 5.3.2 The type scale

Every text element in the product uses one of these thirteen steps. If a design needs a fourteenth, the design is wrong.

| Token | Size | Line height | Weight | Letter spacing | Family | Used for |
|---|---|---|---|---|---|---|
| `display-xl` | 52px / 3.25rem | 1.08 (56px) | 700 | −0.03em | Display | Landing page hero headline |
| `display-lg` | 40px / 2.5rem | 1.15 (46px) | 700 | −0.025em | Display | Marketing section headings |
| `display-md` | 30px / 1.875rem | 1.2 (36px) | 600 | −0.02em | Display | Auth card titles, empty-state headings |
| `title-lg` | 24px / 1.5rem | 1.3 (32px) | 600 | −0.015em | Display | Page titles ("Projects", "My tasks") |
| `title-md` | 20px / 1.25rem | 1.35 (27px) | 600 | −0.01em | Display | Modal titles, task detail title |
| `title-sm` | 17px / 1.0625rem | 1.4 (24px) | 600 | −0.005em | Display | Card headings, section headings, project names |
| `metric` | 30px / 1.875rem | 1.1 (33px) | 600 | −0.02em | Display | Big numbers in dashboard metric cards |
| `body-lg` | 16px / 1rem | 1.6 (26px) | 400 | 0 | UI | Marketing body copy, task descriptions |
| `body` | 14px / 0.875rem | 1.57 (22px) | 400 | 0 | UI | **Default.** Table cells, comments, form values, list items |
| `body-strong` | 14px | 1.57 (22px) | 500 | 0 | UI | Task titles in lists, names, emphasised values |
| `label` | 13px / 0.8125rem | 1.38 (18px) | 500 | 0 | UI | Form labels, nav items, buttons, tabs |
| `caption` | 12px / 0.75rem | 1.33 (16px) | 400 | 0 | UI | Metadata, timestamps, helper text, counts |
| `overline` | 11px / 0.6875rem | 1.27 (14px) | 600 | 0.06em, uppercase | UI | Sidebar section headers, table column heads |

**Minimum size is 11px.** Nothing smaller ships, including badge text and tooltips.

**Negative letter-spacing on display sizes is not optional.** Plus Jakarta Sans at 52px with default tracking looks loose and amateur. The `−0.03em` tightening at `display-xl` is what makes the hero look designed.

### 5.3.3 Numerals

All tables, dates, counts, and metric cards use tabular figures so columns align:

```css
.tabular { font-variant-numeric: tabular-nums; font-feature-settings: 'tnum' 1; }
```

Applied to: list-view date column, all metric card numbers, all count badges, the calendar grid, and the reports tables. Not applied to body copy, where proportional figures read better.

### 5.3.4 Measure and rhythm

- Task descriptions and comments: `max-width: 68ch`
- Marketing body copy: `max-width: 62ch`
- Never justify text; always left-align (or right-align in a future RTL build)
- Paragraph spacing inside rich text: 12px, not a blank line
- Heading top margin is always larger than bottom margin (24px above / 8px below) so headings group with the text they introduce

### 5.3.5 Truncation rules

| Content | Rule |
|---|---|
| Task title on a board card | Clamp to 2 lines, then ellipsis |
| Task title in a list row | Single line, ellipsis, full text in `title` attribute |
| Project name in the sidebar | Single line, ellipsis at the container width |
| Workspace name in the switcher | Single line, max 140px |
| Description on a project card | Clamp to 2 lines |
| Comment body | Full, never truncated — collapse after 8 lines with a "Show more" link |
| User names | Never truncate first names; truncate surnames to an initial if space is short |

---

## 5.4 Spacing, radius, and elevation

### 5.4.1 Spacing scale

A 4px base. Only these values are used:

`2 · 4 · 6 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 64 · 80`

| Context | Value |
|---|---|
| Icon to adjacent label | 8px |
| Inside a button (vertical / horizontal) | 8px / 16px |
| Inside an input | 9px / 12px |
| Inside a card | 16px (compact) or 20px (standard) |
| Between cards in a grid | 12px |
| Between form fields | 16px |
| Between form sections | 32px |
| Page content padding | 24px (desktop), 16px (tablet), 12px (mobile) |
| Between page sections | 32px |

### 5.4.2 Border radius

Different element weights get different radii. A single radius applied to everything is the fastest way to make an interface look generic.

| Element | Radius |
|---|---|
| Badge, pill, tag, avatar | `9999px` (full) |
| Checkbox | 4px |
| Button, input, select, dropdown item | 6px |
| Card, panel, dropdown menu, popover | 10px |
| Modal, drawer, large container | 14px |
| Board card | 6px, but with a **square** left edge where the 3px priority bar sits |

### 5.4.3 Borders and elevation

Structure comes from borders. Shadows are for things that float.

| Layer | Treatment |
|---|---|
| Static card, panel, table row | `1px solid var(--line)`. **No shadow** |
| Input, select | `1px solid var(--line-strong)` |
| Dropdown, popover, tooltip | `1px solid var(--line)` + `0 4px 12px rgba(28,25,23,0.07)` |
| Modal, drawer | `0 16px 48px rgba(28,25,23,0.14)` + a `rgba(28,25,23,0.40)` backdrop |
| Card being dragged | `0 8px 24px rgba(28,25,23,0.16)` + `rotate(-1.5deg)` + `scale(1.02)` |
| Sticky top bar when scrolled | `0 1px 0 var(--line)` only — a hairline, not a shadow |

### 5.4.4 Layout dimensions

| Element | Value |
|---|---|
| Sidebar expanded / collapsed | 248px / 64px |
| Top bar height | 56px |
| Content max width | 1400px, centred |
| Task detail drawer width | 560px (desktop), full width under 900px |
| Modal widths | Small 400px · Medium 520px · Large 720px |
| Kanban column width | 280px fixed, horizontal scroll beyond viewport |
| Table row height | 44px |
| Minimum touch target | 44 × 44px |

---

## 5.5 Iconography

**Library:** Lucide React, 1.5px stroke weight throughout. No mixing with other icon sets.

| Context | Size |
|---|---|
| Sidebar navigation | 18px |
| Top bar actions | 18px |
| Inside buttons | 16px |
| Inline with body text | 14px |
| Metadata rows on cards | 13px |
| Empty states | 28px |

**Rules:**
- Icons inherit `currentColor`; they are never given their own colour except for status indicators
- Every icon-only button carries an `aria-label` and a tooltip on hover after 400ms
- Icons never appear next to a label purely for decoration — if the label is clear, the icon is removed
- Optical alignment: icons sit 1px higher than the text baseline (`vertical-align: -0.125em`)

**Standard icon assignments:**

| Meaning | Icon |
|---|---|
| Task | `circle-check` |
| Project | `folder` |
| Workspace | `layout-grid` |
| Board view | `columns-3` |
| List view | `list` |
| Calendar | `calendar` |
| Team / members | `users` |
| Reports | `chart-bar` |
| Settings | `settings` |
| Notifications | `bell` |
| Search | `search` |
| Add | `plus` |
| More actions | `more-horizontal` |
| Filter | `sliders-horizontal` |
| Sort | `arrow-up-down` |
| Attachment | `paperclip` |
| Comment | `message-square` |
| Subtask | `list-checks` |
| Due date | `calendar-clock` |
| Priority | `flag` |
| Assignee | `user` |
| Watch | `eye` |
| Copy link | `link` |
| Archive | `archive` |
| Delete | `trash-2` |
| Overdue warning | `alert-circle` |
| Blocked | `ban` |

---

## 5.6 Motion

Motion exists to explain a change of state, never to entertain.

| Interaction | Duration | Easing |
|---|---|---|
| Button / row hover | 120ms | `ease-out` |
| Dropdown open | 140ms | `cubic-bezier(0.16, 1, 0.3, 1)` |
| Modal enter (fade + scale 0.98→1) | 180ms | `cubic-bezier(0.16, 1, 0.3, 1)` |
| Modal exit | 120ms | `ease-in` |
| Drawer slide from right | 220ms | `cubic-bezier(0.32, 0.72, 0, 1)` |
| Card drop into a column | 200ms | `cubic-bezier(0.2, 0, 0, 1)` |
| Card drag follow | 0ms | 1:1 with cursor, no lag |
| Toast enter / exit | 200ms / 150ms | `ease-out` / `ease-in` |
| Progress bar fill | 400ms | `ease-out` |
| Skeleton shimmer | 1400ms loop | `linear` |
| Accordion expand | 180ms | `ease-out` |

**Never animated:** page transitions, scroll-triggered reveals, number counters, chart draw-ins, sidebar navigation.

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

Under reduced motion, drag-and-drop still functions — the card simply appears in its new position instead of animating there.

---

## 5.7 Component specifications

### 5.7.1 Buttons

**Variants**

| Variant | Background | Text | Border | Hover | Active | Use |
|---|---|---|---|---|---|---|
| Primary | `--accent-700` | white | none | `--accent-600` | `--accent-800` | The one main action per screen |
| Secondary | `--surface` | `--ink-body` | 1px `--line-strong` | bg `--surface-hover` | bg `--surface-sunken` | Cancel, secondary actions |
| Tertiary (ghost) | transparent | `--ink-body` | none | bg `--surface-hover` | bg `--surface-sunken` | Toolbar actions, `⋯` menus |
| Accent-text | transparent | `--accent-700` | none | bg `--accent-50` | bg `--accent-100` | Inline links styled as buttons |
| Destructive | `--surface` | `--danger` | 1px `--danger-border` | bg `--danger-bg` | — | Delete in menus |
| Destructive-solid | `--danger` | white | none | `#991B1B` | — | **Only** the confirm button in a delete dialog |

**Sizes**

| Size | Height | Padding | Font | Icon | Use |
|---|---|---|---|---|---|
| `xs` | 26px | 0 8px | 12px / 500 | 13px | Inline table actions |
| `sm` | 32px | 0 12px | 13px / 500 | 14px | Toolbars, filter bars, card actions |
| `md` | 38px | 0 16px | 14px / 500 | 16px | **Default.** Top bar, modal footers |
| `lg` | 44px | 0 22px | 15px / 500 | 18px | Auth forms, landing page CTAs |

**States**

- **Focus:** `box-shadow: 0 0 0 2px var(--surface), 0 0 0 4px var(--accent-500)` — a white gap then the ring, so it reads on any background
- **Disabled:** `opacity: 0.45`, `cursor: not-allowed`, no hover change. Always paired with a tooltip explaining why
- **Loading:** label is replaced by a 14px spinner plus the present-participle label ("Saving…"), width is locked to the pre-click width to prevent layout shift, button becomes `aria-busy="true"` and non-interactive
- **Icon-only:** square (26/32/38/44px), `aria-label` required, tooltip after 400ms

**Layout rules:** in a modal footer the primary button sits on the **right**, secondary to its left, 8px gap. Destructive actions in a confirmation dialog put the destructive button on the right. Never place two primary buttons side by side.

### 5.7.2 Text inputs

| Property | Value |
|---|---|
| Height | 38px (md), 32px (sm), 44px (lg) |
| Padding | 9px 12px |
| Border | 1px `--line-strong` |
| Radius | 6px |
| Background | `--surface` |
| Font | 14px / 400, `--ink` |
| Placeholder | 14px `--ink-faint` |

**States**

| State | Treatment |
|---|---|
| Hover | Border `--line-heavy` |
| Focus | Border `--accent-500`, ring `0 0 0 3px var(--accent-100)` |
| Filled | No visual change from default |
| Error | Border `--danger`, ring `0 0 0 3px var(--danger-bg)`, message below |
| Success | Border `--success`, check icon inside on the right |
| Disabled | Background `--surface-inset`, text `--ink-faint`, no border change |
| Read-only | No border, background transparent, text `--ink-body` |

**Anatomy:** label (13px/500 `--ink-body`, 6px above) → optional helper text (12px `--ink-muted`, 6px above the field) → field → error or hint (12px, 6px below). Required fields get a `*` in `--danger` after the label. Optional fields in a mostly-required form get "(optional)" in `--ink-muted` instead — marking the minority is always cleaner.

**Character counters** appear at the bottom-right of the field, 11px `--ink-muted`, and only once the user passes 80% of the limit. Turn `--danger` at 100%.

### 5.7.3 Select and dropdown

**Trigger** looks identical to a text input, with a `chevron-down` 16px icon on the right in `--ink-muted`.

**Menu**

| Property | Value |
|---|---|
| Min width | Matches the trigger, minimum 180px |
| Max height | 320px, then scrolls |
| Padding | 4px |
| Radius | 10px |
| Border + shadow | 1px `--line` + `0 4px 12px rgba(28,25,23,0.07)` |
| Item height | 34px |
| Item padding | 0 10px |
| Item radius | 6px |
| Item font | 14px / 400 |

**Item states:** hover / keyboard-highlighted → `--surface-hover`; selected → `--accent-50` background, `--accent-700` text, 16px check icon on the right; disabled → `--ink-faint`, no hover.

**Optional parts:** a search field pinned at the top (appears automatically when there are more than 8 options); section headers in `overline` style; a divider before destructive items; a footer action row (e.g. "+ Create new label").

**Multi-select** replaces the check with a 4px-radius checkbox on the left and keeps the menu open after each selection. The trigger shows up to two chips then "+3".

### 5.7.4 Checkbox, radio, toggle

| Control | Size | Unchecked | Checked |
|---|---|---|---|
| Checkbox | 16×16, 4px radius | 1px `--line-strong` border, white fill | `--accent-700` fill, white 11px check |
| Radio | 16×16, full radius | 1px `--line-strong` border | 5px `--accent-700` dot, 1.5px `--accent-700` ring |
| Toggle | 36×20, full radius | `--line-strong` track, white 16px knob left | `--accent-700` track, knob right |

Indeterminate checkbox: `--accent-700` fill with a 8×2px white bar. Toggle knob transition: 160ms `cubic-bezier(0.32,0.72,0,1)`.

**Hit area** is always at least 32×32 even though the visual control is 16px, achieved with padding on the wrapping label.

### 5.7.5 Badges and pills

| Type | Height | Padding | Font | Radius |
|---|---|---|---|---|
| Status pill | 20px | 0 8px | 11px / 500 | full |
| Label chip | 20px | 0 8px | 11px / 500 | full |
| Count badge | 18px | 0 6px | 11px / 500 | full |
| Role pill | 18px | 0 7px | 11px / 500 | full |
| Priority dot | 8×8 | — | — | 2px |

Status pills always use the status text colour on the status background. Label chips derive both from the label's chosen hue at fixed lightness steps (background at 94% L, text at 28% L) so any user-picked colour stays readable.

### 5.7.6 Avatars

| Size | Use |
|---|---|
| 20px | Board card, subtask row |
| 24px | List row, comment on mobile |
| 28px | Top bar, dropdown |
| 32px | Comment thread, member list |
| 40px | Task detail assignee, profile card |
| 72px | Profile settings page |

**Fallback:** initials (first letter of first and last name), uppercase, in `--font-ui` 500. Background is picked deterministically from the 8-colour data palette by hashing the user ID, at 92% lightness, with the text at 30% lightness of the same hue. The same person is therefore always the same colour everywhere.

**Stacks:** overlap by 30% of the width, each with a 2px `--surface` ring, maximum 4 shown then a `+N` chip in `--surface-sunken`. Hovering any avatar shows a tooltip with the full name and role.

### 5.7.7 Tooltips

11px text, `--ink` background, `--ink-inverse` text, 6px radius, 5px/9px padding, 4px offset from the trigger, 400ms open delay, 0ms close. Max width 240px. Never contains interactive content. Appears on hover and on keyboard focus.

### 5.7.8 Modals and drawers

**Modal:** centred, 14px radius, `0 16px 48px rgba(28,25,23,0.14)`, backdrop `rgba(28,25,23,0.40)`.
- Header: 20px title, optional 13px description, close `×` top-right, 20px padding, 1px bottom border
- Body: 20px padding, `max-height: 70vh` then scrolls with the header and footer pinned
- Footer: 16px/20px padding, 1px top border, buttons right-aligned

**Drawer:** slides from the right, 560px wide, full height, 14px radius on the left corners only. Used for task detail. Same backdrop.

**Behaviour for both:** focus is trapped inside; focus moves to the first interactive element on open and returns to the trigger on close; `Escape` closes; clicking the backdrop closes **unless** the form is dirty, in which case a "Discard changes?" confirmation appears; body scroll is locked.

### 5.7.9 Toasts

Bottom-right, stacked upward, 360px wide, 10px radius, 1px border, `0 4px 12px rgba(28,25,23,0.10)`, 12px/14px padding.

| Type | Border | Icon | Duration |
|---|---|---|---|
| Success | `--success-border` | `check-circle` `--success` | 4s |
| Error | `--danger-border` | `alert-circle` `--danger` | 8s (or until dismissed) |
| Info | `--info-border` | `info` `--info` | 5s |
| Undo | `--line` | none | 6s with a visible progress bar |

Maximum 3 stacked; older toasts collapse into "2 more". Each has a `×` dismiss. Undo toasts carry an `Undo` accent-text button on the right.

### 5.7.10 Tables

| Property | Value |
|---|---|
| Header row | 40px, `overline` type, `--ink-muted`, 1px bottom border `--line-strong` |
| Body row | 44px, 1px bottom border `--line` |
| Cell padding | 0 12px |
| Row hover | `--surface-hover` |
| Row selected | `--accent-50` |
| Sortable header | Cursor pointer, `arrow-up-down` icon appears on hover, becomes a solid direction arrow when active |
| Sticky header | Yes, with a 1px bottom border when scrolled |
| Zebra striping | **Never** — borders are sufficient and striping fights the selection colour |

Numeric and date columns are right-aligned with tabular numerals and a fixed width so they form a clean column.

### 5.7.11 Empty states

Three parts, centred, maximum 320px wide:
1. A 28px Lucide icon in `--ink-faint` (never an illustration)
2. A `title-sm` heading that states what belongs here — "No tasks in this project yet"
3. A `caption` line of guidance, then one primary button that creates the missing thing

Empty states never say "No results found" and stop. They always offer the next action. A filtered-to-nothing table instead shows "No tasks match these filters" with a `Clear filters` secondary button.

### 5.7.12 Loading and skeletons

Skeleton blocks in `--surface-inset` with a 1400ms shimmer, shaped like the content they replace (a 14px-tall bar for a title, a 20px circle for an avatar). Rules:

- The application shell (sidebar, top bar) renders instantly and is never skeletonised
- Each card or panel loads independently — one slow request does not blank the page
- Full-page spinners are not used anywhere
- Inline actions (saving a field, posting a comment) use a small spinner inside the control, not a page overlay
- If a request exceeds 8 seconds, replace the skeleton with an error state and a `Retry` button

### 5.7.13 Banners

Full-width strips at the top of the content area, 12px/16px padding, 8px radius, 1px border, using the feedback colour set. Used for: trial expiry warnings, unverified email reminders, platform announcements, project-archived notices. Dismissible banners store their dismissal in `localStorage` keyed by banner ID.

---

## 5.8 Accessibility standard

Target: **WCAG 2.1 Level AA**, verified with axe-core in CI.

| Requirement | Implementation |
|---|---|
| Text contrast | 4.5:1 for text under 18px, 3:1 for 18px+ and for UI component boundaries |
| Colour independence | Status has a text label; priority has a tooltip and a sortable column; overdue has an icon plus a word |
| Focus visibility | 2px `--accent-500` ring with a 2px white offset on every focusable element. `:focus-visible` only — no rings on mouse click |
| Keyboard operation | Every action reachable by keyboard, including drag-and-drop (dnd-kit keyboard sensor) |
| Focus management | Trapped in modals; returned to the trigger on close; skip-to-content link as the first tab stop |
| Semantic structure | One `h1` per page, no skipped heading levels, `nav` / `main` / `aside` landmarks |
| Live regions | Toasts announce via `role="status"`; errors via `role="alert"`; the task count announces on filter change |
| Images | Every avatar and uploaded image has alt text; decorative icons carry `aria-hidden="true"` |
| Forms | Every input has a `<label>`; errors are linked with `aria-describedby` and `aria-invalid` |
| Motion | `prefers-reduced-motion` respected globally |
| Zoom | Layout survives 200% browser zoom without horizontal scroll |
| Touch targets | 44 × 44px minimum on touch devices |

---

## 5.9 Responsive behaviour

| Breakpoint | Width | Layout |
|---|---|---|
| `xs` | < 480px | Single column. Bottom tab bar replaces the sidebar. Board becomes one column with a status switcher above it. Task detail is a full-screen sheet. Tables become stacked cards |
| `sm` | 480–767px | As above with wider padding. Metric cards go 2-up |
| `md` | 768–1023px | Sidebar becomes an overlay drawer opened by a hamburger. Board scrolls horizontally. Metric cards 2-up. Task detail is a full-width sheet |
| `lg` | 1024–1279px | Sidebar collapses to 64px icons. Board shows about 3.5 columns and scrolls. Metric cards 4-up. Task detail is a 560px drawer |
| `xl` | 1280–1535px | Full 248px sidebar. Board shows about 5 columns |
| `2xl` | ≥ 1536px | Content capped at 1400px and centred. Extra space becomes canvas, not wider columns |

**Mobile-specific behaviour:**
- The primary action becomes a floating action button, bottom-right, 56px, `--accent-700`, with a shadow
- Swipe left on a list row reveals Complete and Delete actions
- Long-press on a board card opens the actions sheet instead of starting a drag
- The bottom tab bar shows 5 items: Home, My tasks, Add (centre, accent), Notifications, Profile

---

# 6. Work Email Policy

TaskFlow is a product for organisations. Signup is therefore restricted to **work email addresses only** — personal addresses from free consumer providers are rejected at registration.

## 6.1 Why this restriction exists

| Reason | Effect |
|---|---|
| Organisation identity | The email domain *is* the organisation. `@novastudio.pk` identifies the company without asking the user to type a company name that could be anything |
| Automatic teammate discovery | A second person signing up from the same domain can be offered the existing workspace instead of creating a duplicate one |
| Spam and abuse reduction | Disposable and throwaway inboxes are the primary vector for free-tier abuse |
| Account recovery | A work address is administered by the company's IT, so a departing employee's access can actually be revoked |
| Billing clarity | Invoices attach to a domain, not to a personal Gmail |

## 6.2 Validation pipeline

Every submitted email passes through five checks, in this order. The first failure stops the pipeline and returns its specific message.

**Step 1 — Format.** RFC 5322 shape via Zod's `.email()`, then a length cap of 254 characters total and 64 characters for the local part.
Failure → *"That doesn't look like a valid email address."*

**Step 2 — Domain has an MX record.** A DNS MX lookup on the domain, cached in Redis for 24 hours. A domain with no mail exchanger cannot receive the verification code.
Failure → *"We can't find a mail server for that domain. Check the spelling."*

**Step 3 — Free provider blocklist.** The domain is checked against a maintained list of consumer email providers.
Failure → *"Please use your work email. Personal addresses like Gmail and Outlook aren't supported."* — with a secondary line: *"Working solo? [Contact us] and we'll set you up."*

**Step 4 — Disposable provider blocklist.** A larger list of throwaway and temporary-inbox domains (mailinator, guerrillamail, 10minutemail and roughly 3,500 others), refreshed weekly from a maintained open-source list.
Failure → *"Temporary email addresses aren't supported. Please use your work email."*

**Step 5 — Role-account check.** Local parts that indicate a shared mailbox rather than a person: `admin`, `info`, `support`, `sales`, `contact`, `hello`, `noreply`, `no-reply`, `postmaster`, `webmaster`, `abuse`, `billing`, `hr`, `careers`, `jobs`, `office`, `team`.
Failure → *"Please sign up with your personal work address, not a shared inbox like info@ or support@."*

## 6.3 The blocked provider list

Stored in the database (`blocked_domains` table) so a Platform Admin can edit it without a deploy. Seeded with:

```
gmail.com, googlemail.com, yahoo.com, yahoo.co.uk, yahoo.co.in, ymail.com,
rocketmail.com, hotmail.com, hotmail.co.uk, outlook.com, live.com, msn.com,
aol.com, icloud.com, me.com, mac.com, protonmail.com, proton.me, pm.me,
zoho.com, gmx.com, gmx.net, mail.com, mail.ru, yandex.com, yandex.ru,
tutanota.com, tuta.io, fastmail.com, hushmail.com, inbox.com, rediffmail.com,
qq.com, 163.com, 126.com, sina.com, naver.com, hanmail.net, daum.net
```

Each row carries a `reason` (`free_provider` | `disposable` | `abuse`) and a `blocked_at` timestamp. The admin console lists them with a search field, an `Add domain` button, and a `Remove` action per row.

## 6.4 Domain-based workspace discovery

The most useful consequence of the policy.

**When the second person from a domain signs up:**

After email verification, instead of the create-workspace screen they see a **Join screen**:

> **Your team is already on TaskFlow**
> **Nova Studio** — 6 members
> *[avatar stack]*
> `Request to join`   `Create a separate workspace instead`

**Two possible behaviours**, controlled by a workspace setting the Owner manages at `/w/:slug/settings/domains`:

| Setting | Behaviour |
|---|---|
| **Approval required** (default) | The request goes to Owners and Managers as a notification with `Approve` / `Decline`. The requester sees a pending screen. On approval they join as a **Member** |
| **Auto-join** | The user joins immediately as a **Member** and lands on My Tasks. A notification tells the Owner someone joined |

The Owner can also **turn discovery off entirely**, in which case new signups from the domain always create their own separate workspace.

**Multiple workspaces on one domain** is allowed — a large company might run several. In that case the join screen lists them all with member counts, and the user picks one or creates a new one.

## 6.5 Invited users bypass the policy

If a user is invited by email, the work-email check is **skipped for that address**. An Owner may legitimately need to invite an external contractor on a Gmail address as a Viewer. The rationale: an existing verified customer is vouching for that address, which is a stronger signal than a domain check.

The invite form warns when a personal address is entered: *"This looks like a personal address. They'll be able to join, but consider using their work email if they have one."* — a warning, not a block.

## 6.6 Configurable strictness

`WORK_EMAIL_ENFORCEMENT` environment variable:

| Value | Behaviour |
|---|---|
| `strict` | Blocklist enforced (production default) |
| `warn` | Personal addresses allowed, with an in-app banner encouraging a switch |
| `off` | No check (development and test environments) |

---

# 7. Screen Specifications

Each screen below is documented to the level of every button, every dropdown item, every state, and every validation message.

---

## 7.1 Landing Page

**Route:** `/` · **Shell:** Public · **Access:** Everyone; logged-in users are redirected to their role landing route.

### 7.1.1 Purpose

Convert a visitor into a signup. Everything on the page serves that one goal. The page must load in under 1.5 seconds on 4G and be fully server-rendered for SEO.

### 7.1.2 Visual treatment

Pure white background throughout — no coloured section bands, no gradient hero. Sections are separated by generous vertical space (80px desktop, 48px mobile) and, where needed, a single 1px `--line` rule. Orange appears in exactly four places: the logo mark, the two hero buttons, the feature icons, and the final CTA button.

Typography: hero headline in `display-xl` (52px, Plus Jakarta Sans 700, −0.03em). Section headings in `display-lg`. Body copy in `body-lg` (16px Inter, 1.6 line height) capped at 62 characters per line.

### 7.1.3 Section 1 — Navigation bar

| Property | Value |
|---|---|
| Height | 68px |
| Background | `--surface`, becomes `rgba(255,255,255,0.88)` with `backdrop-filter: blur(12px)` and a 1px bottom border once scrolled past 40px |
| Position | Sticky |
| Max width | 1200px, centred, 24px side padding |

**Left:** logo mark (28px rounded square, `--accent-700` fill, white check glyph) + wordmark "TaskFlow" in `title-sm`.

**Centre:** navigation links at 14px `--ink-body`, 28px apart — Features, Pricing, Customers, Docs. Hover changes colour to `--ink` with a 1.5px `--accent-700` underline animating in from the left over 140ms.

**Right:** `Log in` (tertiary button, `md`) and `Get started free` (primary button, `md`).

**Mobile (< 900px):** links collapse into a hamburger. Opening it slides down a full-width white panel with the links stacked at 16px, a divider, then both buttons full-width.

### 7.1.4 Section 2 — Hero

Centred, 96px top padding, 80px bottom.

| Element | Spec |
|---|---|
| Eyebrow pill | 12px/500, `--accent-800` on `--accent-50`, full radius, 4px/12px padding. Text: "Free for teams up to 5" |
| Headline | `display-xl`, `--ink`, max-width 680px. "Everyone knows what to do next" |
| Subheadline | `body-lg`, `--ink-body`, max-width 520px, 16px below the headline. "Plan projects, assign work, and track every deadline in one place. Built for teams who are tired of chasing updates in group chats." |
| Primary CTA | `lg` primary button, "Start free" → `/register` |
| Secondary CTA | `lg` secondary button with a `play-circle` icon, "Watch 2-min demo" → opens a video modal |
| Trust line | 12px `--ink-muted`, 12px below the buttons. "No credit card required · Set up in under 2 minutes" |

### 7.1.5 Section 3 — Product preview

A real board screenshot, not a stock illustration. Rendered as a browser frame: 14px radius, 1px `--line` border, `0 24px 64px rgba(28,25,23,0.10)` shadow, with a mock URL bar. Max width 1000px, centred, pulled up 24px so it overlaps the hero's bottom padding slightly.

Below it, a row of five logos of fictional customer companies at 20px height, `--ink-faint`, with the caption "Trusted by 400+ teams" in `caption` above.

### 7.1.6 Section 4 — Features

Three columns on desktop, one on mobile. 48px column gap.

Each feature: a 28px Lucide icon in `--accent-600`, a `title-sm` heading 12px below, and two lines of `body` copy in `--ink-body`.

| Icon | Heading | Copy |
|---|---|---|
| `columns-3` | Board, list, or calendar | The same work, viewed the way each person thinks. Drag a card to change its status. |
| `users` | Roles that make sense | Owners plan, managers assign, members execute, clients watch. Nobody sees more than they need. |
| `bell-ring` | Nothing slips | Reminders before a deadline, clear flags after one. Overdue work is impossible to miss. |

### 7.1.7 Section 5 — How it works

A horizontal three-step sequence with a thin connecting line. Each step: a 32px circle with the step number in `--accent-700` on `--accent-50`, a `title-sm` heading, and one line of body copy.

1. **Create your workspace** — Sign up with your work email and name your team's space.
2. **Add your projects** — Each project gets its own board, members, and deadline.
3. **Assign and track** — Everyone sees their own tasks. You see all of them.

### 7.1.8 Section 6 — Role showcase

A tabbed panel demonstrating that different people see different things. Four tabs: Owner · Manager · Member · Client. Selecting a tab swaps a screenshot on the right and a short bullet list on the left describing what that role can do. Active tab: `--accent-700` text with a 2px `--accent-700` bottom border.

### 7.1.9 Section 7 — Pricing preview

Three cards side by side, 12px gap, each 10px radius with a 1px `--line` border. The middle card ("Team") is marked recommended: 1.5px `--accent-500` border and a small `--accent-700` pill reading "Most popular" sitting on the top border.

Each card: plan name (`title-sm`), price (`display-md` with a 14px `--ink-muted` "/user/month"), a 1px divider, then 4–6 feature rows each with a 14px `check` icon in `--success`, then a full-width button (secondary on the outer cards, primary on the middle one).

### 7.1.10 Section 8 — FAQ

Six accordion rows, max-width 720px, centred. Each row: question in `body-strong`, `chevron-down` on the right rotating 180° over 180ms when open, answer in `body` `--ink-body`. Only one open at a time. 1px `--line` between rows.

Questions covered: Why do I need a work email? · Can I invite people outside my company? · What happens after the free tier? · Can I export my data? · Do you offer a discount for non-profits? · Is my data private?

### 7.1.11 Section 9 — Final CTA

Full-width band in `--accent-50` (the only tinted section on the page), 80px vertical padding, centred. `display-lg` heading, one line of `body-lg`, one `lg` primary button.

### 7.1.12 Section 10 — Footer

`--canvas` background, 1px top border, 64px top padding, 32px bottom.

Four link columns (Product, Company, Resources, Legal) at 13px `--ink-muted`, each with a 11px `overline` header. A fifth column holds the logo, a one-line description, and social icons at 18px.

Bottom strip separated by a 1px rule: copyright on the left at 12px, and on the right a language selector and a theme toggle.

### 7.1.13 All interactive elements on this page

| Element | Type | Action |
|---|---|---|
| Logo | Link | `/` |
| Features / Pricing / Customers / Docs | Links | Anchor scroll or route |
| Log in | Tertiary button | `/login` |
| Get started free | Primary button | `/register` |
| Start free | Primary button | `/register` |
| Watch 2-min demo | Secondary button | Opens video modal |
| Role showcase tabs | Tab group | Swaps panel content |
| Plan buttons ×3 | Buttons | `/register?plan=free\|team\|business` |
| FAQ rows ×6 | Accordions | Expand / collapse |
| Final CTA | Primary button | `/register` |
| Footer links | Links | Respective routes |
| Language selector | Dropdown | English / اردو (Phase 3) |
| Theme toggle | Icon button | Light / Dark / System |
| Hamburger (mobile) | Icon button | Opens the mobile menu |

### 7.1.14 Performance requirements

Hero image served as AVIF with a WebP fallback and explicit `width`/`height` to reserve space. Below-the-fold images lazy-loaded. Fonts preloaded. Target Lighthouse scores: Performance 95+, Accessibility 100, SEO 100. Largest Contentful Paint under 1.8s on a simulated 4G connection.

---

## 7.2 Sign Up

**Route:** `/register` · **Shell:** Auth · **Access:** Logged-out only.

### 7.2.1 Purpose

Create an account with a verified work email. This is the only account-creation path in the product — there is no separate signup for different roles. Role is determined later by workspace membership.

### 7.2.2 Layout

A centred card on a `--canvas` background. Card: 400px wide, `--surface`, 14px radius, 1px `--line` border, 32px padding, vertically centred with a minimum 48px top margin.

Above the card: the logo mark and wordmark, centred, 24px below the viewport top.
Below the card: "Already have an account? **Log in**" at 14px, the link in `--accent-700`.

### 7.2.3 Card contents in order

**1. Heading** — `display-md` "Create your account".

**2. Subheading** — `body` `--ink-muted`, 4px below: "Use your work email. Free for teams up to 5."

**3. Google button** — full-width secondary button, `lg` size, with the Google mark at 18px and the label "Continue with Google". 24px below the subheading.

> Google OAuth returns the address the user's Google account is registered with. The **same work-email validation applies** — a `@gmail.com` Google account is rejected after the OAuth round-trip with the message *"That Google account uses a personal address. Sign in with your work Google account instead."* Google Workspace accounts on a company domain pass.

**4. Divider** — a horizontal 1px `--line` with the word "or" centred on it in 11px `--ink-faint` on a `--surface` background. 20px margins.

**5. Full name field**
- Label: "Full name"
- Placeholder: "Ayesha Khan"
- Validation: required, 2–100 characters, must contain at least one letter, no URLs
- Error: *"Please enter your full name."*

**6. Work email field**
- Label: "Work email"
- Placeholder: "you@company.com"
- Helper text below the label: "Personal addresses like Gmail aren't supported."
- Validation: the full five-step pipeline from Section 6.2
- Live behaviour: the domain check runs 600ms after the user stops typing, but only once the field contains an `@` and at least one dot after it. A 14px spinner appears on the right of the field during the check
- Success indicator: a `--success` check icon on the right, plus a line below reading *"Looks like a work address."* This resolves the anxiety the restriction creates
- Already-registered error: *"An account already exists for this email. **Log in** instead."* — with the login word as an inline link

**7. Password field**
- Label: "Password", eye/eye-off toggle inside on the right
- Requirements shown as a live checklist below the field once the user starts typing — four rows, each with a 14px `circle` icon that becomes a `--success` `circle-check` when satisfied:
  - At least 10 characters
  - One uppercase letter
  - One lowercase letter
  - One number or symbol
- Strength meter: four 3px bars above the checklist. Weak `--danger`, Fair `--warning`, Good `--accent-600`, Strong `--success`. Calculated with zxcvbn, not just character classes
- Additional check: the password is compared against the Have I Been Pwned range API (k-anonymity, only the first 5 SHA-1 characters are sent). If found: *"This password has appeared in a data breach. Please choose another."*

**8. Terms checkbox**
- 16px checkbox, then 13px `--ink-body` text: "I agree to the **Terms of Service** and **Privacy Policy**" with both as `--accent-700` links opening in a new tab
- Required. The submit button stays disabled until it is checked

**9. Submit button** — full-width `lg` primary, label "Create account". Disabled until every field is valid and the checkbox is ticked. Loading label: "Creating account…".

### 7.2.4 Every validation message

| Field | Condition | Message |
|---|---|---|
| Name | Empty | Please enter your full name. |
| Name | Under 2 chars | That name looks too short. |
| Name | Contains a URL | Names can't contain links. |
| Email | Empty | Please enter your work email. |
| Email | Bad format | That doesn't look like a valid email address. |
| Email | No MX record | We can't find a mail server for that domain. Check the spelling. |
| Email | Free provider | Please use your work email. Personal addresses like Gmail and Outlook aren't supported. |
| Email | Disposable | Temporary email addresses aren't supported. Please use your work email. |
| Email | Role account | Please sign up with your personal work address, not a shared inbox like info@ or support@. |
| Email | Already registered | An account already exists for this email. Log in instead. |
| Password | Under 10 chars | Passwords need at least 10 characters. |
| Password | Missing a class | Add an uppercase letter and a number. |
| Password | Breached | This password has appeared in a data breach. Please choose another. |
| Terms | Unchecked | Please accept the terms to continue. |
| Form | Rate limited | Too many signup attempts. Try again in 15 minutes. |
| Form | Server error | Something went wrong on our end. Please try again. |

**Error timing:** validation fires on blur, not on keystroke. Once a field has shown an error, it re-validates on every keystroke so the error clears the moment it is fixed. Server errors appear in a `--danger` banner at the top of the card.

### 7.2.5 What happens on submit

1. `POST /api/v1/auth/register`
2. Server re-runs the entire validation pipeline (never trust the client)
3. Password hashed with bcrypt, cost factor 12
4. `users` row created with `is_verified = false`
5. A 6-digit numeric code generated, hashed, stored with a 10-minute expiry
6. Verification email queued through BullMQ
7. A short-lived signup session cookie is set (this user can reach `/verify-email` but nothing else)
8. Redirect to `/verify-email`

### 7.2.6 Keyboard and accessibility

`Tab` moves through the fields in visual order. `Enter` in any field submits if the form is valid. The password toggle is a real button with `aria-pressed`. The requirements checklist is inside an `aria-live="polite"` region so screen readers announce each requirement as it is met. The submit button announces its disabled reason through `aria-describedby`.

### 7.2.7 Responsive

Under 480px the card loses its border and shadow and becomes the full-width page with 20px side padding. Buttons and inputs stay at `lg` (44px) for touch. The logo moves to 16px from the top.

---

## 7.3 Email Verification

**Route:** `/verify-email` · **Shell:** Auth · **Access:** Authenticated but unverified.

### 7.3.1 Layout

Same centred card, 380px wide, contents centred.

| Element | Spec |
|---|---|
| Icon | 48px circle, `--accent-50` fill, 22px `mail` icon in `--accent-700` |
| Heading | `display-md` "Check your email" |
| Body | `body` `--ink-muted`. "We sent a 6-digit code to" then the address on its own line in `--ink` `body-strong` |
| Code inputs | Six boxes, each 44 × 52px, 6px radius, 1px `--line-strong`, 20px centred text, 8px gap |
| Expiry line | `caption` `--ink-muted`, "Code expires in 9:41", counting down live |
| Submit | Full-width `lg` primary, "Verify email" |
| Resend | `caption`, "Didn't get it? **Resend code**" — the link is `--ink-faint` and non-interactive during a 60-second cooldown, showing "Resend in 47s" |
| Footer links | "Change email address" (`--accent-700`) · "Log out" (`--ink-muted`), separated by a middot |

### 7.3.2 Code input behaviour

| Behaviour | Detail |
|---|---|
| Auto-advance | Entering a digit moves focus to the next box |
| Backspace | On an empty box, moves back and clears the previous digit |
| Paste | Pasting a 6-digit string fills all boxes at once, from any box |
| Input mode | `inputmode="numeric"` `pattern="[0-9]*"` so mobile shows the number pad |
| Non-numeric | Silently ignored |
| Auto-submit | Verification fires automatically when the sixth digit lands |
| Autofocus | The first empty box on mount |

### 7.3.3 States

| State | Treatment |
|---|---|
| Idle | Active box has an `--accent-500` border and `--accent-100` ring |
| Verifying | All boxes disabled at 60% opacity, spinner in the button |
| Error | All borders turn `--danger`, boxes shake horizontally 6px twice over 300ms, boxes clear, focus returns to the first box, message below: *"That code isn't right. Check and try again."* |
| Too many attempts | After 5 failures the form locks for 15 minutes with a warning banner and a `Resend code` action |
| Expired | Boxes disabled, warning banner: *"This code expired. Request a new one."* with a `Send new code` primary button |
| Success | All borders `--success`, a check icon appears, 800ms pause, then redirect |

### 7.3.4 Where it redirects after success

| Condition | Destination |
|---|---|
| No workspace exists for this domain, user has none | `/onboarding/workspace` |
| A workspace exists on this domain, discovery on, approval required | `/onboarding/join` |
| A workspace exists on this domain, auto-join on | Joined as Member → `/w/:slug/my-tasks` |
| User arrived from an invite link | Auto-joins the inviting workspace with the invited role → role landing route |

### 7.3.5 Rate limits

Code generation: 5 per hour per email address, 10 per hour per IP. Verification attempts: 5 per code. Every limit returns HTTP 429 with a `Retry-After` header, which the UI converts to a human countdown.

---

## 7.4 Log In

**Route:** `/login` · **Shell:** Auth · **Access:** Logged-out only.

### 7.4.1 Purpose

**One login page for every role.** There is no separate admin login URL. A Platform Admin, an Owner, and a Member all sign in here; the system decides where each one lands.

**Why a single login page:** a separate `/admin/login` route advertises the existence of an admin panel to anyone who can read a sitemap, and it forces admins to remember a second URL. Role-based redirection after authentication achieves the same result with a smaller attack surface.

### 7.4.2 Layout

Identical geometry to the signup card — 400px wide, same padding, same field spacing, same Google button position. Users move between these two screens frequently and any layout shift feels broken.

| Element | Spec |
|---|---|
| Heading | `display-md` "Welcome back" |
| Subheading | `body` `--ink-muted`, "Log in to pick up where you left off." |
| Google button | Full-width `lg` secondary, "Continue with Google" |
| Divider | "or" |
| Email field | Label "Email", autofocus on mount, `autocomplete="username"` |
| Password field | Label "Password" with **"Forgot password?"** right-aligned on the same line in 13px `--accent-700`. Eye toggle inside. `autocomplete="current-password"` |
| Remember me | 16px checkbox, "Keep me logged in for 30 days" |
| Submit | Full-width `lg` primary, "Log in" |
| Footer | "New to TaskFlow? **Sign up free**" |

Placing "Forgot password?" on the password label line rather than below the form means a user who has already failed once does not have to hunt for it.

### 7.4.3 Error handling

**The generic error rule.** Whether the email does not exist or the password is wrong, the message is identical:

> *"That email and password don't match. Try again."*

Distinguishing the two would let anyone test whether a given address has a TaskFlow account, which is an information leak and a phishing target list.

| Condition | Message | Treatment |
|---|---|---|
| Wrong credentials | That email and password don't match. Try again. | `--danger` border on both fields, message below the password |
| Unverified account | Please verify your email first. **Resend code** | `--warning` banner; redirect to `/verify-email` on click |
| Suspended account | This account has been suspended. Contact support@taskflow.app | `--danger` banner, form disabled |
| Workspace suspended | Your workspace is suspended. Contact your workspace owner. | `--danger` banner |
| 5 failed attempts | Too many attempts. Try again in 15 minutes, or reset your password. | `--warning` banner, form disabled, "Forgot password?" stays live |
| Google account not registered | No TaskFlow account is linked to that Google account. **Sign up** instead. | `--danger` banner |

### 7.4.4 Post-login routing logic

```ts
function resolveLandingRoute(user: User): string {
  if (!user.isVerified)      return '/verify-email';
  if (user.status === 'suspended') return '/account-suspended';
  if (user.isPlatformAdmin)  return '/admin';

  const memberships = user.workspaceMemberships;
  if (memberships.length === 0) return '/onboarding/workspace';

  const ws = memberships.find(m => m.workspaceId === user.lastWorkspaceId)
          ?? memberships.sort((a, b) => a.joinedAt - b.joinedAt)[0];

  if (ws.workspace.status === 'suspended') return '/workspace-suspended';

  switch (ws.role) {
    case 'owner':
    case 'manager': return `/w/${ws.workspace.slug}/home`;
    case 'member':  return `/w/${ws.workspace.slug}/my-tasks`;
    case 'viewer':  return `/w/${ws.workspace.slug}/projects`;
  }
}
```

**Deep-link preservation:** if the user was sent to `/login` from a protected route, that route is stored in a `returnTo` query parameter and takes precedence over the role landing route — but only after a permission check confirms they may actually see it. If they may not, they go to their role landing route with an info toast: *"You don't have access to that page."*

### 7.4.5 Session behaviour

| Setting | Value |
|---|---|
| Access token | JWT, 15-minute lifetime, held in memory only — never in `localStorage` |
| Refresh token | Opaque random 64-byte token, stored hashed in the database, sent as an `httpOnly` `secure` `sameSite=lax` cookie |
| Refresh lifetime | 7 days, or 30 days with "Keep me logged in" |
| Silent refresh | The client refreshes 60 seconds before expiry, and on any 401 |
| Rotation | Every refresh issues a new refresh token and revokes the old one. A reused token revokes the entire family and forces re-login (detects token theft) |
| Concurrent sessions | Allowed and listed at `/settings/security` with device, browser, IP, and last-active time, each with a `Revoke` button |

### 7.4.6 Rate limits

5 attempts per 15 minutes per IP+email combination. 20 per hour per IP across all addresses. Failures are logged with IP and user agent for the audit trail. Successful login resets the counter.

---

## 7.5 Forgot Password

**Route:** `/forgot-password` · **Access:** Logged-out.

**Card contents:** a 40px `--accent-50` circle with a `lock-open` icon, `display-md` heading "Reset your password", `body` explanation, one email field, a full-width `lg` primary button "Send reset link", and a `caption` "← Back to log in" link.

**On submit** the card content is replaced in place (no navigation) with the sent state:

- 40px `--success-bg` circle with a `mail-check` icon
- `display-md` "Check your email"
- Body: *"If an account exists for ayesha@company.com, we've sent a reset link. It expires in 30 minutes."*
- `caption`: "Didn't get it? **Resend in 60s**"
- Secondary button: "Back to log in"

**The conditional wording is deliberate.** "If an account exists" prevents the page from confirming which addresses are registered. The same message and the same response time are returned whether or not the account exists — the endpoint runs a dummy bcrypt comparison on the miss path so timing cannot be used to distinguish the two.

**Rate limits:** 3 requests per hour per email, 10 per hour per IP.

---

## 7.6 Reset Password

**Route:** `/reset-password?token=…` · **Access:** Valid token holders.

The token is validated **server-side before the page renders**. An invalid token never reaches the form.

### 7.6.1 Valid token state

| Element | Spec |
|---|---|
| Heading | `display-md` "Set a new password" |
| Subheading | `body` `--ink-muted`, "This link expires in 30 minutes." |
| New password | Field with an eye toggle and the four-bar strength meter |
| Confirm password | Field with a live match indicator — `--success` check when matching, `--danger` border and *"Passwords don't match"* when not |
| Requirements checklist | The same four live rows as signup, inside a `--surface-sunken` block |
| Submit | Full-width `lg` primary "Reset password", disabled until every rule passes and both fields match |

### 7.6.2 Invalid token states

| Case | Screen |
|---|---|
| Expired | `--warning` card: "This link expired." Body: "Reset links are valid for 30 minutes." Button: `Request a new link` |
| Already used | Same as expired — "This link has already been used." |
| Malformed or unknown | Redirect to `/forgot-password` with an error toast |
| Account since deleted | "This account no longer exists." with a link to `/register` |

### 7.6.3 What happens on success

1. Password hashed and written
2. **Every refresh token for this user is revoked** — all sessions on all devices end
3. The reset token is marked used
4. A confirmation email is sent: *"Your TaskFlow password was changed"* with the time, approximate location, and a "this wasn't me" support link
5. Redirect to `/login` with a success toast: *"Password updated. Please log in."*

**The user is not auto-logged-in.** If an attacker performed the reset, forcing a fresh login plus sending the notification email gives the real owner a chance to react.

---

## 7.7 Create Workspace

**Route:** `/onboarding/workspace` · **Access:** Verified users. This is the **first screen every new organisation sees.**

### 7.7.1 Why the workspace comes first

Nothing in TaskFlow exists outside a workspace. Projects belong to workspaces, members belong to workspaces, labels and billing belong to workspaces. Creating one silently in the background and calling it "Ayesha's Workspace" produces a name nobody recognises and a container nobody feels ownership of. Asking for it explicitly, as the first act, sets up the mental model correctly: *this is our company's space, and everything goes inside it.*

### 7.7.2 Layout

Centred card, 440px wide, with a three-segment progress indicator above it.

**Progress indicator:** three 3px bars with 6px gaps, full width of the card. Completed and current segments are `--accent-700`, upcoming are `--line`. Below them, `caption` `--ink-muted` "Step 1 of 3".

### 7.7.3 Fields

**1. Workspace name**
- Label "Workspace name", placeholder "Nova Studio"
- Helper below the field, live: `taskflow.app/w/` + the generated slug in `--ink-body`
- Slug generation: lowercase, spaces → hyphens, non-alphanumerics stripped, collapsed repeated hyphens, trimmed to 40 characters
- Uniqueness is checked 500ms after typing stops. If taken, a numeric suffix is appended automatically (`nova-studio-2`) and a `caption` explains: *"That URL is taken, so we've suggested this one."*
- Validation: required, 2–50 characters
- Default value: the company name derived from the email domain, title-cased (`novastudio.pk` → "Novastudio"), pre-filled and fully selected so it can be overwritten with one keystroke

**2. Workspace logo**
- A 56px rounded square preview showing the initials on an `--accent-100` background with `--accent-800` text
- Beside it, a dashed-border `Upload image` secondary button
- Accepts PNG, JPG, SVG, WebP up to 2 MB. Opens a square crop tool on selection. Stored at 256×256 and 64×64
- A `Remove` tertiary button appears once an image exists

**3. Team size**
- Four segmented options: "Just me" · "2–10" · "11–50" · "50+"
- Selected: 1.5px `--accent-500` border, `--accent-50` fill, `--accent-800` text
- Used only to tailor the onboarding copy and for analytics — it gates nothing

**4. What will you use this for** *(optional)*
- A select with: Software development · Marketing · Design · Operations · Consulting / agency · Education · Other
- Determines which project templates are offered in step 3

**5. Continue** — full-width `lg` primary. Disabled until the name is valid and unique.

### 7.7.4 What is created on submit

| Record | Value |
|---|---|
| `workspaces` row | name, slug, logo, timezone from the browser, `owner_id` = current user |
| `workspace_members` row | current user with role `owner` |
| Default labels | Bug (red), Feature (blue), Design (violet), Urgent (orange), Documentation (stone) |
| `users.last_workspace_id` | Set to the new workspace |
| Domain discovery setting | Defaults to `approval_required` |
| Audit log entry | `workspace.created` |

Then → `/onboarding/invite`.

### 7.7.5 Creating additional workspaces later

The same form appears as a **modal** (medium, 520px) triggered from the workspace switcher's `+ Create workspace` row. Differences: no progress indicator, no team-size or use-case questions, a `Cancel` secondary button beside `Create workspace`, and on success it switches straight into the new workspace's home rather than continuing the onboarding sequence.

**Limits:** a user may own up to 5 workspaces on the free tier. Attempting a sixth shows an upgrade prompt inside the modal.

---

## 7.8 Invite Team

**Route:** `/onboarding/invite` · **Access:** New workspace owner. Skippable.

### 7.8.1 Layout

Card, 480px wide, progress showing "Step 2 of 3".

Heading `display-md` "Invite your team". Subheading naming the workspace: *"Add the people you work with. They'll get an email to join Nova Studio."*

### 7.8.2 Invite rows

Three rows by default, the third empty. Each row is a flex layout:

| Part | Width | Spec |
|---|---|---|
| Email field | flex 1 | Placeholder "name@company.com", validated on blur |
| Role select | 120px | Options: Manager, Member, Viewer. Default Member |
| Remove button | 34px | `x` icon, tertiary. Hidden on the last empty row |

Below the rows: `+ Add another` in `--accent-700` 13px. Maximum 20 rows; beyond that a `caption` suggests the invite link instead.

**Role select descriptions.** Each option in the open dropdown carries a second line of `caption` `--ink-muted` text so the chooser understands the consequence:

| Option | Description line |
|---|---|
| Manager | Can create projects and assign work to anyone |
| Member | Can work on tasks assigned to them |
| Viewer | Can see everything but change nothing |

### 7.8.3 Invite link block

A `--surface-sunken` block, 8px radius, 12px padding, below the rows.

- `caption` label: "Or share an invite link"
- A read-only field showing `taskflow.app/join/nova-studio/8f3a2b` in `--font-mono` 11px, truncated
- A `Copy` secondary `sm` button that swaps to a check icon and "Copied" for 2 seconds
- A role select beside it controlling what role link-joiners receive, defaulting to Member
- `caption` note: "Anyone with this link can join as a Member. Expires in 7 days."

### 7.8.4 Buttons

| Button | Type | Behaviour |
|---|---|---|
| `Send N invites` | Primary, flex 1 | The count is live and reflects only valid non-empty rows. Disabled when N = 0 |
| `Skip` | Secondary | Straight to `/onboarding/project` |

### 7.8.5 Validation and edge cases

| Case | Handling |
|---|---|
| Duplicate email in the list | Row turns `--warning`, message "Already added above" |
| Inviting yourself | Row error: "That's your own address." |
| Already a member | Row error: "Already in this workspace." |
| Already invited | Row shows a `caption` "Invite pending — we'll resend it." |
| Personal address | `--warning` inline note, not a block (see Section 6.5) |
| Invalid format | Standard email error |
| Partial failure | Toast: "3 invites sent, 1 failed." Failed rows stay on screen with their reason |

### 7.8.6 The invitation record

Each invite writes an `invitations` row with a 32-byte URL-safe token, the role, the inviter's ID, a 7-day expiry, and status `pending`. The email contains the inviter's name, the workspace name and logo, the assigned role with its description, a `Join Nova Studio` button, and the expiry date.

---

## 7.9 Create First Project

**Route:** `/onboarding/project` · **Access:** New workspace owner. Skippable.

Card, 480px, "Step 3 of 3". Heading "Create your first project".

### 7.9.1 Fields

**1. Template selector** — three cards in a row, each 10px radius with a 1px `--line` border, selected state 1.5px `--accent-500` + `--accent-50`. Each shows a 20px icon, a `body-strong` name, and a `caption` line stating what it pre-fills.

The three offered depend on the use case chosen in step 1. For "Software development": **Blank** · **Product sprint** (8 sample tasks across Backlog/To Do/In Progress) · **Bug tracker** (columns renamed, Bug label pre-applied).

**2. Project name** — required, 2–80 characters, placeholder "Website redesign".

**3. Description** — optional textarea, 3 rows, 500-character limit with a counter.

**4. Colour** — eight 24px circle swatches from the data-viz palette. Selected gets a 2px `--ink` ring with a 2px white offset. Pre-selected round-robin.

**5. Deadline** — optional date picker, "No deadline" by default.

**6. Members** — a multi-select showing everyone already in the workspace, with the creator pre-selected and non-removable. Shows avatars as chips.

**7. Buttons** — `Create project` primary full-width, and `Skip for now` tertiary below it centred.

### 7.9.2 On success

The project is created, the user is taken to `/w/:slug/projects/:id/board`, and a first-run coach mark points at the `+ Add task` control in the first column with the text "Add your first task here" and a `Got it` button. This coach mark shows once per user, ever.

If skipped, the user lands on `/w/:slug/home` where the project grid shows only the dashed `New project` tile.

---

## 7.10 Workspace Home

**Route:** `/w/:slug/home` · **Access:** Owner and Manager. Members and Viewers redirect to their own landing routes.

### 7.10.1 Purpose

The planning surface. Answers three questions in one screen: which projects exist and how they are doing, who is overloaded, and what is about to slip.

### 7.10.2 Layout

Standard workspace shell. Content area, 24px padding, 1400px max width.

**Page header row**
- Left: `title-lg` greeting — "Good morning, Ayesha" (time-based: before 12:00 morning, 12:00–17:00 afternoon, after 17:00 evening), with a `caption` line below: "Monday, 7 September · 3 active projects · 12 tasks due this week"
- Right: `New project` primary `md` button

**Row 1 — Metric cards.** Four cards, equal width, 12px gap, each 10px radius with a 1px `--line` border and 16px padding.

| Card | Number colour | Sub-line | Click destination |
|---|---|---|---|
| Active projects | `--ink` | "of 8 total" | `/projects?status=active` |
| Tasks due this week | `--ink` | "across 3 projects" | `/my-tasks?filter=week` |
| Overdue | `--danger` | "needs attention" | `/my-tasks?filter=overdue` |
| Completed this week | `--success` | "▲ 18% vs last week" | `/reports?range=week` |

Each card: `caption` `--ink-muted` label on top, `metric` number below (30px Plus Jakarta Sans 600), then a `caption` sub-line. Hovering the whole card gives it `--surface-hover` and a pointer cursor.

**Row 2 — Two panels, 1.4fr / 1fr**

*Left panel — Projects at a glance.* Header row with the `title-sm` heading and a `View all` accent-text link. Then up to 5 project rows, each: 8px colour square, project name in `body-strong`, a thin progress bar with the percentage right-aligned, an avatar stack, and the deadline. Rows are clickable and hover to `--surface-hover`.

*Right panel — Team workload.* Header `title-sm` "Team workload". One row per member, up to 6: 24px avatar, name, then a horizontal bar showing their open task count. The bar is `--accent-400`, except when the count exceeds a threshold of 10, where it turns `--warning` and a `caption` "Overloaded" appears. Below, a `View team` link.

This panel is the single most valuable thing on the screen for a manager — it converts "how is everyone doing" from a meeting into a glance.

**Row 3 — Two panels, equal width**

*Left — Needs attention.* A prioritised list of up to 6 items, each with a 3px coloured left bar:
- Overdue tasks (red)
- Tasks due today (amber)
- Unassigned tasks in active projects (stone)
- Projects with no activity in 7 days (stone)

Each row: title, a `caption` reason line, and the responsible person's avatar. Clicking opens the task or project.

*Right — Recent activity.* The last 8 workspace events. Each: 24px avatar, a sentence with the actor's name and the object in `--ink`, and a relative timestamp in `caption`. Ends with a `View all activity` link.

### 7.10.3 Empty states

| Condition | Treatment |
|---|---|
| No projects | The whole content area is replaced by a centred empty state: `folder-plus` icon, "No projects yet", "Projects hold your team's work. Create one to get started.", `Create project` primary button |
| Projects but no tasks | Metric cards render with zeros, and a `--info` banner appears at the top: "Your projects are empty. Add some tasks to see progress here." with a `Go to Website redesign` link |
| One member | The Team workload panel is replaced with an invite prompt: "It's just you here. **Invite your team**" |

### 7.10.4 Every control on this screen

| Control | Type | Action |
|---|---|---|
| New project | Primary button | Opens the create-project modal |
| Metric cards ×4 | Clickable cards | Navigate to filtered views |
| View all (projects) | Accent link | `/w/:slug/projects` |
| Project rows | Clickable rows | Open the project dashboard |
| View team | Accent link | `/w/:slug/team` |
| Needs-attention rows | Clickable rows | Open the task or project |
| View all activity | Accent link | `/w/:slug/reports?tab=activity` |
| Greeting date range | Dropdown (`sm`) | This week / Last week / This month — refilters the metric cards |

---

## 7.11 Projects List

**Route:** `/w/:slug/projects` · **Access:** All workspace roles. Members see only projects they belong to; Viewers see them read-only.

### 7.11.1 Toolbar

A single row below the `title-lg` page title, 16px below, with 16px vertical padding and a 1px bottom border.

**Left — status tabs.** Five tabs, each with a live count: All 9 · Active 3 · Planning 1 · On hold 0 · Completed 5. A sixth, `Archived`, sits after a small divider and is only visible to Owners and Managers. Active tab: `--accent-50` background, `--accent-700` text, 6px radius. Tabs write to the URL (`?status=active`).

**Right — controls.**

| Control | Type | Detail |
|---|---|---|
| Search | Input, `sm`, 200px | Filters by project name and description, debounced 300ms |
| Sort | Dropdown, `sm` | Deadline (soonest first) · Recently updated · Recently created · Name A–Z · Progress · Task count |
| View toggle | Segmented icon pair | Grid / List. Persisted in `localStorage` |
| New project | Primary, `md` | Owner and Manager only |

### 7.11.2 Grid view — project card

Card: `--surface`, 12px radius, 1px `--line`, 16px padding, hover raises the border to `--line-strong` and shifts the background to `--surface-hover`.

| Zone | Content |
|---|---|
| Header | 9px colour square, project name in `title-sm` truncated, and a `⋯` tertiary icon button on the right |
| Status | Status pill, immediately under the name |
| Description | `caption` `--ink-muted`, clamped to 2 lines. Omitted entirely if empty — no placeholder text |
| Progress | A row reading "17 of 25 done" on the left and "68%" on the right in `caption`, then a 5px track in `--surface-inset` with a fill in the project's own colour |
| Footer | Avatar stack (max 3 + overflow) on the left; deadline on the right with a `calendar` icon |

**Deadline formatting rules** — this is the detail that makes the card useful:

| Condition | Display | Colour |
|---|---|---|
| No deadline | "No deadline" | `--ink-faint` |
| More than 14 days away | "30 Sep" | `--ink-muted` |
| 8–14 days | "in 2 weeks" | `--ink-muted` |
| 2–7 days | "in 4 days" | `--warning` |
| Tomorrow | "Tomorrow" | `--warning` |
| Today | "Today" | `--warning`, weight 500 |
| Past | "3 days late" | `--danger`, weight 500, `alert-circle` icon |

An absolute date requires mental arithmetic; a relative one produces an immediate reaction.

### 7.11.3 The `⋯` project menu

| Item | Roles | Behaviour |
|---|---|---|
| Open | All | Navigate |
| Open in new tab | All | — |
| Copy link | All | Clipboard + toast |
| Pin to sidebar top | All | Toggles; pinned projects sort first in the sidebar |
| Edit details | Owner, Manager | Opens the edit modal |
| Duplicate | Owner, Manager | Opens a modal offering "Structure only" or "Structure and tasks" |
| Export to CSV | All except Viewer | Downloads immediately |
| — divider — | | |
| Archive | Owner, Manager | Confirmation modal |
| Leave project | Member | Confirmation |
| Delete | Owner | Type-to-confirm modal |

### 7.11.4 List view

A table with columns: Name (colour dot + name + description on a second muted line) · Status · Progress (bar + %) · Tasks (done/total) · Members (avatar stack) · Deadline · `⋯`. Sortable on Name, Status, Progress, Tasks, and Deadline. Row height 56px because of the two-line name cell.

### 7.11.5 Create project modal

Medium modal, 520px. Title "Create project".

| Field | Spec |
|---|---|
| Name | Required, 2–80 characters, autofocused |
| Description | Optional textarea, 3 rows, 500-character counter |
| Colour | 8 swatches, one pre-selected |
| Icon | Optional — a picker of 24 Lucide icons in a 6×4 grid, defaulting to none |
| Status | Select: Planning · Active (default) · On hold |
| Start date | Optional date input |
| Deadline | Optional date input. Validation: must be after the start date, error *"The deadline can't be before the start date."* |
| Members | Multi-select of workspace members, creator pre-selected and locked |
| Template | Select: Blank (default) · Product sprint · Bug tracker · Content calendar · Client project |
| Board columns | A `caption` preview of what the chosen template produces, e.g. "Backlog → To do → In progress → In review → Done" |

Footer: `Cancel` secondary, `Create project` primary. `Cmd/Ctrl + Enter` submits.

### 7.11.6 Delete project modal

Small modal, 400px, `--danger` treatment.

- 40px `--danger-bg` circle with a `trash-2` icon
- `title-md` "Delete Website redesign?"
- `body` warning: "This will permanently delete **25 tasks**, **48 comments**, and **12 attachments**. This can't be undone."
- A text input labelled "Type **Website redesign** to confirm"
- Footer: `Cancel` secondary, `Delete project` destructive-solid, disabled until the typed name matches exactly (case-sensitive)

Actual behaviour is a soft delete with a 30-day restore window, but the copy says "can't be undone" because from the user's point of view it is gone. Restoration is a support action, not a user-facing feature.

---

## 7.12 Project Dashboard

**Route:** `/w/:slug/projects/:id` · **Access:** Project members. **This is the main view that opens when a project card is clicked.**

### 7.12.1 Project header

Persistent across all project sub-views. Sits directly below the top bar, `--surface` background, 1px bottom border.

**Line 1** — 12px top padding:
- 10px project colour square
- Project name in `title-md`, click-to-edit inline for Owners and Managers
- Status pill with a chevron — a dropdown for Owners and Managers, static for everyone else
- Deadline chip with a `calendar-clock` icon, coloured by the same relative-date rules
- *Pushed right:* member avatar stack (click opens a member popover with an `Add member` action), then `New task` primary `md`, then a `⋯` tertiary icon button

**Line 2** — view tabs, 40px tall, 20px gaps:

| Tab | Icon | Route |
|---|---|---|
| Overview | `layout-dashboard` | `/projects/:id` |
| Board | `columns-3` | `/projects/:id/board` |
| List | `list` | `/projects/:id/list` |
| Calendar | `calendar` | `/projects/:id/calendar` |
| Files | `paperclip` | `/projects/:id/files` |
| Settings | `settings` | `/projects/:id/settings` — Owner and Manager only |

Active tab: `--accent-700` text, weight 500, 2px `--accent-700` bottom border sitting flush with the header's bottom border.

**Right of the tabs:** view-specific controls — a `Filter` button with an active-filter count badge, a `Group by` dropdown, and a `Sort` dropdown.

### 7.12.2 The `⋯` project menu

Edit details · Duplicate project · Export CSV · Copy project link · Manage members · Board settings · Archive project · Delete project. Items are filtered by role.

### 7.12.3 Overview tab content

**Row 1 — four metric cards:** Total tasks · Completed · In progress · Overdue (red when above zero).

**Row 2 — two panels:**

*Burn-up chart* (Recharts area chart, 200px tall). Two series: total scope and completed, plotted over the project's lifetime. Grid lines in `--line`, axes in `--ink-muted` 11px, completed area in `--accent-400` at 20% opacity with an `--accent-600` stroke, scope line in `--ink-faint` dashed. Tooltip on hover shows both values and the date.

*Status breakdown* — a single horizontal stacked bar, 10px tall, full width, segments in the status colours, with a two-column legend below listing each status, its count, and its percentage.

**Row 3 — three panels:**

*Upcoming deadlines* — the next 6 tasks by due date, each with a coloured urgency bar, title, assignee avatar, and formatted date.
*Recent activity* — the last 8 events in this project.
*Team* — every project member with their open task count and completion count for the week.

### 7.12.4 Files tab

A table of every attachment across the project's tasks: file type icon, name, the task it belongs to (as a link), uploader avatar and name, size, and upload date. Filterable by type (Images / Documents / All) and searchable by filename. Each row has a `⋯` menu with Download, Copy link, Open task, and Delete.

A total storage line sits above the table: "48 files · 214 MB of 2 GB used" with a thin progress bar.

---

## 7.13 Board View

**Route:** `/w/:slug/projects/:id/board` · **Access:** Project members. Viewers see it read-only with drag disabled.

### 7.13.1 Layout

The sidebar auto-collapses to 64px on this route. Columns are laid out horizontally with `overflow-x: auto`, 12px gap, 16px page padding.

### 7.13.2 Column specification

| Property | Value |
|---|---|
| Width | 280px fixed |
| Background | `--surface-sunken` |
| Radius | 10px |
| Padding | 10px |
| Max height | `calc(100vh - 200px)`, then the card area scrolls internally |

**Column header** — sticky within the column, 32px tall:
- A 3px × 14px vertical bar in the status colour, then the column name in `label` (13px/500)
- Count in `caption` `--ink-muted`
- On hover: a `plus` icon button and a `⋯` icon button appear on the right

**Column `⋯` menu:** Rename column · Set WIP limit · Sort by (priority / due date / created) · Collapse column · Hide column · Archive all completed (Done column only).

**WIP limit display:** when set, the count reads "6 / 5" and turns `--danger` with a subtle `--danger-bg` tint on the column header when exceeded. Dropping a card into a full column is still allowed but shows a warning toast — a hard block would fight the way real teams work.

**Collapsed column:** 44px wide, the name rotated 90°, the count at the top. Click anywhere to expand. Collapse state persists per user per project.

### 7.13.3 Task card specification

| Property | Value |
|---|---|
| Background | `--surface` |
| Border | 1px `--line` |
| Left border | 3px in the priority colour, square corners on that edge |
| Radius | 6px (right corners) |
| Padding | 10px |
| Gap between cards | 8px |
| Hover | Border `--line-strong`, a `⋯` button fades in at the top-right |

**Card content, top to bottom** (every element is conditional except the title):

1. **Label chips** — up to 2, then a `+N` chip. 11px, full radius.
2. **Title** — `body` 14px `--ink`, clamped to 2 lines.
3. **Due date row** — `calendar-clock` icon plus formatted date. Coloured by urgency; overdue uses `alert-circle` instead and reads "2 days late".
4. **Blocked indicator** — a `ban` icon plus "Blocked by TSK-118" in `--danger` `caption`, shown when an incomplete dependency exists.
5. **Progress bar** — 3px, shown only when the task has subtasks.
6. **Footer row** — left: subtask count (`list-checks` "1/3"), comment count (`message-square` "5"), attachment count (`paperclip` "2"), each only when non-zero. Right: assignee avatar at 20px, or a dashed circle with a `user` icon when unassigned.

**Card states:**

| State | Treatment |
|---|---|
| Default | As above |
| Hover | `--line-strong` border, `⋯` visible, cursor `grab` |
| Dragging | `rotate(-1.5deg)`, `scale(1.02)`, `0 8px 24px rgba(28,25,23,0.16)`, cursor `grabbing`, the original position shows a `--surface-inset` ghost |
| Done | Title `--ink-muted` with a strikethrough, whole card at 70% opacity, left border in the muted Done green |
| Selected (multi-select) | 1.5px `--accent-500` border, `--accent-50` background |
| Just updated by someone else | A 1.5s `--accent-100` background pulse, so live changes are noticed |

### 7.13.4 Drag and drop

**Library:** dnd-kit, with pointer, touch, and keyboard sensors.

| Behaviour | Detail |
|---|---|
| Activation | 5px pointer movement, or 200ms hold on touch — prevents accidental drags on click |
| Drop target | A 2px dashed `--accent-500` outline with an `--accent-50` fill at the insertion point, height matching the dragged card |
| Auto-scroll | Dragging near a horizontal edge scrolls the board at up to 15px per frame |
| Cross-column | Changes status; same-column changes position only |
| Drop animation | 200ms `cubic-bezier(0.2,0,0,1)` |
| Optimistic update | The card moves immediately; `PATCH /tasks/:id/status` fires in the background. On failure the card animates back and an error toast appears |
| Position algorithm | Fractional — the new position is the midpoint of its neighbours. When the gap between two positions falls below 0.0001, a background job renormalises the column to integers |
| Multi-drag | Selecting several cards with `Shift`-click and dragging moves them together as a stacked visual |

**Keyboard drag:** `Tab` to a card, `Space` to lift (an `aria-live` region announces "Draft landing page copy lifted, position 2 of 4 in To do"), arrow keys to move, `Space` to drop, `Escape` to cancel.

### 7.13.5 Quick add

Every column footer has an `+ Add task` row in `caption` `--ink-muted`. Clicking replaces it with a bordered textarea:

- Autofocused, placeholder "What needs doing?"
- `Enter` creates the task in that column and immediately reopens an empty composer below it, so several tasks can be typed in a row
- `Shift + Enter` inserts a line break
- `Escape` cancels
- Below the field, three small icon buttons set assignee, due date, and priority before creation
- Inline syntax: typing `@ayesha` assigns, `!high` sets priority, `#design` adds a label, and `/tomorrow` sets a due date — each token is parsed out and shown as a chip

### 7.13.6 Filter panel

Opened by the `Filter` button, a popover 320px wide, anchored below it.

| Filter | Control |
|---|---|
| Assignee | Multi-select with avatars, plus "Unassigned" and "Me" shortcuts |
| Priority | Four checkboxes with colour dots |
| Label | Multi-select of workspace labels |
| Due date | Radio: Any · Overdue · Today · This week · This month · No date · Custom range |
| Created by | Multi-select |
| Has | Checkboxes: Attachments · Comments · Subtasks · Dependencies |

Footer: `Clear all` tertiary, `Apply` primary. Applied filters become chips in the toolbar, each removable. A `Save view` action stores the combination with a name; saved views appear in a dropdown next to the Filter button and can be shared with the project.

Filters serialise to the URL, so a filtered board is a shareable link.

### 7.13.7 Empty states

| Case | Treatment |
|---|---|
| Empty column | A 60px dashed `--line-strong` area with `+ Add task` centred inside, `--ink-faint` |
| Empty board | A centred empty state replacing the columns: "This board is empty", "Add your first task to get started", `Add task` primary button |
| Filtered to nothing | "No tasks match these filters" with a `Clear filters` secondary button. Columns remain visible so the structure is not lost |

---

## 7.14 List View

**Route:** `/w/:slug/projects/:id/list`

A table view of the same data, for people who think in rows rather than columns, and for bulk operations.

### 7.14.1 Columns

| Column | Width | Content | Sortable |
|---|---|---|---|
| Checkbox | 40px | Bulk select; the header checkbox selects the whole visible page | — |
| Priority | 32px | 8px dot with a tooltip | ✅ |
| Title | flex | Task title, plus a `list-checks` "2/4" chip when it has subtasks; expandable caret when it has children | ✅ |
| Assignee | 120px | 20px avatar + first name | ✅ |
| Status | 120px | Status pill, click to open an inline dropdown | ✅ |
| Due date | 100px | Formatted, right-aligned, tabular figures | ✅ |
| Labels | 140px | Up to 2 chips + overflow | — |
| Comments | 60px | Icon + count, hidden when zero | — |
| `⋯` | 40px | Row menu | — |

Column visibility is configurable through a `Columns` dropdown in the toolbar and persists per user per project.

### 7.14.2 Grouping

A `Group by` dropdown offers Status (default) · Assignee · Priority · Due date · Label · None. Group headers are 36px rows in `--surface-sunken` with a collapse caret, the group name, and a count. Collapse state persists.

### 7.14.3 Inline editing

Clicking a cell edits it in place — no modal, no edit mode:

| Cell | Behaviour |
|---|---|
| Title | Becomes a text input; `Enter` saves, `Escape` reverts, blur saves |
| Assignee | Opens a searchable member dropdown |
| Status | Opens the status dropdown |
| Due date | Opens a date picker popover |
| Priority | Opens a four-option dropdown |
| Labels | Opens a multi-select |

Each save shows a 1-second `--success` flash on the cell border, then fades.

### 7.14.4 Bulk action bar

Appears as a sticky bar directly below the toolbar the moment one row is selected. `--accent-50` background, 44px tall, 1px bottom border.

Left: "3 selected" in `--accent-800`. Then: `Assign` · `Status` · `Priority` · `Due date` · `Labels` · `Move to project` — each a `sm` accent-text button opening a dropdown. Then a divider, then `Delete` in `--danger`. Far right: an `x` button clearing the selection.

Bulk operations are applied with a single API call and show a result toast with an `Undo` action valid for 10 seconds.

**Selection rules:** `Click` selects one, `Shift + click` selects a range, `Cmd/Ctrl + click` toggles individually, `Cmd/Ctrl + A` selects all visible rows.

### 7.14.5 Pagination

50 rows per page with infinite scroll — a sentinel element 200px from the bottom triggers the next fetch, and a skeleton row set renders while loading. A footer line shows "Showing 50 of 214". Sorting or filtering resets to the first page and scrolls to the top.

---

## 7.15 Calendar View

**Route:** `/w/:slug/projects/:id/calendar` and `/w/:slug/calendar` for the workspace-wide version.

### 7.15.1 Controls

Header row: `‹` and `›` icon buttons, a `Today` secondary `sm` button, the current period in `title-md` ("September 2026"), and on the right a segmented control for Month · Week · Day, plus the standard Filter button.

### 7.15.2 Month grid

Seven columns, six rows, cells at a minimum 110px tall.

| Element | Spec |
|---|---|
| Day-of-week header | `overline`, `--ink-muted`, 32px tall, 1px bottom border |
| Cell | 1px `--line` borders forming the grid, `--surface` background |
| Date number | `caption`, top-left, 8px padding |
| Today's cell | Date number becomes a 22px `--accent-700` circle with white text |
| Outside the month | Date number `--ink-faint`, cell background `--canvas` |
| Weekend | Cell background `--canvas` (configurable per workspace) |

**Task chips inside a cell:** 20px tall, full-width, 4px radius, 11px text truncated to one line, with a 3px priority-coloured left edge and the assignee's 14px avatar on the right. Maximum 3 per cell, then a `+2 more` link in `caption` `--accent-700` that opens a day popover.

**Interactions:**
- Click a chip → opens the task drawer
- Drag a chip to another cell → changes the due date, optimistically
- Click an empty area of a cell → opens the quick-add composer pre-filled with that date
- Click the date number → switches to Day view for that date

### 7.15.3 Week and day views

Week view shows seven columns with hour rows from 08:00 to 20:00, positioning tasks that carry a specific time and stacking all-day tasks in a band at the top. Day view is a single column with the same hour grid plus a wider chip showing the description preview.

### 7.15.4 Workspace calendar differences

The `/w/:slug/calendar` version aggregates every project the user can see. Each chip is tinted by its **project** colour rather than priority, and a project multi-select filter is added to the toolbar. A legend of project colours sits below the header.

---

## 7.16 Task Detail

**Route:** `/w/:slug/tasks/:id` · Opens as a right drawer over the current view; renders as a full page on direct navigation or under 900px.

### 7.16.1 Header

44px tall, 1px bottom border, 14px padding:
- Left: project colour square, project name in `caption`, a `/` separator, and the task ID (`TSK-142`) in `--font-mono` 11px `--ink-muted`
- Right, as 16px tertiary icon buttons: `eye` (Watch — filled and `--accent-700` when watching), `link` (Copy link), `maximize-2` (Open full page), `⋯` (More), `x` (Close)

**`⋯` menu:** Duplicate task · Move to project · Convert to subtask · Convert subtask to task · Add dependency · Print · Archive · Delete.

### 7.16.2 Title

`title-md` (20px Plus Jakarta Sans 600), click-to-edit. Editing turns it into a borderless auto-growing textarea holding the same type styles, so nothing shifts. `Enter` saves, `Escape` reverts, blur saves. 255-character limit with a counter appearing past 200.

### 7.16.3 Properties block

A `--surface-sunken` block, 8px radius, 14px padding, laid out as a two-column grid: a fixed 84px label column in `label` type `--ink-muted`, and a value column. Row gap 10px.

| Property | Control | Notes |
|---|---|---|
| Status | Status pill + chevron → dropdown | Selecting Done sets `completed_at` and fires the completion animation |
| Priority | Colour dot + word + chevron → dropdown | Four options |
| Assignee | Avatar + name → searchable dropdown | Includes "Unassign" and "Assign to me". Members can only assign to themselves |
| Watchers | Avatar stack + `+` | Popover with a member multi-select |
| Start date | Date chip → picker | Optional |
| Due date | Date chip → picker | Includes an optional time. Coloured by urgency |
| Labels | Chips + `+` | Multi-select with an inline "Create label" action |
| Estimate | "4h" text field | Accepts `4h`, `30m`, `1d` — parsed to minutes |
| Dependencies | "Blocked by TSK-118" chips | Task search popover. A cycle attempt is rejected with *"That would create a circular dependency."* |
| Created | `caption` text | Non-editable: "by Ayesha · 3 Sep" |

Every change is saved immediately. A `caption` "Saving…" appears at the top-right of the block, becoming "Saved" for 2 seconds, then fading.

### 7.16.4 Description

`label` heading "Description", then a Tiptap rich-text area. Empty state: an `--ink-faint` placeholder "Add a description…" that becomes an editor on click.

**Toolbar** (appears on focus, floating above the selection): Bold · Italic · Strikethrough · Inline code · H2 · H3 · Bulleted list · Numbered list · Checklist · Link · Code block · Quote · Divider · Image.

**Markdown shortcuts** work while typing: `**bold**`, `# heading`, `- list`, `1. list`, `[ ] checkbox`, `` `code` ``, `>` quote.

**Mentions:** typing `@` opens the member picker; the mention renders as an `--accent-50` chip with `--accent-800` text and notifies that person.

**Autosave:** 800ms after typing stops, and always on blur. Content is stored as HTML, sanitised through DOMPurify both on save and on render.

### 7.16.5 Subtasks

Header row: `label` "Subtasks" on the left, "1 of 3" in `caption` on the right. Below it a 4px progress track filling in `--success`.

Each subtask row, 34px tall with a 1px bottom border:
- A drag handle (`grip-vertical`, 14px) appearing on hover at the far left
- A 16px checkbox
- The title, click-to-edit inline; checked items get `--ink-muted` and a strikethrough
- On the right: an optional due-date chip and a 18px assignee avatar (or a dashed placeholder)
- A `⋯` icon on hover: Open as task · Assign · Set due date · Delete

Footer: `+ Add subtask` opening an inline input where `Enter` creates and keeps the input open.

**Rules:** subtasks are real tasks with `parent_task_id` set. They inherit the project. They cannot have their own subtasks. Completing all subtasks does not auto-complete the parent, but shows a toast: *"All subtasks done. Mark 'Draft landing page copy' complete? **Yes**"*.

### 7.16.6 Attachments

A grid of file cards, 3 per row. Each card: a 32px type icon (or an image thumbnail), the filename truncated to one line in `caption`, the size in 11px `--ink-faint`, and a `⋯` on hover with Download · Copy link · Rename · Delete.

A dashed `--line-strong` drop zone sits at the end of the grid reading "Drop files or **browse**". The entire drawer is also a drop target — dragging a file anywhere over it shows a full-panel `--accent-50` overlay with a 2px dashed `--accent-500` border and the text "Drop to attach".

**Constraints:** 10 MB per file, 25 files per task, allowed types `png jpg jpeg gif webp svg pdf doc docx xls xlsx ppt pptx csv txt md zip`. Upload shows a progress bar per file with a cancel `x`. Failures show inline with a `Retry` action.

### 7.16.7 Comments and Activity

Two tabs. "Comments" carries a count; "Activity" does not. Comments is the default.

**Why they are separated:** a task that has been reassigned four times and moved three times generates twenty system entries. Interleaved with three real comments, the conversation becomes unfindable. Splitting them keeps discussion readable while preserving the full audit trail one click away.

**Comment item:** 32px avatar on the left, then the author name in `body-strong`, a relative timestamp in `caption`, an "(edited)" marker where applicable, and the body in `body` `--ink-body` with full rich-text rendering. On hover, a small action row appears at the top-right: `Reply` · `React` (emoji picker) · `⋯` (Edit — own comments only · Copy link · Delete).

Replies are indented 40px with a 2px `--line` left rule, and collapse to "3 replies" after two.

Reactions render as small pills below the comment: the emoji, a count, and an `--accent-50` background when the current user has reacted.

**Composer:** pinned at the bottom of the drawer with a 1px top border and a `--surface` background so it stays visible while scrolling. 32px avatar, a bordered input that grows from 1 to 6 rows, then an icon row (emoji · mention · attach) and a `Comment` primary `sm` button. `Cmd/Ctrl + Enter` submits. Drafts are kept in `localStorage` per task and restored if the drawer is closed and reopened.

**Activity tab:** a vertical timeline with a 1px `--line` running through 20px avatars. Each entry is a single sentence with the changed values inline — "Bilal changed status from **To do** to **In progress**" — plus an absolute timestamp on hover. Grouped by day with `overline` date separators. Rapid consecutive changes by the same person collapse into one entry: "Ayesha made 3 changes ▾".

### 7.16.8 Keyboard shortcuts

| Key | Action |
|---|---|
| `Esc` | Close the drawer |
| `E` | Edit the title |
| `A` | Open the assignee picker |
| `D` | Open the due-date picker |
| `P` | Open the priority menu |
| `S` | Open the status menu |
| `L` | Open the label picker |
| `C` | Focus the comment box |
| `W` | Toggle watch |
| `Cmd/Ctrl + Enter` | Submit the focused composer |
| `Cmd/Ctrl + Backspace` | Delete task (with confirmation) |
| `J` / `K` | Next / previous task without leaving the drawer |

### 7.16.9 Real-time behaviour

Socket.IO room per task. When another user changes a property, the field updates with a 1.5s `--accent-100` pulse and a `caption` note "Updated by Bilal just now". New comments append with the same pulse. If the current user is typing in the composer, the view does **not** auto-scroll — losing your place mid-sentence is worse than missing a message by a second. A subtle "1 new comment ↓" pill appears instead.

Concurrent editing of the same text field uses last-write-wins with a warning: *"Bilal also edited this description. **View their version**"*.

---

## 7.17 My Tasks

**Route:** `/w/:slug/my-tasks` · **The landing page for Members.**

Cross-project list of everything assigned to the current user. Structurally similar to the List view but with no project scope and a different default grouping.

### 7.17.1 Toolbar

Quick-filter tabs with live counts: All · Today · Overdue (always rendered in `--danger` whether selected or not) · Upcoming · Unscheduled · Completed.

Right side: a `Group by` dropdown defaulting to **Due date** (groups: Overdue, Today, Tomorrow, This week, Later, No date), plus Filter and `New task`.

### 7.17.2 Row anatomy

Checkbox · priority dot · title · project chip (in the project's colour family) · status pill · due date, right-aligned in a fixed 72px column with tabular figures.

The fixed-width date column matters: a ragged right edge makes a list unscannable.

### 7.17.3 Completing a task from this screen

1. Checkbox fills `--accent-700` with a white check
2. The row title gets a strikethrough and fades to `--ink-muted` over 200ms
3. After a 300ms hold, the row collapses its height to zero over 200ms and is removed
4. An Undo toast appears for 6 seconds with a visible countdown bar
5. Undo restores the row in place with a brief `--accent-50` flash

### 7.17.4 Inline add

Each group has an `+ Add task` row at its foot. Typing and pressing `Enter` creates a task with that group's implied due date, assigned to the current user, in their most recently used project — with the project shown as an editable chip in the composer.

### 7.17.5 Empty states

| Case | Treatment |
|---|---|
| Nothing assigned | `check-circle` icon, "Nothing assigned to you", "When someone assigns you a task, it'll show up here.", `Browse projects` secondary button |
| All done today | `party-popper` icon, "You're all caught up", "Nothing due today. Nice work.", then a `caption` list of the next three upcoming tasks |
| Filtered to nothing | "No tasks match these filters", `Clear filters` button |

---

## 7.18 Team Directory

**Route:** `/w/:slug/team` · **Access:** All roles; Viewers see it read-only.

### 7.18.1 Header

`title-lg` "Team", a `caption` "8 members · 2 pending invites", and on the right an `Invite people` primary button (Owner and Manager only).

### 7.18.2 Tabs

**Members** (count) · **Pending invites** (count) · **Roles and permissions**.

### 7.18.3 Members table

| Column | Content |
|---|---|
| Person | 32px avatar, name in `body-strong`, email in `caption` below |
| Role | Role pill; a dropdown for those permitted to change it |
| Projects | Count with a tooltip listing them |
| Open tasks | Number with a small inline bar |
| Last active | Relative time; "Never" in `--ink-faint` for those who have not logged in |
| `⋯` | Row menu |

Above the table: a search field, a role filter dropdown, and a sort dropdown (Name · Role · Recently joined · Open tasks).

**Row `⋯` menu:** View profile · Change role (submenu) · Add to project (submenu) · Send message · — · Remove from workspace (`--danger`).

**Role change confirmation:** demoting a Manager to Member shows a modal listing what they will lose: *"Bilal will no longer be able to create projects, assign tasks to others, or manage members."* with `Cancel` and `Change role`.

**Remove member modal:** small, `--danger`. Lists impact — "Bilal is assigned to 7 open tasks across 3 projects" — and offers a required choice of what to do with them: **Reassign to** (member select) · **Leave unassigned**. `Cancel` and `Remove member`.

### 7.18.4 Pending invites tab

Table: email, role, invited by, sent date, expiry with a countdown, and status (`Pending` `--warning` pill or `Expired` `--ink-muted` pill). Actions per row: `Resend` and `Cancel`. A `Cancel all expired` bulk action sits above.

### 7.18.5 Roles and permissions tab

A read-only rendering of the permission matrix from Section 3.3, showing only workspace-relevant rows. Purely educational — it exists so an Owner can decide which role to give someone without guessing. The current user's own role is highlighted with an `--accent-50` column background.

---

## 7.19 Notifications

### 7.19.1 Popover

Opened from the bell. 400px wide, max 480px tall, 10px radius.

Header: `title-sm` "Notifications" on the left; `Mark all read` accent-text and a `settings` icon on the right.
Tabs: All · Unread · Mentions.

**Item:** 24px actor avatar (or a type icon for system notifications), a body sentence with the actor's name and the object in `--ink` `body-strong`, a `caption` timestamp, and a 6px `--accent-500` dot on the far right when unread. Unread items also carry an `--accent-50` background.

Clicking navigates to the object and marks it read. Hovering reveals a `⋯` with Mark as read/unread · Turn off notifications for this task.

Footer: `View all` linking to `/w/:slug/notifications`.

Empty state: `bell-off` icon, "You're all caught up".

### 7.19.2 Full page

The same list at full width, grouped by day with `overline` separators, with filters for type and project, and infinite scroll. Bulk selection allows Mark read and Delete.

### 7.19.3 Complete notification matrix

| Trigger | In-app | Email | Who receives it |
|---|:---:|:---:|---|
| Task assigned to you | ✅ | ✅ | Assignee |
| Task unassigned from you | ✅ | ❌ | Previous assignee |
| Mentioned in a description or comment | ✅ | ✅ | Mentioned user |
| Comment on a task you're assigned to | ✅ | ✅ | Assignee |
| Comment on a task you watch | ✅ | Digest | Watchers |
| Reply to your comment | ✅ | ✅ | Comment author |
| Status changed on your task | ✅ | ❌ | Assignee, watchers |
| Due date changed on your task | ✅ | ✅ | Assignee |
| Priority raised to Urgent | ✅ | ✅ | Assignee, watchers |
| Task due tomorrow | ✅ | ✅ | Assignee |
| Task due in 1 hour | ✅ | ❌ | Assignee |
| Task now overdue | ✅ | ✅ | Assignee, and the Manager if over 3 days |
| Blocking task completed | ✅ | ✅ | Assignee of the blocked task |
| Added to a project | ✅ | ✅ | Added user |
| Removed from a project | ✅ | ❌ | Removed user |
| Invited to a workspace | ❌ | ✅ | Invitee |
| Invite accepted | ✅ | ❌ | Inviter |
| Join request received | ✅ | ✅ | Owners and Managers |
| Join request approved | ✅ | ✅ | Requester |
| Role changed | ✅ | ✅ | Affected user |
| Project deadline in 3 days | ✅ | ✅ | Project members |
| Project marked complete | ✅ | ❌ | Project members |
| Weekly summary | ❌ | ✅ | All, Monday 08:00 local |
| Password changed | ❌ | ✅ | Account owner |
| New device login | ❌ | ✅ | Account owner |

### 7.19.4 Delivery rules

**Batching.** Multiple events on one task within 5 minutes collapse into a single notification: "Bilal made 3 changes to Fix checkout bug".

**Self-suppression.** Users never receive notifications for their own actions.

**Email digest mode.** A per-user setting: Immediate · Hourly digest · Daily digest · Off. Digests group by project and render as a plain, well-structured email.

**Quiet hours.** Configurable per user (default 20:00–08:00 in their timezone). Non-urgent emails queue until the window ends; in-app notifications are unaffected.

**Preferences page** (`/settings/notifications`): one row per trigger with two toggles (In-app, Email), a master digest selector, quiet-hours time inputs, and a `Send test notification` button.

---

## 7.20 Global Search / Command Palette

Triggered by `Cmd/Ctrl + K` or by clicking the search field. A modal overlay, 600px wide, positioned 15vh from the top.

**Input:** 48px tall, borderless, 16px text, with a `search` icon and placeholder "Search or type a command…".

**Default state (nothing typed):** sections for *Recent* (last 5 opened items) and *Quick actions* — Create task · Create project · Invite people · Go to My tasks · Go to Settings · Switch workspace · Toggle theme.

**Search results:** grouped by type with `overline` headers — Tasks · Projects · People · Comments. Each row: a type icon, the title with matched substrings wrapped in a `<mark>` styled with an `--accent-100` background, and a `caption` context line ("in Website redesign · assigned to Bilal"). Maximum 5 per group with a "See all 14 tasks" row.

**Command mode:** typing `>` switches to commands only. Typing `@` searches people. Typing `#` searches labels. Typing `/` searches projects.

**Keyboard:** `↑`/`↓` navigate, `Enter` opens, `Cmd/Ctrl + Enter` opens in a new tab, `Esc` closes. The highlighted row has an `--accent-50` background.

**Implementation:** PostgreSQL full-text search across task titles, descriptions, project names, and comment bodies, with a GIN index on a generated `tsvector` column. Debounced 200ms. Results are permission-filtered server-side — a user never sees a match in a project they cannot access.

---

## 7.21 Settings

A two-level navigation: a settings sidebar replaces the project list, with sections **Account** (Profile · Security · Notifications) and **Workspace** (General · Members · Labels · Domains · Billing · Audit log), the latter filtered by role.

### 7.21.1 Profile (`/settings/profile`)

Avatar (72px) with `Upload` and `Remove` buttons · Full name · Job title · Timezone select (searchable, defaulting from the browser) · Date format (DD/MM/YYYY · MM/DD/YYYY · YYYY-MM-DD) · Time format (12h · 24h) · Week starts on (Sunday · Monday) · Language.

Email address is displayed read-only with a `Change email` button opening a modal that requires the password, re-runs the work-email validation, and sends a verification code to the new address before switching.

`Save changes` primary button, disabled until the form is dirty. A "You have unsaved changes" bar appears at the bottom when dirty and the user tries to navigate away.

### 7.21.2 Security (`/settings/security`)

**Change password** — current, new, confirm; on success every other session is revoked and an email is sent.
**Two-factor authentication** — a toggle opening a setup flow: QR code, 6-digit confirmation, then 10 single-use recovery codes with a `Download` button. Once enabled, shows `Regenerate codes` and `Disable` (password required).
**Active sessions** — a table of device, browser, IP, approximate location, and last active. The current session is marked. Each row has `Revoke`; a `Revoke all others` button sits above.
**Danger zone** — a `--danger-border` block with `Delete account`, requiring the password and typing `DELETE`. If the user owns any workspace, they must transfer or delete it first, and the modal lists them.

### 7.21.3 Workspace general (`/w/:slug/settings/general`) — Owner only

Workspace name · slug (with a warning that changing it breaks existing links) · logo · default timezone · week start · whether weekends are highlighted · default task status for new tasks · default project template.

**Transfer ownership** — a member select, a confirmation typing the workspace name, and a note that the current owner becomes a Manager.
**Danger zone** — `Delete workspace`, listing what will be destroyed and requiring the name to be typed.

### 7.21.4 Labels (`/w/:slug/settings/labels`)

A table of labels: colour swatch, name, usage count, created by. Inline rename on click. A colour picker offering the 8 data-viz hues plus a custom hex field. `New label` primary button. Deleting shows the usage count and warns that it will be removed from those tasks.

### 7.21.5 Domains (`/w/:slug/settings/domains`) — Owner only

The verified domain is listed with a `Verified` `--success` pill. Below it, the discovery setting as three radio options with descriptions:

- **Approval required** — People from @novastudio.pk can request to join. You approve each one. *(default)*
- **Auto-join** — Anyone with an @novastudio.pk address joins automatically as a Member.
- **Off** — New signups from your domain create their own separate workspace.

Additional verified domains can be added (for companies with several) via a DNS TXT record flow showing the record to add, a `Verify` button, and the current status.

### 7.21.6 Audit log (`/w/:slug/settings/audit`) — Owner only

A table: timestamp (absolute, `--font-mono` 12px), actor (avatar + name), action (a code like `member.role_changed` in `--font-mono`), target, and details. Filterable by actor, action type, and date range. Exportable to CSV. Retained for 1 year on paid plans and 30 days on free.

---

## 7.22 Admin Console

**Routes:** `/admin/*` · **Access:** Platform Admin only · **Shell:** B (dark top bar, no sidebar)

### 7.22.1 Why it is completely separate

A Platform Admin is not a customer. They do not have tasks, projects, or a workspace. Rendering the customer sidebar for them would be a lie about what they can do. Shell B removes it entirely and swaps in a dark `#1C1917` top bar with the wordmark "TASKFLOW ADMIN" in `--accent-400` — the one place in the product where a dark surface appears, precisely so that it is impossible to confuse the two contexts.

### 7.22.2 Top bar

Wordmark on the left, then horizontal navigation: Overview · Organisations · Users · Domains · System · Announcements. Active item gets a 2px `--accent-400` bottom border. On the right: a global search field ("Search by email, workspace, or ID"), an environment pill (`PRODUCTION` in `--danger-bg`/`--danger` — a standing reminder of where you are), and the admin's avatar menu with `Exit admin` and `Log out`.

### 7.22.3 Overview

Eight metric cards: Total organisations · Total workspaces · Total users · Active users (7d) · Tasks created (24h) · Signups (24h) · Failed jobs · Error rate.

Two charts: signups over the last 30 days (line) and tasks created per day (bar).

A `Needs attention` panel listing: workspaces over their storage quota, users with more than 10 failed logins in the last hour, jobs failed more than 3 times, and domains flagged by more than one abuse report.

### 7.22.4 Organisations

A table of domain, workspace count, member count, plan, storage used, created date, and status. Searchable and filterable by plan and status.

**Detail page** shows the organisation header (domain, plan, created date), tabs for Workspaces · Members · Billing · Activity, and an actions panel: `Change plan` · `Extend trial` · `Suspend organisation` (with a required reason) · `Send message to owners`.

**What is never shown:** task titles, descriptions, comments, or attachment contents. The workspaces tab lists names, member counts, project counts, and task counts only. This is enforced at the query layer, not by omitting it from the UI — the admin endpoints select metadata columns and never join to task content.

### 7.22.5 Users

Search by email, name, or ID. The table shows avatar, name, email, workspace count, role summary, verification status, last login, and account status.

**Detail page:** profile summary, workspace memberships with roles, recent login history with IPs, and actions — `Force verify email` · `Send password reset` · `Suspend account` (reason required) · `Reactivate` · `Impersonate (read-only)`.

**Impersonation** is heavily constrained: it grants a read-only session, displays a permanent `--warning` banner reading "You are viewing as ayesha@novastudio.pk — read only. **Exit**", expires after 30 minutes, writes an audit entry on entry and exit, and notifies the impersonated user by email.

### 7.22.6 Domains

Two tables: **Blocked domains** (domain, reason, added by, date, with `Add` and `Remove`) and **Verified organisation domains** (domain, workspace, verification method, date).

### 7.22.7 System

Queue health per BullMQ queue (waiting, active, completed, failed) with `Retry failed` and `Clear completed` actions · Recent errors from Sentry with counts and last-seen times · Database connection pool stats · Redis memory · Storage totals · A cron job table showing each scheduled job's last run, duration, and next run.

### 7.22.8 Announcements

Create a platform-wide banner: message (rich text), type (info · warning · danger), audience (all · specific plans · specific workspaces), start and end datetime, and dismissible toggle. A live preview renders exactly as customers will see it. A table of past announcements with view and dismissal counts.

---

## 7.23 Error and Utility Pages

All use a minimal shell: the logo at the top, content centred, no navigation.

| Page | Icon | Heading | Body | Actions |
|---|---|---|---|---|
| `/403` | `lock` `--warning` | "You don't have access to this" | "Ask a workspace owner or manager if you need it." | `Go to my tasks` primary · `Back` secondary |
| `/404` | `search-x` `--ink-muted` | "We can't find that page" | "It may have been moved, deleted, or the link is wrong." | `Go home` primary · `Search` secondary |
| `/500` | `alert-triangle` `--danger` | "Something went wrong on our end" | "We've been notified and we're looking into it." Plus an error ID in `--font-mono` with a copy button | `Try again` primary · `Contact support` secondary |
| `/account-suspended` | `user-x` `--danger` | "Your account is suspended" | "Contact support@taskflow.app to resolve this." | `Contact support` primary · `Log out` secondary |
| `/workspace-suspended` | `building-x` `--danger` | "This workspace is suspended" | "Contact your workspace owner." | `Switch workspace` primary · `Log out` secondary |
| Offline | `wifi-off` | "You're offline" | "We'll reconnect automatically. Any changes you make will sync." | `Retry` secondary |

**Error boundaries:** every route is wrapped in a React error boundary that renders an inline error card rather than a white screen — "This section failed to load" with a `Reload section` button — so one broken panel does not take down the page.

---

# 8. Functional Specification

Every function the system performs, with its inputs, rules, and outcomes. Grouped by module.

## 8.1 Authentication module

| Function | Input | Rules | Output |
|---|---|---|---|
| `registerUser` | name, email, password | Work-email pipeline; email unique; password ≥10 chars and not breached | User created unverified; code emailed |
| `sendVerificationCode` | userId | Max 5/hour per user; invalidates any previous code | 6-digit code hashed and stored, 10-min expiry |
| `verifyEmail` | userId, code | Max 5 attempts; constant-time comparison | `is_verified = true`; routes per Section 7.3.4 |
| `loginUser` | email, password, rememberMe | Generic error on failure; 5 attempts / 15 min | Access + refresh tokens; landing route resolved |
| `refreshSession` | refreshToken cookie | Token must be unused and unexpired; rotates | New token pair; family revoked on reuse |
| `logout` | refreshToken | — | Token revoked; cookie cleared |
| `logoutAllDevices` | userId | — | All refresh tokens for the user revoked |
| `requestPasswordReset` | email | Identical response and timing whether or not the account exists; 3/hour | Token emailed if the account exists |
| `resetPassword` | token, newPassword | Token unused and under 30 min old | Password updated; all sessions revoked; email sent |
| `changePassword` | userId, current, new | Current password must verify | Password updated; other sessions revoked |
| `googleOAuthCallback` | Google profile | Work-email pipeline applies to the returned address | Links to an existing user by email, or creates one |
| `changeEmail` | userId, newEmail, password | Work-email pipeline; new address must be unused | Pending until the new address is verified |

## 8.2 Workspace module

| Function | Input | Rules | Output |
|---|---|---|---|
| `createWorkspace` | name, logo, ownerId | Slug unique with auto-suffix; max 5 owned on free tier | Workspace + owner membership + 5 default labels |
| `updateWorkspace` | id, fields | Owner only; slug change warns about broken links | Updated record; audit entry |
| `deleteWorkspace` | id | Owner only; name must be typed to confirm | Soft delete; 30-day restore window; all members notified |
| `transferOwnership` | id, newOwnerId | Owner only; target must be an existing member | Roles swapped; both users notified; audit entry |
| `listUserWorkspaces` | userId | — | All memberships with role, ordered by last visited |
| `switchWorkspace` | userId, workspaceId | Membership required | `last_workspace_id` updated; role landing route returned |
| `getWorkspaceStats` | id | Cached 60s | Project, member, and task counts; storage used |

## 8.3 Membership module

| Function | Input | Rules | Output |
|---|---|---|---|
| `inviteMember` | workspaceId, email, role | Managers cannot invite Managers; work-email check skipped; not already a member | Invitation row + email; expires in 7 days |
| `bulkInvite` | workspaceId, rows[] | Max 20; partial success allowed | Per-row result list |
| `acceptInvitation` | token | Unexpired, unused, and the logged-in email matches | Membership created with the invited role |
| `cancelInvitation` | id | Owner, or the Manager who sent it | Status set to `cancelled`; token invalidated |
| `resendInvitation` | id | Max 3 resends; regenerates the token | New email sent |
| `changeMemberRole` | workspaceId, userId, role | Managers may only change Members and Viewers; cannot change an Owner | Role updated; user notified; audit entry |
| `removeMember` | workspaceId, userId, reassignTo? | Owner cannot be removed; open tasks must be reassigned or explicitly unassigned | Membership deleted; tasks handled; audit entry |
| `leaveWorkspace` | workspaceId, userId | Owner must transfer first | Membership deleted |
| `requestToJoin` | workspaceId, userId | Domain must match and discovery must be enabled | Request created; Owners and Managers notified |
| `approveJoinRequest` | requestId | Owner or Manager | Membership created as Member; requester notified |
| `generateJoinLink` | workspaceId, role | Owner only; invalidates the previous link | New 7-day token |

## 8.4 Project module

| Function | Input | Rules | Output |
|---|---|---|---|
| `createProject` | workspaceId, fields | Owner or Manager; deadline after start date; creator auto-added | Project + membership + template tasks |
| `updateProject` | id, fields | Owner or Manager | Updated record; members notified of a deadline change |
| `archiveProject` | id | Hidden from default lists; tasks become read-only | `is_archived = true` |
| `restoreProject` | id | — | `is_archived = false` |
| `deleteProject` | id | Owner only; name typed to confirm | Soft delete cascading to tasks |
| `duplicateProject` | id, includeTasks | Owner or Manager | New project; tasks copied without comments, attachments, or assignees |
| `addProjectMember` | projectId, userId | Must be a workspace member | Membership; user notified |
| `removeProjectMember` | projectId, userId | Their assigned tasks become unassigned | Membership removed |
| `getProjectStats` | id | Cached 30s | Counts by status, completion %, overdue count, burn-up series |
| `exportProjectCsv` | id | Respects active filters | CSV stream of all task fields |
| `configureBoardColumns` | projectId, columns[] | Owner or Manager; at least 2 columns; a column with tasks cannot be deleted without reassigning them | Column config saved |

## 8.5 Task module

| Function | Input | Rules | Output |
|---|---|---|---|
| `createTask` | projectId, fields | Title required; position appended to the column | Task created; assignee notified; activity logged |
| `quickCreateTask` | projectId, title, inline tokens | Parses `@user`, `!priority`, `#label`, `/date` | Task with parsed properties |
| `updateTask` | id, fields | Members may only edit their own; each changed field logged separately | Updated task; watchers notified |
| `changeTaskStatus` | id, status, position | Moving to Done sets `completed_at`; blocked tasks warn but are not prevented | Status updated; watchers notified |
| `reorderTask` | id, beforeId, afterId | Fractional midpoint; renormalise below 0.0001 gap | New position |
| `assignTask` | id, userId | Members may only self-assign; assignee must be a project member | Assignment; both parties notified |
| `bulkUpdateTasks` | ids[], fields | Owner or Manager; max 200 per call | Per-id result; single undo token |
| `createSubtask` | parentId, title | Parent must not itself be a subtask | Subtask inheriting the project |
| `addDependency` | taskId, dependsOnId | Cycle detection via graph traversal; same workspace only | Dependency row |
| `archiveTask` | id | Removed from all views, retained in the database | `is_archived = true` |
| `deleteTask` | id | Owner or Manager; cascades to subtasks and comments | Soft delete, 30-day window |
| `moveTaskToProject` | id, projectId | Labels not present in the target are dropped with a warning; assignee cleared if not a member there | Task moved |
| `watchTask` / `unwatchTask` | id, userId | — | Watcher row added or removed |
| `duplicateTask` | id | Copies fields and subtasks, not comments or attachments | New task titled "… (copy)" |
| `getTaskActivity` | id | Paginated, newest first | Activity entries with actor and diff |

## 8.6 Comment and attachment module

| Function | Input | Rules | Output |
|---|---|---|---|
| `createComment` | taskId, content, parentId? | Sanitised; mentions parsed and notified | Comment; watchers notified |
| `updateComment` | id, content | Author only, within 24 hours | Updated with `is_edited = true` |
| `deleteComment` | id | Author, Owner, or Manager | Soft delete showing "Comment deleted" |
| `reactToComment` | id, emoji | One of each emoji per user | Reaction toggled |
| `uploadAttachment` | taskId, file | ≤10 MB; MIME type allowlist; magic-byte check, not just the extension | Stored in Cloudinary; row created |
| `deleteAttachment` | id | Uploader, Owner, or Manager | Row deleted; storage file removed by a nightly job |

## 8.7 Notification module

| Function | Input | Rules | Output |
|---|---|---|---|
| `createNotification` | userId, type, payload | Suppressed when actor = recipient; batched within 5 min | Row; Socket.IO push |
| `markRead` / `markAllRead` | id / userId | — | Updated; badge count pushed |
| `queueEmail` | userId, template, data | Respects preferences, digest mode, and quiet hours | BullMQ job |
| `sendDeadlineReminders` | — | Cron hourly; finds tasks due within 24h in each user's timezone; deduplicated per task per day | Notifications queued |
| `sendOverdueAlerts` | — | Cron daily 09:00 local; escalates to the Manager after 3 days | Notifications queued |
| `sendWeeklyDigest` | — | Cron Monday 08:00 local | Digest email per user |

## 8.8 Search module

| Function | Input | Rules | Output |
|---|---|---|---|
| `globalSearch` | query, workspaceId, types[] | Permission-filtered server-side; debounced 200ms; ranked by `ts_rank` and recency | Grouped results with highlights |
| `filterTasks` | projectId, filters | Filters serialise to URL params | Paginated tasks |
| `saveView` | name, filters, scope | Personal or shared with the project | Saved view row |

---

# 9. Data Model

**Engine:** PostgreSQL 16. Chosen because this data is dense with many-to-many relationships — members to workspaces, labels to tasks, watchers to tasks, dependencies between tasks — and every screen is a join. A document store would require either duplication or application-side joins for all of them.

All primary keys are UUID v7 (time-ordered, so they index well and do not fragment the B-tree like v4).

## 9.1 Tables

### `users`
| Column | Type | Constraints |
|---|---|---|
| id | UUID | PK |
| name | VARCHAR(100) | NOT NULL |
| email | VARCHAR(254) | UNIQUE, NOT NULL, lowercased on write |
| email_domain | VARCHAR(200) | NOT NULL, generated from email, indexed |
| password_hash | TEXT | NULL for OAuth-only accounts |
| avatar_url | TEXT | |
| job_title | VARCHAR(100) | |
| timezone | VARCHAR(64) | DEFAULT 'Asia/Karachi' |
| locale | VARCHAR(10) | DEFAULT 'en' |
| date_format | VARCHAR(20) | DEFAULT 'DD/MM/YYYY' |
| time_format | SMALLINT | 12 or 24, DEFAULT 24 |
| week_starts_on | SMALLINT | 0=Sun, 1=Mon, DEFAULT 1 |
| theme | ENUM | light, dark, system — DEFAULT 'light' |
| is_verified | BOOLEAN | DEFAULT false |
| is_platform_admin | BOOLEAN | DEFAULT false |
| status | ENUM | active, suspended, deleted |
| auth_provider | ENUM | local, google |
| two_factor_secret | TEXT | NULL |
| two_factor_enabled | BOOLEAN | DEFAULT false |
| last_workspace_id | UUID | FK → workspaces, ON DELETE SET NULL |
| last_login_at | TIMESTAMPTZ | |
| created_at / updated_at | TIMESTAMPTZ | |

### `workspaces`
`id, name VARCHAR(50), slug VARCHAR(60) UNIQUE, logo_url, owner_id FK→users, timezone, week_starts_on, domain_discovery ENUM(approval_required|auto_join|off), plan ENUM(free|team|business), status ENUM(active|suspended|deleted), storage_used_bytes BIGINT, trial_ends_at, created_at, updated_at`

### `workspace_members`
`id, workspace_id FK, user_id FK, role ENUM(owner|manager|member|viewer), invited_by FK→users, joined_at`
UNIQUE `(workspace_id, user_id)` · INDEX `(user_id)` · INDEX `(workspace_id, role)`

### `workspace_domains`
`id, workspace_id FK, domain VARCHAR(200), is_verified BOOLEAN, verification_token, verified_at, created_at` · UNIQUE `(domain)`

### `invitations`
`id, workspace_id FK, email VARCHAR(254), role ENUM, token VARCHAR(64) UNIQUE, invited_by FK→users, status ENUM(pending|accepted|expired|cancelled), expires_at, accepted_at, resend_count SMALLINT, created_at`
INDEX `(workspace_id, status)` · INDEX `(email)`

### `join_requests`
`id, workspace_id FK, user_id FK, status ENUM(pending|approved|declined), reviewed_by FK→users, created_at, reviewed_at` · UNIQUE `(workspace_id, user_id)`

### `projects`
`id, workspace_id FK, name VARCHAR(80), description TEXT, color VARCHAR(7), icon VARCHAR(40), status ENUM(planning|active|on_hold|completed|archived), start_date DATE, deadline DATE, created_by FK→users, is_archived BOOLEAN, board_columns JSONB, position INTEGER, created_at, updated_at`
INDEX `(workspace_id, status)` · INDEX `(workspace_id, is_archived)`

`board_columns` example:
```json
[
  {"id":"backlog","name":"Backlog","status":"backlog","wipLimit":null,"order":0},
  {"id":"todo","name":"To do","status":"todo","wipLimit":null,"order":1},
  {"id":"doing","name":"In progress","status":"in_progress","wipLimit":5,"order":2}
]
```

### `project_members`
`id, project_id FK, user_id FK, added_by FK→users, added_at` · UNIQUE `(project_id, user_id)`

### `tasks`
| Column | Type | Notes |
|---|---|---|
| id | UUID | PK |
| short_id | VARCHAR(12) | e.g. `TSK-142`, unique per project |
| project_id | UUID FK | indexed |
| parent_task_id | UUID FK → tasks | NULL for top level |
| title | VARCHAR(255) | NOT NULL |
| description | TEXT | sanitised HTML |
| description_text | TEXT | plain-text copy, for search indexing |
| status | ENUM | backlog, todo, in_progress, in_review, done, blocked |
| priority | ENUM | low, medium, high, urgent — DEFAULT 'medium' |
| assignee_id | UUID FK → users | nullable |
| created_by | UUID FK → users | |
| start_date | DATE | |
| due_date | TIMESTAMPTZ | |
| completed_at | TIMESTAMPTZ | |
| estimate_minutes | INTEGER | |
| position | NUMERIC(20,10) | fractional ordering |
| is_archived | BOOLEAN | |
| search_vector | TSVECTOR | GENERATED from title + description_text |
| created_at / updated_at | TIMESTAMPTZ | |

### `labels`
`id, workspace_id FK, name VARCHAR(40), color VARCHAR(7), created_by FK, created_at` · UNIQUE `(workspace_id, name)`

### `task_labels`
`task_id FK, label_id FK` — composite PK, both indexed

### `task_watchers`
`task_id FK, user_id FK, created_at` — composite PK

### `task_dependencies`
`id, task_id FK, depends_on_task_id FK, created_by FK, created_at` · UNIQUE `(task_id, depends_on_task_id)` · CHECK `task_id <> depends_on_task_id`

### `comments`
`id, task_id FK, user_id FK, parent_comment_id FK→comments, content TEXT, content_text TEXT, is_edited BOOLEAN, is_deleted BOOLEAN, created_at, updated_at` · INDEX `(task_id, created_at)`

### `comment_reactions`
`comment_id FK, user_id FK, emoji VARCHAR(8), created_at` — composite PK on all three

### `attachments`
`id, task_id FK, comment_id FK NULL, uploaded_by FK, file_name VARCHAR(255), file_url TEXT, storage_key TEXT, mime_type VARCHAR(100), size_bytes INTEGER, width/height INTEGER NULL, created_at`

### `activity_log`
`id, workspace_id FK, project_id FK, task_id FK NULL, user_id FK, action VARCHAR(50), field_name VARCHAR(50), old_value TEXT, new_value TEXT, metadata JSONB, created_at`
INDEX `(task_id, created_at DESC)` · INDEX `(workspace_id, created_at DESC)`

### `notifications`
`id, user_id FK, type VARCHAR(50), actor_id FK→users, title, body, link_url, entity_type, entity_id, is_read BOOLEAN, read_at, created_at`
INDEX `(user_id, is_read, created_at DESC)`

### `notification_preferences`
`user_id FK, type VARCHAR(50), in_app BOOLEAN, email BOOLEAN` — composite PK

### `saved_views`
`id, user_id FK, workspace_id FK, project_id FK NULL, name VARCHAR(60), filters JSONB, is_shared BOOLEAN, created_at`

### `refresh_tokens`
`id, user_id FK, token_hash VARCHAR(64), family_id UUID, device_label, ip_address INET, user_agent TEXT, expires_at, revoked_at, last_used_at, created_at` · INDEX `(user_id)` · INDEX `(token_hash)`

### `blocked_domains`
`id, domain VARCHAR(200) UNIQUE, reason ENUM(free_provider|disposable|abuse), added_by FK→users, created_at`

### `audit_log`
`id, workspace_id FK NULL, actor_id FK→users, action VARCHAR(60), target_type, target_id, ip_address INET, user_agent, metadata JSONB, created_at`

## 9.2 Required indexes

```sql
CREATE INDEX idx_tasks_project_status   ON tasks(project_id, status) WHERE is_archived = false;
CREATE INDEX idx_tasks_assignee_due     ON tasks(assignee_id, due_date) WHERE completed_at IS NULL;
CREATE INDEX idx_tasks_due_open         ON tasks(due_date) WHERE completed_at IS NULL AND is_archived = false;
CREATE INDEX idx_tasks_parent           ON tasks(parent_task_id) WHERE parent_task_id IS NOT NULL;
CREATE INDEX idx_tasks_search           ON tasks USING GIN(search_vector);
CREATE INDEX idx_tasks_position         ON tasks(project_id, status, position);
CREATE INDEX idx_comments_task          ON comments(task_id, created_at DESC) WHERE is_deleted = false;
CREATE INDEX idx_notifications_unread   ON notifications(user_id, created_at DESC) WHERE is_read = false;
CREATE INDEX idx_activity_task          ON activity_log(task_id, created_at DESC);
CREATE INDEX idx_members_user           ON workspace_members(user_id);
CREATE INDEX idx_users_domain           ON users(email_domain);
```

## 9.3 Cascade rules

| Deleted | Effect |
|---|---|
| User | Memberships removed; created tasks retained with `created_by` set to a tombstone user; assigned tasks unassigned; comments anonymised to "Deleted user" |
| Workspace | Cascades to projects, members, labels, invitations (soft, 30-day window) |
| Project | Cascades to tasks, project members (soft) |
| Task | Cascades to subtasks, comments, attachments, watchers, dependencies (soft) |
| Label | Removed from `task_labels`; tasks unaffected |
| Comment | Soft — renders as "Comment deleted"; replies preserved |

---

# 10. API Reference

**Base:** `/api/v1` · **Auth:** `Authorization: Bearer <accessToken>` · **Content type:** `application/json`

## 10.1 Response envelope

```json
// success
{ "success": true, "data": { }, "meta": { "page": 1, "limit": 50, "total": 214, "hasMore": true } }

// error
{ "success": false, "error": { "code": "TASK_NOT_FOUND", "message": "Task does not exist",
  "fields": { "email": "Please use your work email." } } }
```

## 10.2 Error codes

| Code | HTTP | Meaning |
|---|---|---|
| `VALIDATION_FAILED` | 400 | One or more fields invalid; see `fields` |
| `UNAUTHENTICATED` | 401 | Missing or expired access token |
| `TOKEN_EXPIRED` | 401 | Triggers a silent refresh on the client |
| `INSUFFICIENT_ROLE` | 403 | Authenticated but the role does not permit this |
| `EMAIL_NOT_VERIFIED` | 403 | Verification required first |
| `ACCOUNT_SUSPENDED` | 403 | |
| `NOT_FOUND` | 404 | Also returned for resources the user may not see |
| `ALREADY_EXISTS` | 409 | Duplicate email, slug, or membership |
| `CIRCULAR_DEPENDENCY` | 409 | Dependency would create a cycle |
| `PAYLOAD_TOO_LARGE` | 413 | File over 10 MB |
| `UNSUPPORTED_FILE_TYPE` | 415 | |
| `RATE_LIMITED` | 429 | Includes a `Retry-After` header |
| `INTERNAL_ERROR` | 500 | Includes an `errorId` for support |

## 10.3 Endpoints

### Authentication
```
POST   /auth/register              { name, email, password }
POST   /auth/login                 { email, password, rememberMe }
POST   /auth/logout
POST   /auth/logout-all
POST   /auth/refresh
POST   /auth/verify-email          { code }
POST   /auth/resend-code
POST   /auth/forgot-password       { email }
POST   /auth/reset-password        { token, password }
GET    /auth/google
GET    /auth/google/callback
GET    /auth/me
POST   /auth/check-email           { email }   → work-email pipeline result
```

### Users
```
GET    /users/me
PATCH  /users/me                   { name, jobTitle, timezone, locale, dateFormat, ... }
POST   /users/me/avatar            multipart
DELETE /users/me/avatar
PATCH  /users/me/password          { currentPassword, newPassword }
POST   /users/me/email             { newEmail, password }
GET    /users/me/sessions
DELETE /users/me/sessions/:id
POST   /users/me/2fa/enable
POST   /users/me/2fa/verify        { code }
DELETE /users/me/2fa
DELETE /users/me                   { password, confirmation }
```

### Workspaces
```
GET    /workspaces
POST   /workspaces                 { name, logoUrl, teamSize, useCase }
GET    /workspaces/:id
PATCH  /workspaces/:id
DELETE /workspaces/:id             { confirmName }
POST   /workspaces/:id/transfer    { newOwnerId }
GET    /workspaces/:id/stats
POST   /workspaces/:id/switch
GET    /workspaces/:id/domains
POST   /workspaces/:id/domains     { domain }
POST   /workspaces/:id/domains/:domainId/verify
PATCH  /workspaces/:id/discovery   { mode }
GET    /workspaces/:id/audit       ?actor=&action=&from=&to=&page=
```

### Members and invitations
```
GET    /workspaces/:id/members     ?role=&search=&sort=
POST   /workspaces/:id/invites     { invites: [{ email, role }] }
GET    /workspaces/:id/invites     ?status=
POST   /invites/:id/resend
DELETE /invites/:id
POST   /invites/accept             { token }
GET    /invites/preview/:token     → workspace name, inviter, role (unauthenticated)
PATCH  /workspaces/:id/members/:userId       { role }
DELETE /workspaces/:id/members/:userId       { reassignTo? }
POST   /workspaces/:id/leave
POST   /workspaces/:id/join-link/regenerate
GET    /workspaces/:id/join-requests
POST   /join-requests              { workspaceId }
PATCH  /join-requests/:id          { decision }
```

### Projects
```
GET    /workspaces/:id/projects    ?status=&search=&sort=&archived=
POST   /workspaces/:id/projects
GET    /projects/:id
PATCH  /projects/:id
DELETE /projects/:id               { confirmName }
POST   /projects/:id/duplicate     { includeTasks }
POST   /projects/:id/archive
POST   /projects/:id/restore
GET    /projects/:id/stats
GET    /projects/:id/burnup        ?from=&to=
GET    /projects/:id/members
POST   /projects/:id/members       { userIds }
DELETE /projects/:id/members/:userId
PATCH  /projects/:id/columns       { columns }
GET    /projects/:id/export        ?format=csv
GET    /projects/:id/files         ?type=&search=
```

### Tasks
```
GET    /projects/:id/tasks         ?status=&assignee=&priority=&label=&dueFrom=&dueTo=
                                   &search=&groupBy=&sort=&page=&limit=
POST   /projects/:id/tasks
POST   /projects/:id/tasks/quick   { text }        → parses inline tokens
GET    /tasks/:id
PATCH  /tasks/:id
DELETE /tasks/:id
PATCH  /tasks/:id/status           { status, position }
PATCH  /tasks/:id/position         { beforeId, afterId }
PATCH  /tasks/:id/assignee         { userId | null }
POST   /tasks/bulk                 { ids, changes }
POST   /tasks/:id/duplicate
POST   /tasks/:id/move             { projectId }
POST   /tasks/:id/archive
GET    /tasks/:id/subtasks
POST   /tasks/:id/subtasks         { title, assigneeId?, dueDate? }
GET    /tasks/:id/dependencies
POST   /tasks/:id/dependencies     { dependsOnTaskId }
DELETE /tasks/:id/dependencies/:depId
POST   /tasks/:id/watchers
DELETE /tasks/:id/watchers/:userId
GET    /tasks/:id/activity         ?page=
GET    /me/tasks                   ?filter=today|overdue|upcoming|unscheduled|completed
                                   &groupBy=&workspaceId=
```

### Comments and attachments
```
GET    /tasks/:id/comments         ?page=
POST   /tasks/:id/comments         { content, parentCommentId? }
PATCH  /comments/:id               { content }
DELETE /comments/:id
POST   /comments/:id/reactions     { emoji }
DELETE /comments/:id/reactions/:emoji
POST   /tasks/:id/attachments      multipart, max 10 MB
DELETE /attachments/:id
GET    /attachments/:id/download   → signed URL, 5-minute expiry
```

### Labels, search, notifications
```
GET    /workspaces/:id/labels
POST   /workspaces/:id/labels      { name, color }
PATCH  /labels/:id
DELETE /labels/:id
GET    /search                     ?q=&workspaceId=&types=task,project,user,comment&limit=
GET    /workspaces/:id/saved-views
POST   /workspaces/:id/saved-views { name, filters, projectId?, isShared }
DELETE /saved-views/:id
GET    /notifications              ?unread=&type=&page=
PATCH  /notifications/:id/read
PATCH  /notifications/read-all
DELETE /notifications/:id
GET    /notifications/preferences
PATCH  /notifications/preferences  { preferences[], digestMode, quietHours }
```

### Admin (Platform Admin only)
```
GET    /admin/stats
GET    /admin/organisations        ?search=&plan=&status=&page=
GET    /admin/organisations/:domain
PATCH  /admin/organisations/:domain/plan
POST   /admin/organisations/:domain/suspend      { reason }
GET    /admin/users                ?search=&status=&page=
GET    /admin/users/:id
POST   /admin/users/:id/verify
POST   /admin/users/:id/suspend    { reason }
POST   /admin/users/:id/reactivate
POST   /admin/users/:id/impersonate
GET    /admin/domains/blocked
POST   /admin/domains/blocked      { domain, reason }
DELETE /admin/domains/blocked/:id
GET    /admin/system/queues
POST   /admin/system/queues/:name/retry-failed
GET    /admin/announcements
POST   /admin/announcements
```

## 10.4 Rate limits

| Scope | Limit |
|---|---|
| Login | 5 / 15 min per IP+email |
| Registration | 3 / hour per IP |
| Verification code send | 5 / hour per user |
| Password reset request | 3 / hour per email |
| Search | 30 / min per user |
| General authenticated API | 120 / min per user |
| File upload | 20 / hour per user |
| Bulk operations | 10 / min per user |

## 10.5 Real-time events (Socket.IO)

**Rooms:** `workspace:{id}` · `project:{id}` · `task:{id}` · `user:{id}`

| Event | Payload | Room |
|---|---|---|
| `task:created` | task | project |
| `task:updated` | taskId, changes, actor | project, task |
| `task:moved` | taskId, fromStatus, toStatus, position | project |
| `task:deleted` | taskId | project |
| `comment:created` | comment | task |
| `comment:updated` / `comment:deleted` | comment / id | task |
| `notification:new` | notification | user |
| `notification:count` | unreadCount | user |
| `member:joined` / `member:left` | member / userId | workspace |
| `presence:update` | userIds viewing this task | task |
| `project:updated` | project | workspace |

Connections authenticate with the access token on handshake and re-authenticate on refresh. Room membership is permission-checked server-side on every join.

---

# 11. Technology Stack

## 11.1 Frontend

| Concern | Choice | Version | Reason |
|---|---|---|---|
| Framework | Next.js (App Router) | 14 | Server components for the marketing pages, file-based routing, image optimisation, and a first-class Vercel deploy |
| Language | TypeScript | 5.4 | This app has 20+ entity shapes; types are what keep refactors safe |
| Styling | Tailwind CSS | 3.4 | Design tokens map directly to a config; no runtime CSS-in-JS cost |
| Component primitives | shadcn/ui + Radix UI | latest | Accessible unstyled behaviour (focus traps, ARIA, keyboard) that we then style entirely ourselves |
| Server state | TanStack Query | 5 | Caching, background refetch, and the optimistic-update primitives the board depends on |
| Client state | Zustand | 4 | Modals, filters, sidebar state — 3 KB versus Redux's ceremony |
| Forms | React Hook Form + Zod | 7 / 3 | Uncontrolled inputs mean no re-render per keystroke; Zod schemas are shared with the backend |
| Drag and drop | dnd-kit | 6 | The only mainstream library with a real keyboard sensor. react-beautiful-dnd is unmaintained |
| Rich text | Tiptap | 2 | ProseMirror-based, extensible, produces clean HTML |
| Charts | Recharts | 2 | Declarative, themeable, sufficient for burn-up and bar charts |
| Dates | date-fns + date-fns-tz | 3 | Tree-shakeable; timezone-correct arithmetic |
| Icons | Lucide React | latest | Consistent 1.5px stroke, 1,400+ icons |
| Toasts | Sonner | 1 | Stacking, promise-aware, accessible |
| Tables | TanStack Table | 8 | Headless — sorting, grouping, and column visibility without imposed markup |
| Virtualisation | TanStack Virtual | 3 | Long task lists render only what is visible |
| Real-time | socket.io-client | 4 | |

## 11.2 Backend

| Concern | Choice | Reason |
|---|---|---|
| Runtime | Node.js 20 LTS | |
| Framework | Express 4 + TypeScript | Small, explicit, well-understood. *NestJS is the alternative if you want enforced structure and DI out of the box* |
| ORM | Prisma 5 | Type-safe queries generated from the schema, and migrations that are readable in review |
| Database | PostgreSQL 16 | |
| Cache and queue | Redis 7 + BullMQ 5 | Session cache, rate-limit counters, email and reminder job queues |
| Real-time | Socket.IO 4 with the Redis adapter | Multi-instance-safe |
| Auth | jsonwebtoken, bcrypt (cost 12), Passport (Google strategy) | |
| Validation | Zod 3 | The same schema objects the frontend imports |
| File storage | Cloudinary | Transformations, CDN, and signed URLs without running our own pipeline. *S3 + CloudFront is the alternative* |
| Email | Resend + React Email | Templates written as React components, previewable in Storybook |
| Scheduling | node-cron for triggers, BullMQ for execution | Cron only enqueues; workers do the work |
| Logging | Pino + pino-http | Structured JSON, correlation IDs per request |
| API docs | Swagger via zod-to-openapi | Generated from the same Zod schemas, so it cannot drift |
| Security headers | Helmet | |
| Rate limiting | rate-limiter-flexible on Redis | |

## 11.3 Infrastructure and tooling

| Concern | Choice |
|---|---|
| Monorepo | Turborepo + pnpm workspaces |
| Frontend hosting | Vercel |
| Backend hosting | Railway *(Render or Fly.io equally fine)* |
| Database | Neon *(or Supabase)* — serverless Postgres with branching |
| Redis | Upstash |
| CI/CD | GitHub Actions — lint, typecheck, test, build on every PR; deploy on merge to `main` |
| Containers | Docker Compose for local Postgres and Redis |
| Error tracking | Sentry (both frontend and backend) |
| Analytics | PostHog — self-hostable, no third-party data sharing |
| Uptime | Better Stack |
| Linting | ESLint + Prettier + Husky + lint-staged |
| Testing | Vitest, React Testing Library, Supertest, Playwright, axe-core |
| Component workshop | Storybook 8 |
| Design | Figma |

## 11.4 Simpler alternative stack

For a semester project or a solo build where the above is too much setup:

**React (Vite) + TypeScript + Tailwind → Express + TypeScript → MongoDB + Mongoose → JWT → Cloudinary → Vercel + Render + MongoDB Atlas.**

**The trade-off, stated honestly:** MongoDB is quicker to start with because there are no migrations. But `workspace_members`, `task_labels`, `task_watchers`, and `task_dependencies` are all pure many-to-many joins, and every board query touches at least three of them. In MongoDB you either denormalise (and then fight consistency on every update) or run `$lookup` aggregations that are slower and harder to read than the equivalent SQL. If the project will be maintained past its deadline, PostgreSQL is the better call.

---

# 12. Security Requirements

| Area | Requirement |
|---|---|
| Password storage | bcrypt, cost 12. Never logged, never returned by any endpoint |
| Password strength | ≥10 characters, checked against Have I Been Pwned via k-anonymity |
| Token storage | Access token in memory only. Refresh token in an `httpOnly` `secure` `sameSite=lax` cookie. **Never `localStorage`** |
| Token rotation | Every refresh issues a new token and revokes the old. Reuse of a revoked token revokes the whole family |
| Authorisation | `requirePermission` middleware on every mutating endpoint. The frontend gate is UX, not security |
| Resource scoping | Every query is scoped by workspace membership. A task ID alone never grants access |
| Enumeration | Inaccessible resources return 404, not 403. Login and password-reset responses are identical for existing and non-existing accounts, including response time |
| Input validation | Zod on every endpoint. Unknown keys stripped, not ignored |
| SQL injection | Prisma parameterises everything. Raw SQL requires review and uses `$queryRaw` tagged templates only |
| XSS | Rich text sanitised with DOMPurify on write **and** on render. A strict CSP with nonces, no `unsafe-inline` |
| CSRF | `sameSite=lax` cookies plus a double-submit token on cookie-authenticated routes |
| File upload | Magic-byte type verification (not extension), 10 MB cap, filename sanitised, served from a separate origin with `Content-Disposition: attachment` |
| Rate limiting | Per Section 10.4, enforced in Redis |
| Headers | Helmet: HSTS with preload, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, strict Referrer-Policy |
| CORS | Explicit origin allowlist. No wildcards in production |
| Secrets | Environment variables only, validated at boot with Zod. Nothing committed |
| Dependencies | Dependabot weekly, `pnpm audit` in CI, builds fail on high-severity findings |
| Audit trail | Every permission-relevant action written to `audit_log` with actor, IP, and user agent |
| Data at rest | Database encryption enabled by the provider; attachments encrypted at rest by Cloudinary |
| Data in transit | TLS 1.3 everywhere, HTTP redirected to HTTPS |
| PII | Deleted accounts anonymised within 30 days. Data export available on request |

---

# 13. Non-Functional Requirements

**Performance targets**

| Metric | Target |
|---|---|
| Largest Contentful Paint (landing) | < 1.8s on 4G |
| Time to Interactive (app shell) | < 2.5s |
| API read p95 | < 200ms |
| API write p95 | < 400ms |
| Board render, 200 tasks | < 300ms |
| Search results | < 500ms |
| Drag-drop visual response | < 16ms (one frame) |

**Techniques:** every list paginated at 50 with infinite scroll · TanStack Virtual on lists over 100 rows · React Query caching with a 30s stale time on task lists · database indexes from day one · `include` used deliberately to avoid N+1 · Redis caching on workspace stats and permission lookups · images served as AVIF/WebP with explicit dimensions · route-level code splitting.

**Reliability:** 99.5% uptime target · automated daily database backups with 30-day retention and a quarterly restore drill · soft deletes with a 30-day window on workspaces, projects, tasks and comments · background jobs idempotent and retried with exponential backoff, three attempts, then a dead-letter queue · React error boundaries per route section.

**Scalability:** stateless API servers behind a load balancer · Socket.IO with the Redis adapter for multi-instance broadcast · read replicas when read load justifies it · Cloudinary handles all file traffic, never the API servers.

**Browser support:** last 2 versions of Chrome, Firefox, Safari, and Edge. iOS Safari 16+. Android Chrome 110+. No IE.

---

# 14. Testing Plan

| Layer | Tool | Scope | Target |
|---|---|---|---|
| Unit | Vitest | Permission logic, date helpers, the work-email pipeline, position calculation, inline-token parsing | 85% on business logic |
| Component | RTL + Vitest | Task card, filter bar, all form fields, board column, comment thread | Every interactive component |
| Visual regression | Storybook + Chromatic | Every component in every state | No unreviewed diffs |
| API integration | Supertest | Every endpoint × every role, including the 403 and 404 paths | 100% of endpoints |
| Database | Vitest + a test container | Cascades, constraints, cycle detection | All cascade rules |
| E2E | Playwright | The eight critical journeys below | All passing before deploy |
| Accessibility | axe-core in CI + manual keyboard pass | Every route | Zero violations |
| Load | k6 | 100 concurrent users on the board endpoint | p95 under target |

**The eight critical journeys:**
1. Sign up with a work email → verify → create workspace → create project → create task
2. Sign up with a Gmail address → correct rejection message
3. Log in as each of the five roles → land on the correct route → confirm the visible controls match the matrix
4. Invite a member → accept the invite → confirm the assigned role
5. Create a task → assign it → drag it across three columns → complete it → undo
6. Comment with an @mention → confirm the notification reaches the mentioned user
7. Second user from the same domain signs up → sees the join screen → is approved → lands on My Tasks
8. Member attempts a manager-only action by direct URL → receives 403 and is redirected

**Rule:** every bug fix ships with a regression test reproducing the bug.

---

# 15. Folder Structure

```
taskflow/
├── apps/
│   ├── web/                              # Next.js
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── (marketing)/          # landing, pricing, about
│   │   │   │   ├── (auth)/               # login, register, verify, reset
│   │   │   │   ├── (onboarding)/         # workspace, invite, project
│   │   │   │   ├── w/[slug]/             # workspace shell (Shell A)
│   │   │   │   │   ├── home/
│   │   │   │   │   ├── my-tasks/
│   │   │   │   │   ├── projects/[id]/    # overview, board, list, calendar, files, settings
│   │   │   │   │   ├── team/
│   │   │   │   │   ├── reports/
│   │   │   │   │   └── settings/
│   │   │   │   ├── admin/                # admin shell (Shell B)
│   │   │   │   └── settings/             # account-level
│   │   │   ├── components/
│   │   │   │   ├── ui/                   # button, input, select, modal, toast…
│   │   │   │   ├── layout/               # Sidebar, TopBar, WorkspaceSwitcher, AdminBar
│   │   │   │   ├── tasks/                # TaskCard, TaskDrawer, QuickAdd, SubtaskList
│   │   │   │   ├── board/                # Board, Column, DragOverlay
│   │   │   │   ├── projects/             # ProjectCard, CreateProjectModal
│   │   │   │   ├── members/              # MemberRow, InviteModal, RoleSelect
│   │   │   │   ├── comments/             # CommentThread, Composer, ActivityFeed
│   │   │   │   └── charts/
│   │   │   ├── hooks/                    # useTasks, useAuth, usePermission, useSocket
│   │   │   ├── lib/                      # apiClient, permissions, dateFormat, constants
│   │   │   ├── store/                    # Zustand slices
│   │   │   ├── types/
│   │   │   └── styles/
│   │   │       ├── tokens.css            # every design token lives here
│   │   │       └── globals.css
│   │   └── public/
│   │
│   └── api/                              # Express
│       ├── src/
│       │   ├── modules/                  # controller · service · routes · schema per module
│       │   │   ├── auth/  users/  workspaces/  members/  invitations/
│       │   │   ├── projects/  tasks/  comments/  attachments/
│       │   │   ├── notifications/  search/  admin/
│       │   ├── middleware/               # authenticate, requirePermission, errorHandler,
│       │   │                             # rateLimit, requestLogger, validate
│       │   ├── jobs/                     # reminders, overdue, digest, cleanup, renormalise
│       │   ├── realtime/                 # socket server, room auth, event emitters
│       │   ├── lib/                      # mailer, storage, redis, workEmail, permissions
│       │   ├── config/                   # env validation
│       │   └── server.ts
│       ├── prisma/
│       │   ├── schema.prisma
│       │   ├── migrations/
│       │   └── seed.ts
│       └── tests/
│
├── packages/
│   ├── shared/                           # Zod schemas + TS types imported by both apps
│   ├── email-templates/                  # React Email
│   └── config/                           # eslint, tsconfig, tailwind preset
│
├── docker-compose.yml
├── turbo.json
├── .github/workflows/ci.yml
└── README.md
```

**Module convention (backend):** every module folder holds exactly four files — `*.routes.ts` (paths and middleware), `*.controller.ts` (request/response only), `*.service.ts` (all business logic, no Express types), `*.schema.ts` (Zod). Services never import Express; controllers never contain logic. This makes services directly unit-testable.

---

# 16. Development Roadmap

### Phase 1 — Foundation (Weeks 1–2)
Monorepo, Docker Compose, Prisma schema and first migration, design tokens in Tailwind, the full `ui/` component library built in Storybook, auth backend, and the login / register / verify / reset screens end to end.

**Done when:** a user can register with a work email, be rejected with a Gmail address, verify, and log in.

### Phase 2 — Workspace and projects (Weeks 3–4)
Workspace creation and switching, the invitation system, role assignment, the permission middleware, workspace home, the project list, project creation, and the project header shell.

**Done when:** all five roles land on the correct route and see exactly the controls the matrix specifies.

### Phase 3 — Tasks and board (Weeks 5–7)
Task CRUD, the board with dnd-kit including keyboard dragging, the list view with bulk actions, quick add with inline tokens, the task drawer with all properties, and subtasks.

**Done when:** a task can be created, assigned, dragged across every column, and completed with undo.

### Phase 4 — Collaboration (Weeks 8–9)
Comments with mentions and reactions, attachments, the activity log, watchers, the notification system with all triggers, email templates, deadline and overdue cron jobs, and Socket.IO live updates.

**Done when:** two browsers open on the same board see each other's changes within a second.

### Phase 5 — Depth (Weeks 10–11)
Dashboards and charts, the calendar view, global search and the command palette, saved views, the team directory, the full settings area, and the admin console.

### Phase 6 — Polish and ship (Weeks 12–13)
Dark theme, every empty and error state, the full responsive pass, the accessibility audit, performance tuning, the Playwright suite, Sentry, CI/CD, production deploy, seed demo data, and user documentation.

---

# 17. Future Enhancements

| Feature | Phase | Note |
|---|---|---|
| Timeline / Gantt view with dependency lines | 7 | The data model already supports it |
| Time tracking with a start/stop timer and timesheets | 7 | `estimate_minutes` already exists |
| Custom fields per project | 8 | Requires a JSONB field-definition table |
| Project templates library | 8 | |
| Recurring tasks | 8 | Daily, weekly, monthly, custom RRULE |
| Slack and Microsoft Teams integration | 9 | Notification mirroring, slash commands |
| Google and Outlook calendar sync | 9 | Two-way, via CalDAV or the vendor APIs |
| Public API with personal access tokens | 9 | |
| Guest client links (read-only, no account) | 9 | |
| Automation rules | 10 | "When status → Done, notify the manager" |
| AI subtask breakdown and effort estimates | 10 | |
| AI thread summarisation | 10 | |
| Native mobile apps | 11 | React Native, sharing the shared package |
| Urdu language and full RTL layout | 11 | Requires a logical-property CSS pass |
| SSO / SAML for enterprise | 12 | |

---

# 18. Risk Register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Work-email restriction blocks legitimate small teams | High | Medium | Clear error copy, a "contact us" path, the `warn` enforcement mode, and invited users exempt from the check |
| Drag-and-drop position conflicts between simultaneous users | Medium | Medium | Fractional positions, server as source of truth, Socket.IO reconciliation, and a nightly renormalisation job |
| Notification volume drives users to disable everything | High | High | Batching within 5 minutes, digest modes, quiet hours, and self-suppression by default |
| Scope creep past v1 | High | High | The feature list is frozen; every new idea goes to Section 17 with a phase number |
| Board slows past 500 tasks | Medium | High | Virtualisation, column-level pagination, and a "load more" per column beyond 100 |
| Permission bug exposes cross-workspace data | Low | Critical | Integration tests covering every endpoint × every role, and 404-not-403 on inaccessible resources |
| Attachment storage cost | Medium | Low | 10 MB cap, per-workspace quota, and a nightly orphan-cleanup job |
| Email deliverability to corporate domains | Medium | High | SPF, DKIM and DMARC configured, a warmed sending domain, and bounce monitoring |
| Timezone bugs in reminders | Medium | Medium | All timestamps stored as `TIMESTAMPTZ`; every scheduled job iterates users by their own timezone; explicit test cases across DST boundaries |

---

# 19. Glossary

| Term | Meaning |
|---|---|
| **Organisation** | Everyone sharing one verified email domain |
| **Workspace** | The container for a team's projects, members, and labels. The root of everything |
| **Workspace switcher** | The control at the top of the sidebar for moving between workspaces and creating new ones |
| **Project** | A body of related work with its own members, colour, board columns, and deadline |
| **Task** | A single unit of work with a status, priority, assignee, and due date |
| **Subtask** | A task nested one level under a parent. Cannot itself have children |
| **Assignee** | The one person responsible for a task |
| **Watcher** | Someone notified about a task without owning it |
| **Backlog** | Work captured but not yet scheduled |
| **Blocked** | A task that cannot start until a dependency completes |
| **WIP limit** | A cap on how many tasks may sit in one board column at once |
| **Board column** | A vertical lane on the kanban board, mapped to a status |
| **Saved view** | A named filter combination, personal or shared with the project |
| **Quick add** | The inline composer that creates a task from one line of text with inline tokens |
| **Inline tokens** | `@user` `!priority` `#label` `/date` typed inside a task title to set properties |
| **Fractional position** | Ordering by decimal midpoint, so inserting between two cards updates one row instead of the whole column |
| **Work email** | A company-domain address; consumer and disposable providers are rejected at signup |
| **Domain discovery** | The setting deciding whether a new signup from a known domain is offered the existing workspace |
| **Shell A / Shell B** | The customer layout (sidebar + top bar) and the platform admin layout (dark bar, no sidebar) |
| **Soft delete** | Marked deleted and hidden, but recoverable for 30 days |
| **Optimistic update** | Applying a change in the UI before the server confirms it, with a defined rollback path |

---

*TaskFlow — Complete Product & Design Documentation, Version 2.0*
