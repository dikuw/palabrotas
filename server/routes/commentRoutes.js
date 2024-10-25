import express from 'express';
import { getCommentsByContentId, addComment }  from '../controllers/commentController.js';

const router = express.Router();

router.get("/getCommentsByContentId/:contentId", getCommentsByContentId);
router.post("/addComment", addComment);

export default router;