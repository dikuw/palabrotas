import { create } from 'zustand';

export const useAvatarStore = create((set, get) => ({
  // State
  avatars: [],
  isLoading: false,
  isGenerating: false,
  error: null,

  // Actions
  getAvatars: async (userId) => {
    try {
      set({ isLoading: true, error: null });
      
      const res = await fetch(`/api/avatar/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (!res.ok) {
        throw new Error('Failed to fetch avatars');
      }

      const avatars = await res.json();
      set({ avatars, isLoading: false });
      return avatars;
    } catch (error) {
      console.error('Error fetching avatars:', error);
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  generateAvatar: async (userId, description) => {
    try {
      set({ isGenerating: true, error: null });

      const res = await fetch('/api/avatar/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ userId, description })
      });

      if (!res.ok) {
        throw new Error('Failed to generate avatar');
      }

      const newAvatar = await res.json();
      
      // Add the new avatar to the beginning of the list
      set(state => ({
        avatars: [newAvatar, ...state.avatars],
        isGenerating: false
      }));
      
      return newAvatar;
    } catch (error) {
      console.error('Error generating avatar:', error);
      set({ error: error.message, isGenerating: false });
      throw error;
    }
  },

  // Utility functions
  clearError: () => set({ error: null }),
  
  clearAvatars: () => set({ avatars: [] }),

  // Get avatar by ID
  getAvatarById: (avatarId) => {
    const { avatars } = get();
    return avatars.find(avatar => avatar._id === avatarId);
  },

  // Get latest avatar for a user
  getLatestAvatar: () => {
    const { avatars } = get();
    return avatars.length > 0 ? avatars[0] : null;
  }
}));
