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
        console.log(`Found lesson ${lessonId}, using chatPrompt: ${lesson.chatPrompt.substring(0, 100)}...`);
      } else {
        console.log(`Lesson ${lessonId} not found or has no chatPrompt`);
      }
    }

    // If a prompt is provided (either directly or from lesson), have the AI initiate the conversation
    if (finalPrompt && finalPrompt.trim()) {
      // Format messages for OpenAI API - use the prompt as context for the AI to initiate
      const formattedMessages = [
        { role: "system", content: "You are a helpful Spanish tutor." },
        { role: "user", content: `Based on this lesson context: "${finalPrompt}". Please initiate a conversation with the student. Start by greeting them and introducing the topic naturally, as if you're beginning a tutoring session.` }
      ];

      console.log('Calling OpenAI to generate initial message...');
      // Get AI response - this will be the first message the student sees
      const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: formattedMessages,
        max_tokens: 1000,
        temperature: 0.7
      });

      const aiMessage = response.choices[0].message.content;
      console.log(`AI generated initial message: ${aiMessage.substring(0, 100)}...`);

      // Only add the assistant's initiating message (not the user prompt)
      initialMessages.push({ role: "assistant", content: aiMessage });
    } else {
      console.log('No prompt provided, creating empty chat');
    }

    const newChat = await Chat.create({
      userId,
      lessonId: lessonId || undefined,
      title: title || "New Chat",
      messages: initialMessages
    });

    console.log(`Created chat ${newChat._id} with ${initialMessages.length} initial messages`);
    res.status(201).json(newChat);
  } catch (err) {
    console.error('Error creating chat:', err);
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

    // Build system message - include lesson context if this is a lesson chat
    let systemMessage = "You are a helpful Spanish tutor.";
    if (chat.lessonId) {
      const lesson = await Lesson.findById(chat.lessonId);
      if (lesson && lesson.chatPrompt) {
        systemMessage = `You are a helpful Spanish tutor. ${lesson.chatPrompt}`;
      }
    }
    formattedMessages.unshift({ role: "system", content: systemMessage });

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