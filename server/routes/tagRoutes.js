import express from 'express';
import { getTags, getTagsForContent, addTag, addTagToContent, removeTagFromContent } from '../controllers/tagController.js';

const router = express.Router();

router.get("/getTags", getTags);
router.get("/getTagsForContent/:contentId", getTagsForContent);
router.post("/addTag", addTag);
router.post("/addTagToContent", addTagToContent);
router.delete("/removeTagFromContent/:contentId/:tagId", removeTagFromContent);
export default router;  