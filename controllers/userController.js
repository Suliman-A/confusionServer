const passport = require('passport')
const validator = require('validator')
const User = require('../models/user')
const authenticate = require('../authenticate')

const getUsers = async (req, res, next) => {
    try {
        const users = await User.find({})
        res.status(200).json(users)
    } catch (err) {
        // res.status(500).json({ err: err.message });
        next(err)
    }
}

const signupUser = async (req, res) => {
    const { username, password, firstname, lastname, email } = req.body

    if (!validator.isEmail(email)) {
        res.status(400).json({
            success: false,
            status: 0,
            message: 'Invalid email format',
        })
        return
    }

    // Check if the email already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
        res.status(409).json({
            success: false,
            status: 0,
            message: 'Email already exists',
        })
        return
    }

    try {
        const registerUser = new User({
            username,
            firstname,
            lastname,
            email,
        })
        await User.register(registerUser, password)

        passport.authenticate('local')(req, res, () => {
            res.status(200).json({
                success: true,
                status: 1,
                message: 'Registration Successful!',
            })
        })
    } catch (err) {
        res.status(500).json({ err: err.message })
    }
}

const loginUser = async (req, res) => {
    const token = authenticate.getToken({ _id: req.user._id })
    res.status(200).json({
        success: true,
        token,
        status: 1,
        message: 'You are Successfully logged in!',
    })
}

const logoutUser = async (req, res, next) => {
    if (req.session) {
        req.session.destroy()
        res.clearCookie('session-id')
        res.redirect('/')
    } else {
        const err = new Error('You are not logged in!')
        err.status = 403
        next(err)
    }
}

module.exports = {
    getUsers,
    loginUser,
    signupUser,
    logoutUser,
}
