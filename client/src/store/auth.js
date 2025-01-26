import { create } from 'zustand';

export const useAuthStore = create(
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
          throw new Error(data.message);
        }
      },
      googleLogin: async () => {
        try {
          const res = await fetch("/api/auth/google", {
            method: "GET",
            credentials: 'include',  // Important for handling cookies
          });
          // Note: This won't actually return anything as it redirects to Google
          // The actual auth will happen in the callback
          return res;
        } catch (error) {
          console.error('Error during Google login:', error);
          throw error;
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
          throw new Error(data.message);
        }
      },
      logoutUser: async () => {
        try {
          const data = await fetch('/api/auth/logout', {
            method: 'POST',
            credentials: 'include',
          });
          set({ authStatus: { isLoggedIn: false, user: null, isLoading: false } });
          return data;
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
          set({ 
            authStatus: { 
              isLoggedIn: false, 
              user: null, 
              isLoading: false 
            } 
          });
        }
        return data;
      },
      updateUser: async (user) => {
        const res = await fetch("/api/user/update", {
          method: "POST",
          credentials: 'include',
          body: JSON.stringify(user),
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
          throw new Error('Update failed');
        }
        return data;
      },
      checkAuthStatus: async () => {
        try {
          const res = await fetch("/api/auth/authStatus", {
            credentials: 'include',
          });
          const data = await res.json();
          if (data.isAuthenticated) {
            set({ 
              authStatus: { 
                isLoggedIn: true, 
                user: data.user, 
                isLoading: false 
              } 
            });
          }
          return data;
        } catch (error) {
          console.error('Error checking auth status:', error);
          throw error;
        }
      },
    }),
);