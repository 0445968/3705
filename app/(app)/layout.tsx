'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

import { DashboardSidebar } from '@/components/layout/sidebar';
import { TopHeader } from '@/components/layout/top-header';
import { PageHeader } from '@/components/layout/page-header';
import { ContextHeader } from '@/components/layout/context-header';
import { AppTaskbar } from '@/components/layout/taskbar';
import { AuthGuard } from '@/components/auth/auth-guard';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  const isEditor = pathname.includes('/docs/editor');

  const isFullBleed =
    pathname === '/dashboard/subjects' ||
    pathname.startsWith('/dashboard/subjects/') ||
    pathname === '/dashboard/profiles/new' ||
    pathname === '/dashboard/forms/new' ||
    pathname.startsWith('/dashboard/forms/new/') ||
    pathname.startsWith('/dashboard/projects/');

  const allowedSections = [
    'tasks',
    'requests',
    'docs',
    'brands',
    'profiles',
    'workspaces',
    'team',
    'chat',
    'agents',
    'settings',
    'projects',
    'subjects',
    'forms',
  ];

  const mainSection = segments.find((seg) => allowedSections.includes(seg));

  const showContextHeader = !isEditor && !!mainSection && !isFullBleed;

  const showPageHeader = !isEditor && !isFullBleed;

  return (
    <AuthGuard>
      <div className="flex h-screen flex-col overflow-hidden bg-background pb-16">
        <TopHeader />
  
        <div className="flex min-h-0 flex-1 overflow-hidden">
          <DashboardSidebar />
  
          <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
            {showPageHeader ? <PageHeader /> : null}
  
            {showContextHeader ? <ContextHeader /> : null}
  
            <main
              className={
                isFullBleed || isEditor
                  ? 'min-h-0 flex-1 overflow-hidden'
                  : 'min-h-0 flex-1 overflow-y-auto'
              }
            >
              {isEditor || isFullBleed ? (
                children
              ) : (
                <div className="mx-auto max-w-7xl px-6 py-8">
                  {children}
                </div>
              )}
            </main>
          </div>
        </div>
  
        <AppTaskbar />
      </div>
    </AuthGuard>
  );
}