import { create } from 'zustand';

export const useTagStore = create((set) => ({
  tags: [],
  MAX_TAG_LENGTH: 20,
  getTags: async () => {
    const res = await fetch("/api/tag/getTags", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
    const data = await res.json();
    set({ tags: data.data });
  },
  getTagsForContent: async (contentId) => {
    const res = await fetch(`/api/tag/getTagsForContent/${contentId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
    const data = await res.json();
    set({ tags: data.data });
  },
  addTag: async (newTag) => {
    const res = await fetch("/api/tag/addTag", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTag),
    })
    const data = await res.json();
    set((state) => ({ tags: [...state.tags, data.data] }));
    return data;
  },
  addTagToContent: async (contentId, tagId, userId) => {
    const res = await fetch(`/api/tag/addTagToContent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ contentId, tagId, userId }),
    });
    const data = await res.json();
    return data;
  }
}));