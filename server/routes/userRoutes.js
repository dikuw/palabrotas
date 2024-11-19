import express from 'express';
import passport from 'passport';
import { login } from '../controllers/authController.js';
import { register, checkAlreadyRegistered } from '../controllers/userController.js';
import { updateStreak, getCurrentStreak, getLongestStreak } from '../controllers/userController.js';

const router = express.Router();

router.post('/register', 
  // // start from Hely, maybe want to add this in the future
  // userController.validateRegister,
  // // end from Hely
  checkAlreadyRegistered,
  register,
  passport.authenticate('local'),
  login
);
router.put('/updateStreak/:userId', updateStreak);
router.get('/getCurrentStreak/:userId', getCurrentStreak);
router.get('/getLongestStreak/:userId', getLongestStreak);

export default router;