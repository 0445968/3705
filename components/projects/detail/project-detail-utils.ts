import type { TaskPriority, TaskStatus } from '@/lib/queries/tasks';

export function formatDate(value?: string | null) {
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

export function formatShortDate(value?: string | null) {
  if (!value) return 'No date';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'No date';
  }

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
  }).format(date);
}

export function statusClassName(status?: string | null) {
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

export function statusDotClassName(status?: string | null) {
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

export function taskStatusClassName(status?: TaskStatus | string | null) {
  switch (status) {
    case 'done':
      return 'border-emerald-500/20 bg-emerald-500/10 text-emerald-600';
    case 'review':
      return 'border-purple-500/20 bg-purple-500/10 text-purple-600';
    case 'in_progress':
      return 'border-blue-500/20 bg-blue-500/10 text-blue-600';
    case 'todo':
      return 'border-amber-500/20 bg-amber-500/10 text-amber-600';
    default:
      return 'border-muted bg-muted text-muted-foreground';
  }
}

export function taskPriorityClassName(priority?: TaskPriority | string | null) {
  switch (priority) {
    case 'high':
      return 'text-red-600';
    case 'medium':
      return 'text-amber-600';
    case 'low':
      return 'text-emerald-600';
    default:
      return 'text-muted-foreground';
  }
}