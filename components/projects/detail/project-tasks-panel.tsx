'use client';

import { useState, type FormEvent } from 'react';
import {
  Check,
  CheckCircle2,
  Loader2,
  Plus,
  Trash2,
} from 'lucide-react';

import type {
  CreateTaskInput,
  Task,
  TaskPriority,
  TaskStatus,
  UpdateTaskInput,
} from '@/lib/queries/tasks';
import { cn } from '@/lib/utils';
import {
  formatShortDate,
  taskPriorityClassName,
  taskStatusClassName,
} from './project-detail-utils';

const TASK_STATUSES: Array<{
  value: TaskStatus;
  label: string;
}> = [
  { value: 'backlog', label: 'Backlog' },
  { value: 'todo', label: 'To do' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'review', label: 'Review' },
  { value: 'done', label: 'Done' },
];

const TASK_PRIORITIES: Array<{
  value: TaskPriority;
  label: string;
}> = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

export function ProjectTasksPanel({
  tasks,
  loading,
  projectId,
  subjectId,
  addTask,
  updateTask,
  deleteTask,
  compact = false,
}: {
  tasks: Task[];
  loading: boolean;
  projectId: string;
  subjectId?: string | null;
  addTask: (input: Omit<CreateTaskInput, 'org_id'>) => Promise<Task>;
  updateTask: (
    id: string,
    input: Omit<UpdateTaskInput, 'org_id'>
  ) => Promise<Task>;
  deleteTask: (id: string) => Promise<void>;
  compact?: boolean;
}) {
  const [title, setTitle] = useState('');
  const [creating, setCreating] = useState(false);
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null);

  async function handleCreateTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    try {
      setCreating(true);

      await addTask({
        project_id: projectId,
        subject_id: subjectId ?? null,
        title: trimmedTitle,
        description: null,
        status: 'todo',
        priority: 'medium',
        due_date: null,
      });

      setTitle('');
    } catch (error) {
      console.error('Failed to create task:', error);

      const message =
        error instanceof Error
          ? error.message
          : typeof error === 'object' && error && 'message' in error
            ? String((error as { message?: unknown }).message)
            : 'Failed to create task';

      alert(message);
    } finally {
      setCreating(false);
    }
  }

  async function handleUpdateTask(
    task: Task,
    updates: {
      status?: TaskStatus | string;
      priority?: TaskPriority | string;
      due_date?: string | null;
    }
  ) {
    try {
      setUpdatingTaskId(task.id);
      await updateTask(task.id, updates);
    } catch (error) {
      console.error('Failed to update task:', error);

      const message =
        error instanceof Error
          ? error.message
          : typeof error === 'object' && error && 'message' in error
            ? String((error as { message?: unknown }).message)
            : 'Failed to update task';

      alert(message);
    } finally {
      setUpdatingTaskId(null);
    }
  }

  async function handleDeleteTask(task: Task) {
    const confirmed = window.confirm(`Delete "${task.title}"?`);
    if (!confirmed) return;

    try {
      setUpdatingTaskId(task.id);
      await deleteTask(task.id);
    } catch (error) {
      console.error('Failed to delete task:', error);

      const message =
        error instanceof Error
          ? error.message
          : typeof error === 'object' && error && 'message' in error
            ? String((error as { message?: unknown }).message)
            : 'Failed to delete task';

      alert(message);
    } finally {
      setUpdatingTaskId(null);
    }
  }

  return (
    <section className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
      <div className="flex flex-col gap-4 border-b border-border bg-muted/25 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />

            <h2 className="text-base font-semibold tracking-tight text-foreground">
              {compact ? 'Checklist' : 'Project tasks'}
            </h2>
          </div>

          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            Track the core work connected to this project.
          </p>
        </div>

        <span className="rounded-md bg-background px-2.5 py-1 text-xs font-medium text-muted-foreground">
          {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
        </span>
      </div>

      <div className="border-b border-border px-5 py-4">
        <form
          onSubmit={handleCreateTask}
          className="flex flex-col gap-2 sm:flex-row"
        >
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Add checklist item..."
            className="h-10 min-w-0 flex-1 rounded-md border border-border bg-background px-3 text-sm outline-none transition focus:ring-2 focus:ring-primary/20"
          />

          <button
            type="submit"
            disabled={creating || title.trim().length === 0}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {creating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            Add task
          </button>
        </form>
      </div>

      {loading ? (
        <div className="space-y-3 p-10 text-center">
          <div className="mx-auto h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading tasks...</p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="p-10 text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <CheckCircle2 className="h-4 w-4" />
          </div>

          <h3 className="mt-3 text-sm font-semibold text-foreground">
            No tasks yet
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            Add your first task to start turning this project into actionable
            work.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {tasks.map((task) => {
            const isUpdating = updatingTaskId === task.id;
            const isDone = task.status === 'done';

            return (
              <div
                key={task.id}
                className="group px-5 py-4 transition hover:bg-accent/40"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        disabled={isUpdating}
                        onClick={() =>
                          handleUpdateTask(task, {
                            status: isDone ? 'todo' : 'done',
                          })
                        }
                        className={cn(
                          'flex h-5 w-5 items-center justify-center rounded-full border transition',
                          isDone
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-muted-foreground/30 hover:border-primary'
                        )}
                      >
                        {isDone ? <Check className="h-3 w-3" /> : null}
                      </button>

                      <p
                        className={cn(
                          'truncate text-sm font-medium text-foreground',
                          isDone && 'text-muted-foreground line-through'
                        )}
                      >
                        {task.title}
                      </p>

                      <span
                        className={cn(
                          'rounded-full border px-2 py-0.5 text-[11px] font-medium',
                          taskStatusClassName(task.status)
                        )}
                      >
                        {TASK_STATUSES.find(
                          (status) => status.value === task.status
                        )?.label ?? task.status}
                      </span>
                    </div>

                    {task.description ? (
                      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                        {task.description}
                      </p>
                    ) : null}

                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span
                        className={cn(
                          'font-medium capitalize',
                          taskPriorityClassName(task.priority)
                        )}
                      >
                        {task.priority ?? 'medium'} priority
                      </span>

                      <span>·</span>

                      <span>{formatShortDate(task.due_date)}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 self-end lg:self-auto">
                    <select
                      value={task.status ?? 'backlog'}
                      disabled={isUpdating}
                      onChange={(event) =>
                        handleUpdateTask(task, {
                          status: event.target.value,
                        })
                      }
                      className="h-8 rounded-md border border-border bg-background px-2 text-xs outline-none transition focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
                    >
                      {TASK_STATUSES.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>

                    <select
                      value={task.priority ?? 'medium'}
                      disabled={isUpdating}
                      onChange={(event) =>
                        handleUpdateTask(task, {
                          priority: event.target.value,
                        })
                      }
                      className="h-8 rounded-md border border-border bg-background px-2 text-xs outline-none transition focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
                    >
                      {TASK_PRIORITIES.map((priority) => (
                        <option key={priority.value} value={priority.value}>
                          {priority.label}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      disabled={isUpdating}
                      onClick={() => handleDeleteTask(task)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive disabled:opacity-60"
                      title="Delete task"
                    >
                      {isUpdating ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}