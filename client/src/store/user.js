import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export const useUserStore = create(
  // TODO: remove devtools prior to production
  devtools(
    (set) => ({
      users: [],
      setUsers: (users) => set({ users }),
      registerUser: async (newUser) => {
        const res = await fetch("/api/user/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newUser),
        })
        const data = await res.json();
        set((state) => ({ users: [...state.users, data] }));
        return data;
      },
      loginUser: async (user) => {
        const res = await fetch("/api/user/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        })
        const data = await res.json();
        console.log('data', data);
      },
      logoutUser: () => set({ users: [] }),
    }),
    { name: "user-store" }
  )
);