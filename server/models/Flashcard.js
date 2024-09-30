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
  reviewCount: {
    type: Number,
    default: 0
  },
}, { timestamps: true });

// Compound index to ensure a user can't have duplicate content in their flashcards
flashcardSchema.index({ user: 1, content: 1 }, { unique: true });

const Flashcard = mongoose.model('Flashcard', flashcardSchema);

export default Flashcard;