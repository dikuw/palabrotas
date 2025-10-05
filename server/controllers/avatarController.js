// controllers/imageController.js
import OpenAI from "openai";
import Avatar from "../models/Avatar.js";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// POST /api/image/generate
export const generateAvatar = async (req, res) => {
  try {
    const { userId, description } = req.body;
    if (!userId || !description) {
      return res.status(400).json({ error: "userId and description are required" });
    }

    const result = await client.images.generate({
      model: "gpt-image-1",
      prompt: description,
      size: "1024x1024",
      n: 1,
    });

    const base64 = result.data[0].b64_json;
    if (!base64) {
      return res.status(500).json({ error: "No image data returned from OpenAI" });
    }

    // Option A: store as data URL (simpler)
    const imageUrl = `data:image/png;base64,${base64}`;

    // Option B (later): upload to Cloudinary, S3, or similar, and store that URL instead

    const newImage = await Avatar.create({
      userId,
      description,
      imageUrl
    });

    res.status(201).json(newImage);
  } catch (error) {
    console.error("Error generating image:", error);
    res.status(500).json({ error: error.message });
  }
};

// GET /api/image/:userId
export const getAvatars = async (req, res) => {
  try {
    const { userId } = req.params;
    const images = await Avatar.find({ userId }).sort({ createdAt: -1 });
    res.json(images);
  } catch (error) {
    console.error("Error fetching images:", error);
    res.status(500).json({ error: error.message });
  }
};
