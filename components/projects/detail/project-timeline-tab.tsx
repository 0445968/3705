'use client';

import { CalendarDays, CheckCircle2, Clock } from 'lucide-react';

export function ProjectTimelineTab({
  dueDate,
  daysRemaining,
}: {
  dueDate?: string | null;
  daysRemaining: number | null;
}) {
  const timelineLabel =
    daysRemaining === null
      ? 'No due date'
      : daysRemaining >= 0
        ? `${daysRemaining} days remaining`
        : `${Math.abs(daysRemaining)} days overdue`;

  return (
    <section className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
      <div className="border-b border-border px-5 py-4">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-muted-foreground" />

          <h2 className="text-base font-semibold tracking-tight text-foreground">
            Timeline / Calendar
          </h2>
        </div>

        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          Project milestones, due dates, launch windows, scheduled reviews, and
          calendar planning will live here.
        </p>
      </div>

      <div className="grid gap-3 p-5 md:grid-cols-3">
        <div className="rounded-lg border border-border bg-background p-4">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <p className="mt-3 text-sm font-semibold text-foreground">
            Timeline status
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{timelineLabel}</p>
        </div>

        <div className="rounded-lg border border-border bg-background p-4">
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
          <p className="mt-3 text-sm font-semibold text-foreground">
            Due date
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {dueDate ? dueDate.slice(0, 10) : 'No date set'}
          </p>
        </div>

        <div className="rounded-lg border border-border bg-background p-4">
          <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          <p className="mt-3 text-sm font-semibold text-foreground">
            Milestones
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Milestone tracking can be connected next.
          </p>
        </div>
      </div>
    </section>
  );
}