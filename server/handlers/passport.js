import mongoose from 'mongoose';
import passport from 'passport';
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from '../models/User.js';

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

passport.use(User.createStrategy());

const callbackURL = process.env.NODE_ENV === 'production'
  ? 'https://www.palabrotas.app/api/auth/google/callback'  // Production URL
  : 'http://localhost:5000/api/auth/google/callback';  // Development URL

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: callbackURL,
      proxy: true
    },
    async function(accessToken, refreshToken, profile, done) {
      try {
        // Check if user already exists
        const existingUser = await User.findOne({ email: profile.emails[0].value });
        
        if (existingUser) {
          // If user exists but was created with local strategy, update with Google ID
          if (!existingUser.googleId) {
            existingUser.googleId = profile.id;
            await existingUser.save();
          }
          return done(null, existingUser);
        }

        // If user doesn't exist, create new user
        const user = await User.create({
          email: profile.emails[0].value,
          name: profile.displayName,
          googleId: profile.id,
          // Set a random password since we won't use it
          password: Math.random().toString(36).slice(-8)
        });

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

export default passport;