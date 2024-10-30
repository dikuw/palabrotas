import Tag from '../models/Tag.js';

export const getTags = async (req, res) => {
  try {
    const tags = await Tag.find({});
    if (!tags.length) {
      return res
        .status(404)
        .json({ success: false, error: `No content found` })
    }
    res.status(200).json({ success: true, data: tags });
  } catch(error) {
    console.error("Error in get tags:", error.message);
    res.status(500).json({ success: false, message: error });
  }
};

export const addTag = async (req, res) => {
  const tag = req.body;
  const newTag = new Tag(tag);
  try {
    await newTag.save();
    res.status(201).json({ success: true, data: newTag });
  } catch(error) {
    console.error("Error in add tag:", error.message);
    res.status(500).json({ success: false, message: error });
  }
};
