import mongoose from "mongoose";

const tagSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: 'Please enter tag name'
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
}, { timestamps: true });

function autopopulate(next) {
  this.populate('owner');
  next();
};

tagSchema.pre('find', autopopulate);
tagSchema.pre('findOne', autopopulate);

const Tag = mongoose.model('Tag', tagSchema);

export default Tag;