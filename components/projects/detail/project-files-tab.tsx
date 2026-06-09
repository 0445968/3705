'use client';

import Link from 'next/link';
import {
  ClipboardList,
  ExternalLink,
  FileText,
  Loader2,
  Paperclip,
  Send,
  Sparkles,
} from 'lucide-react';

import { cn } from '@/lib/utils';

type ProjectFormSummary = {
  id: string;
  name: string;
  description?: string | null;
  status?: string | null;
  fields?: unknown[];
};

const PROJECT_FILE_DOCUMENTS = [
  {
    id: 'brief',
    name: 'Creative brief',
    type: 'Document',
    status: 'Draft',
    updated: 'Today',
    href: '/dashboard/docs/editor/new?template=creative-brief',
  },
  {
    id: 'timeline',
    name: 'Project timeline',
    type: 'Schedule',
    status: 'Planned',
    updated: 'Today',
    href: '/dashboard/docs/editor/new?template=project-timeline',
  },
  {
    id: 'budget',
    name: 'Budget tracker',
    type: 'Tracker',
    status: 'Active',
    updated: 'Today',
    href: '/dashboard/docs/editor/new?template=budget-tracker',
  },
];

export function ProjectFilesTab({
  forms,
  loading,
  onCreateProjectForm,
  creatingForm,
}: {
  forms: ProjectFormSummary[];
  loading: boolean;
  onCreateProjectForm: () => Promise<void>;
  creatingForm: boolean;
}) {
  return (
    <div className="space-y-4">
      <ProjectFilesDocuments forms={forms} variant="full" />

      <ProjectFormsPanel
        forms={forms}
        loading={loading}
        onCreateProjectForm={onCreateProjectForm}
        creatingForm={creatingForm}
      />
    </div>
  );
}

export function ProjectFilesDocuments({
  forms,
  variant = 'compact',
}: {
  forms: ProjectFormSummary[];
  variant?: 'compact' | 'full';
}) {
  const linkedForms = forms.slice(0, variant === 'compact' ? 3 : 6);

  return (
    <section className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
      <div className="flex items-start justify-between gap-3 border-b border-border px-4 py-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Assets
          </p>

          <h2 className="mt-1 text-base font-semibold tracking-tight text-foreground">
            Project files & documents
          </h2>

          {variant === 'full' ? (
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Centralize briefs, trackers, files, forms, and project documents.
            </p>
          ) : null}
        </div>

        <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-1 text-[11px] font-medium text-primary">
          <Paperclip className="h-3 w-3" />
          {PROJECT_FILE_DOCUMENTS.length + forms.length}
        </span>
      </div>

      <div
        className={cn(
          'p-4',
          variant === 'full' && 'grid gap-4 lg:grid-cols-2'
        )}
      >
        <div className="space-y-3">
          {PROJECT_FILE_DOCUMENTS.map((file) => (
            <Link
              key={file.id}
              href={file.href}
              className="group flex items-center gap-3 rounded-lg border border-border bg-background p-3 transition hover:border-primary/30 hover:bg-primary/5"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                <FileText className="h-4 w-4" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground group-hover:text-primary">
                  {file.name}
                </p>

                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  {file.type} / {file.status} / {file.updated}
                </p>
              </div>

              <ExternalLink className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            </Link>
          ))}
        </div>

        {variant === 'full' ? (
          <div className="space-y-3">
            <div className="rounded-lg border border-dashed border-border bg-muted/20 p-3">
              <p className="text-sm font-semibold text-foreground">
                Linked project forms
              </p>

              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Forms generated from this project are listed here until a full
                file storage layer is connected.
              </p>
            </div>

            {linkedForms.length === 0 ? (
              <div className="rounded-lg border border-border bg-background p-3 text-xs leading-5 text-muted-foreground">
                No forms or intake documents are linked yet.
              </div>
            ) : (
              linkedForms.map((form) => (
                <Link
                  key={form.id}
                  href={`/dashboard/forms/${form.id}`}
                  className="group flex items-center gap-3 rounded-lg border border-border bg-background p-3 transition hover:border-primary/30 hover:bg-primary/5"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-blue-500/10 text-blue-500">
                    <ClipboardList className="h-4 w-4" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground group-hover:text-primary">
                      {form.name}
                    </p>

                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {form.fields?.length ?? 0} fields /{' '}
                      {form.status ?? 'draft'}
                    </p>
                  </div>

                  <ExternalLink className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                </Link>
              ))
            )}
          </div>
        ) : null}
      </div>
    </section>
  );
}

function ProjectFormsPanel({
  forms,
  loading,
  onCreateProjectForm,
  creatingForm,
}: {
  forms: ProjectFormSummary[];
  loading: boolean;
  onCreateProjectForm: () => Promise<void>;
  creatingForm: boolean;
}) {
  return (
    <section className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-border bg-muted/25 px-4 py-4">
        <div>
          <h2 className="text-base font-semibold tracking-tight text-foreground">
            Project forms
          </h2>

          <p className="mt-1 text-xs text-muted-foreground">
            Intake and request forms connected to this project.
          </p>
        </div>

        <button
          type="button"
          onClick={onCreateProjectForm}
          disabled={creatingForm}
          className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border bg-card px-3 text-sm font-medium transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
        >
          {creatingForm ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          {creatingForm ? 'Creating...' : 'New form'}
        </button>
      </div>

      {loading ? (
        <div className="space-y-3 p-10 text-center">
          <div className="mx-auto h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
          <p className="text-sm text-muted-foreground">
            Loading project forms...
          </p>
        </div>
      ) : forms.length === 0 ? (
        <div className="mx-auto max-w-sm p-10 text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-muted-foreground">
            <ClipboardList className="h-4 w-4" />
          </div>

          <h3 className="mt-3 text-sm font-semibold text-foreground">
            No forms yet
          </h3>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Generate a project intake form to collect goals, deliverables, and
            scope details.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {forms.map((form) => (
            <div
              key={form.id}
              className="group p-4 transition hover:bg-accent/40"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 space-y-1">
                  <p className="truncate text-sm font-medium text-foreground transition group-hover:text-primary">
                    {form.name}
                  </p>

                  {form.description ? (
                    <p className="line-clamp-1 text-sm text-muted-foreground">
                      {form.description}
                    </p>
                  ) : null}

                  <div className="flex items-center gap-2 pt-1 text-xs text-muted-foreground">
                    <span className="rounded-full bg-muted px-2 py-0.5">
                      {form.fields?.length ?? 0} fields
                    </span>

                    <span
                      className={cn(
                        'rounded-full border px-2 py-0.5 capitalize',
                        form.status === 'active'
                          ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-600'
                          : 'border-muted bg-muted text-muted-foreground'
                      )}
                    >
                      {form.status ?? 'draft'}
                    </span>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2 self-end sm:self-auto">
                  <Link
                    href={`/dashboard/forms/${form.id}`}
                    className="inline-flex h-8 items-center justify-center rounded-lg border bg-card px-3 text-xs font-medium transition hover:bg-accent"
                  >
                    Configure
                  </Link>

                  <Link
                    href={`/dashboard/forms/${form.id}/fill`}
                    className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg bg-primary px-3 text-xs font-medium text-primary-foreground transition hover:bg-primary/90"
                  >
                    <Send className="h-3.5 w-3.5" />
                    Fill
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}