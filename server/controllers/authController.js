import passport from 'passport';
import crypto from 'crypto';
import User from '../models/User.js';
// const promisify = require('es6-promisify');
// const mail = require('../handlers/mail');

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
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Incorrect email or password'
    });
  }
  res.json({
    authenticated: true,
    user: {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      isAdmin: req.user.isAdmin || false
    }
  });
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

export const forgot = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    req.flash('error', 'No user associated with that email. Please register a new account.');
    return res.redirect('/register');
  }
  user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
  user.resetPasswordExpires = Date.now() + 3600000;
  await user.save();
  const resetURL = `http://${req.headers.host}/account/reset/${user.resetPasswordToken}`;
  await mail.send({
    user,
    subject: 'Password Reset',
    resetURL,
    filename: 'password-reset'
  })
  req.flash('success', `You have been emailed a password reset link`);
  res.redirect('/');
};

export const reset = async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() }
  });
  if (!user) {
    req.flash('error', 'Password reset is invalid or has expired');
    return res.redirect('/login');
  }
  res.render('reset', { title: 'Reset your Password' });
};

export const confirmPasswords = (req, res, next) => {
  if (req.body.password === req.body['password-confirm']) {
    next();
    return;
  }
  req.flash('error', 'Passwords do not match');
  res.redirect('back');
};

export const updateUser = async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() }
  });
  if (!user) {
    req.flash('error', 'Password reset is invalid or has expired');
    return res.redirect('/login');
  }
  await User.setPassword(req.body.password);
  // const setPassword = promisify(user.setPassword, user);
  await setPassword(req.body.password);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  const updatedUser = await user.save();
  await req.login(updatedUser);
  // req.flash('Success', 'Your password has been reset. You are logged in.');
  // res.redirect('/');
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

    req.logIn(user, function(err) {
      if (err) {
        const frontendURL = process.env.NODE_ENV === 'production'
          ? 'https://www.palabrotas.app'
          : 'http://localhost:3000';
        return res.redirect(`${frontendURL}/login?error=Login failed`);
      }
      const frontendURL = process.env.NODE_ENV === 'production'
        ? 'https://www.palabrotas.app'
        : 'http://localhost:3000';
      return res.redirect(frontendURL);
    });
  })(req, res, next);
};