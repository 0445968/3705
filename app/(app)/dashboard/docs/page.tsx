'use client';

import type { ComponentType } from 'react';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Bot,
  ChevronRight,
  Clock3,
  Copy,
  Download,
  FileCode,
  FilePen,
  FileSpreadsheet,
  FileText,
  Filter,
  Folder,
  LayoutGrid,
  LayoutList,
  Lock,
  MessageSquare,
  MoreHorizontal,
  Palette,
  Plus,
  Search,
  Share2,
  ShieldCheck,
  Sparkles,
  Star,
  StarOff,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type DocKind = 'brief' | 'guidelines' | 'contract' | 'knowledge' | 'sheet' | 'code';
type AccessLevel = 'Private' | 'Workspace' | 'Client link';
type ViewMode = 'grid' | 'list';

interface DocumentRecord {
  id: string;
  title: string;
  kind: DocKind;
  workspace: string;
  owner: string;
  updated: string;
  status: string;
  access: AccessLevel;
  collaborators: number;
  comments: number;
  starred: boolean;
  aiReady: boolean;
}

interface TemplateRecord {
  title: string;
  description: string;
  kind: DocKind;
  href: string;
  accent: string;
  icon: ComponentType<{ className?: string }>;
}

const KIND_META: Record<DocKind, { label: string; icon: ComponentType<{ className?: string }>; accent: string; surface: string }> = {
  brief: {
    label: 'Brief',
    icon: FilePen,
    accent: 'text-blue-500',
    surface: 'bg-blue-500/10',
  },
  guidelines: {
    label: 'Guidelines',
    icon: Palette,
    accent: 'text-violet-500',
    surface: 'bg-violet-500/10',
  },
  contract: {
    label: 'Contract',
    icon: ShieldCheck,
    accent: 'text-emerald-500',
    surface: 'bg-emerald-500/10',
  },
  knowledge: {
    label: 'Knowledge',
    icon: FileText,
    accent: 'text-amber-500',
    surface: 'bg-amber-500/10',
  },
  sheet: {
    label: 'Tracker',
    icon: FileSpreadsheet,
    accent: 'text-rose-500',
    surface: 'bg-rose-500/10',
  },
  code: {
    label: 'Spec',
    icon: FileCode,
    accent: 'text-cyan-500',
    surface: 'bg-cyan-500/10',
  },
};

const TEMPLATES: TemplateRecord[] = [
  {
    title: 'Creative Brief',
    description: 'Scope, goals, assets, deliverables, stakeholders, and approval path.',
    kind: 'brief',
    href: '/dashboard/docs/editor/new?template=creative-brief',
    accent: 'from-blue-500 to-cyan-400',
    icon: FilePen,
  },
  {
    title: 'Brand Guidelines',
    description: 'Logos, palette, typography, voice rules, and usage notes.',
    kind: 'guidelines',
    href: '/dashboard/docs/editor/new?template=brand-guidelines',
    accent: 'from-violet-500 to-fuchsia-400',
    icon: Palette,
  },
  {
    title: 'Client Proposal',
    description: 'Offer summary, timeline, pricing, terms, and signature section.',
    kind: 'contract',
    href: '/dashboard/docs/editor/new?template=proposal',
    accent: 'from-emerald-500 to-teal-400',
    icon: ShieldCheck,
  },
  {
    title: 'Launch Retro',
    description: 'Decisions, lessons, metrics, blockers, and next actions.',
    kind: 'knowledge',
    href: '/dashboard/docs/editor/new?template=retro',
    accent: 'from-amber-500 to-orange-400',
    icon: MessageSquare,
  },
];

const INITIAL_DOCUMENTS: DocumentRecord[] = [
  {
    id: 'doc_01',
    title: 'Bloom Studio - Spring Campaign Brief',
    kind: 'brief',
    workspace: 'Marketing',
    owner: 'Maya Chen',
    updated: 'Today, 12:08 PM',
    status: 'Client review',
    access: 'Client link',
    collaborators: 5,
    comments: 12,
    starred: true,
    aiReady: true,
  },
  {
    id: 'doc_02',
    title: 'Acme Corp Brand Guidelines v3',
    kind: 'guidelines',
    workspace: 'Brand',
    owner: 'James Park',
    updated: 'Today, 10:54 AM',
    status: 'Approved',
    access: 'Workspace',
    collaborators: 8,
    comments: 4,
    starred: true,
    aiReady: true,
  },
  {
    id: 'doc_03',
    title: 'Northstar Labs Retainer Agreement',
    kind: 'contract',
    workspace: 'Accounts',
    owner: 'Alex Rivera',
    updated: 'Yesterday, 4:22 PM',
    status: 'Signature needed',
    access: 'Private',
    collaborators: 2,
    comments: 3,
    starred: false,
    aiReady: false,
  },
  {
    id: 'doc_04',
    title: 'Q2 Asset Delivery Tracker',
    kind: 'sheet',
    workspace: 'Production',
    owner: 'Aria Johnson',
    updated: 'Apr 29, 2026',
    status: 'In progress',
    access: 'Workspace',
    collaborators: 6,
    comments: 9,
    starred: false,
    aiReady: true,
  },
  {
    id: 'doc_05',
    title: 'Request Assist Prompt Library',
    kind: 'knowledge',
    workspace: 'AI Ops',
    owner: 'Maya Chen',
    updated: 'Apr 28, 2026',
    status: 'Draft',
    access: 'Workspace',
    collaborators: 3,
    comments: 7,
    starred: false,
    aiReady: true,
  },
  {
    id: 'doc_06',
    title: 'Public API Webhook Spec',
    kind: 'code',
    workspace: 'Engineering',
    owner: 'James Park',
    updated: 'Apr 26, 2026',
    status: 'Needs review',
    access: 'Private',
    collaborators: 4,
    comments: 5,
    starred: false,
    aiReady: false,
  },
];

