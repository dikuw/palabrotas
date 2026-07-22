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

    // Check if the flashcard already exists for this user and content
    const existingFlashcard = await Flashcard.findOne({ user: userId, content: contentId });

    if (existingFlashcard) {
      // If the flashcard already exists, send a 409 Conflict status
      return res.status(409).json({ 
        message: 'This flashcard already exists in your collection.',
        flashcard: existingFlashcard
      });
    }

    // If the flashcard doesn't exist, create a new one
    const flashcard = new Flashcard({
      user: userId,
      content: contentId
    });
    await flashcard.save();
    res.status(201).json({ 
      message: 'Flashcard added successfully',
      flashcard: flashcard
    });
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
    const result = flashcard.toObject();
    result.previewIntervals = flashcard.previewIntervals();
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDueFlashcards = async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 100 } = req.query;

    const dueFlashcards = await Flashcard.getDueFlashcards(userId, parseInt(limit));
    const withPreviews = dueFlashcards.map((card) => {
      const obj = card.toObject();
      obj.previewIntervals = card.previewIntervals();
      return obj;
    });
    res.json(withPreviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const previewIntervals = async (req, res) => {
  try {
    const { flashcardId } = req.params;
    const flashcard = await Flashcard.findById(flashcardId);

    if (!flashcard) {
      return res.status(404).json({ message: 'Flashcard not found' });
    }

    res.json(flashcard.previewIntervals());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};