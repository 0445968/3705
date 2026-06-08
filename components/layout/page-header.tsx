'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Bot,
  ChevronRight,
  Clock3,
  Home,
  MoreHorizontal,
  Share2,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const LABEL_MAP: Record<string, string> = {
  agents: 'AI Agents',
  chat: 'Chat',
  dashboard: 'Dashboard',
  docs: 'Docs',
  requests: 'Requests',
  settings: 'Settings',
  tasks: 'Tasks',
  team: 'Team',
  'brands': 'Brand Profiles',
  workspaces: 'Workspaces',
};

const SECTION_META: Record<string, { status: string; owner: string }> = {
  agents: { status: 'Usage synced', owner: 'AI Ops' },
  chat: { status: 'Live messages', owner: 'Workspace' },
  docs: { status: 'Indexed recently', owner: 'Knowledge' },
  requests: { status: 'Queue updated', owner: 'Production' },
  settings: { status: 'Audit ready', owner: 'Admins' },
  tasks: { status: 'Updated today', owner: 'Team' },
  team: { status: 'Roles active', owner: 'Admins' },
  'brands': { status: 'Version tracked', owner: 'Brand' },
  workspaces: { status: 'Capacity synced', owner: 'Operations' },
};

function formatLabel(segment: string) {
  const lower = segment.toLowerCase();
  if (LABEL_MAP[lower]) return LABEL_MAP[lower];
  if (/^[0-9a-fA-F-]{6,}$|^\d+$|^(doc|req|task|ws|org)_/.test(segment)) return 'Details';
  return segment.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

export function PageHeader() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);
  const dashboardIndex = segments.indexOf('dashboard');
  const visibleSegments = dashboardIndex >= 0 ? segments.slice(dashboardIndex) : segments;
  const mainSection = visibleSegments.find((segment) => segment !== 'dashboard') ?? 'dashboard';
  const meta = SECTION_META[mainSection] ?? { status: 'Updated recently', owner: 'Workspace' };

  return (
    <div className="flex min-h-10 items-center gap-3 border-b border-border bg-card px-6 py-1 text-sm">
      <div className="flex min-w-0 flex-1 items-center text-muted-foreground">
        <Link
          href="/dashboard"
          className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md transition-colors hover:bg-accent hover:text-foreground"
          aria-label="Dashboard home"
        >
          <Home className="h-3.5 w-3.5" />
        </Link>

        {visibleSegments.map((segment, index) => {
          if (segment === 'dashboard' && index === 0) return null;

          const href = '/' + visibleSegments.slice(0, index + 1).join('/');
          const isLast = index === visibleSegments.length - 1;
          const label = formatLabel(segment);

          return (
            <div key={`${href}-${segment}`} className="flex min-w-0 items-center">
              <ChevronRight className="mx-1 h-3.5 w-3.5 flex-shrink-0 text-muted-foreground/40" />
              {isLast ? (
                <span className="truncate text-xs font-semibold text-foreground">{label}</span>
              ) : (
                <Link href={href} className="truncate text-xs transition-colors hover:text-foreground">
                  {label}
                </Link>
              )}
            </div>
          );
        })}
      </div>

      <div className="hidden items-center gap-3 text-[11px] text-muted-foreground md:flex">
        <span className="flex items-center gap-1.5">
          <Clock3 className="h-3 w-3" />
          {meta.status}
        </span>
        <span className="flex items-center gap-1.5">
          <Users className="h-3 w-3" />
          {meta.owner}
        </span>
      </div>

      <div className="hidden h-5 w-px bg-border sm:block" />

      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" className="h-7 gap-1.5 px-2 text-[11px] font-medium">
          <Bot className="h-3.5 w-3.5 text-primary" />
          <span className="hidden sm:inline">Ask AI</span>
        </Button>

        <Button variant="ghost" size="sm" className="h-7 gap-1.5 px-2 text-[11px] font-medium">
          <Share2 className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Share</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <MoreHorizontal className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem className="text-[13px]">Copy link</DropdownMenuItem>
            <DropdownMenuItem className="text-[13px]">Export view</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-[13px]">View activity</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
