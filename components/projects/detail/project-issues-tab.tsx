'use client';

import {
  AlertTriangle,
  GitBranch,
  Send,
  Target,
  type LucideIcon,
} from 'lucide-react';

const ISSUE_SUMMARY: Array<{
  label: string;
  value: number;
  description: string;
  icon: LucideIcon;
}> = [
  {
    label: 'Requests',
    value: 12,
    description: 'Open project requests and intake follow-ups.',
    icon: Send,
  },
  {
    label: 'Escalations',
    value: 2,
    description: 'Items that need attention from a manager or owner.',
    icon: AlertTriangle,
  },
  {
    label: 'Connected portfolios',
    value: 3,
    description: 'Portfolio-level initiatives linked to this project.',
    icon: GitBranch,
  },
  {
    label: 'Connected goals',
    value: 5,
    description: 'Goals supported by this project workstream.',
    icon: Target,
  },
];

export function ProjectIssuesTab() {
  return (
    <section className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
      <div className="border-b border-border px-5 py-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />

          <h2 className="text-base font-semibold tracking-tight text-foreground">
            Issues
          </h2>
        </div>

        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          Requests, escalations, blockers, risks, connected portfolios, and
          connected goals will live here.
        </p>
      </div>

      <div className="grid gap-3 p-5 md:grid-cols-2 xl:grid-cols-4">
        {ISSUE_SUMMARY.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="rounded-lg border border-border bg-background p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <Icon className="h-4 w-4 text-muted-foreground" />

                <span className="text-2xl font-bold leading-none tracking-tight text-foreground">
                  {item.value}
                </span>
              </div>

              <p className="mt-4 text-sm font-semibold text-foreground">
                {item.label}
              </p>

              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}