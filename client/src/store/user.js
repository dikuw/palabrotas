import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export const useUserStore = create(
  // TODO: remove devtools prior to production (start)
  devtools(
    (set) => ({
  // TODO: remove devtools prior to production (end)
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
      checkAuthStatus: async () => {
        const res = await fetch('/api/user/authStatus', {
          method: 'GET',
          credentials: 'include',
        })
        const data = await res.json();
        console.log('checkAuthStatus data', data);
        return data.authenticated;
      },
      logoutUser: () => set({ users: [] }),
    }),
    // TODO: remove devtools prior to production (start)
    { name: "user-store" }
  )
  // TODO: remove devtools prior to production (end)
);