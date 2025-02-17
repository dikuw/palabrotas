import express from 'express';
import passport from 'passport';
import { login, isAdmin } from '../controllers/authController.js';
import { register, getUsers, updateStreak, getCurrentStreak, getLongestStreak, getAppIntro, setAppIntro } from '../controllers/userController.js';

const router = express.Router();

router.post('/register', 
  // // TODO start from Hely, maybe want to add this in the future
  // userController.validateRegister,
  // // end from Hely
  register,
  passport.authenticate('local'),
  login
);
router.get('/getUsers', isAdmin, getUsers);
router.put('/updateStreak/:userId', updateStreak);
router.get('/getCurrentStreak/:userId', getCurrentStreak);
router.get('/getLongestStreak/:userId', getLongestStreak);
router.get('/getAppIntro/:userId', getAppIntro);
router.put('/setAppIntro/:userId', setAppIntro);

export default router;