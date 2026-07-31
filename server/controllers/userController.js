import User from '../models/User.js';
import Content from '../models/Content.js';
import Streak from '../models/Streak.js';
import { issueEmailVerification } from '../handlers/emailVerification.js';
import { cancelActiveSubscription } from '../handlers/stripe.js';
import { invalidateUserSessions } from '../handlers/sessions.js';

export const validateRegister = async (req, res, next) => {
  req.sanitizeBody('name');
  req.checkBody('name', 'Please enter a name').notEmpty();
  req.checkBody('email', 'Please enter a valid email').isEmail();
  req.sanitizeBody('email').normalizeEmail({
    remove_dots: false,
    remove_extension: false,
    gmail_remove_subaddress: false
  });
  req.checkBody('password', 'Password cannot be blank').notEmpty();
  req.checkBody('confirmPassword', 'Confirmed password cannot be blank').notEmpty();
  req.checkBody('confirmPassword', 'Passwords do not match').equals(req.body.password);

  const errors = req.validationErrors();
  if (errors) {
    res.json( { errors });
    return;
  }
  next();
};

export const register = async (req, res, next) => {
  try {
    const user = new User({ 
      email: req.body.email, 
      name: req.body.name,
      emailVerified: false,
    });
    await User.register(user, req.body.password);

    try {
      await issueEmailVerification(user);
    } catch (mailError) {
      // Don't block signup if verification email fails
      console.error('Verification email failed after register:', mailError.message);
    }

    next();
  } catch (error) {
    if (error.name === 'UserExistsError') {
      return res.status(400).json({ 
        success: false, 
        message: 'That email is already registered!' 
      });
    }
    console.error('Error in register:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred during registration' 
    });
  }
};

export const findOrCreate = async (req, res, next) => {
  const registered = await User.find({ email: req.body.email });
  if (registered[0] && registered[0]._id) {
    next();
  } else {
    await new User({ 
      email: req.body.email, 
      name: req.body.name,
    }).save();
    next();
  }
};

export const updateAccount = async (req, res) => {
  let updates = {
    name: req.body.name,
    email: req.body.email,
    userType: req.body.userType,
    timezone: req.body.timezone,
    SSID: req.body.SSID,
    password: req.body.password
  };
  if (req.body.photoId) {
    updates = { ...updates, image: req.body.photoId };
  }

  const user = await User.findOneAndUpdate(
    { _id: req.user._id },
    { $set: updates },
    { new: true, runValidators: true, context: 'query' }
  );

  req.flash('success', 'Profile updated');
  res.redirect('back');
};

export const updateStreak = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let streak = await Streak.findOne({ user: userId, endDate: null });

    if (!streak) {
      // If no streak exists, create a new one
      streak = new Streak({
        user: userId,
        startDate: today,
        lastActivityDate: today,
        length: 1
      });
    } else {
      const lastActivityDate = new Date(streak.lastActivityDate);
      lastActivityDate.setHours(0, 0, 0, 0);

      const diffDays = (today - lastActivityDate) / (1000 * 60 * 60 * 24);

      if (diffDays === 0) {
        // Streak already updated today, no action needed
        return res.status(200).json({ streak: streak.length, updated: false });
      } else if (diffDays === 1) {
        // Streak continues
        streak.length += 1;
        streak.lastActivityDate = today;
      } else {
        // Streak broken, close the current streak and start a new one
        streak.endDate = lastActivityDate;
        await streak.save();

        // Create a new streak
        streak = new Streak({
          user: userId,
          startDate: today,
          lastActivityDate: today,
          length: 1
        });
      }
    }
    
    await streak.save();

    res.status(200).json({ streak: streak.length, updated: true });
  } catch (error) {
    console.error('Error updating streak:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getCurrentStreak = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const streak = await Streak.findOne({ user: userId, endDate: null });
    if (!streak) {
      return res.status(200).json({ streak: 0, message: 'No current streak. Start your streak today!' });
    }

    // Check if the streak is still active (last activity was yesterday or today)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastActivityDate = new Date(streak.lastActivityDate);
    lastActivityDate.setHours(0, 0, 0, 0);
    const diffDays = (today - lastActivityDate) / (1000 * 60 * 60 * 24);

    if (diffDays > 1) {
      // If the last activity was more than a day ago, the streak is broken
      streak.endDate = lastActivityDate;
      await streak.save();
      return res.status(200).json({ streak: 0, message: 'Your previous streak has ended. Start a new streak today!' });
    }

    res.status(200).json({ streak: streak.length });
  } catch (error) {
    console.error('Error fetching current streak:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getLongestStreak = async (req, res) => { 
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const longestStreak = await Streak.findOne({ user: userId }).sort('-length').limit(1);
    if (!longestStreak) {
      return res.status(200).json({ streak: 0, message: 'No streaks yet. Start your first streak today!' });
    }

    res.status(200).json({ streak: longestStreak.length });
  } catch (error) {
    console.error('Error fetching longest streak:', error);
    res.status(500).json({ message: 'Internal server error' }); 
  }
};

export const getAppIntro = async (req, res) => {
  const { userId } = req.params;
  const user = await User.findById(userId);
  res.status(200).json({ appIntro: user.appIntro });
};

export const setAppIntro = async (req, res) => {
  const { userId } = req.params;
  const user = await User.findById(userId);
  user.appIntro = true;
  await user.save();
  res.status(200).json({ message: 'App intro set' });
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find({}, 'name email isAdmin createdAt lastLogin');
    res.status(200).json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
};

/**
 * Soft-delete / anonymize the authenticated user's account.
 * Requires body.confirmation === 'DELETE'.
 */
export const deleteAccount = async (req, res) => {
  try {
    if (!req.isAuthenticated?.() || !req.user) {
      return res.status(401).json({
        success: false,
        message: 'You must be logged in to delete your account.',
      });
    }

    if (req.body?.confirmation !== 'DELETE') {
      return res.status(400).json({
        success: false,
        message: 'Please type DELETE to confirm account deletion.',
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    if (user.status === 'deleted') {
      return res.status(400).json({
        success: false,
        message: 'This account has already been deleted.',
      });
    }

    const userId = user._id;

    // 1. Cancel active Stripe subscription first (no-op if not configured)
    await cancelActiveSubscription(user);

    // 2. Anonymize denormalized author on Content owned by this user
    //    (match by owner ObjectId — reliable; author string is updated in the same step)
    await Content.updateMany(
      { owner: userId },
      { $set: { author: 'Deleted User' } }
    );

    // 3. Anonymize the User record (do not hard-delete)
    await User.findByIdAndUpdate(userId, {
      $set: {
        email: `deleted-user-${userId}@deleted.palabrotas.app`,
        name: 'Deleted User',
        emailVerified: false,
        loginHistory: [],
        status: 'deleted',
        deletedAt: new Date(),
      },
      $unset: {
        hash: '',
        salt: '',
        googleId: '',
        resetPasswordToken: '',
        resetPasswordExpires: '',
        emailVerificationToken: '',
        emailVerificationExpires: '',
        stripeCustomerId: '',
        stripeSubscriptionId: '',
      },
    });

    // 4. Invalidate all sessions for this user
    await invalidateUserSessions(userId);

    // 5. Log out the current request session
    await new Promise((resolve) => {
      req.logout((err) => {
        if (err) {
          console.error('Logout after account deletion:', err.message);
        }
        resolve();
      });
    });

    return res.json({
      success: true,
      message: 'Your account has been deleted.',
    });
  } catch (error) {
    console.error('Error deleting account:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to delete account. Please try again later.',
    });
  }
};

