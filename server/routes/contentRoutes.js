import express from 'express';
import { getContents, getContentsByUserId, getContentById,addContent, updateContent, deleteContent }  from '../controllers/contentController.js';

const router = express.Router();

router.get("/getContents", getContents);
router.get("/getContentById/:id", getContentById);
router.get("/getContents/:userId", getContentsByUserId);
router.post("/addContent", addContent);
router.put("/updateContent", updateContent);
router.put("/deleteContent", deleteContent);

export default router;