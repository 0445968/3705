'use client';

import { useEffect, useState } from 'react';

import { supabase } from '@/lib/supabase/client';

export type Notification = {
  id: string;
  org_id: string;

  user_id: string;

  type: string;

  title?: string | null;
  message?: string | null;

  entity_type?: string | null;
  entity_id?: string | null;

  read: boolean;

  created_at: string;
};

export function useNotifications(userId?: string) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const [loading, setLoading] = useState(true);

  async function loadNotifications() {
    if (!userId) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', {
          ascending: false,
        });

      if (error) throw error;

      setNotifications(data ?? []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function markAsRead(id: string) {
    await supabase.from('notifications').update({ read: true }).eq('id', id);

    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  }

  useEffect(() => {
    loadNotifications();
  }, [userId]);

  // realtime
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel(`notifications:${userId}`)

      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const notification = payload.new as Notification;

          setNotifications((prev) => [notification, ...prev]);
        }
      )

      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  return {
    notifications,
    loading,

    unreadCount: notifications.filter((n) => !n.read).length,

    refreshNotifications: loadNotifications,

    markAsRead,
  };
}
