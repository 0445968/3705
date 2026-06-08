'use client';

import type { ComponentType, ReactNode } from 'react';
import Link from 'next/link';
import { useState } from 'react';
import {
  Bell,
  Calendar,
  FileSpreadsheet,
  FileText,
  Folder,
  FormInput,
  Inbox,
  Plus,
  Presentation,
  Search,
  Sparkles,
  Wind,
} from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ProfileMenu } from '@/components/layout/profile-menu';
import { cn } from '@/lib/utils';

const CREATE_ITEMS: Array<{
  icon: ComponentType<{ className?: string }>;
  label: string;
  href: string;
  color: string;
  bg: string;
}> = [
  { icon: FileText, label: 'Document', href: '/dashboard/docs/editor/new', color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { icon: FileSpreadsheet, label: 'Spreadsheet', href: '/dashboard/sheets/editor/new', color: 'text-amber-500', bg: 'bg-amber-500/10' },
  { icon: Presentation, label: 'Slide Deck', href: '/dashboard/slides/editor/new', color: 'text-rose-500', bg: 'bg-rose-500/10' },
  { icon: FormInput, label: 'Form', href: '/dashboard/forms/editor/new', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  { icon: Folder, label: 'Workspace', href: '/dashboard/workspaces/new', color: 'text-orange-500', bg: 'bg-orange-500/10' },
];

const NOTIFICATIONS = [
  { id: 1, title: 'Sarah signed the contract', time: '2m ago', read: false },
  { id: 2, title: 'New request from Bloom Studio', time: '1h ago', read: false },
  { id: 3, title: 'Marcus uploaded logo variants', time: '3h ago', read: true },
];

function HeaderIconButton({
  children,
  badge,
  title,
}: {
  children: ReactNode;
  badge?: number;
  title: string;
}) {
  return (
    <button
      title={title}
      className="relative flex h-8 w-8 items-center justify-center rounded-md text-white/70 transition-colors hover:bg-white/10 hover:text-white"
    >
      {children}
      {badge != null && badge > 0 ? (
        <span className="absolute right-1 top-1 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-rose-500 px-1 text-[8px] font-bold leading-none text-white ring-2 ring-[#390099]">
          {badge > 9 ? '!' : badge}
        </span>
      ) : null}
    </button>
  );
}

export function AppHeader({ leftSlot }: { leftSlot?: ReactNode }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const unreadCount = NOTIFICATIONS.filter((notification) => !notification.read).length;

  return (
    <header className="flex h-12 flex-shrink-0 items-center gap-3 border-b border-white/10 bg-[#390099] px-4 shadow-sm">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <Link href="/dashboard" className="flex flex-shrink-0 items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-white text-[#390099]">
            <Wind className="h-4 w-4" />
          </div>
          <span className="hidden text-sm font-bold tracking-tight text-white sm:inline">Crafterkite</span>
        </Link>

        {leftSlot ? <div className="hidden min-w-0 md:block">{leftSlot}</div> : null}
      </div>

      <div className="hidden flex-1 justify-center px-2 md:flex">
        <div
          className={cn(
            'relative flex w-full max-w-md items-center rounded-md border transition-all',
            searchFocused
              ? 'border-white/30 bg-white/15 ring-1 ring-white/25'
              : 'border-white/10 bg-white/10 hover:bg-white/15'
          )}
        >
          <Search className="absolute left-3 h-3.5 w-3.5 text-white/50" />
          <input
            type="text"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            placeholder="Search workspace..."
            className="h-8 w-full border-0 bg-transparent pl-8 pr-12 text-xs text-white placeholder:text-white/40 focus:outline-none"
          />
          <kbd className="absolute right-2 hidden rounded border border-white/20 bg-white/5 px-1.5 py-0.5 text-[9px] text-white/45 lg:block">
            CMD K
          </kbd>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-end gap-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex h-8 w-8 items-center justify-center rounded-md bg-white/10 text-white transition-colors hover:bg-white/20">
              <Plus className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              Quick create
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {CREATE_ITEMS.map((item) => {
              const Icon = item.icon;

              return (
                <DropdownMenuItem key={item.label} asChild>
                  <Link href={item.href} className="flex cursor-pointer items-center gap-2">
                    <div className={cn('flex h-5 w-5 items-center justify-center rounded', item.bg)}>
                      <Icon className={cn('h-3 w-3', item.color)} />
                    </div>
                    <span className="text-xs">{item.label}</span>
                  </Link>
                </DropdownMenuItem>
              );
            })}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-primary focus:text-primary">
              <Sparkles className="mr-2 h-4 w-4" />
              <span className="text-xs font-medium">AI create</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <HeaderIconButton title="Calendar">
          <Calendar className="h-4 w-4" />
        </HeaderIconButton>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <span>
              <HeaderIconButton badge={3} title="Inbox">
                <Inbox className="h-4 w-4" />
              </HeaderIconButton>
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel>Inbox</DropdownMenuLabel>
            <div className="p-4 text-center text-xs text-muted-foreground">All caught up.</div>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <span>
              <HeaderIconButton badge={unreadCount} title="Notifications">
                <Bell className="h-4 w-4" />
              </HeaderIconButton>
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 p-0">
            <div className="flex items-center justify-between border-b px-4 py-2">
              <span className="text-xs font-bold">Notifications</span>
              <button className="text-[10px] text-primary">Clear all</button>
            </div>
            {NOTIFICATIONS.map((notification) => (
              <div key={notification.id} className="border-b p-3 last:border-0 hover:bg-muted/50">
                <p className="text-xs font-medium">{notification.title}</p>
                <span className="text-[10px] text-muted-foreground">{notification.time}</span>
              </div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <ThemeToggle />

        <div className="ml-1 border-l border-white/10 pl-2">
          <ProfileMenu />
        </div>
      </div>
    </header>
  );
}
