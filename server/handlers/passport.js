import mongoose from 'mongoose';
import passport from 'passport';

const User = mongoose.model('User');

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

passport.use(User.createStrategy());

export default passport;