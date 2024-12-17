import mongoose from 'mongoose';
import passport from 'passport';
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from '../models/User.js';

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

passport.use(User.createStrategy());

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Find or create a user in your database
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          user = await User.create({
            googleId: profile.id,
            email: profile.emails[0].value,
            name: profile.displayName,
          });
        }
        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

export default passport;