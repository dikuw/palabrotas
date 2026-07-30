import passport from 'passport';
import crypto from 'crypto';
import mongoose from 'mongoose';
import User from '../models/User.js';
import { sendEmail, getFrontendUrl } from '../handlers/mail.js';
import { rateLimit } from '../handlers/rateLimit.js';

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour
const GENERIC_FORGOT_MESSAGE =
  'If an account exists with that email, a reset link has been sent.';

function hashResetToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

async function invalidateUserSessions(userId) {
  try {
    const sessions = mongoose.connection.collection('sessions');
    await sessions.deleteMany({
      session: new RegExp(String(userId)),
    });
  } catch (error) {
    console.error('Error invalidating sessions after password reset:', error.message);
  }
}

export const getCurrentUser = async (req, res) => {
  if (req.user) {
    res.json({ user: req.user });
  } else {
    res.json({ error: 'No user found' });
  };
};

export const passportLocal = (req, res, next) => {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return res.status(500).json({ 
        success: false, 
        message: 'Authentication error occurred' 
      });
    }
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: info?.message || 'Invalid email or password' 
      });
    }

    req.logIn(user, function(err) {
      if (err) {
        return res.status(500).json({ 
          success: false, 
          message: 'Login error occurred' 
        });
      }
      return next();
    });
  })(req, res, next);
};

export const authStatus = (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      authenticated: true,
      user: {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        isAdmin: req.user.isAdmin || false
      }
    });
  } else {
    res.json({ authenticated: false, user: null });
  }
};

export const passportFB = (req, res, next) => {
  passport.authenticate('facebook'),
  function(req, res){
    // The request will be redirected to Instagram for authentication, so this
    // function will not be called.
  };
  next();
}

export const passportIG = (req, res, next) => {
  passport.authenticate('instagram'),
  function(req, res){
    // The request will be redirected to Instagram for authentication, so this
    // function will not be called.
  };
  next();
}

export const passportTW = (req, res, next) => {
  passport.authenticate('twitter'),
  function(req, res){
    // The request will be redirected to Twitter for authentication, so this
    // function will not be called.
  };
  next();
}

export const login = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    // Update login stats
    user.lastLogin = new Date();
    user.loginCount += 1;
    user.loginHistory.push({
      timestamp: new Date(),
      method: 'local'
    });
    
    await user.save();

    res.json({
      authenticated: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin || false
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Error during login' });
  }
};

export const logout = (req, res) => {
  if (req.user) {
    req.logout((err) => {
      if (err) {
        console.error('Logout error:', err);
        return res.status(500).json({ error: 'Could not log out, please try again' });
      }
      res.json({ msg: 'logged out' });
    });
  } else {
    res.json({ msg: 'no user to log out' });
  }
};

export const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
    return;
  }
  req.flash('error', 'You must be logged in to do that');
  res.redirect('/login');
};

export const isAdmin = (req, res, next) => {
  if (req.user.isAdmin) {
    next();
    return;
  }
  req.flash('error', 'You must be an admin to do that');
  res.redirect('/Devices');
};

export const forgotPassword = async (req, res) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !emailPattern.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.',
      });
    }

    const ip = req.ip || req.socket?.remoteAddress || 'unknown';
    const ipLimit = rateLimit({
      key: `forgot-ip:${ip}`,
      limit: 5,
      windowMs: 15 * 60 * 1000,
    });
    const emailLimit = rateLimit({
      key: `forgot-email:${email}`,
      limit: 3,
      windowMs: 15 * 60 * 1000,
    });

    if (!ipLimit.allowed || !emailLimit.allowed) {
      return res.status(429).json({
        success: false,
        message: 'Too many reset requests. Please try again later.',
      });
    }

    const user = await User.findOne({ email });

    // Always return the same success response (don't leak account existence)
    if (!user) {
      return res.json({ success: true, message: GENERIC_FORGOT_MESSAGE });
    }

    const rawToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = hashResetToken(rawToken);
    user.resetPasswordExpires = new Date(Date.now() + RESET_TOKEN_TTL_MS);
    await user.save();

    const resetURL = `${getFrontendUrl()}/reset-password?token=${rawToken}`;

    await sendEmail({
      to: user.email,
      subject: 'Reset your Palabrotas password',
      textBody: [
        'You requested a password reset for your Palabrotas account.',
        '',
        'Open this link to set a new password (expires in 1 hour):',
        resetURL,
        '',
        'If you did not request this, you can ignore this email.',
      ].join('\n'),
      htmlBody: `
        <p>You requested a password reset for your Palabrotas account.</p>
        <p><a href="${resetURL}">Set a new password</a></p>
        <p>This link expires in 1 hour.</p>
        <p>If you did not request this, you can ignore this email.</p>
      `,
    });

    return res.json({ success: true, message: GENERIC_FORGOT_MESSAGE });
  } catch (error) {
    console.error('Forgot password error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Unable to process password reset request. Please try again later.',
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, password, confirmPassword } = req.body;

    if (!token || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Token, password, and confirm password are required.',
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match.',
      });
    }

    if (String(password).length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long.',
      });
    }

    const hashedToken = hashResetToken(String(token));
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Password reset link is invalid or has expired. Please request a new one.',
      });
    }

    await user.setPassword(password);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    await invalidateUserSessions(user._id);

    try {
      await sendEmail({
        to: user.email,
        subject: 'Your Palabrotas password was changed',
        textBody: [
          'Your Palabrotas account password was just changed.',
          '',
          'If this was you, no further action is needed.',
          'If this was not you, please contact us immediately at michael@dikuw.com.',
        ].join('\n'),
        htmlBody: `
          <p>Your Palabrotas account password was just changed.</p>
          <p>If this was you, no further action is needed.</p>
          <p>If this was not you, please contact us immediately at
            <a href="mailto:michael@dikuw.com">michael@dikuw.com</a>.</p>
        `,
      });
    } catch (mailError) {
      console.error('Password-change confirmation email failed:', mailError.message);
    }

    return res.json({
      success: true,
      message: 'Password updated successfully. You can now log in.',
    });
  } catch (error) {
    console.error('Reset password error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Unable to reset password. Please try again later.',
    });
  }
};

export const passportGoogle = (req, res, next) => {
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
};

export const googleCallback = (req, res, next) => {
  passport.authenticate('google', function(err, user, info) {
    if (err) {
      const frontendURL = process.env.NODE_ENV === 'production'
        ? 'https://www.palabrotas.app'
        : 'http://localhost:3000';
      return res.redirect(`${frontendURL}/login?error=Authentication failed`);
    }
    
    if (!user) {
      const frontendURL = process.env.NODE_ENV === 'production'
        ? 'https://www.palabrotas.app'
        : 'http://localhost:3000';
      return res.redirect(`${frontendURL}/login?error=No user found`);
    }

    req.logIn(user, async function(err) {
      if (err) {
        const frontendURL = process.env.NODE_ENV === 'production'
          ? 'https://www.palabrotas.app'
          : 'http://localhost:3000';
        return res.redirect(`${frontendURL}/login?error=Login failed`);
      }

      // Update login stats
      user.lastLogin = new Date();
      user.loginCount += 1;
      user.loginHistory.push({
        timestamp: new Date(),
        method: 'google'
      });
      
      await user.save();

      const frontendURL = process.env.NODE_ENV === 'production'
        ? 'https://www.palabrotas.app'
        : 'http://localhost:3000';
      return res.redirect(frontendURL);
    });
  })(req, res, next);
};
