import { create } from 'zustand';

export const useAppStore = create((set) => ({
  menuOpen: false,
  setMenuOpen: (menuOpen) => set({ menuOpen }),
}));