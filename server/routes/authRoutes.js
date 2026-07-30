import express from 'express';
import {
  passportLocal,
  login,
  logout,
  getCurrentUser,
  authStatus,
  passportGoogle,
  googleCallback,
  forgotPassword,
  resetPassword,
} from '../controllers/authController.js';

const router = express.Router();

router.get('/getUser', getCurrentUser);
router.get('/authStatus', authStatus);
router.post('/login', passportLocal, login);
router.get('/google', passportGoogle);
router.get('/google/callback', googleCallback);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;
