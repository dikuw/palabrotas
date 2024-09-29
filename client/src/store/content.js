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
    return data;
  },
  updateContent: async (updatedContent) => {
    const res = await fetch("/api/content/updateContent", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedContent),
    })
    const data = await res.json();
    set((state) => ({ contents: state.contents.map(content => content._id === data._id ? data : content) }));
    return data;
  },
  deleteContent: async (updatedContent) => {
    const res = await fetch(`/api/content/deleteContent`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedContent),
    });
    const data = await res.json();
    set((state) => ({ contents: state.contents.filter(content => content._id !== updatedContent.id) }));
    return data;
  },
  getContents: async () => {
    const res = await fetch("/api/content/getContents", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
    const data = await res.json();
    const visibleContents = data.data.filter(content => content.show === true);
    set({ contents: visibleContents });
  }, 
}));