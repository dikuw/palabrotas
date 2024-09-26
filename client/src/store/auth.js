import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export const useAuthStore = create(
  // TODO: remove devtools prior to production (start)
  devtools(
  // TODO: remove devtools prior to production (end)
    (set, get) => ({
      authStatus: { isLoggedIn: false, user: null, isLoading: true },
      registerUser: async (newUser) => {
        const res = await fetch("/api/user/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newUser),
        })
        const data = await res.json();
        if (data.authenticated) {
          set({ 
            authStatus: { 
              isLoggedIn: true, 
              user: data.user, 
              isLoading: false 
            } 
          });
          return data;
        } else {
          throw new Error('Authentication failed');
        }
      },
      loginUser: async (credentials) => {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
          credentials: 'include',
        })
        const data = await res.json();
        if (data.authenticated) {
          set({ 
            authStatus: { 
              isLoggedIn: true, 
              user: data.user, 
              isLoading: false 
            } 
          });
          return data;
        } else {
          throw new Error('Authentication failed');
        }
      },
      logoutUser: async () => {
        try {
          const response = await fetch('/api/auth/logout', {
            method: 'POST',
            credentials: 'include',
          });
          if (!response.ok) throw new Error('Failed to logout');
          set({ authStatus: { isLoggedIn: false, user: null, isLoading: false } });
        } catch (error) {
          console.error('Error during logout:', error);
        }
      },
      getCurrentUser: async () => {
        const res = await fetch("/api/auth/getUser", {
          method: "GET",
          credentials: 'include',
        })
        const data = await res.json();
        if (data.user) {
          set({ 
            authStatus: { 
              isLoggedIn: true, 
              user: data.user, 
              isLoading: false 
            } 
          });
          return data;
        } else {
          throw new Error('Authentication failed');
        }
        return data;
      }
    }),
    // TODO: remove devtools prior to production (start)
    { name: "auth-store" }
  )
  // TODO: remove devtools prior to production (end)
);