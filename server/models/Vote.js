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

// Static method to get vote counts for all content
voteSchema.statics.getVoteCounts = async function() {
  return this.aggregate([
    {
      $group: {
        _id: '$content',
        count: {
          $sum: {
            $cond: [
              { $eq: ['$voteType', 'upvote'] },
              1,
              -1
            ]
          }
        }
      }
    }
  ]);
};

const Vote = mongoose.model('Vote', voteSchema);

export default Vote;