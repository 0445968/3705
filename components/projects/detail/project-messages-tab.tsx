'use client';

import { MessageSquareText } from 'lucide-react';

export function ProjectMessagesTab() {
  return (
    <section className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
      <div className="border-b border-border px-5 py-4">
        <div className="flex items-center gap-2">
          <MessageSquareText className="h-4 w-4 text-muted-foreground" />

          <h2 className="text-base font-semibold tracking-tight text-foreground">
            Messages
          </h2>
        </div>

        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          Project comments, stakeholder conversations, approvals, and threaded
          feedback will live here.
        </p>
      </div>

      <div className="p-5">
        <div className="rounded-lg border border-dashed border-border bg-muted/20 p-5 text-sm text-muted-foreground">
          No project messages yet. Comments and approval threads can be wired
          here after the comments data layer is added.
        </div>
      </div>
    </section>
  );
}