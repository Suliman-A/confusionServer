const mongoose = require('mongoose')

const { Schema } = mongoose
// require('mongoose-currency').loadType(mongoose);

// const { Currency } = mongoose.Types;

const commentSchema = Schema(
    {
        rating: {
            type: Number,
            min: 0,
            max: 5,
            required: true,
        },
        comment: {
            type: String,
            required: true,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    {
        timestamps: true,
    },
    { usePushEach: true }
)

const dishSchema = Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        description: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        label: {
            type: String,
            default: '',
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        featured: {
            type: Boolean,
            default: false,
        },
        comments: [commentSchema],
    },
    {
        timestamps: true,
    }
)

const Dishes = mongoose.model('Dish', dishSchema)

module.exports = Dishes
