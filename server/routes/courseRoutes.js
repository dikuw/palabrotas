import express from 'express';
import { getLessons } from '../controllers/courseController.js';

const router = express.Router();

router.get("/getLessons", getLessons);

export default router;

