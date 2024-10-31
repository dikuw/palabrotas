import mongoose from 'mongoose';

const contentTagSchema = new mongoose.Schema({
  content: {
    type: mongoose.Schema.ObjectId,
    ref: 'Content',
    required: 'You must supply a content reference'
  },
  tag: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tag',
    required: 'You must supply a tag reference'
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: 'You must supply a user reference'
  }
}, { timestamps: true });

// Compound index to ensure a tag can only be added once to a content
contentTagSchema.index({ content: 1, tag: 1 }, { unique: true });

contentTagSchema.statics.getTagsForContent = async function(contentId) {
  return this.aggregate([
    { $match: { content: mongoose.Types.ObjectId.createFromHexString(contentId) }},
    { $lookup: {
      from: 'tags',
      localField: 'tag',
      foreignField: '_id',
      as: 'tagDetails'
    }},
    { $unwind: '$tagDetails' },
    { $project: {
      _id: '$tagDetails._id',
      name: '$tagDetails.name'
    }}
  ]);
};

const ContentTag = mongoose.model('ContentTag', contentTagSchema);

export default ContentTag;