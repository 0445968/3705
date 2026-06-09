'use client';

import Link from 'next/link';
import { FileText, Loader2, Plus } from 'lucide-react';

type ProjectFormSummary = {
  id: string;
  name: string;
  description?: string | null;
  status?: string | null;
  fields?: unknown[];
};

export function ProjectQuickLinks({
  forms,
  onCreateProjectForm,
  creatingForm,
}: {
  forms: ProjectFormSummary[];
  onCreateProjectForm: () => Promise<void>;
  creatingForm: boolean;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Shortcuts
          </p>

          <h2 className="mt-1 text-base font-semibold tracking-tight text-foreground">
            Quick links
          </h2>
        </div>

        <button
          type="button"
          onClick={onCreateProjectForm}
          disabled={creatingForm}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
          title="Create project form"
        >
          {creatingForm ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Plus className="h-3.5 w-3.5" />
          )}
        </button>
      </div>

      {forms.length === 0 ? (
        <div className="mt-4 rounded-lg border border-dashed border-border bg-muted/30 p-4 text-xs leading-5 text-muted-foreground">
          No linked forms yet. Generate a project form to create your first
          project asset.
        </div>
      ) : (
        <div className="mt-4 space-y-2">
          {forms.slice(0, 5).map((form) => (
            <Link
              key={form.id}
              href={`/dashboard/forms/${form.id}`}
              className="group flex items-center gap-3 rounded-lg border border-border bg-background p-3 transition hover:border-primary/30 hover:bg-primary/5"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                <FileText className="h-4 w-4" />
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground group-hover:text-primary">
                  {form.name}
                </p>

                <p className="text-xs text-muted-foreground">
                  {form.fields?.length ?? 0} fields · {form.status ?? 'draft'}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}