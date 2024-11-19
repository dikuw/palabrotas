import User from '../models/User.js';
import Streak from '../models/Streak.js';

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
    });
    await User.register(user, req.body.password);
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
