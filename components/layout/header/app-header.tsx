'use client';

import type { ComponentType, ReactNode } from 'react';
import Link from 'next/link';
import { useState } from 'react';
import {
  Bell,
  Bot,
  Briefcase,
  Building2,
  Calendar,
  CheckSquare,
  ClipboardList,
  Download,
  FileSpreadsheet,
  FileText,
  Folder,
  FormInput,
  Inbox,
  LayoutTemplate,
  Megaphone,
  MessageSquare,
  Palette,
  Plus,
  Presentation,
  Search,
  Sparkles,
  Upload,
  UserPlus,
  Users,
  Wind,
  Workflow,
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

type QuickCreateItem = {
  icon: ComponentType<{ className?: string }>;
  label: string;
  description: string;
  href: string;
  color: string;
  bg: string;
};

type QuickCreateCategory = {
  label: string;
  description: string;
  items: QuickCreateItem[];
};

const QUICK_CREATE_CATEGORIES: QuickCreateCategory[] = [
  {
    label: 'Work',
    description: 'Projects, workspaces, tasks, and requests.',
    items: [
      {
        icon: Briefcase,
        label: 'Project',
        description: 'Create work connected to a subject.',
        href: '/dashboard/projects/new',
        color: 'text-violet-500',
        bg: 'bg-violet-500/10',
      },
      {
        icon: Folder,
        label: 'Workspace',
        description: 'Group related work and resources.',
        href: '/dashboard/workspaces/new',
        color: 'text-orange-500',
        bg: 'bg-orange-500/10',
      },
      {
        icon: CheckSquare,
        label: 'Task',
        description: 'Create an actionable to-do.',
        href: '/dashboard/tasks/new',
        color: 'text-sky-500',
        bg: 'bg-sky-500/10',
      },
      {
        icon: ClipboardList,
        label: 'Request',
        description: 'Start an intake or workflow request.',
        href: '/dashboard/requests/new',
        color: 'text-emerald-500',
        bg: 'bg-emerald-500/10',
      },
    ],
  },
  {
    label: 'Profiles',
    description: 'Subjects, profiles, templates, and contacts.',
    items: [
      {
        icon: Building2,
        label: 'Subject',
        description: 'Add a client, student, patient, or account.',
        href: '/dashboard/subjects',
        color: 'text-blue-500',
        bg: 'bg-blue-500/10',
      },
      {
        icon: LayoutTemplate,
        label: 'Profile template',
        description: 'Build a modular profile from widgets.',
        href: '/dashboard/profiles/new',
        color: 'text-fuchsia-500',
        bg: 'bg-fuchsia-500/10',
      },
      {
        icon: Palette,
        label: 'Profile library',
        description: 'Browse templates and industry presets.',
        href: '/dashboard/profiles',
        color: 'text-pink-500',
        bg: 'bg-pink-500/10',
      },
      {
        icon: UserPlus,
        label: 'Contact',
        description: 'Add a person linked to a subject.',
        href: '/dashboard/contacts/new',
        color: 'text-cyan-500',
        bg: 'bg-cyan-500/10',
      },
    ],
  },
  {
    label: 'Documents',
    description: 'Docs, sheets, slides, and forms.',
    items: [
      {
        icon: FileText,
        label: 'Document',
        description: 'Draft briefs, notes, SOPs, or reports.',
        href: '/dashboard/docs/editor/new',
        color: 'text-blue-500',
        bg: 'bg-blue-500/10',
      },
      {
        icon: FileSpreadsheet,
        label: 'Spreadsheet',
        description: 'Create budgets, trackers, or data sheets.',
        href: '/dashboard/sheets/editor/new',
        color: 'text-amber-500',
        bg: 'bg-amber-500/10',
      },
      {
        icon: Presentation,
        label: 'Slide deck',
        description: 'Build a pitch, proposal, or review deck.',
        href: '/dashboard/slides/editor/new',
        color: 'text-rose-500',
        bg: 'bg-rose-500/10',
      },
      {
        icon: FormInput,
        label: 'Form',
        description: 'Create intake, feedback, or approval forms.',
        href: '/dashboard/forms/editor/new',
        color: 'text-emerald-500',
        bg: 'bg-emerald-500/10',
      },
    ],
  },
  {
    label: 'Communication',
    description: 'Messages, events, announcements, and invites.',
    items: [
      {
        icon: MessageSquare,
        label: 'Chat',
        description: 'Start a team or subject conversation.',
        href: '/dashboard/chat/new',
        color: 'text-indigo-500',
        bg: 'bg-indigo-500/10',
      },
      {
        icon: Megaphone,
        label: 'Announcement',
        description: 'Post an update to a team or workspace.',
        href: '/dashboard/announcements/new',
        color: 'text-red-500',
        bg: 'bg-red-500/10',
      },
      {
        icon: Calendar,
        label: 'Calendar event',
        description: 'Schedule a meeting or milestone.',
        href: '/dashboard/calendar/new',
        color: 'text-purple-500',
        bg: 'bg-purple-500/10',
      },
      {
        icon: Users,
        label: 'Invite teammate',
        description: 'Invite someone to the organization.',
        href: '/dashboard/team/invite',
        color: 'text-teal-500',
        bg: 'bg-teal-500/10',
      },
    ],
  },
  {
    label: 'Automation',
    description: 'AI, workflows, imports, and exports.',
    items: [
      {
        icon: Sparkles,
        label: 'AI draft',
        description: 'Generate a doc, form, or project starter.',
        href: '/dashboard/ai/create',
        color: 'text-yellow-500',
        bg: 'bg-yellow-500/10',
      },
      {
        icon: Bot,
        label: 'AI agent',
        description: 'Create an assistant for repeatable work.',
        href: '/dashboard/agents/new',
        color: 'text-lime-500',
        bg: 'bg-lime-500/10',
      },
      {
        icon: Workflow,
        label: 'Workflow',
        description: 'Automate a process across the workspace.',
        href: '/dashboard/workflows/new',
        color: 'text-green-500',
        bg: 'bg-green-500/10',
      },
      {
        icon: Upload,
        label: 'Import',
        description: 'Import templates, contacts, or data.',
        href: '/dashboard/import',
        color: 'text-slate-500',
        bg: 'bg-slate-500/10',
      },
    ],
  },
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

function MegaMenuItem({ item }: { item: QuickCreateItem }) {
  const Icon = item.icon;

  return (
    <DropdownMenuItem asChild>
      <Link
        href={item.href}
        className="group flex cursor-pointer items-start gap-2.5 rounded-xl px-2 py-2.5 outline-none transition hover:bg-accent focus:bg-accent"
      >
        <div
          className={cn(
            'mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg transition group-hover:scale-105',
            item.bg
          )}
        >
          <Icon className={cn('h-4 w-4', item.color)} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold leading-4 text-foreground">
            {item.label}
          </p>
          <p className="mt-0.5 line-clamp-2 text-[10.5px] leading-4 text-muted-foreground">
            {item.description}
          </p>
        </div>
      </Link>
    </DropdownMenuItem>
  );
}

function QuickCreateMegaMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          title="Quick create"
          className="flex h-8 w-8 items-center justify-center rounded-md bg-white/10 text-white transition-colors hover:bg-white/20"
        >
          <Plus className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-[min(1120px,calc(100vw-32px))] overflow-hidden rounded-2xl border bg-popover p-0 shadow-2xl"
      >
        <div className="flex items-center justify-between gap-4 border-b bg-muted/30 px-5 py-4">
          <div>
            <DropdownMenuLabel className="p-0 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              Quick create
            </DropdownMenuLabel>
            <h2 className="mt-1 text-sm font-semibold text-foreground">
              Start something new
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Create workspace items, profiles, documents, communications, and automations.
            </p>
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <Link
              href="/dashboard/import"
              className="inline-flex h-8 items-center gap-2 rounded-lg border bg-background px-3 text-xs font-medium text-muted-foreground transition hover:bg-accent hover:text-foreground"
            >
              <Upload className="h-3.5 w-3.5" />
              Import
            </Link>

            <Link
              href="/dashboard/export"
              className="inline-flex h-8 items-center gap-2 rounded-lg border bg-background px-3 text-xs font-medium text-muted-foreground transition hover:bg-accent hover:text-foreground"
            >
              <Download className="h-3.5 w-3.5" />
              Export
            </Link>
          </div>
        </div>

        <div className="grid max-h-[calc(100vh-190px)] overflow-y-auto p-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {QUICK_CREATE_CATEGORIES.map((category, index) => (
            <div
              key={category.label}
              className={cn(
                'min-w-0 px-2 py-2',
                index > 0 && 'border-t md:border-l md:border-t-0'
              )}
            >
              <div className="mb-2 px-2">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                  {category.label}
                </p>
                <p className="mt-1 min-h-[32px] text-[11px] leading-4 text-muted-foreground">
                  {category.description}
                </p>
              </div>

              <div className="space-y-1">
                {category.items.map((item) => (
                  <MegaMenuItem
                    key={`${category.label}-${item.label}`}
                    item={item}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <DropdownMenuSeparator />

        <div className="grid gap-2 bg-muted/20 p-3 md:grid-cols-3">
          <Link
            href="/dashboard/profiles/new"
            className="rounded-xl border bg-background p-3 transition hover:bg-accent"
          >
            <div className="flex items-center gap-2">
              <LayoutTemplate className="h-4 w-4 text-primary" />
              <p className="text-xs font-semibold">Build profile template</p>
            </div>
            <p className="mt-1 text-[11px] leading-4 text-muted-foreground">
              Create reusable subject profiles from industry widgets.
            </p>
          </Link>

          <Link
            href="/dashboard/projects/new"
            className="rounded-xl border bg-background p-3 transition hover:bg-accent"
          >
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-primary" />
              <p className="text-xs font-semibold">Start project</p>
            </div>
            <p className="mt-1 text-[11px] leading-4 text-muted-foreground">
              Create a project and connect it to a subject.
            </p>
          </Link>

          <Link
            href="/dashboard/ai/create"
            className="rounded-xl border bg-background p-3 transition hover:bg-accent"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <p className="text-xs font-semibold">Generate with AI</p>
            </div>
            <p className="mt-1 text-[11px] leading-4 text-muted-foreground">
              Generate drafts, forms, templates, or project starters.
            </p>
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ChatMenuButton() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <span>
          <HeaderIconButton title="Chat">
            <MessageSquare className="h-4 w-4" />
          </HeaderIconButton>
        </span>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" sideOffset={8} className="w-72 p-0">
        <div className="border-b px-4 py-3">
          <p className="text-xs font-bold">Chat</p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            Conversations, project chats, and AI messages.
          </p>
        </div>

        <div className="p-2">
          <DropdownMenuItem asChild>
            <Link
              href="/dashboard/chat"
              className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2"
            >
              <MessageSquare className="h-4 w-4 text-primary" />
              <div>
                <p className="text-xs font-medium">Open chat</p>
                <p className="text-[10px] text-muted-foreground">
                  View all conversations
                </p>
              </div>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link
              href="/dashboard/chat/new"
              className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2"
            >
              <Plus className="h-4 w-4 text-primary" />
              <div>
                <p className="text-xs font-medium">New chat</p>
                <p className="text-[10px] text-muted-foreground">
                  Start a new conversation
                </p>
              </div>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link
              href="/dashboard/agents"
              className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2"
            >
              <Bot className="h-4 w-4 text-primary" />
              <div>
                <p className="text-xs font-medium">AI agents</p>
                <p className="text-[10px] text-muted-foreground">
                  Open assistant workspace
                </p>
              </div>
            </Link>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function AppHeader({ leftSlot }: { leftSlot?: ReactNode }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  const unreadCount = NOTIFICATIONS.filter(
    (notification) => !notification.read
  ).length;

  return (
    <header className="flex h-12 flex-shrink-0 items-center gap-3 border-b border-white/10 bg-[#390099] px-4 shadow-sm">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <Link href="/dashboard" className="flex flex-shrink-0 items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-white text-[#390099]">
            <Wind className="h-4 w-4" />
          </div>

          <span className="hidden text-sm font-bold tracking-tight text-white sm:inline">
            Crafterkite
          </span>
        </Link>

        {leftSlot ? (
          <div className="hidden min-w-0 md:block">{leftSlot}</div>
        ) : null}
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
        <QuickCreateMegaMenu />

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
            <div className="p-4 text-center text-xs text-muted-foreground">
              All caught up.
            </div>
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
              <div
                key={notification.id}
                className="border-b p-3 last:border-0 hover:bg-muted/50"
              >
                <p className="text-xs font-medium">{notification.title}</p>
                <span className="text-[10px] text-muted-foreground">
                  {notification.time}
                </span>
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