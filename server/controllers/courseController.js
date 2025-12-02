import Lesson from '../models/Lesson.js';

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

