'use client';

import type { ComponentType } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Bot,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileStack,
  Gauge,
  MessageSquare,
  Palette,
  Plus,
  ShieldCheck,
  Sparkles,
  TimerReset,
  TrendingUp,
  Users,
  WalletCards,
} from 'lucide-react';
import { MOCK_REQUESTS, STATUS_LABELS, TYPE_LABELS } from '@/lib/mock-requests';
import { cn, formatDate, formatRelativeTime, getInitials, stringToColor } from '@/lib/utils';
import { Request, RequestStatus } from '@/types';
import { Button } from '@/components/ui/button';
import { useUser } from '@/store/auth.store';

const ACTIVE_STATUSES: RequestStatus[] = ['SUBMITTED', 'ACTIVE', 'IN_PROGRESS', 'IN_REVISION'];
const DAILY_CAPACITY = 3;

const WORKSPACE_CAPACITY = [
  { name: 'Marketing', active: 4, capacity: 5, color: 'bg-blue-500' },
  { name: 'Product', active: 2, capacity: 3, color: 'bg-emerald-500' },
  { name: 'Executive', active: 1, capacity: 2, color: 'bg-amber-500' },
  { name: 'Engineering', active: 2, capacity: 3, color: 'bg-rose-500' },
];

const CLIENT_SIGNALS = [
  { label: 'ACME Studio', detail: '2 review links awaiting approval', tone: 'text-amber-500' },
  { label: 'Northstar Labs', detail: 'Invoice paid, renewal touchpoint ready', tone: 'text-emerald-500' },
  { label: 'Bloom Supply', detail: 'Lead score up 18 points this week', tone: 'text-blue-500' },
];

const AI_ACTIONS = [
  'Summarize revision notes for launch banner',
  'Draft a stronger brief for Q4 campaign',
  'Explain why turnaround time rose this week',
];

function statusCount(status: RequestStatus) {
  return MOCK_REQUESTS.filter((request) => request.status === status).length;
}

function daysUntil(date?: string | null) {
  if (!date) return null;
  const dayMs = 24 * 60 * 60 * 1000;
  return Math.ceil((new Date(date).getTime() - Date.now()) / dayMs);
}

function getAssigneeName(request: Request) {
  if (!request.assignee) return 'Unassigned';
  return `${request.assignee.firstName} ${request.assignee.lastName}`;
}

function getQueuePosition(index: number) {
  return String(index + 1).padStart(2, '0');
}

function StatTile({
  label,
  value,
  detail,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string;
  detail: string;
  icon: ComponentType<{ className?: string }>;
  accent: string;
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
        <div className={cn('flex h-8 w-8 items-center justify-center rounded-md', accent)}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className="mt-3 text-xs leading-5 text-muted-foreground">{detail}</p>
    </div>
  );
}

