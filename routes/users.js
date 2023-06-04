const express = require('express');
const passport = require('passport');
const authenticate = require('../authenticate');
const cors = require('./cors');
const {
  getUsers, signupUser, loginUser, logoutUser,
} = require('../controllers/userController');

const router = express.Router();

/* GET users listing. */
router.get('/', cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, getUsers);

// SIGN UP
router.post('/signup', cors.corsWithOptions, signupUser);

// LOG IN
router.post('/login', cors.corsWithOptions, passport.authenticate('local', { session: false }), loginUser);

// LOG OUT
router.get('/logout', logoutUser);

module.exports = router;
