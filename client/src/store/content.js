import { create } from 'zustand';

export const useContentStore = create((set) => ({
  contents: [],
  setContents: (contents) => set({ contents }),
  addContent: async (newContent) => {
    const res = await fetch("/api/content/addContent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newContent),
    })
    const data = await res.json();
    set((state) => ({ contents: [...state.contents, data.data] }));
  },
  getContents: async () => {
    const res = await fetch("/api/content/getContents", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
    const data = await res.json();
    set({ contents: data.data });
  }, 
}));