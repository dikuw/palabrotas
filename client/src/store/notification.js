import { create } from 'zustand';

export const useNotificationStore = create((set) => ({
  notifications: [],
  addNotification: (message, type = 'info', duration = 3000) => set((state) => {
    const id = Math.random().toString(36).slice(2, 11);
    return { notifications: [...state.notifications, { id, message, type, duration }] };
  }),
  removeNotification: (id) => set((state) => ({
    notifications: state.notifications.filter(notification => notification.id !== id)
  })),
}));