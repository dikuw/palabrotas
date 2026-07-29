import { create } from 'zustand';

export const useContactStore = create(() => ({
  sendContactMessage: async ({ name, email, message }) => {
    const res = await fetch('/api/contact/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, message }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to send message.');
    }
    return data;
  },
}));