function QueueRow({ request, index }: { request: Request; index: number }) {
  const dueIn = daysUntil(request.dueDate);
  const isAtRisk = dueIn !== null && dueIn <= 2 && request.status !== 'COMPLETED';
  const assigneeColor = request.assignee ? stringToColor(request.assignee.id) : 'hsl(var(--muted-foreground))';

  return (
    <Link
      href={`/dashboard/requests/${request.id}`}
      className="group grid gap-3 border-b border-border px-4 py-3 transition-colors last:border-b-0 hover:bg-accent/50 md:grid-cols-[40px_1fr_120px_120px_120px]"
    >
      <span className="text-xs font-semibold tabular-nums text-muted-foreground">
        {getQueuePosition(index)}
      </span>
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-semibold text-foreground group-hover:text-primary">
            {request.title}
          </p>
          {isAtRisk ? <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0 text-amber-500" /> : null}
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
          <span>{TYPE_LABELS[request.type]}</span>
          <span className="text-muted-foreground/40">/</span>
          <span>{request.workspace?.name ?? 'Workspace'}</span>
          <span className="text-muted-foreground/40">/</span>
          <span>{formatRelativeTime(request.updatedAt)}</span>
        </div>
      </div>
      <div className="flex items-center">
        <span className="rounded-md bg-muted px-2 py-1 text-[11px] font-medium text-muted-foreground">
          {STATUS_LABELS[request.status]}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <div
          className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white"
          style={{ backgroundColor: assigneeColor }}
        >
          {request.assignee ? getInitials(request.assignee.firstName, request.assignee.lastName) : '--'}
        </div>
        <span className="truncate text-xs text-muted-foreground">{getAssigneeName(request)}</span>
      </div>
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <CalendarDays className="h-3.5 w-3.5" />
        <span>{request.dueDate ? formatDate(request.dueDate) : 'No due date'}</span>
      </div>
    </Link>
  );
}

function WorkspaceBar({ item }: { item: (typeof WORKSPACE_CAPACITY)[number] }) {
  const pct = Math.min(100, Math.round((item.active / item.capacity) * 100));

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-xs">
        <span className="font-medium text-foreground">{item.name}</span>
        <span className="text-muted-foreground">
          {item.active}/{item.capacity} slots
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div className={cn('h-full rounded-full', item.color)} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const user = useUser();
  const activeRequests = MOCK_REQUESTS.filter((request) => ACTIVE_STATUSES.includes(request.status));
  const orderedQueue = [...activeRequests].sort((a, b) => a.priorityOrder - b.priorityOrder);
  const completed = statusCount('COMPLETED');
  const revisionCount = statusCount('IN_REVISION');
  const queueLoad = activeRequests.length;
  const firstDraftRisk = orderedQueue.filter((request) => {
    const dueIn = daysUntil(request.dueDate);
    return dueIn !== null && dueIn <= 2;
  }).length;
  const capacityPct = Math.round((queueLoad / (DAILY_CAPACITY * 2)) * 100);

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 rounded-lg border border-border bg-card p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-3xl">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Hello{user?.firstName ? `, ${user.firstName}` : ''}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Monitor production capacity, request movement, client approvals, and AI-assisted next steps from one workspace view.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild size="sm" className="gap-2">
            <Link href="/dashboard/requests">
              <Plus className="h-3.5 w-3.5" />
              New request
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="gap-2">
            <Link href="/dashboard/docs">
              <Sparkles className="h-3.5 w-3.5" />
              Open assist
            </Link>
          </Button>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <StatTile
          label="Queue load"
          value={`${queueLoad}/${DAILY_CAPACITY * 2}`}
          detail={`${capacityPct}% of the next two production days reserved.`}
          icon={Gauge}
          accent="bg-blue-500/10 text-blue-500"
        />
        <StatTile
          label="SLA risk"
          value={`${firstDraftRisk}`}
          detail="Requests due within 48 hours need a first-draft check."
          icon={TimerReset}
          accent="bg-amber-500/10 text-amber-500"
        />
        <StatTile
          label="Revision loop"
          value={`${revisionCount}`}
          detail="Active items are waiting on feedback or version updates."
          icon={MessageSquare}
          accent="bg-rose-500/10 text-rose-500"
        />
        <StatTile
          label="Completed"
          value={`${completed}`}
          detail="Delivered requests available for reporting and billing."
          icon={CheckCircle2}
          accent="bg-emerald-500/10 text-emerald-500"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
          <div className="flex flex-col gap-3 border-b border-border px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold tracking-tight text-foreground">Priority request queue</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Gap-ordered production work across active workspaces.
              </p>
            </div>
            <Button asChild variant="ghost" size="sm" className="gap-2 self-start">
              <Link href="/dashboard/requests">
                View all
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
          <div className="hidden grid-cols-[40px_1fr_120px_120px_120px] border-b border-border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground md:grid">
            <span>Rank</span>
            <span>Request</span>
            <span>Status</span>
            <span>Owner</span>
            <span>Due</span>
          </div>
          {orderedQueue.slice(0, 5).map((request, index) => (
            <QueueRow key={request.id} request={request} index={index} />
          ))}
        </div>

        <aside className="space-y-4">
          <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold tracking-tight text-foreground">Production slots</h2>
                <p className="mt-1 text-xs text-muted-foreground">Workspace capacity for today and tomorrow.</p>
              </div>
              <Clock3 className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="space-y-4">
              {WORKSPACE_CAPACITY.map((item) => (
                <WorkspaceBar key={item.name} item={item} />
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <Bot className="h-4 w-4 text-primary" />
              <h2 className="text-base font-semibold tracking-tight text-foreground">AI assist queue</h2>
            </div>
            <div className="space-y-2">
              {AI_ACTIONS.map((action) => (
                <button
                  key={action}
                  className="flex w-full items-center justify-between gap-3 rounded-md border border-border px-3 py-2 text-left text-xs text-muted-foreground transition-colors hover:border-primary/30 hover:bg-primary/5 hover:text-foreground"
                >
                  <span>{action}</span>
                  <Sparkles className="h-3.5 w-3.5 flex-shrink-0 text-primary" />
                </button>
              ))}
            </div>
          </div>
        </aside>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Palette className="h-4 w-4 text-blue-500" />
            <h2 className="text-base font-semibold tracking-tight text-foreground">Brand governance</h2>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Active brand profiles</span>
              <span className="font-semibold text-foreground">8</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Assets on current version</span>
              <span className="font-semibold text-emerald-500">91%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Review links live</span>
              <span className="font-semibold text-foreground">14</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-500" />
            <h2 className="text-base font-semibold tracking-tight text-foreground">Client signals</h2>
          </div>
          <div className="space-y-3">
            {CLIENT_SIGNALS.map((signal) => (
              <div key={signal.label} className="flex items-start gap-3">
                <span className={cn('mt-1 h-2 w-2 rounded-full bg-current', signal.tone)} />
                <div>
                  <p className="text-sm font-medium text-foreground">{signal.label}</p>
                  <p className="text-xs leading-5 text-muted-foreground">{signal.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-violet-500" />
            <h2 className="text-base font-semibold tracking-tight text-foreground">Platform readiness</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'RBAC', icon: Users, state: 'Ready' },
              { label: 'Billing', icon: WalletCards, state: 'Synced' },
              { label: 'Analytics', icon: BarChart3, state: 'Live' },
              { label: 'Files', icon: FileStack, state: 'Healthy' },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.label} className="rounded-md border border-border bg-background px-3 py-2">
                  <Icon className="mb-2 h-3.5 w-3.5 text-muted-foreground" />
                  <p className="text-xs font-semibold text-foreground">{item.label}</p>
                  <p className="text-[11px] text-muted-foreground">{item.state}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
