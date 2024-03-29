const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const JwtStrategy = require('passport-jwt').Strategy
const { ExtractJwt } = require('passport-jwt')
const jwt = require('jsonwebtoken') // used to create, sign, and verify tokens
const User = require('./models/user')

const config = require('./config')

exports.local = passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

exports.getToken = (user) =>
    jwt.sign(user, config.secretKey, { expiresIn: 3600 })

const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = config.secretKey

exports.jwtPassport = passport.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
        try {
            console.log('JWT payload: ', jwt_payload)
            const user = await User.findOne({ _id: jwt_payload._id })
            if (user) {
                return done(null, user)
            }
            return done(null, false)
        } catch (err) {
            return done(err, false)
        }
    })
)

exports.verifyUser = passport.authenticate('jwt', { session: false })
exports.verifyAdmin = (req, res, next) => {
    if (req.user.admin) {
        return next()
    }
    const err = new Error('You are not authorized to perform this operation!')
    err.status = 403
    return next(err)
}
