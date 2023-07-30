const mongoose = require('mongoose')
const Dishes = require('./dishes')

const { Schema } = mongoose

const favoriteScema = Schema(
    {
        postedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        dishes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: Dishes,
            },
        ],
    },
    {
        timestamps: true,
    }
)

const Favorites = mongoose.model('Favorite', favoriteScema)

module.exports = Favorites
