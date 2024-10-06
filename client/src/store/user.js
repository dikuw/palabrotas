import { create } from 'zustand';

export const useUserStore = create((set, get) => ({
  user: null,
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
}));