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
  },
  getContentAudioFiles: async (contentId) => {
    try {
      const res = await fetch(`/api/course/getContentAudioFiles/${contentId}`);
      const data = await res.json();
      
      if (res.ok && data.success) {
        return data.data;
      } else {
        console.error("Error fetching audio files:", data.message || "Unknown error");
        return [];
      }
    } catch (error) {
      console.error("Error in getContentAudioFiles:", error);
      return [];
    }
  },
  recordProgress: async (lessonId, contentId, isCorrect) => {
    try {
      console.log('recordProgress called:', { lessonId, contentId, isCorrect });
      const res = await fetch(`/api/course/recordProgress/${lessonId}/${contentId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ isCorrect })
      });
      const data = await res.json();
      
      console.log('recordProgress response:', { status: res.status, ok: res.ok, data });
      
      if (res.ok && data.success) {
        return data.data;
      } else {
        console.error("Error recording progress:", data.error || data.message || "Unknown error");
        throw new Error(data.error || data.message || "Failed to record progress");
      }
    } catch (error) {
      console.error("Error in recordProgress:", error);
      throw error;
    }
  },
  getLessonProgress: async (lessonId) => {
    try {
      const res = await fetch(`/api/course/getLessonProgress/${lessonId}`, {
        credentials: 'include'
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        return data.data;
      } else {
        console.error("Error fetching lesson progress:", data.message || "Unknown error");
        return null;
      }
    } catch (error) {
      console.error("Error in getLessonProgress:", error);
      return null;
    }
  }
}));

