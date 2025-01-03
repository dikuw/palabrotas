import Tag from '../models/Tag.js';
import ContentTag from '../models/ContentTag.js';

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

export const getTagsForContent = async (req, res) => {
  try {
    const { contentId } = req.params;
    
    if (!contentId) {
      return res.status(400).json({ 
        success: false, 
        message: "Content ID is required" 
      });
    }

    const tags = await ContentTag.getTagsForContent(contentId);
    
    res.status(200).json({ 
      success: true, 
      data: tags 
    });
    
  } catch (error) {
    console.error("Error in getTagsForContent:", error.message);
    res.status(500).json({ 
      success: false, 
      message: "Error retrieving tags" 
    });
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

export const addTagToContent  = async (req, res) => {
  const { contentId, tagId, userId } = req.body;
  const newContentTag = new ContentTag({ content: contentId, tag: tagId, owner: userId });
  try {
    await newContentTag.save();
    res.status(201).json({ success: true, data: newContentTag });
  } catch (error) {
    if (error.code === 11000) { // MongoDB duplicate key error code
      res.status(400).json({ success: false, message: "Tag already added to this content." });
    } else {
      console.error("Error in add tag to content:", error.message);
      res.status(500).json({ success: false, message: "Server error. Please try again later." });
    }
  }
};

export const removeTagFromContent = async (req, res) => {
  try {
    const { contentId, tagId } = req.params;
    
    if (!contentId || !tagId) {
      return res.status(400).json({ 
        success: false, 
        message: "Content ID and Tag ID are required" 
      });
    }

    const result = await ContentTag.findOneAndDelete({ 
      content: contentId, 
      tag: tagId 
    });

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Tag association not found"
      });
    }

    res.status(200).json({ 
      success: true, 
      message: "Tag removed from content successfully" 
    });

  } catch (error) {
    console.error("Error in removeTagFromContent:", error.message);
    res.status(500).json({ 
      success: false, 
      message: "Error removing tag from content" 
    });
  }
};