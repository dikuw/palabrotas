import express from 'express';
import { getTags, addTag } from '../controllers/tagController.js';

const router = express.Router();

router.get("/getTags", getTags);
router.post("/addTag", addTag);

export default router;  