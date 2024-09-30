import { create } from 'zustand';

export const useFlashcardStore = create((set, get) => ({
  flashcards: [],
  setFlashcards: (flashcards) => set({ flashcards }),
  addFlashcard: async (newFlashcard) => {
    const res = await fetch("/api/flashcard/addFlashcard", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newFlashcard),
    });
    const data = await res.json();
    set((state) => ({ flashcards: [...state.flashcards, data.data] }));
    return data;
  },
  getFlashcards: async (userId) => {
    const res = await fetch(`/api/flashcard/getFlashcards/${userId}`);
    const data = await res.json();
    set({ flashcards: data });
    return data;
  },
}));