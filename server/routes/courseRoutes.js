import express from 'express';
import { getLessons, getLesson, getLessonContent } from '../controllers/courseController.js';

const router = express.Router();

router.get("/getLessons", getLessons);
router.get("/getLesson/:lessonId", getLesson);
router.get("/getLessonContent/:lessonId", getLessonContent);

export default router;

