import { create } from 'zustand';

export const useUserStore = create((set) => ({
  users: [],
  setUsers: (users) => set({ users }),

  registerUser: async (newUser) => {
    const res = await fetch("/api/users/addUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    })
    const data = await res.json();
    set((state) => ({ users: [...state.users, data.data] }));
    set({ isLoggedIn: true });
  },

  logoutUser: () => set({ users: [] }),
}));