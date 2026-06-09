'use client';

import {
  AlertTriangle,
  Briefcase,
  Calendar,
  CheckCircle2,
  CircleDollarSign,
  ClipboardList,
  FileText,
  Gauge,
  GitBranch,
  Layers,
  Send,
  Target,
  Timer,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react';

import type { Task } from '@/lib/queries/tasks';
import { cn } from '@/lib/utils';
import { formatDate } from './project-detail-utils';

const PROJECT_BUDGET_SNAPSHOT = {
  budget: 37500,
  paid: 20500,
  billableHours: 124,
  nonBillableHours: 38,
  hourlyRate: 150,
};

const PROJECT_CONNECTION_SNAPSHOT = {
  requests: 12,
  escalations: 2,
  portfolios: 3,
  goals: 5,
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

export function ProjectAnalyticsTab({
  project,
  tasks,
  progress,
  completedTasks,
  totalTasks,
  formsCount,
  daysRemaining,
}: {
  project: any;
  tasks: Task[];
  progress: number;
  completedTasks: number;
  totalTasks: number;
  formsCount: number;
  daysRemaining: number | null;
}) {
  const billableTasks = tasks.filter(
    (task) => task.status === 'in_progress' || task.status === 'review'
  ).length;

  const nonBillableTasks = tasks.filter(
    (task) => task.status === 'backlog' || task.status === 'todo'
  ).length;

  const reviewTasks = tasks.filter((task) => task.status === 'review').length;

  const timelineLabel =
    daysRemaining === null
      ? 'No due date'
      : daysRemaining >= 0
        ? `${daysRemaining} days left`
        : `${Math.abs(daysRemaining)} days overdue`;

  const dueAmount =
    PROJECT_BUDGET_SNAPSHOT.budget - PROJECT_BUDGET_SNAPSHOT.paid;

  const estimatedRevenue =
    PROJECT_BUDGET_SNAPSHOT.billableHours *
    PROJECT_BUDGET_SNAPSHOT.hourlyRate;

  return (
    <section className="space-y-4">
      <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Report & analytics
            </p>

            <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground">
              Project performance
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
              Monitor progress, billable and non-billable work, hours, budgets,
              requests, escalations, connected portfolios, and connected goals.
            </p>
          </div>

          <span
            className={cn(
              'inline-flex w-fit items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium capitalize',
              project.status === 'paused'
                ? 'bg-amber-500/10 text-amber-600'
                : project.status === 'completed'
                  ? 'bg-emerald-500/10 text-emerald-600'
                  : 'bg-primary/10 text-primary'
            )}
          >
            <Gauge className="h-3 w-3" />
            {project.status ?? 'active'}
          </span>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <ProjectAnalyticsMetric
          label="Progress"
          value={`${progress}%`}
          detail={`${completedTasks} of ${totalTasks} tasks completed`}
          icon={TrendingUp}
        />

        <ProjectAnalyticsMetric
          label="Budget due"
          value={formatCurrency(dueAmount)}
          detail={`${formatCurrency(PROJECT_BUDGET_SNAPSHOT.paid)} paid of ${formatCurrency(
            PROJECT_BUDGET_SNAPSHOT.budget
          )}`}
          icon={CircleDollarSign}
        />

        <ProjectAnalyticsMetric
          label="Billable hours"
          value={`${PROJECT_BUDGET_SNAPSHOT.billableHours}h`}
          detail={`${formatCurrency(estimatedRevenue)} estimated revenue`}
          icon={Timer}
        />

        <ProjectAnalyticsMetric
          label="Timeline"
          value={timelineLabel}
          detail={formatDate(project.due_date)}
          icon={Calendar}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
          <div className="border-b border-border px-4 py-4">
            <h3 className="text-base font-semibold tracking-tight text-foreground">
              Workload breakdown
            </h3>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Compare active production work, planning work, reviews, and completed delivery.
            </p>
          </div>

          <div className="divide-y divide-border">
            <ProjectAnalyticsRow
              label="Billable production tasks"
              value={billableTasks}
              detail="In progress or under review"
              icon={Briefcase}
              percent={totalTasks ? Math.round((billableTasks / totalTasks) * 100) : 0}
            />

            <ProjectAnalyticsRow
              label="Non-billable planning tasks"
              value={nonBillableTasks}
              detail="Backlog or to-do work"
              icon={ClipboardList}
              percent={totalTasks ? Math.round((nonBillableTasks / totalTasks) * 100) : 0}
            />

            <ProjectAnalyticsRow
              label="Review queue"
              value={reviewTasks}
              detail="Waiting on feedback or approval"
              icon={CheckCircle2}
              percent={totalTasks ? Math.round((reviewTasks / totalTasks) * 100) : 0}
            />

            <ProjectAnalyticsRow
              label="Linked forms"
              value={formsCount}
              detail="Project intake and request assets"
              icon={FileText}
              percent={formsCount > 0 ? 100 : 0}
            />
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-base font-semibold tracking-tight text-foreground">
                Budget snapshot
              </h3>
            </div>

            <dl className="mt-4 space-y-3 text-xs">
              <ProjectAnalyticsDetail
                label="Total budget"
                value={formatCurrency(PROJECT_BUDGET_SNAPSHOT.budget)}
              />
              <ProjectAnalyticsDetail
                label="Paid"
                value={formatCurrency(PROJECT_BUDGET_SNAPSHOT.paid)}
              />
              <ProjectAnalyticsDetail
                label="Due"
                value={formatCurrency(dueAmount)}
                danger={dueAmount > 0}
              />
              <ProjectAnalyticsDetail
                label="Hourly rate"
                value={`${formatCurrency(PROJECT_BUDGET_SNAPSHOT.hourlyRate)}/hr`}
              />
              <ProjectAnalyticsDetail
                label="Non-billable hours"
                value={`${PROJECT_BUDGET_SNAPSHOT.nonBillableHours}h`}
              />
            </dl>
          </div>

          <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <GitBranch className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-base font-semibold tracking-tight text-foreground">
                Connected work
              </h3>
            </div>

            <div className="mt-4 grid gap-2">
              <ProjectConnectionPill
                icon={Send}
                label="Requests"
                value={PROJECT_CONNECTION_SNAPSHOT.requests}
              />

              <ProjectConnectionPill
                icon={AlertTriangle}
                label="Escalations"
                value={PROJECT_CONNECTION_SNAPSHOT.escalations}
              />

              <ProjectConnectionPill
                icon={Layers}
                label="Portfolios"
                value={PROJECT_CONNECTION_SNAPSHOT.portfolios}
              />

              <ProjectConnectionPill
                icon={Target}
                label="Goals"
                value={PROJECT_CONNECTION_SNAPSHOT.goals}
              />
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

function ProjectAnalyticsMetric({
  label,
  value,
  detail,
  icon: Icon,
}: {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {label}
          </p>

          <p className="mt-2 text-2xl font-bold leading-none tracking-tight text-foreground">
            {value}
          </p>
        </div>

        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Icon className="h-4 w-4" />
        </div>
      </div>

      <p className="mt-3 text-xs leading-5 text-muted-foreground">{detail}</p>
    </div>
  );
}

function ProjectAnalyticsRow({
  label,
  value,
  detail,
  icon: Icon,
  percent,
}: {
  label: string;
  value: number;
  detail: string;
  icon: LucideIcon;
  percent: number;
}) {
  return (
    <div className="px-4 py-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
            <Icon className="h-4 w-4" />
          </div>

          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">{label}</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">{detail}</p>
          </div>
        </div>

        <span className="text-sm font-semibold text-foreground">{value}</span>
      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${Math.min(percent, 100)}%` }}
        />
      </div>
    </div>
  );
}

function ProjectAnalyticsDetail({
  label,
  value,
  danger = false,
}: {
  label: string;
  value: string;
  danger?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={cn('font-semibold text-foreground', danger && 'text-red-600')}>
        {value}
      </dd>
    </div>
  );
}

function ProjectConnectionPill({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md border border-border bg-background px-3 py-2">
      <div className="flex items-center gap-2">
        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-xs font-medium text-foreground">{label}</span>
      </div>

      <span className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
        {value}
      </span>
    </div>
  );
}