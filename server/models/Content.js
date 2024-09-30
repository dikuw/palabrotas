import mongoose from "mongoose";

const contentSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: 'Please enter content title'
  },
  description: {
    type: String,
    trim: true,
    required: 'Please enter content description'
  },
  hint1: {
    type: String,
    trim: true,
    required: false
  },
  hint2: {
    type: String,
    trim: true,
    required: false
  },
  hint3: {
    type: String,
    trim: true,
    required: false
  },
  exampleSentence: {
    type: String,
    trim: true,
    required: false
  },
  version: { 
    type: Number, 
    default: 0 
  },
  show: {
    type: Boolean,
    default: true
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: 'You must supply an owner'
  },
  country: {
    type: String,
    enum: ['Colombia', 'Mexico', 'Chile'],
    required: 'You must supply a country',
    default: 'Colombia'
  },
}, { timestamps: true });

function autopopulate(next) {
  this.populate('owner');
  next();
};

contentSchema.pre('find', autopopulate);
contentSchema.pre('findOne', autopopulate);

const Content = mongoose.model('Content', contentSchema);

export default Content;