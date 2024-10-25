import { create } from 'zustand';

export const useVoteStore = create((set, get) => ({
  votes: [],
  setVotes: (votes) => set({ votes }),
  addVote: async (contentId, userId, voteType) => {
    const res = await fetch("/api/vote/addVote", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ contentId, userId, voteType }),
    })
    const data = await res.json();
    set((state) => ({ votes: [...state.votes, data.data] }));
    return data;
  },
  getVotesByContentId: async (contentId) => {
    try {
      const res = await fetch(`/api/vote/getVotesByContentId/${contentId}`);
      const data = await res.json();
      set({ votes: Array.isArray(data) ? data : [] });
    } catch (error) {
      console.error('Error fetching votes:', error);
      set({ votes: [] });
    }
  }
}));