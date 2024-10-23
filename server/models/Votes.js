import mongoose from "mongoose";

const voteSchema = new mongoose.Schema({
  content: {
    type: mongoose.Schema.ObjectId,
    ref: 'Content',
    required: 'You must supply a content reference'
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: 'You must supply a user reference'
  },
  voteType: {
    type: String,
    enum: ['upvote', 'downvote'],
    required: 'You must specify the vote type'
  },
}, { timestamps: true });

// Compound index to ensure a user can only have one upvote and one downvote per content
voteSchema.index({ content: 1, user: 1, voteType: 1 }, { unique: true });

// Static method to get vote counts for a piece of content
voteSchema.statics.getVoteCounts = async function(contentId) {
  const result = await this.aggregate([
    { $match: { content: mongoose.Types.ObjectId(contentId) } },
    { $group: {
        _id: '$voteType',
        count: { $sum: 1 }
      }
    }
  ]);

  const counts = { upvotes: 0, downvotes: 0 };
  result.forEach(item => {
    counts[item._id + 's'] = item.count;
  });

  return counts;
};

const Vote = mongoose.model('Vote', voteSchema);

export default Vote;