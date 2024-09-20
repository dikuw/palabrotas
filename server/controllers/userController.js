import User from '../models/User.js';

export const getCurrentUser = async (req, res) => {
  if (req.user) {
    res.json({ user: req.user });
  } else {
    res.json({ error: 'No user found' });
  };
};

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

export const addUser = async (req, res) => {
  const user = req.body;
  const newUser = new User(user);
  try {
    await newUser.save();
    res.status(201).json({ success: true, data: newUser });
  } catch(error) {
    console.error("Error in add user:", error.message);
    res.status(500).json({ success: false, message: error });
  }
};

export const checkAlreadyRegistered = async (req, res, next) => {
  const registered = await User.find({ email: req.body.email });
  if (registered[0] && registered[0]._id) {
    res.json( { error: 'That email is already registered!' });
    return;
  }
  next();
}

export const register = async (req, res) => {
  const user = new User({ 
    email: req.body.email, 
    name: req.body.name,
  });
  const register = promisify(User.register, User);
  await register(user, req.body.password);
  next();
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

// // start from Hely, maybe want to add this in the future, but docs instead of orders
// exports.account = async (req, res) => {
//   const orders = await Order.find({ user: req.user._id });
//   res.render('account', { title: 'Edit Your Account', orders });
// };
// // end from Hely

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