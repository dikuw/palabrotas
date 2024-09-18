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
  version: { 
    type: Number, 
    default: 0 
  },
  show: {
    type: Boolean,
    default: true
  },
}, { timestamps: true });

const Content = mongoose.model('Content', contentSchema);

export default Content;