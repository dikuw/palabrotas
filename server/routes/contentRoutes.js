import express from 'express';
import { getContents, addContent, updateContent }  from '../controllers/contentController.js';

const router = express.Router();

router.get("/getContents", getContents);
// TODO
//router.get('/getContentById/:id', contentController.getContentById);
router.post("/addContent", addContent);
router.put("/updateContent", updateContent);

export default router;