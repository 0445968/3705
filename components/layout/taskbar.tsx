'use client';

import React, { useEffect, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Bot,
  Briefcase,
  CheckSquare,
  ChevronDown,
  FileStack,
  FileText,
  Folder,
  FormInput,
  HelpCircle,
  Import,
  Keyboard,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Monitor,
  Palette,
  PanelRightOpen,
  Receipt,
  Settings,
  User,
  Users,
  Wind,
  X,
} from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useAuthStore } from '@/store/auth.store';
import { useOrgStore } from '@/store/org.store';
import { useLogout } from '@/hooks/use-auth';
import { cn, getInitials, stringToColor } from '@/lib/utils';
import {
  TaskbarItem,
  TaskbarItemType,
  useTaskbarStore,
} from '@/store/taskbar.store';

const TYPE_LABELS: Record<TaskbarItemType, string> = {
  project: 'Projects',
  document: 'Documents',
  profile: 'Profiles',
  request: 'Requests',
  workspace: 'Workspaces',
  subject: 'Subjects',
  form: 'Forms',
  task: 'Tasks',
  team: 'Team',
  agent: 'Agents',
  chat: 'Chat',
  page: 'Pages',
};

// Color palette inspired by modern flat app icons (vibrant but professional)
const TYPE_COLORS: Record<TaskbarItemType, string> = {
  project: 'bg-blue-600',
  document: 'bg-emerald-600',
  profile: 'bg-violet-600',
  request: 'bg-orange-600',
  workspace: 'bg-amber-600',
  subject: 'bg-sky-600',
  form: 'bg-teal-600',
  task: 'bg-rose-600',
  team: 'bg-cyan-600',
  agent: 'bg-purple-600',
  chat: 'bg-blue-600',
  page: 'bg-slate-600',
};

const TYPE_ICONS: Record<
  TaskbarItemType,
  React.ComponentType<{ className?: string }>
> = {
  project: Briefcase,
  document: FileText,
  profile: Palette,
  request: FileStack,
  workspace: Folder,
  subject: User,
  form: FormInput,
  task: CheckSquare,
  team: Users,
  agent: Bot,
  chat: MessageSquare,
  page: LayoutDashboard,
};

