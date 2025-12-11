import Lesson from '../models/Lesson.js';
import Content from '../models/Content.js';
import AudioFile from '../models/AudioFile.js';
import LessonProgress from '../models/LessonProgress.js';

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

export const getContentAudioFiles = async (req, res) => {
  try {
    const { contentId } = req.params;
    const audioFiles = await AudioFile.find({ content: contentId })
      .sort({ order: 1 });
    
    res.status(200).json({ success: true, data: audioFiles });
  } catch (error) {
    console.error("Error in get content audio files:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Record progress for a content item in a lesson
export const recordProgress = async (req, res) => {
  try {
    const { lessonId, contentId } = req.params;
    const { isCorrect } = req.body;

    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ 
        success: false, 
        error: 'User not authenticated' 
      });
    }

    const userId = req.user._id;

    if (typeof isCorrect !== 'boolean') {
      return res.status(400).json({ 
        success: false, 
        error: 'isCorrect must be a boolean' 
      });
    }

    // Verify lesson and content exist
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({ 
        success: false, 
        error: 'Lesson not found' 
      });
    }

    const content = await Content.findById(contentId);
    if (!content) {
      return res.status(404).json({ 
        success: false, 
        error: 'Content not found' 
      });
    }

    // Verify content belongs to lesson
    if (!lesson.vocabulary.includes(contentId)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Content does not belong to this lesson' 
      });
    }

    // Create progress record
    const progress = new LessonProgress({
      user: userId,
      lesson: lessonId,
      content: contentId,
      isCorrect
    });

    await progress.save();

    // Get updated progress stats
    const progressStats = await LessonProgress.getLessonProgress(userId, lessonId);

    res.status(200).json({ 
      success: true, 
      data: {
        progress: progress,
        stats: progressStats
      }
    });
  } catch (error) {
    console.error("Error in record progress:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get progress stats for a lesson
export const getLessonProgress = async (req, res) => {
  try {
    const { lessonId } = req.params;

    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ 
        success: false, 
        error: 'User not authenticated' 
      });
    }

    const userId = req.user._id;

    // Verify lesson exists
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({ 
        success: false, 
        error: 'Lesson not found' 
      });
    }

    // Get progress stats
    const progressStats = await LessonProgress.getLessonProgress(userId, lessonId);

    res.status(200).json({ 
      success: true, 
      data: progressStats
    });
  } catch (error) {
    console.error("Error in get lesson progress:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

