const express = require('express');
const bodyParser = require('body-parser');
const User = require('../models/user');
const passport = require('passport');
const authenticate = require('../authenticate');
const cors = require('./cors');
const validator = require('validator')
const router = express.Router();
router.use(bodyParser.json());

/* GET users listing. */
router.get('/', cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, function(req, res, next) {
  User.find({}, (err, users) => {
    if(err) {
      return next(err);
    } else {
      res.statusCode = 200;
      res.setHeader('Content_type', 'application/json');
      res.json(users);
    }
  })
});

// SIGN UP
router.post('/signup', cors.corsWithOptions, async (req, res, next) => {
  const { username, password, firstname, lastname, email } = req.body

  if (!validator.isEmail(email)) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.json({ success: false, status: 0, message: 'Invalid email format' });
    return;
  }

  // Check if the email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    // res.statusCode = 409; // Conflict - Email already exists
    // res.setHeader('Content-Type', 'application/json');
    res.status(409).json({ success: false, status: 0, message: 'Email already exists' });
    return;
  }

  try {
    const registerUser = new User({  username, firstname, lastname, email });

    await User.register(registerUser, password)

    // await newUser.save()

    passport.authenticate('local')(req, res, () => {
      // res.statusCode = 200;
      // res.setHeader('Content-Type', 'application/json');
      res.status(200).json({success: true, status: 1, message: 'Registration Successful!'});
    });

  } catch (err) {
    // res.statusCode = 500;
    // res.setHeader('Content-Type', 'application/json');
    res.status(500).json({err: err.message});
  }
});


// LOG IN
router.post('/login', cors.corsWithOptions, passport.authenticate('local'), (req, res) => {

  const token = authenticate.getToken({_id: req.user._id})
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true, token: token, status: 'You are Successfully logged in!'});
});
// LOG OUT
router.get('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  }
  else {
    var err = new Error('You are not logged in!');
    err.status = 403;
    next(err);
  }
})
module.exports = router;
