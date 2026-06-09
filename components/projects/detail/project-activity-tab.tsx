'use client';

import { Activity } from 'lucide-react';

import type { Task } from '@/lib/queries/tasks';

export function ProjectActivityTab({
  projectName,
  tasks,
  formsCount,
}: {
  projectName: string;
  tasks: Task[];
  formsCount: number;
}) {
  const latestTasks = tasks.slice(0, 3);

  return (
    <section className="rounded-lg border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <Activity className="h-4 w-4 text-muted-foreground" />

        <h2 className="text-base font-semibold tracking-tight text-foreground">
          Activity
        </h2>
      </div>

      <p className="mt-1 text-xs leading-5 text-muted-foreground">
        Recent project updates, linked assets, task changes, and system events.
      </p>

      <div className="mt-5 space-y-5">
        <ActivityItem
          title="Project opened"
          description={`${projectName} is ready for project work.`}
          timestamp="Just now"
        />

        <ActivityItem
          title="Forms connected"
          description={`${formsCount} project form${
            formsCount === 1 ? '' : 's'
          } linked.`}
          timestamp="Today"
        />

        {latestTasks.map((task) => (
          <ActivityItem
            key={task.id}
            title="Task updated"
            description={`${task.title} is currently ${task.status}.`}
            timestamp="Recently"
          />
        ))}
      </div>
    </section>
  );
}

function ActivityItem({
  title,
  description,
  timestamp,
}: {
  title: string;
  description: string;
  timestamp: string;
}) {
  return (
    <div className="relative flex gap-3">
      <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
        <span className="h-2 w-2 rounded-full bg-primary" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-semibold text-foreground">{title}</p>

          <span className="text-[11px] font-medium text-muted-foreground">
            {timestamp}
          </span>
        </div>

        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}