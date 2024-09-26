import express from 'express';
import passport from 'passport';
import { login } from '../controllers/authController.js';
import { addUser, register } from '../controllers/userController.js';

const router = express.Router();

router.post("/addUser", addUser);

//  ** User Routes **  //
router.post('/register', 
  // // start from Hely, maybe want to add this in the future
  // userController.validateRegister,
  // userController.checkAlreadyRegistered,
  // // end from Hely
  register,
  passport.authenticate('local'),
  login
);

export default router;