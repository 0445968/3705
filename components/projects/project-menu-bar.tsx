'use client';

import type { ElementType } from 'react';
import {
  Activity,
  AlertCircle,
  BarChart3,
  CalendarDays,
  FileText,
  FolderOpen,
  MessageSquareText,
  Settings,
} from 'lucide-react';

import { cn } from '@/lib/utils';

export type ProjectWorkspaceTab =
  | 'overview'
  | 'messages'
  | 'activity'
  | 'timeline'
  | 'analytics'
  | 'files'
  | 'issues'
  | 'settings';

const PROJECT_WORKSPACE_TABS: Array<{
  value: ProjectWorkspaceTab;
  label: string;
  icon: ElementType;
}> = [
  { value: 'overview', label: 'Overview', icon: FolderOpen },
  { value: 'messages', label: 'Messages', icon: MessageSquareText },
  { value: 'activity', label: 'Activity', icon: Activity },
  { value: 'timeline', label: 'Timeline / Calendar', icon: CalendarDays },
  { value: 'analytics', label: 'Report & Analytics', icon: BarChart3 },
  { value: 'files', label: 'Files', icon: FileText },
  { value: 'issues', label: 'Issues', icon: AlertCircle },
  { value: 'settings', label: 'Settings', icon: Settings },
];

export function ProjectMenuBar({
  activeTab,
  onChange,
}: {
  activeTab: ProjectWorkspaceTab;
  onChange: (tab: ProjectWorkspaceTab) => void;
}) {
  return (
    <nav className="h-12 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="flex h-full items-center gap-1 overflow-x-auto px-4 sm:px-6 lg:px-8">
        {PROJECT_WORKSPACE_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.value;

          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => onChange(tab.value)}
              className={cn(
                'relative inline-flex h-12 shrink-0 items-center gap-2 px-2.5 text-xs font-medium text-muted-foreground transition hover:text-foreground sm:px-3 sm:text-sm',
                isActive && 'text-foreground'
              )}
            >
              <Icon
                className={cn(
                  'h-4 w-4',
                  isActive ? 'text-primary' : 'text-muted-foreground'
                )}
              />

              <span>{tab.label}</span>

              {isActive ? (
                <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-primary" />
              ) : null}
            </button>
          );
        })}
      </div>
    </nav>
  );
}