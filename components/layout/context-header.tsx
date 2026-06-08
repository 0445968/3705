'use client';

import type { ComponentType } from 'react';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Activity,
  ArrowDownUp,
  BarChart3,
  Bell,
  Bot,
  Calendar,
  CheckSquare,
  CreditCard,
  FileStack,
  FileText,
  Filter,
  Gauge,
  GitBranch,
  Globe,
  Grid2X2,
  Inbox,
  Kanban,
  LayoutGrid,
  List,
  Lock,
  MessageSquare,
  MoreHorizontal,
  Palette,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  UserPlus,
  Users,
  Wand2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

type DashboardSection =
  | 'requests'
  | 'tasks'
  | 'docs'
  | 'brands'
  | 'workspaces'
  | 'team'
  | 'chat'
  | 'agents'
  | 'settings';

interface ContextView {
  type: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
}

interface ContextMenuItem {
  label: string;
  href?: string;
}

interface ContextConfig {
  sectionLabel: string;
  views: ContextView[];
  defaultView: string;
  searchPlaceholder: string;
  filterLabel: string;
  sortLabel: string;
  primaryAction: {
    label: string;
    href: string;
    icon: ComponentType<{ className?: string }>;
  };
  menuItems: ContextMenuItem[];
}

const SECTION_CONFIG: Record<DashboardSection, ContextConfig> = {
  requests: {
    sectionLabel: 'Requests',
    views: [
      { type: 'queue', label: 'Queue', icon: List },
      { type: 'board', label: 'Board', icon: Kanban },
      { type: 'calendar', label: 'Calendar', icon: Calendar },
      { type: 'analytics', label: 'SLA', icon: Gauge },
    ],
    defaultView: 'queue',
    searchPlaceholder: 'Search requests, clients, or assignees...',
    filterLabel: 'Status',
    sortLabel: 'Priority',
    primaryAction: { label: 'New Request', href: '/dashboard/requests', icon: Plus },
    menuItems: [
      { label: 'Export request queue' },
      { label: 'Customize request fields' },
      { label: 'Manage workflow steps' },
    ],
  },
  tasks: {
    sectionLabel: 'Tasks',
    views: [
      { type: 'list', label: 'List', icon: CheckSquare },
      { type: 'board', label: 'Board', icon: Kanban },
      { type: 'calendar', label: 'Calendar', icon: Calendar },
      { type: 'workload', label: 'Workload', icon: BarChart3 },
    ],
    defaultView: 'list',
    searchPlaceholder: 'Search tasks, owners, or projects...',
    filterLabel: 'Assignee',
    sortLabel: 'Due date',
    primaryAction: { label: 'New Task', href: '/dashboard/tasks/new', icon: Plus },
    menuItems: [
      { label: 'Export task report' },
      { label: 'Show blocked tasks' },
      { label: 'Manage task statuses' },
    ],
  },
  docs: {
    sectionLabel: 'Docs',
    views: [
      { type: 'library', label: 'Library', icon: FileText },
      { type: 'templates', label: 'Templates', icon: Sparkles },
      { type: 'shared', label: 'Shared', icon: Globe },
      { type: 'comments', label: 'Comments', icon: MessageSquare },
    ],
    defaultView: 'library',
    searchPlaceholder: 'Search docs, templates, owners, or workspaces...',
    filterLabel: 'Type',
    sortLabel: 'Updated',
    primaryAction: { label: 'New Doc', href: '/dashboard/docs/editor/new', icon: Plus },
    menuItems: [
      { label: 'Import markdown' },
      { label: 'Export knowledge pack' },
      { label: 'Review document permissions' },
    ],
  },
  'brands': {
    sectionLabel: 'Brand',
    views: [
      { type: 'profiles', label: 'Profiles', icon: Palette },
      { type: 'assets', label: 'Assets', icon: FileStack },
      { type: 'versions', label: 'Versions', icon: GitBranch },
      { type: 'rules', label: 'Rules', icon: ShieldCheck },
    ],
    defaultView: 'profiles',
    searchPlaceholder: 'Search brand profiles, assets, colors, or fonts...',
    filterLabel: 'Brand',
    sortLabel: 'Version',
    primaryAction: { label: 'New Profile', href: '/dashboard/brands/new', icon: Plus },
    menuItems: [
      { label: 'Upload brand assets' },
      { label: 'Compare brand versions' },
      { label: 'Export brand guide' },
    ],
  },
  workspaces: {
    sectionLabel: 'Workspaces',
    views: [
      { type: 'grid', label: 'Grid', icon: LayoutGrid },
      { type: 'clients', label: 'Clients', icon: Users },
      { type: 'capacity', label: 'Capacity', icon: Gauge },
      { type: 'activity', label: 'Activity', icon: Activity },
    ],
    defaultView: 'grid',
    searchPlaceholder: 'Search workspaces, clients, or teams...',
    filterLabel: 'Client',
    sortLabel: 'Activity',
    primaryAction: { label: 'New Workspace', href: '/dashboard/workspaces/new', icon: Plus },
    menuItems: [
      { label: 'Import workspace' },
      { label: 'Manage workspace roles' },
      { label: 'Export workspace summary' },
    ],
  },
  team: {
    sectionLabel: 'Team',
    views: [
      { type: 'members', label: 'Members', icon: Users },
      { type: 'roles', label: 'Roles', icon: ShieldCheck },
      { type: 'capacity', label: 'Capacity', icon: Gauge },
      { type: 'activity', label: 'Activity', icon: Activity },
    ],
    defaultView: 'members',
    searchPlaceholder: 'Search members, roles, or permissions...',
    filterLabel: 'Role',
    sortLabel: 'Name',
    primaryAction: { label: 'Invite Member', href: '/dashboard/team', icon: UserPlus },
    menuItems: [
      { label: 'Review pending invites' },
      { label: 'Manage role permissions' },
      { label: 'Export utilization report' },
    ],
  },
  chat: {
    sectionLabel: 'Chat',
    views: [
      { type: 'channels', label: 'Channels', icon: MessageSquare },
      { type: 'inbox', label: 'Inbox', icon: Inbox },
      { type: 'mentions', label: 'Mentions', icon: Bell },
      { type: 'files', label: 'Files', icon: FileStack },
    ],
    defaultView: 'channels',
    searchPlaceholder: 'Search messages, channels, threads, or files...',
    filterLabel: 'Channel',
    sortLabel: 'Recent',
    primaryAction: { label: 'New Channel', href: '/dashboard/chat', icon: Plus },
    menuItems: [
      { label: 'Mark all as read' },
      { label: 'Manage notification rules' },
      { label: 'Export conversation log' },
    ],
  },
  agents: {
    sectionLabel: 'AI Agents',
    views: [
      { type: 'agents', label: 'Agents', icon: Bot },
      { type: 'runs', label: 'Runs', icon: Activity },
      { type: 'prompts', label: 'Prompts', icon: Wand2 },
      { type: 'usage', label: 'Usage', icon: BarChart3 },
    ],
    defaultView: 'agents',
    searchPlaceholder: 'Search agents, prompts, tools, or recent runs...',
    filterLabel: 'Capability',
    sortLabel: 'Usage',
    primaryAction: { label: 'New Agent', href: '/dashboard/agents', icon: Plus },
    menuItems: [
      { label: 'Review AI usage limits' },
      { label: 'Manage prompt library' },
      { label: 'Export agent run log' },
    ],
  },
  settings: {
    sectionLabel: 'Settings',
    views: [
      { type: 'general', label: 'General', icon: Settings },
      { type: 'billing', label: 'Billing', icon: CreditCard },
      { type: 'security', label: 'Security', icon: Lock },
      { type: 'integrations', label: 'Integrations', icon: Grid2X2 },
    ],
    defaultView: 'general',
    searchPlaceholder: 'Search settings, billing, security, or integrations...',
    filterLabel: 'Area',
    sortLabel: 'Updated',
    primaryAction: { label: 'Save Changes', href: '/dashboard/settings', icon: ShieldCheck },
    menuItems: [
      { label: 'Open audit log' },
      { label: 'Manage API keys' },
      { label: 'Download billing records' },
    ],
  },
};

