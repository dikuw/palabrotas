import Feedback from '../models/Feedback.js';

export const addFeedback = async (req, res) => {
  const feedback = req.body;
  const newFeedback = new Feedback(feedback);
  try {
    await newFeedback.save();
    res.status(201).json({ success: true, data: newFeedback });
  } catch(error) {
    console.error("Error in add feedback:", error.message);
    res.status(500).json({ success: false, message: error });
  }
};
