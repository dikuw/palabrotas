import express from "express";
import { createChat, sendMessage, getChats, getChatsByLesson, updateChat, deleteChat } from "../controllers/chatController.js";

const router = express.Router();

router.post("/new", createChat);
router.post("/send", sendMessage);
router.get("/chats/:userId", getChats);
router.get("/chats/:userId/lesson/:lessonId", getChatsByLesson);
router.put("/:chatId", updateChat);
router.delete("/:chatId", deleteChat);

export default router;
