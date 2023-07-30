const { Schema } = require('mongoose')
const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')

const User = new Schema({
    firstname: {
        type: String,
        required: true,
        default: '',
    },
    lastname: {
        type: String,
        required: true,
        default: '',
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    admin: {
        type: Boolean,
        default: false,
    },
})

User.plugin(passportLocalMongoose)

module.exports = mongoose.model('User', User)
