'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileStack,
  Palette,
  Users,
  ChevronDown,
  CheckSquare,
  Plus,
  Menu,
  Layers,
  Bell,
  Bot,
  FileText,
  Briefcase,
  Search,
  Building2,
  FormInput,
  MoreHorizontal,
  Grid2X2,
  Inbox,
  Loader2,
} from 'lucide-react';

import { cn, getInitials } from '@/lib/utils';
import { useProjects } from '@/hooks/use-projects';
import type { Project } from '@/lib/queries/projects';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  exact?: boolean;
}

type SidebarWorkspace = {
  id: string;
  name: string;
  href: string;
  initial: string;
  projectCount: number;
};

type SidebarProject = {
  id: string;
  name: string;
  href: string;
  workspaceId?: string | null;
  workspaceName?: string | null;
  icon?: React.ComponentType<{ className?: string }>;
  count?: number;
  createdAt?: string;
  updatedAt?: string | null;
};

const NAV_ITEMS: NavItem[] = [
  { label: 'Overview', href: '/dashboard', icon: LayoutDashboard, exact: true },
  { label: 'Requests', href: '/dashboard/requests', icon: FileStack },
  { label: 'Tasks', href: '/dashboard/tasks', icon: CheckSquare },
  { label: 'Profiles', href: '/dashboard/profiles', icon: Palette },
  { label: 'Team', href: '/dashboard/team', icon: Users },
  { label: 'Subjects', href: '/dashboard/subjects', icon: Building2 },
  { label: 'Forms', href: '/dashboard/forms', icon: FormInput },
  { label: 'AI Agents', href: '/dashboard/agents', icon: Bot },
  { label: 'Docs', href: '/dashboard/docs', icon: FileText },
];

