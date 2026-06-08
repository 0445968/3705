'use client';
import React from 'react';
import { usePathname } from 'next/navigation';
import { DashboardSidebar } from '@/components/layout/sidebar';
import { TopHeader } from '@/components/layout/top-header';
import { PageHeader } from '@/components/layout/page-header';
import { ContextHeader } from '@/components/layout/context-header';
import { AuthGuard } from '@/components/auth/auth-guard';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);
  const isEditor = pathname.includes('/docs/editor');

  // Only show on dashboard sections with page-aware controls.
  const allowedSections = [
    'tasks',
    'requests',
    'docs',
    'brands',
    'workspaces',
    'team',
    'chat',
    'agents',
    'settings',
  ];
  const mainSection = segments.find(seg => allowedSections.includes(seg));

  const showContextHeader = 
    !isEditor && 
    !!mainSection;

  return (
    <AuthGuard>
      <div className="flex h-screen flex-col bg-background">
        <TopHeader />

        <div className="flex flex-1 overflow-hidden">
          <DashboardSidebar />

          <div className="flex flex-1 flex-col overflow-hidden">
            {!isEditor && <PageHeader />}

            {/* Context Header - Only on allowed pages */}
            {showContextHeader && <ContextHeader />}

            <main className="flex-1 overflow-y-auto">
              {isEditor ? (
                children
              ) : (
                <div className="mx-auto max-w-7xl px-6 py-8">
                  {children}
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
