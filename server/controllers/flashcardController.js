import Flashcard from '../models/Flashcard.js';

export const getFlashcards = async (req, res) => {
  try {
    const flashcards = await Flashcard.find({ user: req.params.userId })
      .populate('content')
      .sort({ nextReview: 1 });
    res.json(flashcards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addFlashcard = async (req, res) => {
  try {
    const { userId, contentId } = req.body;
    const flashcard = new Flashcard({
      user: userId,
      content: contentId
    });
    await flashcard.save();
    res.status(201).json(flashcard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateFlashcardReview = async (req, res) => {
  try {
    const { flashcardId } = req.params;
    const { quality } = req.body;

    const flashcard = await Flashcard.findById(flashcardId);
    if (!flashcard) {
      return res.status(404).json({ message: 'Flashcard not found' });
    }

    await flashcard.updateReview(quality);
    res.json(flashcard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDueFlashcards = async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 100 } = req.query;

    const dueFlashcards = await Flashcard.getDueFlashcards(userId, parseInt(limit));
    res.json(dueFlashcards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};