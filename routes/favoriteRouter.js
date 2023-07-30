const express = require('express')
const authenticate = require('../authenticate')
const {
    getFavorites,
    addFavorite,
    deleteAllFavorites,
    deleteFavoriteDish,
} = require('../controllers/favoriteController')

const favoriteRouter = express.Router()

favoriteRouter
    .route('/')
    .all(authenticate.verifyUser)
    .get(getFavorites)
    .post(addFavorite)
    .delete(deleteAllFavorites)

favoriteRouter
    .route('/:dishId')
    .all(authenticate.verifyUser)
    .delete(deleteFavoriteDish)

module.exports = favoriteRouter
