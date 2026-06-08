'use client';

import Link from 'next/link';
import { Check, ChevronDown, Plus, Wind } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn, getInitials, stringToColor } from '@/lib/utils';
import { useOrgStore } from '@/store/org.store';

export function WorkspaceSwitcher({ compact = false }: { compact?: boolean }) {
  const currentOrg = useOrgStore((state) => state.currentOrg);
  const orgs = useOrgStore((state) => state.orgs);
  const setCurrentOrg = useOrgStore((state) => state.setCurrentOrg);

  const orgInitials = currentOrg ? getInitials(currentOrg.name) : 'CK';
  const orgColor = currentOrg ? stringToColor(currentOrg.id) : '#6B89FF';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            'flex min-w-0 items-center gap-2 rounded-md border border-border bg-background px-2 py-1.5 text-left transition-colors hover:bg-accent',
            compact ? 'w-[190px]' : 'w-[240px]'
          )}
        >
          <div
            className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md text-[10px] font-bold text-white"
            style={{ backgroundColor: orgColor }}
          >
            {currentOrg ? orgInitials : <Wind className="h-3.5 w-3.5" />}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold leading-none text-foreground">
              {currentOrg?.name ?? 'Select workspace'}
            </p>
            {!compact ? (
              <p className="mt-0.5 truncate text-[10px] leading-none text-muted-foreground">
                {currentOrg?.plan ? `${currentOrg.plan} plan` : 'Organization'}
              </p>
            ) : null}
          </div>
          <ChevronDown className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuLabel className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
          Organizations
        </DropdownMenuLabel>
        {orgs.length > 0 ? (
          orgs.map((org) => (
            <DropdownMenuItem
              key={org.id}
              onClick={() => setCurrentOrg(org)}
              className="flex cursor-pointer items-center gap-2.5"
            >
              <div
                className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md text-[10px] font-bold text-white"
                style={{ backgroundColor: stringToColor(org.id) }}
              >
                {getInitials(org.name)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm">{org.name}</p>
                <p className="truncate text-[11px] text-muted-foreground">{org.slug}</p>
              </div>
              {currentOrg?.id === org.id ? <Check className="h-3.5 w-3.5 text-primary" /> : null}
            </DropdownMenuItem>
          ))
        ) : (
          <DropdownMenuItem disabled className="text-sm text-muted-foreground">
            No organizations yet
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/onboarding/create-org" className="flex cursor-pointer items-center gap-2">
            <Plus className="h-3.5 w-3.5" />
            New organization
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