function isRouteActive(pathname: string, href: string, exact?: boolean) {
  return exact
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`);
}

function getProjectHref(project: Project) {
  return `/dashboard/projects/${project.id}`;
}

function getWorkspaceHref(workspaceId: string) {
  return `/dashboard/workspaces/${workspaceId}`;
}

function getSoftTileClasses(index: number) {
  const colors = [
    'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300',
    'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300',
    'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300',
    'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300',
    'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300',
    'bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300',
    'bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300',
    'bg-cyan-100 text-cyan-700 dark:bg-cyan-500/20 dark:text-cyan-300',
  ];

  return colors[index % colors.length];
}

function projectToSidebarProject(project: Project): SidebarProject {
  return {
    id: project.id,
    name: project.name,
    href: getProjectHref(project),
    workspaceId: project.workspace_id,
    workspaceName: project.workspaces?.name ?? null,
    icon: Briefcase,
    createdAt: project.created_at,
    updatedAt: project.updated_at,
  };
}

function SidebarSectionHeader({
  label,
  actionLabel,
  actionHref,
  collapsible = false,
  collapsed = false,
  onToggle,
}: {
  label: string;
  actionLabel?: string;
  actionHref?: string;
  collapsible?: boolean;
  collapsed?: boolean;
  onToggle?: () => void;
}) {
  return (
    <div className="group/header flex items-center justify-between px-5 pb-1 pt-4">
      <button
        type="button"
        onClick={collapsible ? onToggle : undefined}
        className={cn(
          'flex min-w-0 items-center gap-1 text-[11px] font-semibold text-muted-foreground/75',
          collapsible && 'hover:text-foreground'
        )}
      >
        <span className="truncate">{label}</span>

        {collapsible ? (
          <ChevronDown
            className={cn(
              'h-3.5 w-3.5 transition-transform',
              collapsed && '-rotate-90'
            )}
          />
        ) : null}
      </button>

      {actionHref ? (
        <Link
          href={actionHref}
          aria-label={actionLabel}
          title={actionLabel}
          className="flex h-5 w-5 items-center justify-center rounded-md text-muted-foreground opacity-0 transition hover:bg-accent hover:text-foreground group-hover/header:opacity-100"
        >
          <Plus className="h-3.5 w-3.5" />
        </Link>
      ) : null}
    </div>
  );
}

function StaticNavItem({
  item,
  pathname,
  onClose,
}: {
  item: NavItem;
  pathname: string;
  onClose?: () => void;
}) {
  const Icon = item.icon;
  const isActive = isRouteActive(pathname, item.href, item.exact);

  return (
    <Link
      href={item.href}
      onClick={onClose}
      className={cn(
        'group flex items-center gap-2.5 rounded-lg px-2.5 py-[7px] text-[13px] font-medium transition-all duration-150',
        isActive
          ? 'bg-primary/[0.12] text-primary'
          : 'text-muted-foreground hover:bg-white/[0.05] hover:text-foreground'
      )}
    >
      <Icon
        className={cn(
          'h-[15px] w-[15px] flex-shrink-0 transition-colors',
          isActive
            ? 'text-primary'
            : 'text-muted-foreground/70 group-hover:text-foreground'
        )}
      />

      <span className="min-w-0 flex-1 truncate">{item.label}</span>

      {item.badge ? (
        <span className="ml-auto flex h-4 min-w-[16px] items-center justify-center rounded-full bg-primary/10 px-1 text-[10px] font-semibold text-primary">
          {item.badge}
        </span>
      ) : null}
    </Link>
  );
}

function WorkspaceRow({
  workspace,
  pathname,
  onClose,
  index,
}: {
  workspace: SidebarWorkspace;
  pathname: string;
  onClose?: () => void;
  index: number;
}) {
  const isActive = isRouteActive(pathname, workspace.href);

  return (
    <div className="group/workspace flex items-center gap-1">
      <Link
        href={workspace.href}
        onClick={onClose}
        className={cn(
          'flex min-w-0 flex-1 items-center gap-2.5 rounded-xl px-2.5 py-2 text-[13px] font-medium transition',
          isActive
            ? 'bg-sky-100 text-sky-800 dark:bg-sky-500/15 dark:text-sky-300'
            : 'text-foreground/85 hover:bg-accent/70 hover:text-foreground'
        )}
      >
        <div
          className={cn(
            'flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-[11px] font-bold',
            getSoftTileClasses(index)
          )}
        >
          {workspace.initial}
        </div>

        <span className="min-w-0 flex-1 truncate">{workspace.name}</span>

        {workspace.projectCount > 0 ? (
          <span
            className={cn(
              'text-xs font-semibold',
              isActive
                ? 'text-sky-700 dark:text-sky-300'
                : 'text-muted-foreground'
            )}
          >
            {workspace.projectCount}
          </span>
        ) : null}
      </Link>

      <button
        type="button"
        title="Workspace options"
        className="hidden h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-accent hover:text-foreground group-hover/workspace:flex"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>

      <Link
        href={`/dashboard/projects/new?workspace=${workspace.id}`}
        onClick={onClose}
        title="New project"
        className="mr-1 hidden h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-accent hover:text-foreground group-hover/workspace:flex"
      >
        <Plus className="h-4 w-4" />
      </Link>
    </div>
  );
}

function ProjectRow({
  project,
  pathname,
  onClose,
  index,
}: {
  project: SidebarProject;
  pathname: string;
  onClose?: () => void;
  index: number;
}) {
  const Icon = project.icon ?? Briefcase;
  const isActive = isRouteActive(pathname, project.href);
  const initial = getInitials(project.name).slice(0, 1);

  return (
    <div className="group/project flex items-center gap-1">
      <Link
        href={project.href}
        onClick={onClose}
        className={cn(
          'flex min-w-0 flex-1 items-center gap-2.5 rounded-xl px-2.5 py-1.5 text-[12px] font-medium transition',
          isActive
            ? 'bg-sky-100 text-sky-800 dark:bg-sky-500/15 dark:text-sky-300'
            : 'text-foreground/85 hover:bg-accent/70 hover:text-foreground'
        )}
      >
        <div
          className={cn(
            'flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-[11px] font-bold',
            getSoftTileClasses(index + 3)
          )}
        >
          {initial || <Icon className="h-3.5 w-3.5" />}
        </div>

        <div className="min-w-0 flex-1">
        <p className="truncate text-[12px] leading-tight">{project.name}</p>

          {project.workspaceName ? (
            <p className="truncate text-[10px] font-normal leading-tight text-muted-foreground">
              {project.workspaceName}
            </p>
          ) : null}
        </div>

        {project.count ? (
          <span
            className={cn(
              'text-xs font-semibold',
              isActive
                ? 'text-sky-700 dark:text-sky-300'
                : 'text-muted-foreground'
            )}
          >
            {project.count}
          </span>
        ) : null}
      </Link>

      <button
        type="button"
        title="Project options"
        className="mr-1 hidden h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-accent hover:text-foreground group-hover/project:flex"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>
    </div>
  );
}

function EmptySectionState({ label }: { label: string }) {
  return (
    <div className="mx-3 rounded-lg border border-dashed border-border px-3 py-3 text-center text-[11px] text-muted-foreground">
      {label}
    </div>
  );
}

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();

  const [query, setQuery] = useState('');
  const [workspacesOpen, setWorkspacesOpen] = useState(true);
  const [projectsOpen, setProjectsOpen] = useState(true);

  const { projects, loading } = useProjects();

  const sidebarProjects = useMemo<SidebarProject[]>(() => {
    return projects
      .slice()
      .sort((a, b) => {
        const aDate = a.updated_at ?? a.created_at;
        const bDate = b.updated_at ?? b.created_at;

        return new Date(bDate).getTime() - new Date(aDate).getTime();
      })
      .map(projectToSidebarProject);
  }, [projects]);

  const workspaceList = useMemo<SidebarWorkspace[]>(() => {
    const workspaceMap = new Map<
      string,
      {
        id: string;
        name: string;
        projectCount: number;
      }
    >();

    projects.forEach((project) => {
      const workspaceId = project.workspace_id;
      const workspaceName = project.workspaces?.name;

      if (!workspaceId || !workspaceName) return;

      const existing = workspaceMap.get(workspaceId);

      if (existing) {
        existing.projectCount += 1;
        return;
      }

      workspaceMap.set(workspaceId, {
        id: workspaceId,
        name: workspaceName,
        projectCount: 1,
      });
    });

    return Array.from(workspaceMap.values())
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((workspace) => ({
        id: workspace.id,
        name: workspace.name,
        href: getWorkspaceHref(workspace.id),
        initial: getInitials(workspace.name).slice(0, 1),
        projectCount: workspace.projectCount,
      }));
  }, [projects]);

  const filteredWorkspaces = useMemo(() => {
    const value = query.trim().toLowerCase();

    if (!value) return workspaceList;

    return workspaceList.filter((workspace) =>
      workspace.name.toLowerCase().includes(value)
    );
  }, [query, workspaceList]);

  const filteredProjects = useMemo(() => {
    const value = query.trim().toLowerCase();

    if (!value) return sidebarProjects;

    return sidebarProjects.filter((project) => {
      return (
        project.name.toLowerCase().includes(value) ||
        project.workspaceName?.toLowerCase().includes(value)
      );
    });
  }, [query, sidebarProjects]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto py-3">
        {/* Main menu */}
        <div className="px-3">
          <div className="mb-2 px-2">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
              Menu
            </p>
          </div>

          <nav className="space-y-0.5">
            {NAV_ITEMS.map((item) => (
              <StaticNavItem
                key={item.href}
                item={item}
                pathname={pathname}
                onClose={onClose}
              />
            ))}
          </nav>
        </div>

        {/* Search */}
        <div className="px-3 pt-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/70" />

            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search workspaces or projects..."
              className="h-8 w-full rounded-lg border border-border bg-card pl-8 pr-2 text-xs text-foreground outline-none transition-shadow placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* Workspaces */}
        <SidebarSectionHeader
          label="Workspaces"
          actionLabel="Create workspace"
          actionHref="/dashboard/workspaces/new"
          collapsible
          collapsed={!workspacesOpen}
          onToggle={() => setWorkspacesOpen((value) => !value)}
        />

        {workspacesOpen ? (
          <div className="space-y-1 px-3">
            <Link
              href="/dashboard/workspaces"
              onClick={onClose}
              className={cn(
                'flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-[13px] font-medium transition',
                pathname === '/dashboard/workspaces'
                  ? 'bg-sky-100 text-sky-800 dark:bg-sky-500/15 dark:text-sky-300'
                  : 'text-foreground/85 hover:bg-accent/70 hover:text-foreground'
              )}
            >
              <Grid2X2 className="h-4 w-4" />
              <span className="flex-1">Everything</span>

              {workspaceList.length > 0 ? (
                <span className="text-xs font-semibold text-muted-foreground">
                  {workspaceList.length}
                </span>
              ) : null}
            </Link>

            {loading ? (
              <div className="flex items-center gap-2 px-2.5 py-2 text-xs text-muted-foreground">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Loading workspaces...
              </div>
            ) : filteredWorkspaces.length > 0 ? (
              filteredWorkspaces.map((workspace, index) => (
                <WorkspaceRow
                  key={workspace.id}
                  workspace={workspace}
                  pathname={pathname}
                  onClose={onClose}
                  index={index}
                />
              ))
            ) : (
              <EmptySectionState label="No workspaces found." />
            )}

            <Link
              href="/dashboard/workspaces"
              onClick={onClose}
              className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-[13px] font-medium text-foreground/85 transition hover:bg-accent/70 hover:text-foreground"
            >
              <Grid2X2 className="h-4 w-4 text-muted-foreground" />
              View all Workspaces
            </Link>

            <Link
              href="/dashboard/workspaces/new"
              onClick={onClose}
              className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-[13px] font-medium text-foreground/85 transition hover:bg-accent/70 hover:text-foreground"
            >
              <Plus className="h-4 w-4 text-muted-foreground" />
              Create Workspace
            </Link>
          </div>
        ) : null}

        {/* Projects */}
        <SidebarSectionHeader
          label="Projects"
          actionLabel="Create project"
          actionHref="/dashboard/projects/new"
          collapsible
          collapsed={!projectsOpen}
          onToggle={() => setProjectsOpen((value) => !value)}
        />

        {projectsOpen ? (
          <div className="space-y-1 px-3">
            <Link
              href="/dashboard/projects"
              onClick={onClose}
              className={cn(
                'flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-[13px] font-medium transition',
                pathname === '/dashboard/projects'
                  ? 'bg-sky-100 text-sky-800 dark:bg-sky-500/15 dark:text-sky-300'
                  : 'text-foreground/85 hover:bg-accent/70 hover:text-foreground'
              )}
            >
              <Briefcase className="h-4 w-4" />
              <span className="flex-1">All Projects</span>

              {sidebarProjects.length > 0 ? (
                <span className="text-xs font-semibold text-muted-foreground">
                  {sidebarProjects.length}
                </span>
              ) : null}
            </Link>

            {loading ? (
              <div className="flex items-center gap-2 px-2.5 py-2 text-xs text-muted-foreground">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Loading projects...
              </div>
            ) : filteredProjects.length > 0 ? (
              filteredProjects.map((project, index) => (
                <ProjectRow
                  key={project.id}
                  project={project}
                  pathname={pathname}
                  onClose={onClose}
                  index={index}
                />
              ))
            ) : (
              <EmptySectionState label="No projects found." />
            )}

            <Link
              href="/dashboard/projects"
              onClick={onClose}
              className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-[13px] font-medium text-foreground/85 transition hover:bg-accent/70 hover:text-foreground"
            >
              <Briefcase className="h-4 w-4 text-muted-foreground" />
              View all Projects
            </Link>

            <Link
              href="/dashboard/projects/new"
              onClick={onClose}
              className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-[13px] font-medium text-foreground/85 transition hover:bg-accent/70 hover:text-foreground"
            >
              <Plus className="h-4 w-4 text-muted-foreground" />
              Create Project
            </Link>
          </div>
        ) : null}
      </div>

      {/* Bottom utility */}
      <div className="border-t border-border/60 px-3 py-2">
        <Link
          href="/dashboard/team/invite"
          onClick={onClose}
          className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-[13px] font-medium text-foreground/85 transition hover:bg-accent/70 hover:text-foreground"
        >
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="flex-1">Invite</span>
          <Inbox className="h-4 w-4 text-muted-foreground/60" />
        </Link>

        <button className="mt-1 flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-[13px] font-medium text-foreground/85 transition-all hover:bg-accent/70 hover:text-foreground">
          <Bell className="h-4 w-4 text-muted-foreground" />
          <span>Notifications</span>
          <span className="ml-auto flex h-4 min-w-[16px] items-center justify-center rounded-full bg-blue-500/20 px-1 text-[10px] font-semibold text-blue-400">
            3
          </span>
        </button>
      </div>
    </div>
  );
}

export function DashboardSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false);
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-40 rounded-lg border border-border bg-card p-2 text-muted-foreground shadow-sm transition-colors hover:bg-accent hover:text-foreground lg:hidden"
        aria-label="Open navigation"
      >
        <Menu className="h-4 w-4" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen ? (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      ) : null}

      {/* Mobile drawer */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-[280px] border-r border-border/60 bg-[hsl(var(--sidebar))] transition-transform duration-300 ease-in-out lg:hidden',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <SidebarContent onClose={() => setMobileOpen(false)} />
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden w-[280px] shrink-0 flex-col border-r border-border/60 bg-[hsl(var(--sidebar))] lg:flex">
        <SidebarContent />
      </aside>
    </>
  );
}