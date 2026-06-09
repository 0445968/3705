'use client';

import { useState } from 'react';
import {
  Crown,
  FileText,
  Hash,
  Loader2,
  Mail,
  Sparkles,
  Tag,
  Users,
} from 'lucide-react';

import type { UpdateProjectInput } from '@/lib/queries/projects';

type ProjectField = 'status' | 'due_date' | 'description';

const PROJECT_TEAM_MEMBERS = [
  {
    id: 'owner',
    name: 'Project Owner',
    email: 'owner@crafterkite.local',
    role: 'Owner',
    initials: 'PO',
  },
  {
    id: 'creative',
    name: 'Creative Lead',
    email: 'creative@crafterkite.local',
    role: 'Creative',
    initials: 'CL',
  },
  {
    id: 'client',
    name: 'Client Reviewer',
    email: 'client@crafterkite.local',
    role: 'Reviewer',
    initials: 'CR',
  },
];

const PROJECT_TAGS = [
  'Creative Ops',
  'Client Work',
  'Production',
  'Priority',
];

export function ProjectSettingsTab({
  project,
  updatingProjectField,
  onUpdateProject,
}: {
  project: any;
  updatingProjectField: ProjectField | null;
  onUpdateProject: (
    field: ProjectField,
    updates: Omit<UpdateProjectInput, 'org_id'>
  ) => Promise<void>;
}) {
  const [descriptionDraft, setDescriptionDraft] = useState(
    project.description ?? ''
  );

  const descriptionChanged =
    descriptionDraft.trim() !== (project.description ?? '').trim();

  async function handleSaveDescription() {
    await onUpdateProject('description', {
      description: descriptionDraft.trim() || null,
    });
  }

  return (
    <section className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
      <div className="border-b border-border px-5 py-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Project configuration
            </p>

            <h2 className="mt-2 text-base font-semibold tracking-tight text-foreground">
              Settings
            </h2>

            <p className="mt-1 max-w-2xl text-xs leading-5 text-muted-foreground">
              Manage the project description, team context, ownership, tags,
              billing posture, and connected project metadata.
            </p>
          </div>

          <span className="inline-flex w-fit items-center gap-1 rounded-md bg-primary/10 px-2 py-1 text-[11px] font-medium text-primary">
            <Sparkles className="h-3 w-3" />
            Workspace settings
          </span>
        </div>
      </div>

      <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6 border-b border-border p-5 lg:border-b-0 lg:border-r">
          <div>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold text-foreground">
                Project description
              </h3>
            </div>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              This summary appears in the project hero and gives collaborators
              context for scope, deliverables, constraints, and outcomes.
            </p>

            <textarea
              value={descriptionDraft}
              onChange={(event) => setDescriptionDraft(event.target.value)}
              placeholder="Describe the project scope, outcomes, risks, deadlines, and important team decisions."
              rows={7}
              disabled={updatingProjectField === 'description'}
              className="mt-4 min-h-40 w-full resize-y rounded-md border border-border bg-background px-3 py-2 text-sm leading-6 outline-none transition placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-60"
            />

            <div className="mt-3 flex items-center justify-between gap-3">
              <p className="text-xs text-muted-foreground">
                Save changes to update the project summary everywhere.
              </p>

              <button
                type="button"
                onClick={handleSaveDescription}
                disabled={
                  updatingProjectField === 'description' || !descriptionChanged
                }
                className="inline-flex h-8 items-center justify-center gap-2 rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {updatingProjectField === 'description' ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : null}
                Save description
              </button>
            </div>
          </div>

          <div className="border-t border-border pt-6">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold text-foreground">
                Team members
              </h3>
            </div>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              People connected to this project. Database-backed collaborators
              can be wired into this panel next.
            </p>

            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {PROJECT_TEAM_MEMBERS.map((member) => (
                <div
                  key={member.id}
                  className="rounded-lg border border-border bg-background p-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      {member.initials}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {member.name}
                      </p>

                      <p className="mt-0.5 truncate text-xs text-muted-foreground">
                        {member.role}
                      </p>

                      <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        <span className="truncate">{member.email}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-5 p-5">
          <div>
            <div className="flex items-center gap-2">
              <Crown className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold text-foreground">
                Author
              </h3>
            </div>

            <div className="mt-3 rounded-lg border border-border bg-background p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500/10 text-xs font-semibold text-blue-500">
                  CK
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">
                    Crafterkite User
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Project creator
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-5">
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold text-foreground">Tags</h3>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {PROJECT_TAGS.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-[11px] font-medium text-muted-foreground"
                >
                  <Hash className="h-3 w-3" />
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="border-t border-border pt-5">
            <h3 className="text-sm font-semibold text-foreground">
              Connected metadata
            </h3>

            <dl className="mt-3 space-y-3 text-xs">
              <div className="flex items-center justify-between gap-3">
                <dt className="text-muted-foreground">Subject</dt>
                <dd className="truncate font-medium text-foreground">
                  {project.subject?.name ?? 'Undefined'}
                </dd>
              </div>

              <div className="flex items-center justify-between gap-3">
                <dt className="text-muted-foreground">Workspace</dt>
                <dd className="truncate font-medium text-foreground">
                  {project.workspaces?.name ?? 'Default workspace'}
                </dd>
              </div>

              <div className="flex items-center justify-between gap-3">
                <dt className="text-muted-foreground">Industry</dt>
                <dd className="truncate font-medium text-foreground">
                  {project.industry ?? 'No industry'}
                </dd>
              </div>

              <div className="flex items-center justify-between gap-3">
                <dt className="text-muted-foreground">Status</dt>
                <dd className="truncate font-medium capitalize text-foreground">
                  {project.status ?? 'active'}
                </dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>
    </section>
  );
}