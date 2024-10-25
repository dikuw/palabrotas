import Vote from '../models/Vote.js';

export const addVote = async (req, res) => {
  const { contentId, userId, voteType } = req.body;
  console.log(contentId, userId, voteType);
  const newVote = new Vote({ content: contentId, user: userId, voteType });
  try {
    await newVote.save();
    res.status(201).json({ success: true, data: newVote });
  } catch(error) {
    console.error("Error in add vote:", error.message);
    res.status(500).json({ success: false, message: error });
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