import express from 'express';
import { getContents, addContent, updateContent, deleteContent }  from '../controllers/contentController.js';

const router = express.Router();

router.get("/getContents", getContents);
// TODO
//router.get('/getContentById/:id', contentController.getContentById);
router.post("/addContent", addContent);
router.put("/updateContent", updateContent);
router.put("/deleteContent", deleteContent);

export default router;