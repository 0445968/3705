import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';

export function useNotifications(userId?: string | null) {
  return useQuery({
    queryKey: ['notifications', userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId!)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data;
    },
  });
}

export function useUnreadNotificationCount(userId?: string | null) {
  return useQuery({
    queryKey: ['notifications', userId, 'unread-count'],
    enabled: Boolean(userId),
    queryFn: async () => {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', {
          count: 'exact',
          head: true,
        })
        .eq('user_id', userId!)
        .eq('read', false);

      if (error) throw error;

      return count ?? 0;
    },
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      notificationId,
      userId,
    }: {
      notificationId: string;
      userId: string;
    }) => {
      const { data, error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;

      return data;
    },
    onSuccess: (notification) => {
      queryClient.invalidateQueries({
        queryKey: ['notifications', notification.user_id],
      });

      queryClient.invalidateQueries({
        queryKey: ['notifications', notification.user_id, 'unread-count'],
      });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', userId)
        .eq('read', false);

      if (error) throw error;

      return userId;
    },
    onSuccess: (userId) => {
      queryClient.invalidateQueries({
        queryKey: ['notifications', userId],
      });

      queryClient.invalidateQueries({
        queryKey: ['notifications', userId, 'unread-count'],
      });
    },
  });
}
