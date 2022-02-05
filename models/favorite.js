const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const favoriteScema = Schema({
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    dishes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dishes'
    }]
}, {
    timestamps: true
});

var Favorites = mongoose.model('Favorite', favoriteScema);

module.exports = Favorites;