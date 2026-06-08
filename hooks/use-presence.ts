'use client';

import { useEffect, useState } from 'react';

import { supabase } from '@/lib/supabase/client';

export type PresenceUser = {
  user_id: string;
  online_at: string;
};

export function usePresence(room: string) {
  const [onlineUsers, setOnlineUsers] = useState<PresenceUser[]>([]);

  useEffect(() => {
    const channel = supabase.channel(room, {
      config: {
        presence: {
          key: crypto.randomUUID(),
        },
      },
    });

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();

        const users: PresenceUser[] = [];

        Object.values(state).forEach((presences: any) => {
          presences.forEach((presence: any) => {
            users.push({
              user_id: presence.user_id,
              online_at: presence.online_at,
            });
          });
        });

        setOnlineUsers(users);
      })

      .subscribe(async (status) => {
        if (status !== 'SUBSCRIBED') return;

        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) return;

        await channel.track({
          user_id: user.id,
          online_at: new Date().toISOString(),
        });
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [room]);

  return {
    onlineUsers,
    onlineCount: onlineUsers.length,
  };
}
