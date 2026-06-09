'use client';

import Link from 'next/link';
import {
  ArrowLeft,
  Link2,
  MoreHorizontal,
} from 'lucide-react';

export function ProjectDetailTopbar({
  projectName,
  onBack,
}: {
  projectName: string;
  onBack: () => void;
}) {
  return (
    <div className="border-b bg-card">
      <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-2 text-sm text-muted-foreground">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border bg-background transition hover:bg-accent hover:text-foreground"
            aria-label="Go back"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>

          <Link
            href="/dashboard/projects"
            className="transition hover:text-foreground"
          >
            Projects
          </Link>

          <span>/</span>

          <span className="truncate font-medium text-foreground">
            {projectName}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="hidden h-9 items-center gap-2 rounded-lg border bg-background px-3 text-sm font-medium transition hover:bg-accent sm:inline-flex"
          >
            <Link2 className="h-4 w-4" />
            Copy link
          </button>

          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border bg-background transition hover:bg-accent"
            aria-label="More project actions"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}