const FILTERS: Array<{ label: string; value: 'all' | DocKind }> = [
  { label: 'All', value: 'all' },
  { label: 'Briefs', value: 'brief' },
  { label: 'Brand', value: 'guidelines' },
  { label: 'Contracts', value: 'contract' },
  { label: 'Knowledge', value: 'knowledge' },
  { label: 'Trackers', value: 'sheet' },
];

function AccessBadge({ access }: { access: AccessLevel }) {
  const config = {
    Private: { icon: Lock, className: 'bg-muted text-muted-foreground' },
    Workspace: { icon: Users, className: 'bg-blue-500/10 text-blue-500' },
    'Client link': { icon: Share2, className: 'bg-emerald-500/10 text-emerald-500' },
  }[access];
  const Icon = config.icon;

  return (
    <span className={cn('inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium', config.className)}>
      <Icon className="h-3 w-3" />
      {access}
    </span>
  );
}

function StatPanel({
  label,
  value,
  detail,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string;
  detail: string;
  icon: ComponentType<{ className?: string }>;
  accent: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
          <p className="mt-2 text-2xl font-bold leading-none tracking-tight text-foreground">{value}</p>
        </div>
        <div className={cn('flex h-8 w-8 items-center justify-center rounded-md', accent)}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className="mt-3 text-xs leading-5 text-muted-foreground">{detail}</p>
    </div>
  );
}

function TemplateCard({ template }: { template: TemplateRecord }) {
  const Icon = template.icon;
  const meta = KIND_META[template.kind];

  return (
    <Link
      href={template.href}
      className="group rounded-lg border border-border bg-card p-4 shadow-sm transition-all hover:border-primary/30 hover:bg-primary/5"
    >
      <div className={cn('mb-4 flex h-20 items-end overflow-hidden rounded-md bg-gradient-to-br p-3', template.accent)}>
        <div className="space-y-1 opacity-70">
          <div className="h-1.5 w-24 rounded-full bg-white" />
          <div className="h-1.5 w-16 rounded-full bg-white/80" />
          <div className="h-1.5 w-28 rounded-full bg-white/50" />
        </div>
      </div>
      <div className="flex items-start gap-3">
        <div className={cn('flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md', meta.surface)}>
          <Icon className={cn('h-4 w-4', meta.accent)} />
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-semibold leading-5 text-foreground">{template.title}</h3>
          <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">{template.description}</p>
        </div>
      </div>
    </Link>
  );
}

function DocumentCard({
  document,
  onToggleStar,
}: {
  document: DocumentRecord;
  onToggleStar: (id: string) => void;
}) {
  const meta = KIND_META[document.kind];
  const Icon = meta.icon;

  return (
    <div className="group overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-all hover:border-primary/30 hover:shadow-md">
      <Link href={`/dashboard/docs/editor/${document.id}`} className="block border-b border-border bg-muted/25 px-4 py-4">
        <div className="mb-6 flex items-start justify-between">
          <div className={cn('flex h-9 w-9 items-center justify-center rounded-md', meta.surface)}>
            <Icon className={cn('h-4 w-4', meta.accent)} />
          </div>
          <span className="rounded-md bg-background px-2 py-1 text-[11px] font-medium text-muted-foreground">
            {meta.label}
          </span>
        </div>
        <div className="space-y-1.5">
          <div className="h-2 w-3/4 rounded-full bg-foreground/15" />
          <div className="h-1.5 w-full rounded-full bg-foreground/10" />
          <div className="h-1.5 w-5/6 rounded-full bg-foreground/10" />
          <div className="h-1.5 w-2/3 rounded-full bg-foreground/10" />
        </div>
      </Link>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link href={`/dashboard/docs/editor/${document.id}`} className="block">
              <h3 className="truncate text-sm font-semibold text-foreground group-hover:text-primary">{document.title}</h3>
            </Link>
            <p className="mt-1 text-xs text-muted-foreground">
              {document.workspace} / {document.updated}
            </p>
          </div>
          <button
            onClick={() => onToggleStar(document.id)}
            className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            aria-label={document.starred ? 'Unstar document' : 'Star document'}
          >
            {document.starred ? (
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            ) : (
              <StarOff className="h-4 w-4" />
            )}
          </button>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <AccessBadge access={document.access} />
          {document.aiReady ? (
            <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-1 text-[11px] font-medium text-primary">
              <Sparkles className="h-3 w-3" />
              AI ready
            </span>
          ) : null}
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
          <span>{document.status}</span>
          <span>
            {document.collaborators} people / {document.comments} comments
          </span>
        </div>
      </div>
    </div>
  );
}

