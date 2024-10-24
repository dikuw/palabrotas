import Content from '../models/Content.js';

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