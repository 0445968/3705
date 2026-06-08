'use client';

import { Globe } from 'lucide-react';
import { AppHeader } from '@/components/layout/header/app-header';

export function ClientHeader() {
  return (
    <AppHeader
      leftSlot={
        <span className="hidden items-center gap-1.5 rounded-md border border-white/20 bg-white/10 px-2 py-1 text-[11px] font-semibold text-white/85 xl:flex">
          <Globe className="h-3 w-3" />
          Client portal
        </span>
      }
    />
  );
}
