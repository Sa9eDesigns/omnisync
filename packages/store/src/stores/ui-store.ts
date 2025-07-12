import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Theme } from '@boilerplate/shared';
import { DEFAULT_THEME, DARK_THEME } from '@boilerplate/shared';

interface UIState {
  theme: Theme;
  isDarkMode: boolean;
  sidebarOpen: boolean;
  language: string;
  notifications: Notification[];
}

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
}

interface UIActions {
  setTheme: (theme: Theme) => void;
  toggleDarkMode: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setLanguage: (language: string) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  removeNotification: (id: string) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
}

type UIStore = UIState & UIActions;

export const useUIStore = create<UIStore>()(
  persist(
    (set, get) => ({
      // State
      theme: DEFAULT_THEME,
      isDarkMode: false,
      sidebarOpen: true,
      language: 'en',
      notifications: [],

      // Actions
      setTheme: (theme) => set({ theme }),

      toggleDarkMode: () => {
        const isDarkMode = !get().isDarkMode;
        set({
          isDarkMode,
          theme: isDarkMode ? DARK_THEME : DEFAULT_THEME,
        });
      },

      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),

      toggleSidebar: () => set({ sidebarOpen: !get().sidebarOpen }),

      setLanguage: (language) => set({ language }),

      addNotification: (notification) => {
        const newNotification: Notification = {
          ...notification,
          id: Math.random().toString(36).substr(2, 9),
          timestamp: Date.now(),
          read: false,
        };

        set({
          notifications: [newNotification, ...get().notifications],
        });

        // Auto-remove after 5 seconds for success notifications
        if (notification.type === 'success') {
          setTimeout(() => {
            get().removeNotification(newNotification.id);
          }, 5000);
        }
      },

      removeNotification: (id) =>
        set({
          notifications: get().notifications.filter((n) => n.id !== id),
        }),

      markNotificationRead: (id) =>
        set({
          notifications: get().notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        }),

      clearNotifications: () => set({ notifications: [] }),
    }),
    {
      name: 'ui-store',
      partialize: (state) => ({
        theme: state.theme,
        isDarkMode: state.isDarkMode,
        sidebarOpen: state.sidebarOpen,
        language: state.language,
      }),
    }
  )
);
