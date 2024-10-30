import Vote from '../models/Vote.js';

export const addVote = async (req, res) => {
  const { contentId, userId, voteType } = req.body;
  const newVote = new Vote({ content: contentId, user: userId, voteType });
  try {
    await newVote.save();
    res.status(201).json({ success: true, data: newVote });
  } catch (error) {
    if (error.code === 11000) { // MongoDB duplicate key error code
      res.status(400).json({ success: false, message: "Vote already recorded for this user on this content." });
    } else {
      console.error("Error in add vote:", error.message);
      res.status(500).json({ success: false, message: "Server error. Please try again later." });
    }
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