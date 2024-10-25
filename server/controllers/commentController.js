import Comment from '../models/Comment.js';

export const addComment = async (req, res) => {
  const { contentId, userId, text } = req.body;
  const newComment = new Comment({ content: contentId, owner: userId, text });
  try {
    await newComment.save();
    res.status(201).json({ success: true, data: newComment });
  } catch(error) {
    console.error("Error in add comment:", error.message);
    res.status(500).json({ success: false, message: error });
  }
};

export const getCommentsByContentId = async (req, res) => {
  try {
    const { contentId } = req.params;

    // Find all comments for the given content ID
    const comments = await Comment.find({ content: contentId })
      .populate('owner', 'name')
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};