function titleCase(value: string) {
  return value
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getTaskbarItemFromPathname(
  pathname: string
): Omit<TaskbarItem, 'createdAt'> | null {
  const segments = pathname.split('/').filter(Boolean);

  if (segments[0] !== 'dashboard') return null;

  const section = segments[1];
  const third = segments[2];
  const fourth = segments[3];

  if (!section) return null;

  if (segments.length === 2) return null;

  const lastSegment = segments[segments.length - 1];
  const isNew = lastSegment === 'new';
  const isEditor = segments.includes('editor');

  const isSpecificRecord =
    Boolean(third) &&
    third !== 'editor' &&
    third !== 'new' &&
    third !== 'create';

  const isEditorRecord =
    isEditor &&
    Boolean(fourth) &&
    fourth !== 'new';

  const isCreateOrNew =
    isNew ||
    third === 'new' ||
    third === 'create' ||
    fourth === 'new';

  switch (section) {
    case 'projects': {
      if (!isSpecificRecord && !isCreateOrNew) return null;

      return {
        id: pathname,
        type: 'project',
        title: isCreateOrNew ? 'New project' : titleCase(lastSegment),
        subtitle: 'Project',
        href: pathname,
      };
    }

    case 'docs':
    case 'sheets':
    case 'slides': {
      if (!isEditor) return null;
      if (!isEditorRecord && !isCreateOrNew) return null;

      const documentLabel =
        section === 'docs'
          ? 'document'
          : section === 'sheets'
            ? 'spreadsheet'
            : 'slide deck';

      return {
        id: pathname,
        type: 'document',
        title: isCreateOrNew ? `New ${documentLabel}` : titleCase(lastSegment),
        subtitle:
          section === 'docs'
            ? 'Document editor'
            : section === 'sheets'
              ? 'Spreadsheet editor'
              : 'Slides editor',
        href: pathname,
      };
    }

    case 'profiles': {
      if (!isSpecificRecord && !isCreateOrNew) return null;

      return {
        id: pathname,
        type: 'profile',
        title: isCreateOrNew ? 'New profile' : titleCase(lastSegment),
        subtitle: 'Profile',
        href: pathname,
      };
    }

    case 'requests': {
      if (!isSpecificRecord && !isCreateOrNew) return null;

      return {
        id: pathname,
        type: 'request',
        title: isCreateOrNew ? 'New request' : titleCase(lastSegment),
        subtitle: 'Request',
        href: pathname,
      };
    }

    case 'tasks': {
      if (!isSpecificRecord && !isCreateOrNew) return null;

      return {
        id: pathname,
        type: 'task',
        title: isCreateOrNew ? 'New task' : titleCase(lastSegment),
        subtitle: 'Task',
        href: pathname,
      };
    }

    case 'forms': {
      const isFormEditor = isEditor && (isEditorRecord || isCreateOrNew);

      if (!isSpecificRecord && !isCreateOrNew && !isFormEditor) return null;

      return {
        id: pathname,
        type: 'form',
        title: isCreateOrNew ? 'New form' : titleCase(lastSegment),
        subtitle: isEditor ? 'Form builder' : 'Form',
        href: pathname,
      };
    }

    case 'subjects': {
      if (!isSpecificRecord && !isCreateOrNew) return null;

      return {
        id: pathname,
        type: 'subject',
        title: isCreateOrNew ? 'New subject' : titleCase(lastSegment),
        subtitle: 'Subject',
        href: pathname,
      };
    }

    case 'workspaces': {
      if (!isSpecificRecord && !isCreateOrNew) return null;

      return {
        id: pathname,
        type: 'workspace',
        title: isCreateOrNew ? 'New workspace' : titleCase(lastSegment),
        subtitle: 'Workspace',
        href: pathname,
      };
    }

    case 'agents': {
      if (!isSpecificRecord && !isCreateOrNew) return null;

      return {
        id: pathname,
        type: 'agent',
        title: isCreateOrNew ? 'New AI agent' : titleCase(lastSegment),
        subtitle: 'Agent',
        href: pathname,
      };
    }

    case 'chat': {
      if (!isSpecificRecord && !isCreateOrNew) return null;

      return {
        id: pathname,
        type: 'chat',
        title: isCreateOrNew ? 'New chat' : titleCase(lastSegment),
        subtitle: 'Conversation',
        href: pathname,
      };
    }

    default:
      return null;
  }
}

function TaskbarUserMenu() {
  const user = useAuthStore((state) => state.user);
  const currentOrg = useOrgStore((state) => state.currentOrg);
  const orgs = useOrgStore((state) => state.orgs);
  const setCurrentOrg = useOrgStore((state) => state.setCurrentOrg);
  const { mutate: logout } = useLogout();

  const userName = user ? `${user.firstName} ${user.lastName}` : 'Crafterkite';
  const userInitials = user ? getInitials(userName) : 'CK';
  const userColor = user ? stringToColor(user.id) : '#390099';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex h-full w-[280px] flex-shrink-0 items-center gap-3 border-r border-zinc-200 bg-white px-4 text-left transition hover:bg-zinc-50">
          <Avatar className="h-9 w-9 flex-shrink-0 ring-1 ring-zinc-200">
            {user?.avatarUrl ? (
              <AvatarImage src={user.avatarUrl} alt={userName} />
            ) : null}

            <AvatarFallback
              className="text-[11px] font-bold text-white"
              style={{ backgroundColor: userColor }}
            >
              {userInitials}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-zinc-900 leading-tight">
              {userName}
            </p>
            <p className="truncate text-[11px] text-zinc-500 leading-tight">
              {currentOrg?.name ?? user?.email ?? 'Workspace menu'}
            </p>
          </div>

          <ChevronDown className="h-4 w-4 flex-shrink-0 text-zinc-400" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        side="top"
        sideOffset={10}
        className="w-80 overflow-hidden rounded-2xl p-0"
      >
        <div className="bg-muted/30 px-4 py-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              {user?.avatarUrl ? (
                <AvatarImage src={user.avatarUrl} alt={userName} />
              ) : null}

              <AvatarFallback
                className="text-xs font-bold text-white"
                style={{ backgroundColor: userColor }}
              >
                {userInitials}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{userName}</p>
              <p className="truncate text-xs text-muted-foreground">
                {user?.email ?? 'Signed in'}
              </p>
              <p className="mt-1 text-[10px] font-medium uppercase tracking-widest text-primary">
                Owner · Free Plan
              </p>
            </div>
          </div>
        </div>

        <div className="p-2">
          <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-muted-foreground">
            Organization
          </DropdownMenuLabel>

          {orgs.map((org) => (
            <DropdownMenuItem
              key={org.id}
              onClick={() => setCurrentOrg(org)}
              className="cursor-pointer gap-2"
            >
              <div
                className="flex h-5 w-5 items-center justify-center rounded text-[9px] font-bold text-white"
                style={{ backgroundColor: stringToColor(org.id) }}
              >
                {getInitials(org.name)}
              </div>

              <span className="min-w-0 flex-1 truncate text-xs">
                {org.name}
              </span>

              {currentOrg?.id === org.id ? (
                <span className="text-[10px] text-primary">Active</span>
              ) : null}
            </DropdownMenuItem>
          ))}

          {orgs.length === 0 ? (
            <DropdownMenuItem disabled className="text-xs text-muted-foreground">
              No organizations
            </DropdownMenuItem>
          ) : null}

          <DropdownMenuItem asChild>
            <Link href="/onboarding/create-org" className="cursor-pointer gap-2">
              <Wind className="h-3.5 w-3.5" />
              New organization
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href="/settings/organization" className="cursor-pointer gap-2">
              <Settings className="h-3.5 w-3.5" />
              Organization settings
            </Link>
          </DropdownMenuItem>
        </div>

        <DropdownMenuSeparator />

        <div className="grid grid-cols-2 gap-1 p-2">
          <DropdownMenuItem asChild>
            <Link href="/settings/profile" className="cursor-pointer gap-2">
              <User className="h-3.5 w-3.5" />
              Profile
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href="/settings/account" className="cursor-pointer gap-2">
              <Settings className="h-3.5 w-3.5" />
              Account
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href="/settings/billing" className="cursor-pointer gap-2">
              <Receipt className="h-3.5 w-3.5" />
              Billing
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href="/settings/appearance" className="cursor-pointer gap-2">
              <Monitor className="h-3.5 w-3.5" />
              Appearance
            </Link>
          </DropdownMenuItem>
        </div>

        <DropdownMenuSeparator />

        <div className="p-2">
          <DropdownMenuItem className="cursor-pointer gap-2">
            <Keyboard className="h-3.5 w-3.5" />
            Keyboard shortcuts
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href="/dashboard/import" className="cursor-pointer gap-2">
              <Import className="h-3.5 w-3.5" />
              Import
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem className="cursor-pointer gap-2">
            <HelpCircle className="h-3.5 w-3.5" />
            Help & feedback
          </DropdownMenuItem>
        </div>

        <DropdownMenuSeparator />

        <div className="flex items-center justify-between px-3 py-2">
          <div>
            <p className="text-[10px] font-medium text-muted-foreground">
              Online · Synced
            </p>
            <p className="text-[10px] text-muted-foreground/70">
              Crafterkite v0.1.0
            </p>
          </div>

          <ThemeToggle />
        </div>

        <DropdownMenuSeparator />

        <div className="p-2">
          <DropdownMenuItem
            onClick={() => logout()}
            className="cursor-pointer gap-2 text-destructive focus:text-destructive"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign out
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function TaskbarGroup({
  type,
  items,
  activeHref,
}: {
  type: TaskbarItemType;
  items: TaskbarItem[];
  activeHref: string | null;
}) {
  const closeItem = useTaskbarStore((state) => state.closeItem);
  const closeItemsByType = useTaskbarStore((state) => state.closeItemsByType);
  const Icon = TYPE_ICONS[type];
  const colorClass = TYPE_COLORS[type];

  const activeItem = items.find((item) => item.href === activeHref);
  const hasMultiple = items.length > 1;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          title={`${TYPE_LABELS[type]} · ${items.length} open`}
          className={cn(
            'group relative flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl border transition-all duration-200 hover:scale-[1.05]',
            activeItem
              ? 'border-zinc-300 bg-white shadow-sm'
              : 'border-zinc-200 bg-white/70 hover:bg-white hover:shadow'
          )}
        >
          {/* Ripple / Stacked effect for multiple open items */}
          {hasMultiple && (
            <>
              <div className="absolute -top-[3px] -left-[3px] h-11 w-11 rounded-2xl border border-zinc-200 bg-white/50" />
              <div className="absolute -top-[1.5px] -left-[1.5px] h-11 w-11 rounded-2xl border border-zinc-200 bg-white/70" />
            </>
          )}

          {/* Colorful flat app icon style */}
          <div
            className={cn(
              'relative z-10 flex h-9 w-9 items-center justify-center rounded-2xl text-white shadow-sm transition-all',
              colorClass,
              hasMultiple && 'ring-2 ring-white/60'
            )}
          >
            <Icon className="h-4.5 w-4.5" />
          </div>

          {/* Active indicator */}
          {activeItem && (
            <span className="absolute bottom-1 h-1 w-4 rounded-full bg-blue-600 z-20" />
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        side="top"
        sideOffset={10}
        className="w-72 p-1"
      >
        <div className="flex items-center justify-between px-2 py-1.5">
          <DropdownMenuLabel className="p-0 text-[11px] uppercase tracking-widest text-muted-foreground">
            {TYPE_LABELS[type]}
          </DropdownMenuLabel>

          <button
            onClick={() => closeItemsByType(type)}
            className="text-[10px] font-medium text-muted-foreground hover:text-destructive"
          >
            Close group
          </button>
        </div>

        <DropdownMenuSeparator />

        <div className="max-h-80 overflow-y-auto py-1">
          {items.map((item) => {
            const ItemIcon = TYPE_ICONS[item.type];
            const isActive = item.href === activeHref;

            return (
              <DropdownMenuItem key={item.id} asChild>
                <div className="group/item flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5">
                  <Link
                    href={item.href}
                    className="flex min-w-0 flex-1 items-center gap-2"
                  >
                    <div
                      className={cn(
                        'flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-xl text-white shadow-sm',
                        TYPE_COLORS[item.type],
                        isActive && 'ring-2 ring-offset-2 ring-blue-500'
                      )}
                    >
                      <ItemIcon className="h-3.5 w-3.5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p
                        className={cn(
                          'truncate text-xs font-medium',
                          isActive ? 'text-blue-600' : 'text-zinc-900'
                        )}
                      >
                        {item.title}
                      </p>
                      <p className="truncate text-[10px] text-zinc-500">
                        {item.subtitle}
                      </p>
                    </div>
                  </Link>

                  <button
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      closeItem(item.id);
                    }}
                    className="flex h-6 w-6 items-center justify-center rounded-md text-zinc-400 opacity-0 transition hover:bg-red-100 hover:text-red-600 group-hover/item:opacity-100"
                    aria-label={`Close ${item.title}`}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </DropdownMenuItem>
            );
          })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function TaskbarChatDock() {
  const chatOpen = useTaskbarStore((state) => state.chatOpen);
  const toggleChat = useTaskbarStore((state) => state.toggleChat);

  return (
    <div className="ml-auto flex h-full flex-shrink-0 items-center border-l border-zinc-200 bg-white">
      <button
        onClick={toggleChat}
        className={cn(
          'flex h-full min-w-[240px] items-center gap-3 px-4 text-left text-xs transition hover:bg-zinc-50',
          chatOpen && 'bg-zinc-100 text-zinc-900'
        )}
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-sm">
          <MessageSquare className="h-5 w-5" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-zinc-900">Chat</p>
          <p className="truncate text-[11px] text-zinc-500">
            Team, project, and AI conversations
          </p>
        </div>

        <PanelRightOpen className="h-5 w-5 text-zinc-400" />
      </button>
    </div>
  );
}

export function AppTaskbar() {
  const pathname = usePathname();

  const items = useTaskbarStore((state) => state.items);
  const activeHref = useTaskbarStore((state) => state.activeHref);
  const addOrFocusItem = useTaskbarStore((state) => state.addOrFocusItem);
  const setActiveHref = useTaskbarStore((state) => state.setActiveHref);
  const closeAllItems = useTaskbarStore((state) => state.closeAllItems);

  useEffect(() => {
    const taskbarItem = getTaskbarItemFromPathname(pathname);

    setActiveHref(pathname);

    if (taskbarItem) {
      addOrFocusItem(taskbarItem);
    }
  }, [pathname, addOrFocusItem, setActiveHref]);

  const groupedItems = useMemo(() => {
    return items.reduce(
      (groups, item) => {
        if (!groups[item.type]) {
          groups[item.type] = [];
        }

        groups[item.type]!.push(item);

        return groups;
      },
      {} as Partial<Record<TaskbarItemType, TaskbarItem[]>>
    );
  }, [items]);

  const sortedTypes = useMemo(() => {
    const seen = new Set<TaskbarItemType>();
    const orderedTypes: TaskbarItemType[] = [];

    items.forEach((item) => {
      if (!seen.has(item.type)) {
        seen.add(item.type);
        orderedTypes.push(item.type);
      }
    });

    return orderedTypes;
  }, [items]);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 flex h-16 border-t border-zinc-200 bg-zinc-100 shadow-[0_-4px_20px_-4px_rgb(0,0,0,0.1)]">
      <TaskbarUserMenu />

      <div className="flex min-w-0 flex-1 items-center gap-2.5 overflow-x-auto px-4 py-2">
        {sortedTypes.length > 0 ? (
          sortedTypes.map((type) => {
            const groupItems = groupedItems[type] ?? [];

            return (
              <TaskbarGroup
                key={type}
                type={type}
                items={groupItems}
                activeHref={activeHref}
              />
            );
          })
        ) : (
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <LayoutDashboard className="h-4 w-4" />
            Open a project, document, profile, request, or task.
          </div>
        )}

        {items.length > 0 ? (
          <button
            onClick={closeAllItems}
            className="ml-1 hidden h-9 rounded-xl px-3 text-[10px] font-medium text-zinc-500 transition hover:bg-white hover:text-zinc-900 md:inline-flex md:items-center"
          >
            Close all
          </button>
        ) : null}
      </div>

      <TaskbarChatDock />
    </div>
  );
}