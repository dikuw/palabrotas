import Lesson from '../models/Lesson.js';
import Content from '../models/Content.js';

export const getLessons = async (req, res) => {
  try {
    const lessons = await Lesson.find({ show: true })
      .sort({ lessonNumber: 1 });
    
    if (!lessons.length) {
      return res.status(404).json({ 
        success: false, 
        error: 'No lessons found' 
      });
    }
    
    res.status(200).json({ success: true, data: lessons });
  } catch (error) {
    console.error("Error in get lessons:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const lesson = await Lesson.findById(lessonId);
    
    if (!lesson) {
      return res.status(404).json({ 
        success: false, 
        error: 'Lesson not found' 
      });
    }
    
    res.status(200).json({ success: true, data: lesson });
  } catch (error) {
    console.error("Error in get lesson:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getLessonContent = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const lesson = await Lesson.findById(lessonId);
    
    if (!lesson) {
      return res.status(404).json({ 
        success: false, 
        error: 'Lesson not found' 
      });
    }
    
    // Get vocabulary content items
    const vocabulary = await Content.find({ 
      _id: { $in: lesson.vocabulary },
      show: true 
    }).sort({ title: 1 });
    
    res.status(200).json({ success: true, data: vocabulary });
  } catch (error) {
    console.error("Error in get lesson content:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

