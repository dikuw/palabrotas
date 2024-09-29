import { create } from 'zustand';

export const useUserStore = create(
    (set, get) => ({
      users: [],
      setUsers: (users) => set({ users }),
    }),
);