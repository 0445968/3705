'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TaskbarItemType =
  | 'project'
  | 'document'
  | 'profile'
  | 'request'
  | 'workspace'
  | 'subject'
  | 'form'
  | 'task'
  | 'team'
  | 'agent'
  | 'chat'
  | 'page';

export type TaskbarItem = {
  id: string;
  type: TaskbarItemType;
  title: string;
  href: string;
  subtitle?: string;
  createdAt: number;
};

type TaskbarState = {
  items: TaskbarItem[];
  activeHref: string | null;
  chatOpen: boolean;

  addOrFocusItem: (item: Omit<TaskbarItem, 'createdAt'>) => void;
  closeItem: (id: string) => void;
  closeItemsByType: (type: TaskbarItemType) => void;
  closeAllItems: () => void;
  setActiveHref: (href: string | null) => void;
  setChatOpen: (open: boolean) => void;
  toggleChat: () => void;
};

const MAX_ITEMS = 24;

export const useTaskbarStore = create<TaskbarState>()(
  persist(
    (set) => ({
      items: [],
      activeHref: null,
      chatOpen: false,

      addOrFocusItem: (item) =>
        set((state) => {
          const existing = state.items.find((current) => current.id === item.id);

          if (existing) {
            return {
              activeHref: item.href,
              items: state.items.map((current) =>
                current.id === item.id
                  ? {
                      ...current,
                      title: item.title,
                      href: item.href,
                      subtitle: item.subtitle,
                      type: item.type,
                    }
                  : current
              ),
            };
          }

          const nextItems = [
            ...state.items,
            {
              ...item,
              createdAt: Date.now(),
            },
          ];

          return {
            activeHref: item.href,
            items: nextItems.slice(Math.max(0, nextItems.length - MAX_ITEMS)),
          };
        }),

      closeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),

      closeItemsByType: (type) =>
        set((state) => ({
          items: state.items.filter((item) => item.type !== type),
        })),

      closeAllItems: () =>
        set({
          items: [],
          activeHref: null,
        }),

      setActiveHref: (href) =>
        set({
          activeHref: href,
        }),

      setChatOpen: (open) =>
        set({
          chatOpen: open,
        }),

      toggleChat: () =>
        set((state) => ({
          chatOpen: !state.chatOpen,
        })),
    }),
    {
      name: 'crafterkite-taskbar',
      partialize: (state) => ({
        items: state.items,
        activeHref: state.activeHref,
        chatOpen: state.chatOpen,
      }),
    }
  )
);