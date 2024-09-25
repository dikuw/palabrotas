import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export const useUserStore = create(
  // TODO: remove devtools prior to production (start)
  devtools(
  // TODO: remove devtools prior to production (end)
    (set, get) => ({
      authStatus: { isLoggedIn: false, user: null, isLoading: true },
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
      },
      checkAuthStatus: async () => {
        if (get().authStatus.isLoading) {
          try {
            set({ authStatus: { ...get().authStatus, isLoading: true } });
            const response = await fetch('/api/user/authStatus', {
              method: 'GET',
              credentials: 'include',
            });
            if (!response.ok) throw new Error('Failed to fetch auth status');
            const data = await response.json();
            set({ 
              authStatus: { 
                isLoggedIn: data.authenticated, 
                user: data.user, 
                isLoading: false 
              } 
            });
          } catch (error) {
            console.error('Error checking auth status:', error);
            set({ authStatus: { isLoggedIn: false, user: null, isLoading: false } });
          }
        }
      },
      logout: async () => {
        try {
          const response = await fetch('/api/user/logout', {
            method: 'POST',
            credentials: 'include',
          });
          if (!response.ok) throw new Error('Failed to logout');
          set({ authStatus: { isLoggedIn: false, user: null, isLoading: false } });
        } catch (error) {
          console.error('Error during logout:', error);
        }
      },
    }),
    // TODO: remove devtools prior to production (start)
    { name: "user-store" }
  )
  // TODO: remove devtools prior to production (end)
);