const KNOWN_SECTIONS = Object.keys(SECTION_CONFIG) as DashboardSection[];

function getDashboardSection(pathname: string): DashboardSection | null {
  const segments = pathname.split('/').filter(Boolean);
  return segments.find((segment): segment is DashboardSection =>
    KNOWN_SECTIONS.includes(segment as DashboardSection)
  ) ?? null;
}

export function ContextHeader() {
  const pathname = usePathname();
  const section = getDashboardSection(pathname);
  const config = section ? SECTION_CONFIG[section] : null;
  const [activeView, setActiveView] = useState(config?.defaultView ?? 'overview');

  useEffect(() => {
    if (config) setActiveView(config.defaultView);
  }, [config]);

  const visibleViews = useMemo(() => config?.views ?? [], [config]);

  if (!config) return null;

  const PrimaryIcon = config.primaryAction.icon;

  return (
    <div className="flex min-h-10 items-center gap-2 border-b border-border bg-card px-6 py-1 text-sm">
      <div className="hidden min-w-[82px] items-center gap-1.5 text-[11px] font-semibold text-muted-foreground xl:flex">
        <SlidersHorizontal className="h-3 w-3" />
        {config.sectionLabel}
      </div>

      <div className="flex max-w-full items-center gap-0.5 overflow-x-auto rounded-md bg-muted/70 p-0.5">
        {visibleViews.map((view) => {
          const Icon = view.icon;
          const isActive = activeView === view.type;

          return (
            <button
              key={view.type}
              onClick={() => setActiveView(view.type)}
              className={cn(
                'flex h-7 items-center gap-1 whitespace-nowrap rounded px-2 text-[11px] transition-all',
                isActive
                  ? 'bg-background font-medium text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className="h-3 w-3" />
              {view.label}
            </button>
          );
        })}
      </div>

      <div className="flex-1" />

      <div className="hidden items-center gap-2 lg:flex">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder={config.searchPlaceholder}
            className="h-8 w-full rounded-md border border-border bg-background pl-9 pr-3 text-xs outline-none transition-shadow focus:ring-2 focus:ring-primary/30"
          />
        </div>

        <Button variant="outline" size="sm" className="h-8 gap-1.5 px-3 text-xs">
          <Filter className="h-3.5 w-3.5" />
          {config.filterLabel}
        </Button>

        <Button variant="outline" size="sm" className="h-8 gap-1.5 px-3 text-xs">
          <ArrowDownUp className="h-3.5 w-3.5" />
          {config.sortLabel}
        </Button>
      </div>

      <Button asChild size="sm" className="h-8 gap-1.5 px-3 text-xs">
        <Link href={config.primaryAction.href}>
          <PrimaryIcon className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">{config.primaryAction.label}</span>
        </Link>
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          {config.menuItems.map((item) => (
            item.href ? (
              <DropdownMenuItem key={item.label} asChild>
                <Link href={item.href}>{item.label}</Link>
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem key={item.label}>{item.label}</DropdownMenuItem>
            )
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem>Customize this view</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
