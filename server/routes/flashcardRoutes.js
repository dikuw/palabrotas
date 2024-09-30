import express from 'express';
import { getFlashcards, addFlashcard }  from '../controllers/flashcardController.js';

const router = express.Router();

router.get("/getFlashcards", getFlashcards);
// TODO
//router.get('/getContentById/:id', contentController.getContentById);
router.post("/addFlashcard", addFlashcard);
// TODO 
// router.put("/updateFlashcard", updateFlashcard);
// router.put("/deleteFlashcard", deleteFlashcard);

export default router;