function DocumentRow({
  document,
  onToggleStar,
}: {
  document: DocumentRecord;
  onToggleStar: (id: string) => void;
}) {
  const meta = KIND_META[document.kind];
  const Icon = meta.icon;

  return (
    <div className="grid gap-3 border-b border-border px-4 py-3 last:border-b-0 md:grid-cols-[1fr_150px_140px_110px_40px]">
      <Link href={`/dashboard/docs/editor/${document.id}`} className="flex min-w-0 items-center gap-3">
        <div className={cn('flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md', meta.surface)}>
          <Icon className={cn('h-4 w-4', meta.accent)} />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground hover:text-primary">{document.title}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {document.owner} / {document.workspace}
          </p>
        </div>
      </Link>
      <div className="flex items-center">
        <span className="rounded-md bg-muted px-2 py-1 text-[11px] font-medium text-muted-foreground">{document.status}</span>
      </div>
      <div className="flex items-center">
        <AccessBadge access={document.access} />
      </div>
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Clock3 className="h-3.5 w-3.5" />
        <span>{document.updated}</span>
      </div>
      <button
        onClick={() => onToggleStar(document.id)}
        className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        aria-label={document.starred ? 'Unstar document' : 'Star document'}
      >
        {document.starred ? <Star className="h-4 w-4 fill-amber-400 text-amber-400" /> : <StarOff className="h-4 w-4" />}
      </button>
    </div>
  );
}

function ActionCard({
  title,
  icon: Icon,
  detail,
}: {
  title: string;
  icon: ComponentType<{ className?: string }>;
  detail: string;
}) {
  return (
    <button className="rounded-lg border border-border bg-card p-4 text-left shadow-sm transition-colors hover:border-primary/30 hover:bg-primary/5">
      <Icon className="mb-3 h-4 w-4 text-primary" />
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <p className="mt-1 text-xs leading-5 text-muted-foreground">{detail}</p>
    </button>
  );
}

