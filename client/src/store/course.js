import { create } from 'zustand';

export const useCourseStore = create((set, get) => ({
  lessons: [],
  setLessons: (lessons) => set({ lessons }),
  getLessons: async () => {
    try {
      const res = await fetch("/api/course/getLessons");
      const data = await res.json();
      
      if (res.ok && data.success) {
        set({ lessons: data.data });
        return data.data;
      } else {
        console.error("Error fetching lessons:", data.message || "Unknown error");
        return [];
      }
    } catch (error) {
      console.error("Error in getLessons:", error);
      return [];
    }
  }
}));

