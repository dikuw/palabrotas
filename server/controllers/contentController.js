import Content from '../models/Content.js';
import Vote from '../models/Vote.js';

export const getContents = async (req, res) => {
  try {
    const contents = await Content.find({});
    if (!contents.length) {
      return res
        .status(404)
        .json({ success: false, error: `No content found` })
    }
    res.status(200).json({ success: true, data: contents });
  } catch(error) {
    console.error("Error in get content:", error.message);
    res.status(500).json({ success: false, message: error });
  }
};

export const getContentsSortedByVoteDesc = async (req, res) => {
  try {
    // Get vote counts for all content
    const voteCounts = await Vote.getVoteCounts();
    // Fetch all content
    const contents = await Content.find({ show: true });

    // Combine content with vote counts and sort
    const contentWithVotes = contents.map(content => {
      const voteCount = voteCounts.find(vc => vc._id.toString() === content._id.toString())?.count || 0;
      return { 
        ...content.toObject(), 
        voteCount,
        _id: content._id.toString()
      };
    }).sort((a, b) => b.voteCount - a.voteCount);

    if (!contentWithVotes.length) {
      return res
        .status(404)
        .json({ success: false, error: `No content found` });
    }

    res.status(200).json({ success: true, data: contentWithVotes });
  } catch(error) {
    console.error("Error in get contents sorted by votes:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getContentById = async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getContentsByUserId = async (req, res) => {
  try {
    const contents = await Content.find({ owner: req.params.userId });
    res.status(200).json({ success: true, data: contents });
  } catch(error) {
    console.error("Error in get contents by user id:", error.message);
    res.status(500).json({ success: false, message: error });
  }
};

export const addContent = async (req, res) => {
  const content = req.body;
  const newContent = new Content(content);
  try {
    await newContent.save();
    res.status(201).json({ success: true, data: newContent });
  } catch(error) {
    console.error("Error in add content:", error.message);
    res.status(500).json({ success: false, message: error });
  }
};

export const updateContent = async (req, res) => {
  if (!req.body.id) {
    return res.status(400).json({
      success: false,
      error: 'You must provide an id',
    });
  }

  const content = await Content.findOneAndUpdate({ _id: req.body.id }, req.body, {
    new: true,
    runValidators: true
  }).exec();

  if (!content) {
    return res.status(400).json({ success: false, error: "Content not found" });
  }

  await content.save();
    
  return res.status(201).json({
    success: true,
    id: content._id,
    content: 'Content updated!',
  });
};

export const deleteContent = async (req, res) => {
  if (!req.body.id) {
    return res.status(400).json({
      success: false,
      error: 'You must provide an id',
    });
  }

  try {
    const content = await Content.findOneAndUpdate(
      { _id: req.body.id },
      { show: false },
      {
        new: true,
        runValidators: true
      }
    ).exec();

    if (!content) {
      return res.status(404).json({ success: false, error: "Content not found" });
    }
    
    return res.status(200).json({
      success: true,
      id: content._id,
      message: 'Content soft deleted!',
    });
  } catch (error) {
    console.error("Error in delete content:", error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
};