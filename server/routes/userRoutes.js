import express from 'express';
import passport from 'passport';
import { login, logout, passportLocal, authStatus} from '../controllers/authController.js';
import { addUser, register } from '../controllers/userController.js';

const router = express.Router();

router.post("/addUser", addUser);

//  ** User Routes **  //
// router.get('/getUser', userController.getCurrentUser);
router.get('/authStatus', authStatus);
router.post('/register', 
  // // start from Hely, maybe want to add this in the future
  // userController.validateRegister,
  // userController.checkAlreadyRegistered,
  // // end from Hely
  register,
  passport.authenticate('local'),
  login
);
router.post('/login', passport.authenticate('local'), login);
// router.post('/auth/facebook', authController.passportFB, authController.login);
// router.get('/auth/facebook/callback', authController.login);
// router.post('/auth/instagram', authController.passportIG, authController.login);
// router.get('/auth/instagram/callback', authController.login);
// router.post('/auth/twitter', authController.passportTW, authController.login);
// router.get('/auth/twitter/callback', authController.login);
router.post('/logout', logout);
// router.post('/forgot', authController.forgot);

export default router;