import mongoose from 'mongoose';
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

    console.log('recordProgress called:', { lessonId, contentId, isCorrect, user: req.user?._id });

    if (!req.isAuthenticated() || !req.user) {
      console.log('Authentication failed:', { isAuthenticated: req.isAuthenticated(), hasUser: !!req.user });
      return res.status(401).json({ 
        success: false, 
        error: 'User not authenticated' 
      });
    }

    const userId = req.user._id;

    if (typeof isCorrect !== 'boolean') {
      console.log('Invalid isCorrect type:', typeof isCorrect);
      return res.status(400).json({ 
        success: false, 
        error: 'isCorrect must be a boolean' 
      });
    }

    // Verify lesson and content exist
    // Use direct MongoDB query to bypass autopopulate middleware
    const lessonDoc = await mongoose.connection.db.collection('lessons').findOne(
      { _id: new mongoose.Types.ObjectId(lessonId) },
      { projection: { vocabulary: 1 } }
    );
    
    if (!lessonDoc) {
      console.log('Lesson not found:', lessonId);
      return res.status(404).json({ 
        success: false, 
        error: 'Lesson not found' 
      });
    }
    
    const lesson = { vocabulary: lessonDoc.vocabulary };
    
    const content = await Content.findById(contentId);
    if (!content) {
      console.log('Content not found:', contentId);
      return res.status(404).json({ 
        success: false, 
        error: 'Content not found' 
      });
    }

    // Verify content belongs to lesson
    // lesson.vocabulary contains ObjectIds from direct MongoDB query
    const vocabularyIds = (lesson.vocabulary || []).map(id => id.toString());
    const contentIdStr = contentId.toString();
    
    console.log('Checking vocabulary:', { 
      contentId: contentIdStr, 
      vocabularyIds: vocabularyIds,
      vocabularyCount: vocabularyIds.length,
      lessonId 
    });
    
    if (!vocabularyIds.includes(contentIdStr)) {
      console.log('Content does not belong to lesson:', { 
        contentId: contentIdStr, 
        vocabularyIds: vocabularyIds,
        lessonId 
      });
      return res.status(400).json({ 
        success: false, 
        error: 'Content does not belong to this lesson' 
      });
    }
    
    console.log('Content validation passed:', { contentId: contentIdStr, lessonId });

    console.log('Creating progress record:', { userId, lessonId, contentId, isCorrect });

    // Create progress record
    const progress = new LessonProgress({
      user: userId,
      lesson: lessonId,
      content: contentId,
      isCorrect
    });

    await progress.save();
    console.log('Progress record saved:', progress._id);

    // Get updated progress stats
    const progressStats = await LessonProgress.getLessonProgress(userId, lessonId);
    console.log('Progress stats:', progressStats);

    res.status(200).json({ 
      success: true, 
      data: {
        progress: progress,
        stats: progressStats
      }
    });
  } catch (error) {
    console.error("Error in record progress:", error);
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

// Get progress stats for a specific content item
export const getContentProgress = async (req, res) => {
  try {
    const { lessonId, contentId } = req.params;

    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ 
        success: false, 
        error: 'User not authenticated' 
      });
    }

    const userId = req.user._id;

    // Verify lesson exists - use direct MongoDB query to bypass autopopulate middleware
    const lessonDoc = await mongoose.connection.db.collection('lessons').findOne(
      { _id: new mongoose.Types.ObjectId(lessonId) },
      { projection: { vocabulary: 1 } }
    );
    
    if (!lessonDoc) {
      console.log('Lesson not found:', lessonId);
      return res.status(404).json({ 
        success: false, 
        error: 'Lesson not found' 
      });
    }
    
    const lesson = { vocabulary: lessonDoc.vocabulary };

    // Verify content exists
    const content = await Content.findById(contentId);
    if (!content) {
      console.log('Content not found:', contentId);
      return res.status(404).json({ 
        success: false, 
        error: 'Content not found' 
      });
    }

    // Verify content belongs to lesson (log warning but don't block for read operations)
    // lesson.vocabulary contains ObjectIds from direct MongoDB query
    // Convert ObjectIds to strings for comparison
    const vocabularyIds = (lesson.vocabulary || []).map(id => {
      // Handle both ObjectId objects and strings
      if (id && typeof id.toString === 'function') {
        return id.toString();
      }
      return String(id);
    });
    const contentIdStr = contentId.toString();
    
    console.log('getContentProgress - Checking vocabulary:', {
      contentId: contentIdStr,
      vocabularyIds: vocabularyIds,
      vocabularyCount: vocabularyIds.length,
      lessonId,
      vocabularyRaw: lesson.vocabulary?.map(id => id?.toString?.() || String(id))
    });
    
    if (!vocabularyIds.includes(contentIdStr)) {
      console.warn('getContentProgress - Content may not belong to lesson (proceeding anyway):', {
        contentId: contentIdStr,
        vocabularyIds: vocabularyIds,
        lessonId
      });
      // Don't block read operations - just log a warning
      // The progress query will return empty results if content doesn't belong to lesson anyway
    } else {
      console.log('getContentProgress - Content validation passed:', { contentId: contentIdStr, lessonId });
    }

    // Get progress stats for this content
    const progressStats = await LessonProgress.getContentProgress(userId, lessonId, contentId);
    
    console.log('getContentProgress response:', {
      userId: userId?.toString(),
      lessonId,
      contentId,
      progressStats
    });

    res.status(200).json({ 
      success: true, 
      data: progressStats
    });
  } catch (error) {
    console.error("Error in get content progress:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

