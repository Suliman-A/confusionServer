const Favorites = require('../models/favorite')

const getFavorites = async (req, res, next) => {
    try {
        // Get the authenticated user's ID from the request
        const userId = req.user._id

        // find the user's favorites based on the 'postedBy' field
        const favorites = await Favorites.find({ postedBy: userId })
            .populate('postedBy')
            .populate('dishes')

        res.json(favorites)
    } catch (err) {
        next(err)
    }
}

const addFavorite = async (req, res, next) => {
    try {
        const userId = req.user._id
        const dishId = req.body._id

        const favorites = await Favorites.find({ postedBy: userId })

        // Check if the user already has a favorites list
        if (favorites.length > 0) {
            const favoriteAlreadyExist = favorites[0].dishes.includes(dishId)

            if (!favoriteAlreadyExist) {
                // Add the dish ID to the existing favorites list and save it
                favorites[0].dishes.push(dishId)
                const updatedFavorite = await favorites[0].save()

                console.log('Updated favorites!')
                res.json(updatedFavorite)
            } else {
                console.log('Favorite already exists!')
                res.json(favorites[0])
            }
        } else {
            // Create a new favorites list and add the dish ID to it
            const newFavorite = await Favorites.create({
                postedBy: userId,
                dishes: [dishId],
            })

            console.log('New favorites created!')
            res.json(newFavorite)
        }
    } catch (err) {
        next(err)
    }
}

const deleteAllFavorites = async (req, res, next) => {
    try {
        // Delete favorites associated with the authenticated user
        const deleteResult = await Favorites.deleteMany({
            postedBy: req.user._id,
        })

        // Respond with the result of the deletion
        res.json(deleteResult)
    } catch (err) {
        next(err)
    }
}

// (/favorite//:dishId)
const deleteFavoriteDish = async (req, res, next) => {
    try {
        const userId = req.user._id
        const { dishId } = req.params // Get the dish ID from the request parameter

        // Find the user's favorites
        const favorites = await Favorites.find({ postedBy: userId })

        if (favorites.length === 0) {
            return
        }

        const favorite = favorites[0]
        const indexOfDish = favorite.dishes.indexOf(dishId)

        if (indexOfDish === -1) {
            res.status(400).json({ error: 'No dish found' })
            return
        }

        favorite.dishes.splice(indexOfDish, 1) // Remove the dish from the array
        await favorite.save() // Save the updated favorite document

        res.status(200).json(favorite) // Send the updated favorite object as the response
    } catch (err) {
        next(err)
    }
}

module.exports = {
    getFavorites,
    addFavorite,
    deleteAllFavorites,
    deleteFavoriteDish,
}
