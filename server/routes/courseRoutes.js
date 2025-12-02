import express from 'express';
import { getLessons, getLesson, getLessonContent, getContentAudioFiles } from '../controllers/courseController.js';

const router = express.Router();

router.get("/getLessons", getLessons);
router.get("/getLesson/:lessonId", getLesson);
router.get("/getLessonContent/:lessonId", getLessonContent);
router.get("/getContentAudioFiles/:contentId", getContentAudioFiles);

export default router;

