'use client';

import Link from 'next/link';
import {
  BarChart3,
  CheckCircle2,
  Clock,
  FolderOpen,
  Layers,
  Sparkles,
  UserRound,
  type LucideIcon,
} from 'lucide-react';

import { cn } from '@/lib/utils';

function statusClassName(status?: string | null) {
  switch (status) {
    case 'completed':
      return 'border-emerald-500/20 bg-emerald-500/10 text-emerald-600';
    case 'paused':
      return 'border-amber-500/20 bg-amber-500/10 text-amber-600';
    case 'archived':
      return 'border-muted bg-muted text-muted-foreground';
    case 'draft':
      return 'border-blue-500/20 bg-blue-500/10 text-blue-600';
    default:
      return 'border-primary/20 bg-primary/10 text-primary';
  }
}

export function ProjectHero({
  project,
  progress,
  completedTasks,
  totalTasks,
  daysRemaining,
  creatingForm,
  onCreateProjectForm,
}: {
  project: any;
  progress: number;
  completedTasks: number;
  totalTasks: number;
  daysRemaining: number | null;
  creatingForm: boolean;
  onCreateProjectForm: () => Promise<void>;
}) {
  return (
    <section className="rounded-lg border border-border bg-card p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="mb-4 flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Last sync</span>
            <span className="font-medium text-foreground">Just now</span>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
              <FolderOpen className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="truncate text-2xl font-bold tracking-tight text-foreground">
                  {project.name}
                </h1>

                <span
                  className={cn(
                    'rounded-md border px-2 py-1 text-[11px] font-medium capitalize',
                    statusClassName(project.status)
                  )}
                >
                  {project.status ?? 'active'}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                <ProjectMetaPill icon={UserRound}>
                  {project.subject ? (
                    <Link
                      href={`/dashboard/subjects/${project.subject.id}`}
                      className="transition hover:text-primary"
                    >
                      {project.subject.name}
                    </Link>
                  ) : (
                    'Undefined subject'
                  )}
                </ProjectMetaPill>

                <ProjectMetaPill icon={Layers}>
                  {project.workspaces?.name ?? 'Default workspace'}
                </ProjectMetaPill>

                <ProjectMetaPill icon={BarChart3}>
                  {project.industry ?? 'No industry'}
                </ProjectMetaPill>

                <ProjectMetaPill icon={CheckCircle2}>
                  {progress}% complete
                </ProjectMetaPill>
              </div>
            </div>
          </div>

          <div className="mt-5 max-w-4xl border-t border-border pt-4">
            {project.description ? (
              <p className="text-sm leading-6 text-muted-foreground">
                {project.description}
              </p>
            ) : (
              <p className="text-sm leading-6 text-muted-foreground">
                Add a project description to capture goals, scope, deliverables,
                and important constraints for this work.
              </p>
            )}
          </div>
        </div>

        <div className="w-full rounded-lg border border-border bg-background p-4 shadow-sm lg:w-72">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-semibold text-foreground">{progress}%</span>
          </div>

          <div className="mt-3 h-2 rounded-full bg-muted">
            <div
              className="h-2 rounded-full bg-primary transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {completedTasks}/{totalTasks} tasks
            </span>

            <span>
              {daysRemaining === null
                ? 'No due date'
                : daysRemaining >= 0
                  ? `${daysRemaining} days left`
                  : `${Math.abs(daysRemaining)} days overdue`}
            </span>
          </div>

          <button
            type="button"
            onClick={onCreateProjectForm}
            disabled={creatingForm}
            className="mt-4 inline-flex h-9 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Sparkles className="h-4 w-4" />
            {creatingForm ? 'Creating form...' : 'Generate form'}
          </button>
        </div>
      </div>
    </section>
  );
}

function ProjectMetaPill({
  icon: Icon,
  children,
}: {
  icon: LucideIcon;
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2 py-1 text-muted-foreground">
      <Icon className="h-3.5 w-3.5" />
      {children}
    </span>
  );
}