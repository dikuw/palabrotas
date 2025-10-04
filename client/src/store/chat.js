import { create } from 'zustand';

export const useChatStore = create((set, get) => ({
  chats: [],
  currentChat: null,
  messages: [],
  isLoading: false,
  
  // Setter functions
  setChats: (chats) => set({ chats }),
  setCurrentChat: (chat) => set({ currentChat: chat }),
  setMessages: (messages) => set({ messages }),
  setLoading: (isLoading) => set({ isLoading }),
  
  // Create a new chat
  createChat: async (userId, title = "New Chat") => {
    try {
      set({ isLoading: true });
      const res = await fetch("/api/chat/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify({ userId, title }),
      });
      
      if (!res.ok) {
        throw new Error('Failed to create chat');
      }
      
      const data = await res.json();
      set((state) => ({ 
        chats: [...state.chats, data],
        currentChat: data,
        messages: [],
        isLoading: false
      }));
      return data;
    } catch (error) {
      console.error('Error creating chat:', error);
      set({ isLoading: false });
      throw error;
    }
  },
  
  // Send a message in the current chat
  sendMessage: async (userId, chatId, message) => {
    try {
      set({ isLoading: true });
      
      // Add user message to local state immediately
      const userMessage = { role: 'user', content: message, createdAt: new Date() };
      set((state) => ({ 
        messages: [...state.messages, userMessage]
      }));
      
      const res = await fetch("/api/chat/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify({ userId, chatId, message }),
      });
      
      if (!res.ok) {
        throw new Error('Failed to send message');
      }
      
      const data = await res.json();
      
      // Add assistant response to local state
      const assistantMessage = { 
        role: 'assistant', 
        content: data.reply, 
        createdAt: new Date() 
      };
      
      set((state) => ({ 
        messages: [...state.messages, assistantMessage],
        isLoading: false
      }));
      
      return data;
    } catch (error) {
      console.error('Error sending message:', error);
      set({ isLoading: false });
      
      // Remove the user message if sending failed
      set((state) => ({ 
        messages: state.messages.slice(0, -1)
      }));
      
      throw error;
    }
  },
  
  // Get all chats for a user
  getChats: async (userId) => {
    try {
      set({ isLoading: true });
      const res = await fetch(`/api/chat/chats/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
      });
      
      if (!res.ok) {
        throw new Error('Failed to fetch chats');
      }
      
      const data = await res.json();
      set({ 
        chats: Array.isArray(data) ? data : [],
        isLoading: false
      });
      return data;
    } catch (error) {
      console.error('Error fetching chats:', error);
      set({ 
        chats: [],
        isLoading: false
      });
      throw error;
    }
  },
  
  // Load a specific chat and its messages
  loadChat: (chat) => {
    set({ 
      currentChat: chat,
      messages: chat.messages || []
    });
  },
  
  // Clear current chat
  clearCurrentChat: () => {
    set({ 
      currentChat: null,
      messages: []
    });
  },
  
  // Update chat title
  updateChatTitle: async (chatId, newTitle) => {
    try {
      const res = await fetch(`/api/chat/${chatId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify({ title: newTitle }),
      });
      
      if (!res.ok) {
        throw new Error('Failed to update chat title');
      }
      
      const updatedChat = await res.json();
      
      // Update in chats array
      set((state) => ({
        chats: state.chats.map(chat => 
          chat._id === chatId ? updatedChat : chat
        ),
        currentChat: state.currentChat?._id === chatId ? updatedChat : state.currentChat
      }));
      
      return updatedChat;
    } catch (error) {
      console.error('Error updating chat title:', error);
      throw error;
    }
  },
  
  // Delete a chat
  deleteChat: async (chatId) => {
    try {
      const res = await fetch(`/api/chat/${chatId}`, {
        method: "DELETE",
        credentials: 'include',
      });
      
      if (!res.ok) {
        throw new Error('Failed to delete chat');
      }
      
      // Remove from chats array
      set((state) => ({
        chats: state.chats.filter(chat => chat._id !== chatId),
        currentChat: state.currentChat?._id === chatId ? null : state.currentChat,
        messages: state.currentChat?._id === chatId ? [] : state.messages
      }));
      
      return true;
    } catch (error) {
      console.error('Error deleting chat:', error);
      throw error;
    }
  }
}));
