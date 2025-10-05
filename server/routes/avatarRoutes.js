// routes/imageRoutes.js
import express from "express";
import { generateAvatar, getAvatars } from "../controllers/avatarController.js";

const router = express.Router();

router.post("/generate", generateAvatar);
router.get("/:userId", getAvatars);

export default router;
