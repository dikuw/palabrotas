import Chat from "../models/Chat.js";
import Lesson from "../models/Lesson.js";
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const createChat = async (req, res) => {
  try {
    const { userId, title, prompt, lessonId } = req.body;

    // Initialize messages array
    const initialMessages = [];
    let finalPrompt = prompt;

    // If lessonId is provided and no prompt is given, fetch the lesson's chatPrompt
    if (lessonId && !prompt) {
      const lesson = await Lesson.findById(lessonId);
      if (lesson && lesson.chatPrompt) {
        finalPrompt = lesson.chatPrompt;
      }
    }

    // If a prompt is provided (either directly or from lesson), process it and get an AI response
    if (finalPrompt && finalPrompt.trim()) {
      // Format messages for OpenAI API
      const formattedMessages = [
        { role: "system", content: "You are a helpful Spanish tutor." },
        { role: "user", content: finalPrompt }
      ];

      // Get AI response
      const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: formattedMessages,
        max_tokens: 1000,
        temperature: 0.7
      });

      const aiMessage = response.choices[0].message.content;

      // Add both user and assistant messages
      initialMessages.push({ role: "user", content: finalPrompt });
      initialMessages.push({ role: "assistant", content: aiMessage });
    }

    const newChat = await Chat.create({
      userId,
      lessonId: lessonId || undefined,
      title: title || "New Chat",
      messages: initialMessages
    });

    res.status(201).json(newChat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create chat" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { userId, chatId, message } = req.body;

    let chat = await Chat.findOne({ _id: chatId, userId });
    if (!chat) return res.status(404).json({ error: "Chat not found" });

    // Format existing messages for OpenAI API
    const formattedMessages = chat.messages.map(m => ({
      role: m.role,
      content: m.content
    }));

    // Add the new user message
    formattedMessages.push({ role: "user", content: message });

    // Add system message at the beginning
    formattedMessages.unshift({ role: "system", content: "You are a helpful Spanish tutor." });

    // Limit context to last 10 messages (including system message)
    const context = formattedMessages.slice(-11); // Keep system + last 10 messages

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: context,
      max_tokens: 1000,
      temperature: 0.7
    });

    const aiMessage = response.choices[0].message.content;

    // Save both user and assistant messages
    chat.messages.push({ role: "user", content: message });
    chat.messages.push({ role: "assistant", content: aiMessage });
    await chat.save();

    res.json({ reply: aiMessage, chatId: chat._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send message" });
  }
};

export const getChats = async (req, res) => {
  try {
    const { userId } = req.params;
    const chats = await Chat.find({ userId }).sort({ updatedAt: -1 });
    res.json(chats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch chats" });
  }
};

export const getChatsByLesson = async (req, res) => {
  try {
    const { userId, lessonId } = req.params;
    const chats = await Chat.find({ userId, lessonId }).sort({ updatedAt: -1 });
    res.json(chats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch chats by lesson" });
  }
};

export const updateChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { title } = req.body;

    const chat = await Chat.findByIdAndUpdate(
      chatId,
      { title, updatedAt: new Date() },
      { new: true }
    );

    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    res.json(chat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update chat" });
  }
};

export const deleteChat = async (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findByIdAndDelete(chatId);

    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete chat" });
  }
};