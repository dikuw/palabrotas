import mongoose from 'mongoose';

const flashcardSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Content',
    required: true
  },
  lastReviewed: {
    type: Date,
    default: Date.now
  },
  nextReview: {
    type: Date,
    default: Date.now
  },
  interval: {
    type: Number,
    default: 0
  },
  ease: {
    type: Number,
    default: 2.5
  },
  reviewCount: {
    type: Number,
    default: 0
  },
}, { timestamps: true });

// Compound index to ensure a user can't have duplicate content in their flashcards
flashcardSchema.index({ user: 1, content: 1 }, { unique: true });

// Constants for the algorithm
const MINIMUM_INTERVAL = 1;
const MAXIMUM_INTERVAL = 3650; // 10 years
const MINIMUM_EASE = 1.3;

flashcardSchema.methods.updateReview = function(quality) {
  const now = new Date();
  
  // Update review count and last reviewed date
  this.reviewCount += 1;
  this.lastReviewed = now;

  // Map the new quality ratings to numerical values
  const qualityMap = {
    'Again': 0,
    'Hard': 2,
    'Good': 3,
    'Easy': 5
  };

  const numericQuality = qualityMap[quality] || 3; // Default to 'Good' if unknown quality

  // Calculate new ease
  this.ease = Math.max(MINIMUM_EASE, this.ease + (0.1 - (5 - numericQuality) * (0.08 + (5 - numericQuality) * 0.02)));

  // Calculate new interval
  if (this.reviewCount === 1) {
    this.interval = 1;
  } else if (this.reviewCount === 2) {
    this.interval = 6;
  } else {
    this.interval = Math.min(MAXIMUM_INTERVAL, Math.round(this.interval * this.ease));
  }

  // If the quality is 'Again' or 'Hard', reset the interval
  if (numericQuality <= 2) {
    this.interval = MINIMUM_INTERVAL;
  }

  // Set next review date
  this.nextReview = new Date(now.getTime() + this.interval * 24 * 60 * 60 * 1000);

  return this.save();
};

flashcardSchema.statics.getDueFlashcards = function(userId, limit = 100) {
  const now = new Date();
  return this.find({
    user: userId,
    nextReview: { $lte: now }
  })
  .sort({ nextReview: 1 })
  .limit(limit)
  .populate('content');
};

const Flashcard = mongoose.model('Flashcard', flashcardSchema);

export default Flashcard;