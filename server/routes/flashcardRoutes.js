import express from 'express';
import { getFlashcards, addFlashcard, updateFlashcardReview, getDueFlashcards, previewIntervals }  from '../controllers/flashcardController.js';

const router = express.Router();

router.get("/getFlashcards/:userId", getFlashcards);
router.post("/addFlashcard", addFlashcard);
router.put('/updateFlashcardReview/:flashcardId', updateFlashcardReview);
router.get('/getDueFlashcards/:userId', getDueFlashcards);
router.get('/previewIntervals/:flashcardId', previewIntervals);
// TODO 
// router.put("/deleteFlashcard", deleteFlashcard);

export default router;