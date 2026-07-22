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

// Anki-like SM-2 constants
const MINIMUM_INTERVAL = 1;
const MAXIMUM_INTERVAL = 3650; // 10 years
const MINIMUM_EASE = 1.3;
const HARD_FACTOR = 1.2;
const EASY_BONUS = 1.3;

const QUALITY_MAP = {
  Again: 0,
  Hard: 2,
  Good: 3,
  Easy: 5,
};

/**
 * Pure calculation of the next review state for a given quality rating.
 * Does not mutate the document.
 * Interval is in whole days; 0 means due again today.
 */
flashcardSchema.methods.calculateNextReviewState = function(quality) {
  const numericQuality = QUALITY_MAP[quality] ?? 3;
  const nextReviewCount = this.reviewCount + 1;
  const priorInterval = Math.max(this.interval, 1);

  // SM-2 ease update
  const ease = Math.max(
    MINIMUM_EASE,
    this.ease + (0.1 - (5 - numericQuality) * (0.08 + (5 - numericQuality) * 0.02))
  );

  let interval;

  if (numericQuality === 0) {
    // Again → show again today (relearning)
    interval = 0;
  } else if (this.reviewCount === 0) {
    // First review (leaving new/learning)
    if (numericQuality === 2) interval = 1;       // Hard
    else if (numericQuality === 3) interval = 3;  // Good
    else interval = 4;                             // Easy
  } else if (this.reviewCount === 1) {
    // Second review
    if (numericQuality === 2) interval = 3;       // Hard
    else if (numericQuality === 3) interval = 6;  // Good
    else interval = Math.round(6 * EASY_BONUS);   // Easy (~8)
  } else if (numericQuality === 2) {
    // Mature Hard
    interval = Math.max(MINIMUM_INTERVAL, Math.round(priorInterval * HARD_FACTOR));
  } else if (numericQuality === 3) {
    // Mature Good
    interval = Math.max(MINIMUM_INTERVAL, Math.round(priorInterval * ease));
  } else {
    // Mature Easy
    interval = Math.max(MINIMUM_INTERVAL, Math.round(priorInterval * ease * EASY_BONUS));
  }

  if (interval > 0) {
    interval = Math.min(MAXIMUM_INTERVAL, interval);
  }

  return { interval, ease, reviewCount: nextReviewCount };
};

/** Preview intervals (in days) for each quality button without saving. */
flashcardSchema.methods.previewIntervals = function() {
  return Object.keys(QUALITY_MAP).reduce((acc, quality) => {
    acc[quality] = this.calculateNextReviewState(quality).interval;
    return acc;
  }, {});
};

flashcardSchema.methods.updateReview = function(quality) {
  const now = new Date();
  const { interval, ease, reviewCount } = this.calculateNextReviewState(quality);

  this.reviewCount = reviewCount;
  this.lastReviewed = now;
  this.ease = ease;
  // Keep a usable growth base after "today" (Again); schedule is still immediate
  this.interval = interval === 0 ? 1 : interval;
  this.nextReview = interval === 0
    ? now
    : new Date(now.getTime() + interval * 24 * 60 * 60 * 1000);

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
