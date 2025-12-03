import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: 'Please enter lesson title'
  },
  description: {
    type: String,
    trim: true,
    required: 'Please enter lesson description'
  },
  lessonNumber: {
    type: Number,
    required: 'Please enter lesson number',
    unique: true
  },
  vocabulary: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Content'
  }],
  show: {
    type: Boolean,
    default: true
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: 'You must supply an owner'
  },
  author: {
    type: String,
    trim: true,
    required: 'You must supply an author'
  },
  chatPrompt: {
    type: String,
    trim: true
  },
}, { timestamps: true });

function autopopulate(next) {
  this.populate('owner');
  this.populate('vocabulary');
  next();
};

lessonSchema.pre('find', autopopulate);
lessonSchema.pre('findOne', autopopulate);

const Lesson = mongoose.model('Lesson', lessonSchema);

export default Lesson;

