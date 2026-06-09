'use client';

import Link from 'next/link';
import {
  Activity,
  BarChart3,
  Calendar,
  ClipboardList,
  ExternalLink,
  Layers,
  Loader2,
  UserRound,
  Users,
  type LucideIcon,
} from 'lucide-react';

import type { ProjectStatus, UpdateProjectInput } from '@/lib/queries/projects';
import { cn } from '@/lib/utils';

type ProjectField = 'status' | 'due_date' | 'description';

const PROJECT_STATUSES: Array<{
  value: ProjectStatus;
  label: string;
}> = [
  { value: 'active', label: 'Active' },
  { value: 'draft', label: 'Draft' },
  { value: 'paused', label: 'Paused' },
  { value: 'completed', label: 'Completed' },
  { value: 'archived', label: 'Archived' },
];

function formatDate(value?: string | null) {
  if (!value) return 'No date';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'No date';
  }

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

function statusDotClassName(status?: string | null) {
  switch (status) {
    case 'completed':
      return 'bg-emerald-500';
    case 'paused':
      return 'bg-amber-500';
    case 'archived':
      return 'bg-muted-foreground';
    case 'draft':
      return 'bg-blue-500';
    default:
      return 'bg-primary';
  }
}

export function ProjectPropertiesSidebar({
  project,
  progress,
  totalTasks,
  completedTasks,
  formsCount,
  updatingProjectField,
  onUpdateProject,
}: {
  project: any;
  progress: number;
  totalTasks: number;
  completedTasks: number;
  formsCount: number;
  updatingProjectField: ProjectField | null;
  onUpdateProject: (
    field: ProjectField,
    updates: Omit<UpdateProjectInput, 'org_id'>
  ) => Promise<void>;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
      <h2 className="text-base font-semibold tracking-tight text-foreground">
        Project properties
      </h2>

      <dl className="mt-5 space-y-5 text-xs">
        <SidebarRow icon={Activity} label="Status">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'h-2 w-2 rounded-full',
                statusDotClassName(project.status)
              )}
            />

            <select
              value={project.status ?? 'active'}
              disabled={updatingProjectField === 'status'}
              onChange={(event) =>
                onUpdateProject('status', {
                  status: event.target.value as ProjectStatus,
                })
              }
              className="h-8 min-w-0 flex-1 rounded-md border border-border bg-background px-2 text-xs font-medium capitalize outline-none transition focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {PROJECT_STATUSES.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>

            {updatingProjectField === 'status' ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
            ) : null}
          </div>
        </SidebarRow>

        <SidebarRow icon={Layers} label="Group">
          {project.workspaces?.name ?? 'None'}
        </SidebarRow>

        <SidebarRow icon={BarChart3} label="Progress">
          {progress}% · {completedTasks}/{totalTasks}
        </SidebarRow>

        <SidebarRow icon={ClipboardList} label="Forms">
          {formsCount}
        </SidebarRow>

        <SidebarRow icon={Calendar} label="Due date">
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={project.due_date ? project.due_date.slice(0, 10) : ''}
              disabled={updatingProjectField === 'due_date'}
              onChange={(event) =>
                onUpdateProject('due_date', {
                  due_date: event.target.value || null,
                })
              }
              className="h-8 min-w-0 flex-1 rounded-md border border-border bg-background px-2 text-xs font-medium outline-none transition focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
            />

            {updatingProjectField === 'due_date' ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
            ) : null}
          </div>
        </SidebarRow>

        <SidebarRow icon={UserRound} label="Subject">
          {project.subject ? (
            <Link
              href={`/dashboard/subjects/${project.subject.id}`}
              className="inline-flex items-center gap-1 text-primary hover:underline"
            >
              {project.subject.name}
              <ExternalLink className="h-3 w-3" />
            </Link>
          ) : (
            'Undefined'
          )}
        </SidebarRow>

        <SidebarRow icon={Users} label="Support">
          ---
        </SidebarRow>
      </dl>
    </div>
  );
}

function SidebarRow({
  icon: Icon,
  label,
  children,
}: {
  icon: LucideIcon;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[20px_84px_minmax(0,1fr)] items-start gap-3">
      <Icon className="mt-0.5 h-4 w-4 text-muted-foreground" />

      <dt className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </dt>

      <dd className="min-w-0 text-xs font-semibold text-foreground">
        {children}
      </dd>
    </div>
  );
}