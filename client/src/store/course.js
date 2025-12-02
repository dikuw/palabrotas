import { create } from 'zustand';

export const useCourseStore = create((set, get) => ({
  lessons: [],
  currentLesson: null,
  lessonContent: [],
  setLessons: (lessons) => set({ lessons }),
  setCurrentLesson: (lesson) => set({ currentLesson: lesson }),
  setLessonContent: (content) => set({ lessonContent: content }),
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
  },
  getLesson: async (lessonId) => {
    try {
      const res = await fetch(`/api/course/getLesson/${lessonId}`);
      const data = await res.json();
      
      if (res.ok && data.success) {
        set({ currentLesson: data.data });
        return data.data;
      } else {
        console.error("Error fetching lesson:", data.message || "Unknown error");
        return null;
      }
    } catch (error) {
      console.error("Error in getLesson:", error);
      return null;
    }
  },
  getLessonContent: async (lessonId) => {
    try {
      const res = await fetch(`/api/course/getLessonContent/${lessonId}`);
      const data = await res.json();
      
      if (res.ok && data.success) {
        set({ lessonContent: data.data });
        return data.data;
      } else {
        console.error("Error fetching lesson content:", data.message || "Unknown error");
        return [];
      }
    } catch (error) {
      console.error("Error in getLessonContent:", error);
      return [];
    }
  }
}));

