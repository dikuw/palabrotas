import { create } from 'zustand';

export const useUserStore = create((set, get) => ({
  users: [],
  isLoading: false,
  error: null,

  updateStreak: async (userId) => {
    const res = await fetch(`/api/user/updateStreak/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    })
    const data = await res.json();
    return data;
  },

  getCurrentStreak: async (userId) => {
    const res = await fetch(`/api/user/getCurrentStreak/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
    const data = await res.json();
    return data;
  }, 

  getLongestStreak: async (userId) => {
    const res = await fetch(`/api/user/getLongestStreak/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
    const data = await res.json();
    return data;
  }, 

  getUsers: async () => {
    try {
      set({ isLoading: true, error: null });
      const res = await fetch('/api/user/getUsers', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (!res.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await res.json();
      set({ users: data.users, isLoading: false });
      return data.users;
    } catch (error) {
      console.error('Error fetching users:', error);
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
}));