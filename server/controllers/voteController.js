import Vote from '../models/Vote.js';

export const addVote = async (req, res) => {
  const { contentId, userId, voteType } = req.body;
  
  try {
    // Find the most recent vote by this user on this content
    const existingVote = await Vote.findOne(
      { content: contentId, user: userId },
      {},
      { sort: { 'createdAt': -1 } }
    );

    // Check if the most recent vote is the same type
    if (existingVote && existingVote.voteType === voteType) {
      return res.status(400).json({ 
        success: false, 
        message: `You already ${voteType === 'upvote' ? 'upvoted' : 'downvoted'} this content.`
      });
    }

    // Create and save the new vote
    const newVote = new Vote({ content: contentId, user: userId, voteType });
    await newVote.save();
    res.status(201).json({ success: true, data: newVote });

  } catch (error) {
    console.error("Error in add vote:", error.message);
    res.status(500).json({ success: false, message: "Server error. Please try again later." });
  }
};

export const getVotesByContentId = async (req, res) => {
  try {
    const { contentId } = req.params;

    // Find all votes for the given content ID
    const votes = await Vote.find({ content: contentId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    res.json(votes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};