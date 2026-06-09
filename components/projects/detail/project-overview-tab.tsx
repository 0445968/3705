'use client';

import {
  Activity,
  Calendar,
  CheckCircle2,
  ClipboardList,
  Paperclip,
  UserRound,
  type LucideIcon,
} from 'lucide-react';

import { formatDate } from './project-detail-utils';

export function ProjectOverviewTab({
  project,
  progress,
  completedTasks,
  totalTasks,
  formsCount,
}: {
  project: any;
  progress: number;
  completedTasks: number;
  totalTasks: number;
  formsCount: number;
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">
            General information
          </h2>

          <ClipboardList className="h-4 w-4 text-muted-foreground" />
        </div>

        <dl className="mt-4 space-y-4 text-xs">
          <ProjectInfoRow label="Status" icon={CheckCircle2}>
            <span className="capitalize">{project.status ?? 'active'}</span>
          </ProjectInfoRow>

          <ProjectInfoRow label="Subject" icon={UserRound}>
            {project.subject?.name ?? 'Undefined / No subject'}
          </ProjectInfoRow>

          <ProjectInfoRow label="Due date" icon={Calendar}>
            {formatDate(project.due_date)}
          </ProjectInfoRow>
        </dl>
      </div>

      <MetricCard
        title="Progress"
        icon={Activity}
        value={`${progress}%`}
        caption={`${completedTasks} of ${totalTasks} tasks completed`}
      />

      <MetricCard
        title="Project assets"
        icon={Paperclip}
        value={String(formsCount)}
        caption="Linked forms and intake routes"
      />
    </div>
  );
}

function ProjectInfoRow({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon: LucideIcon;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 h-4 w-4 text-muted-foreground" />

      <div>
        <dt className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
          {label}
        </dt>

        <dd className="mt-1 text-xs font-semibold text-foreground">
          {children}
        </dd>
      </div>
    </div>
  );
}

function MetricCard({
  title,
  icon: Icon,
  value,
  caption,
}: {
  title: string;
  icon: LucideIcon;
  value: string;
  caption: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-sm font-semibold text-foreground">{title}</h2>
          <p className="mt-1 text-xs text-muted-foreground">Current project</p>
        </div>

        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Icon className="h-4 w-4" />
        </div>
      </div>

      <p className="mt-6 text-2xl font-bold leading-none tracking-tight text-foreground">
        {value}
      </p>

      <p className="mt-2 text-xs leading-5 text-muted-foreground">
        {caption}
      </p>

      <div className="mt-4 h-2 rounded-full bg-muted">
        <div className="h-2 w-3/4 rounded-full bg-primary" />
      </div>
    </div>
  );
}