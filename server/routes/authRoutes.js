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
  verifyEmail,
  resendVerificationEmail,
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
router.post('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerificationEmail);

export default router;
