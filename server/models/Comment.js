import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  content: {
    type: mongoose.Schema.ObjectId,
    ref: 'Content',
    required: 'You must supply a content reference'
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: 'You must supply a user reference'
  },
  text: {
    type: String,
    required: 'You must supply a comment text',
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Optionally, you can add indexes to optimize queries
commentSchema.index({ content: 1, createdAt: -1 });

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;