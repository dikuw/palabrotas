import express from 'express';
import { getTags, addTag, addTagToContent } from '../controllers/tagController.js';

const router = express.Router();

router.get("/getTags", getTags);
router.post("/addTag", addTag);
router.post("/addTagToContent", addTagToContent);
export default router;  