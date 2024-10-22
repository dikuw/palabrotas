import { create } from 'zustand';

export const useFlashcardStore = create((set, get) => ({
  flashcards: [],
  dueFlashcards: [],
  setFlashcards: (flashcards) => set({ flashcards }),
  addFlashcard: async (newFlashcard) => {
    try {
      const res = await fetch("/api/flashcard/addFlashcard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newFlashcard),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        if (res.status === 201) {
          set((state) => ({ flashcards: [...state.flashcards, data.data] }));
          return { success: true, message: data.message, data: data.data };
        } else if (res.status === 409) {
          // Flashcard already exists, but we don't treat this as an error
          return { success: false, message: data.message };
        }
      } else {
        // For other non-ok statuses, we still return a failure but don't throw
        return { success: false, message: data.message || "An error occurred while adding the flashcard." };
      }
    } catch (error) {
      // This catch will now only handle network errors or JSON parsing errors
      return { success: false, message: "An error occurred while adding the flashcard." };
    }
  },
  getFlashcards: async (userId) => {
    const res = await fetch(`/api/flashcard/getFlashcards/${userId}`);
    const data = await res.json();
    set({ flashcards: data });
    return data;
  },
  getDueFlashcards: async (userId) => {
    const res = await fetch(`/api/flashcard/getDueFlashcards/${userId}`);
    const data = await res.json();
    set({ dueFlashcards: data });
    return data;
  },
  updateFlashcardReview: async (flashcardId, quality) => {
    const res = await fetch(`/api/flashcard/updateFlashcardReview/${flashcardId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ quality }),
    });
    const data = await res.json();
    return data;
  }
}));