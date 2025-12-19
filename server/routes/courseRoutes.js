import express from 'express';
import { getLessons, getLesson, getLessonContent, getContentAudioFiles, recordProgress, getLessonProgress, getContentProgress } from '../controllers/courseController.js';

const router = express.Router();

router.get("/getLessons", getLessons);
router.get("/getLesson/:lessonId", getLesson);
router.get("/getLessonContent/:lessonId", getLessonContent);
router.get("/getContentAudioFiles/:contentId", getContentAudioFiles);
router.post("/recordProgress/:lessonId/:contentId", recordProgress);
router.get("/getLessonProgress/:lessonId", getLessonProgress);
router.get("/getContentProgress/:lessonId/:contentId", getContentProgress);

export default router;

