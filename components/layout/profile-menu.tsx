'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  User,
  LogOut,
  Settings,
  CreditCard,
  LifeBuoy,
  Check,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthStore } from '@/store/auth.store';
import { useLogout } from '@/hooks/use-auth';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const STATUS_OPTIONS = [
  { label: 'Online', color: 'bg-emerald-500', value: 'online' },
  { label: 'Away', color: 'bg-amber-500', value: 'away' },
  { label: 'Busy', color: 'bg-rose-500', value: 'busy' },
  { label: 'Invisible', color: 'bg-slate-400', value: 'invisible' },
];

export function ProfileMenu() {
  const user = useAuthStore((s) => s.user);
  const { mutate: logout } = useLogout();
  const [currentStatus, setCurrentStatus] = useState('online');

  const fullName = user ? `${user.firstName} ${user.lastName}` : 'Guest User';
  const email = user?.email || '';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="group relative flex items-center justify-center h-8 w-8 rounded-full transition-all focus:outline-none">
          <Avatar className="h-7 w-7 ring-2 ring-white/20 transition-all group-hover:ring-white/40">
            {user?.avatarUrl && <AvatarImage src={user.avatarUrl} />}
            <AvatarFallback className="bg-white/10 text-white">
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          {/* Small status dot on the trigger avatar */}
          <span className={cn(
            "absolute bottom-0 right-0 h-2 w-2 rounded-full border border-[#390099]",
            STATUS_OPTIONS.find(s => s.value === currentStatus)?.color
          )} />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64 p-2 shadow-xl">
        {/* User Info Header */}
        <div className="flex items-center gap-3 px-2 py-3">
          <Avatar className="h-10 w-10 border border-border">
            {user?.avatarUrl && <AvatarImage src={user.avatarUrl} />}
            <AvatarFallback className="bg-muted text-sm uppercase">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold truncate text-foreground">{fullName}</span>
            <span className="text-[11px] text-muted-foreground truncate">{email}</span>
          </div>
        </div>

        <DropdownMenuSeparator />

        {/* Status Section */}
        <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-2 py-1.5">
          Set Status
        </DropdownMenuLabel>
        <div className="space-y-0.5">
          {STATUS_OPTIONS.map((status) => (
            <DropdownMenuItem 
              key={status.value} 
              className="flex items-center justify-between cursor-pointer py-2"
              onClick={() => setCurrentStatus(status.value)}
            >
              <div className="flex items-center gap-2.5">
                <div className={cn("h-2 w-2 rounded-full", status.color)} />
                <span className="text-xs">{status.label}</span>
              </div>
              {currentStatus === status.value && (
                <Check className="h-3 w-3 text-primary" />
              )}
            </DropdownMenuItem>
          ))}
        </div>

        <DropdownMenuSeparator />

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-2 gap-1 p-1">
          <DropdownMenuItem className="flex flex-col items-center justify-center py-3 gap-1 cursor-pointer">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-[10px]">Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex flex-col items-center justify-center py-3 gap-1 cursor-pointer">
            <Settings className="h-4 w-4 text-muted-foreground" />
            <span className="text-[10px]">Settings</span>
          </DropdownMenuItem>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="cursor-pointer py-2">
          <CreditCard className="h-4 w-4 mr-2.5 text-muted-foreground" />
          <span className="text-xs">Billing</span>
        </DropdownMenuItem>

        <DropdownMenuItem className="cursor-pointer py-2">
          <LifeBuoy className="h-4 w-4 mr-2.5 text-muted-foreground" />
          <span className="text-xs">Support</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem 
          onClick={() => logout()}
          className="cursor-pointer py-2 text-destructive focus:bg-destructive/10 focus:text-destructive"
        >
          <LogOut className="h-4 w-4 mr-2.5" />
          <span className="text-xs font-medium">Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}