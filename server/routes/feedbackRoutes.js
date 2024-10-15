import express from 'express';
import { addFeedback } from '../controllers/feedbackController.js';

const router = express.Router();

router.post("/addFeedback", addFeedback);

export default router;