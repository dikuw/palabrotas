import express from 'express';
import { getVotesByContentId, addVote }  from '../controllers/voteController.js';

const router = express.Router();

router.get("/getVotesByContentId/:contentId", getVotesByContentId);
router.post("/addVote", addVote);

export default router;  