export default function DocsPage() {
  const [documents, setDocuments] = useState(INITIAL_DOCUMENTS);
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | DocKind>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const filteredDocuments = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return documents.filter((document) => {
      const matchesFilter = activeFilter === 'all' || document.kind === activeFilter;
      const matchesQuery =
        normalized.length === 0 ||
        document.title.toLowerCase().includes(normalized) ||
        document.workspace.toLowerCase().includes(normalized) ||
        document.owner.toLowerCase().includes(normalized);

      return matchesFilter && matchesQuery;
    });
  }, [activeFilter, documents, query]);

  const starredCount = documents.filter((document) => document.starred).length;
  const clientSharedCount = documents.filter((document) => document.access === 'Client link').length;
  const aiReadyCount = documents.filter((document) => document.aiReady).length;

  function toggleStar(id: string) {
    setDocuments((current) =>
      current.map((document) =>
        document.id === id ? { ...document, starred: !document.starred } : document
      )
    );
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 rounded-lg border border-border bg-card p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-3xl">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Docs and knowledge</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Create briefs, brand guidelines, contracts, specs, and reusable knowledge with client sharing and AI context built in.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild size="sm" className="gap-2">
            <Link href="/dashboard/docs/editor/new">
              <Plus className="h-3.5 w-3.5" />
              New document
            </Link>
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Bot className="h-3.5 w-3.5" />
            Ask AI
          </Button>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <StatPanel
          label="Documents"
          value={`${documents.length}`}
          detail="Active workspace docs across briefs, specs, contracts, and knowledge."
          icon={FileText}
          accent="bg-blue-500/10 text-blue-500"
        />
        <StatPanel
          label="AI indexed"
          value={`${aiReadyCount}`}
          detail="Docs ready to support brief assist, summaries, and RAG answers."
          icon={Sparkles}
          accent="bg-violet-500/10 text-violet-500"
        />
        <StatPanel
          label="Client shared"
          value={`${clientSharedCount}`}
          detail="Live external links available for review and approval."
          icon={Share2}
          accent="bg-emerald-500/10 text-emerald-500"
        />
        <StatPanel
          label="Starred"
          value={`${starredCount}`}
          detail="Pinned documents for fast access during production work."
          icon={Star}
          accent="bg-amber-500/10 text-amber-500"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold tracking-tight text-foreground">Start from a workflow template</h2>
              <p className="mt-1 text-xs text-muted-foreground">Structured docs for the creative operations flow.</p>
            </div>
            <Link href="/dashboard/docs/editor/new" className="hidden items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 sm:flex">
              Blank document
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {TEMPLATES.map((template) => (
              <TemplateCard key={template.title} template={template} />
            ))}
          </div>
        </div>

        <aside className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold tracking-tight text-foreground">Knowledge health</h2>
              <p className="mt-1 text-xs text-muted-foreground">Signals for searchable, reusable context.</p>
            </div>
            <Folder className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="space-y-4">
            {[
              { label: 'Brand docs current', value: 91, color: 'bg-emerald-500' },
              { label: 'Briefs with complete context', value: 76, color: 'bg-blue-500' },
              { label: 'Contracts awaiting signature', value: 34, color: 'bg-amber-500' },
            ].map((item) => (
              <div key={item.label}>
                <div className="mb-1.5 flex items-center justify-between text-xs">
                  <span className="font-medium text-foreground">{item.label}</span>
                  <span className="text-muted-foreground">{item.value}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div className={cn('h-full rounded-full', item.color)} style={{ width: `${item.value}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-md border border-border bg-background p-3">
            <div className="flex items-start gap-2">
              <Sparkles className="mt-0.5 h-4 w-4 text-primary" />
              <div>
                <p className="text-xs font-semibold text-foreground">Suggested cleanup</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Add brand version links to 3 recent deliverable briefs before the next analytics rollup.
                </p>
              </div>
            </div>
          </div>
        </aside>
      </section>

      <section className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
        <div className="flex flex-col gap-4 border-b border-border px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-base font-semibold tracking-tight text-foreground">Document library</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              {filteredDocuments.length} {filteredDocuments.length === 1 ? 'document' : 'documents'} matching the current view.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search docs..."
                className="h-9 w-full rounded-md border border-border bg-background pl-8 pr-3 text-sm outline-none transition-shadow focus:ring-2 focus:ring-primary/30 sm:w-64"
              />
            </div>
            <div className="flex items-center gap-1 rounded-md border border-border bg-background p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={cn('flex h-7 w-7 items-center justify-center rounded text-muted-foreground transition-colors hover:text-foreground', viewMode === 'grid' && 'bg-accent text-foreground')}
                aria-label="Grid view"
              >
                <LayoutGrid className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn('flex h-7 w-7 items-center justify-center rounded text-muted-foreground transition-colors hover:text-foreground', viewMode === 'list' && 'bg-accent text-foreground')}
                aria-label="List view"
              >
                <LayoutList className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto border-b border-border px-4 py-3">
          {FILTERS.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setActiveFilter(filter.value)}
              className={cn(
                'inline-flex items-center gap-1.5 whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
                activeFilter === filter.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-background text-muted-foreground hover:bg-accent hover:text-foreground'
              )}
            >
              {filter.label}
            </button>
          ))}
          <span className="ml-auto hidden items-center gap-1.5 text-xs text-muted-foreground md:flex">
            <Filter className="h-3.5 w-3.5" />
            Sort by recently updated
          </span>
        </div>

        {filteredDocuments.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <FileText className="mb-3 h-10 w-10 text-muted-foreground/30" />
            <h3 className="text-sm font-semibold text-foreground">No documents found</h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Try a different search term or clear the current document type filter.
            </p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid gap-3 p-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredDocuments.map((document) => (
              <DocumentCard key={document.id} document={document} onToggleStar={toggleStar} />
            ))}
          </div>
        ) : (
          <div>
            <div className="hidden grid-cols-[1fr_150px_140px_110px_40px] border-b border-border bg-muted/25 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground md:grid">
              <span>Name</span>
              <span>Status</span>
              <span>Access</span>
              <span>Updated</span>
              <span />
            </div>
            {filteredDocuments.map((document) => (
              <DocumentRow key={document.id} document={document} onToggleStar={toggleStar} />
            ))}
          </div>
        )}
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {[
          { title: 'Duplicate as template', icon: Copy, detail: 'Turn any approved brief into a reusable workspace template.' },
          { title: 'Export pack', icon: Download, detail: 'Prepare PDF, Markdown, and client handoff exports from final docs.' },
          { title: 'More actions', icon: MoreHorizontal, detail: 'Move documents, update permissions, or archive old client work.' },
        ].map((item) => (
          <ActionCard key={item.title} title={item.title} icon={item.icon} detail={item.detail} />
        ))}
      </section>
    </div>
  );
}
