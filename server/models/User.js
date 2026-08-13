import mongoose from "mongoose";
// mongoose.Promise = global.Promise;
// const validator = require('validator');
// const mongodbErrorHandler = require('mongoose-mongodb-errors');
import passportLocalMongoose from 'passport-local-mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    // validate: [validator.isEmail, 'Please enter a valid email'],
    required: 'Please enter an email address'
  },
  name: {
    type: String,
    required: 'Please enter a name',
    trim: true
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  emailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  isAdmin: {
    type: Boolean,
    default: false
  },
  appIntro: {
    type: Boolean,
    default: false
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true
  },
  status: {
    type: String,
    enum: ['active', 'deleted'],
    default: 'active'
  },
  deletedAt: Date,
  stripeCustomerId: String,
  stripeSubscriptionId: String,
  subscriptionStatus: {
    type: String,
    enum: ['none', 'active', 'past_due', 'canceled', 'incomplete'],
    default: 'none'
  },
  lastLogin: Date,
  loginCount: {
    type: Number,
    default: 0
  },
  loginHistory: [{
    timestamp: Date,
    method: {
      type: String,
      enum: ['local', 'google']
    }
  }]
}, { timestamps: true });

userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });
// userSchema.plugin(mongodbErrorHandler);

const User = mongoose.model('User', userSchema);

export default User;