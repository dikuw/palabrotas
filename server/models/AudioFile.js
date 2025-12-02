import mongoose from "mongoose";

const audioFileSchema = new mongoose.Schema({
  content: {
    type: mongoose.Schema.ObjectId,
    ref: 'Content',
    required: 'You must supply a content reference'
  },
  audioUrl: {
    type: String,
    required: 'Audio URL is required',
    trim: true
  },
  voice: {
    type: String,
    required: 'Voice name is required',
    trim: true
  },
  gender: {
    type: String,
    enum: ['female', 'male'],
    required: 'Gender is required'
  },
  languageCode: {
    type: String,
    default: 'es-US',
    trim: true
  },
  audioFormat: {
    type: String,
    default: 'mp3',
    trim: true
  },
  order: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

// Index for efficient queries
audioFileSchema.index({ content: 1, order: 1 });

function autopopulate(next) {
  this.populate('content');
  next();
}

audioFileSchema.pre('find', autopopulate);
audioFileSchema.pre('findOne', autopopulate);

const AudioFile = mongoose.model('AudioFile', audioFileSchema);

export default AudioFile;

