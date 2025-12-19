import mongoose from 'mongoose';

const lessonProgressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lesson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
    required: true
  },
  content: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Content',
    required: true
  },
  isCorrect: {
    type: Boolean,
    required: true
  }
}, { timestamps: true });

// Compound index for efficient queries
lessonProgressSchema.index({ user: 1, lesson: 1, createdAt: -1 });
lessonProgressSchema.index({ user: 1, lesson: 1, content: 1, createdAt: -1 });

// Static method to get consecutive correct count for a user in a lesson
lessonProgressSchema.statics.getConsecutiveCorrect = async function(userId, lessonId) {
  // Get all attempts for this user and lesson, ordered by most recent first
  const attempts = await this.find({ 
    user: userId, 
    lesson: lessonId 
  })
  .sort({ createdAt: -1 })
  .limit(100); // Limit to recent attempts for performance
  
  // Count consecutive correct from the most recent attempt
  let consecutiveCount = 0;
  for (const attempt of attempts) {
    if (attempt.isCorrect) {
      consecutiveCount++;
    } else {
      break; // Stop counting when we hit an incorrect answer
    }
  }
  
  return consecutiveCount;
};

// Static method to get consecutive correct count for a specific content item
lessonProgressSchema.statics.getContentConsecutiveCorrect = async function(userId, lessonId, contentId) {
  // Ensure ObjectIds are properly converted
  const userObjId = mongoose.Types.ObjectId.isValid(userId) ? new mongoose.Types.ObjectId(userId) : userId;
  const lessonObjId = mongoose.Types.ObjectId.isValid(lessonId) ? new mongoose.Types.ObjectId(lessonId) : lessonId;
  const contentObjId = mongoose.Types.ObjectId.isValid(contentId) ? new mongoose.Types.ObjectId(contentId) : contentId;
  
  // Get all attempts for this user, lesson, and content, ordered by most recent first
  const attempts = await this.find({ 
    user: userObjId, 
    lesson: lessonObjId,
    content: contentObjId
  })
  .sort({ createdAt: -1 })
  .limit(100); // Limit to recent attempts for performance
  
  console.log('getContentConsecutiveCorrect:', {
    userId: userObjId?.toString(),
    lessonId: lessonObjId?.toString(),
    contentId: contentObjId?.toString(),
    attemptsFound: attempts.length,
    attempts: attempts.map(a => ({ isCorrect: a.isCorrect, createdAt: a.createdAt }))
  });
  
  // Count consecutive correct from the most recent attempt
  let consecutiveCount = 0;
  for (const attempt of attempts) {
    if (attempt.isCorrect) {
      consecutiveCount++;
    } else {
      break; // Stop counting when we hit an incorrect answer
    }
  }
  
  console.log('Consecutive correct count:', consecutiveCount);
  return consecutiveCount;
};

// Static method to get progress summary for a lesson
lessonProgressSchema.statics.getLessonProgress = async function(userId, lessonId) {
  const attempts = await this.find({ 
    user: userId, 
    lesson: lessonId 
  })
  .sort({ createdAt: -1 })
  .limit(100);
  
  const consecutiveCorrect = await this.getConsecutiveCorrect(userId, lessonId);
  
  // Calculate total correct and total attempts
  const totalAttempts = attempts.length;
  const totalCorrect = attempts.filter(a => a.isCorrect).length;
  const accuracy = totalAttempts > 0 ? (totalCorrect / totalAttempts) * 100 : 0;
  
  return {
    consecutiveCorrect,
    totalAttempts,
    totalCorrect,
    accuracy: Math.round(accuracy * 10) / 10 // Round to 1 decimal place
  };
};

// Static method to get progress summary for a specific content item
lessonProgressSchema.statics.getContentProgress = async function(userId, lessonId, contentId) {
  // Ensure ObjectIds are properly converted
  const userObjId = mongoose.Types.ObjectId.isValid(userId) ? new mongoose.Types.ObjectId(userId) : userId;
  const lessonObjId = mongoose.Types.ObjectId.isValid(lessonId) ? new mongoose.Types.ObjectId(lessonId) : lessonId;
  const contentObjId = mongoose.Types.ObjectId.isValid(contentId) ? new mongoose.Types.ObjectId(contentId) : contentId;
  
  const attempts = await this.find({ 
    user: userObjId, 
    lesson: lessonObjId,
    content: contentObjId
  })
  .sort({ createdAt: -1 })
  .limit(100);
  
  const consecutiveCorrect = await this.getContentConsecutiveCorrect(userId, lessonId, contentId);
  
  // Calculate total correct and total attempts for this content
  const totalAttempts = attempts.length;
  const totalCorrect = attempts.filter(a => a.isCorrect).length;
  const accuracy = totalAttempts > 0 ? (totalCorrect / totalAttempts) * 100 : 0;
  
  return {
    consecutiveCorrect,
    totalAttempts,
    totalCorrect,
    accuracy: Math.round(accuracy * 10) / 10 // Round to 1 decimal place
  };
};

const LessonProgress = mongoose.model('LessonProgress', lessonProgressSchema);

export default LessonProgress;

