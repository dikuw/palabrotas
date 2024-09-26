import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export const useUserStore = create(
  // TODO: remove devtools prior to production (start)
  devtools(
  // TODO: remove devtools prior to production (end)
    (set, get) => ({
      users: [],
      setUsers: (users) => set({ users }),
    }),
    // TODO: remove devtools prior to production (start)
    { name: "user-store" }
  )
  // TODO: remove devtools prior to production (end)
);