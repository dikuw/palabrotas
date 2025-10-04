import express from "express";
import { createChat, sendMessage, getChats } from "../controllers/chatController.js";

const router = express.Router();

router.post("/new", createChat);
router.post("/send", sendMessage);
router.get("/chats/:userId", getChats);

export default router;
