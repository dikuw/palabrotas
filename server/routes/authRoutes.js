import express from 'express';
import passport from "../handlers/passport.js";
import { passportLocal, login, logout, getCurrentUser, authStatus} from '../controllers/authController.js';

const router = express.Router();

router.get('/getUser', getCurrentUser);
router.get('/authStatus', authStatus);
router.post('/login', passportLocal, login);
// Initiate Google authentication
router.get('/google', passport.authenticate("google", { scope: ["profile", "email"] }));
// Google callback URL
router.get('/google/callback', passport.authenticate("google", { failureRedirect: "/login" }), (req, res) => {
    res.redirect("/");
  }
);
// router.post('/auth/facebook', authController.passportFB, authController.login);
// router.get('/auth/facebook/callback', authController.login);
// router.post('/auth/instagram', authController.passportIG, authController.login);
// router.get('/auth/instagram/callback', authController.login);
// router.post('/auth/twitter', authController.passportTW, authController.login);
// router.get('/auth/twitter/callback', authController.login);
router.post('/logout', logout);
// router.post('/forgot', authController.forgot);

export default router;