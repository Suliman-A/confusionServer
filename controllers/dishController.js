const Dishes = require('../models/dishes')

// controller functions for (dishes) route

const getDishes = async (req, res, next) => {
    try {
        const dishes = await Dishes.find({}).populate('comments.author')
        res.status(200).json(dishes)
    } catch (err) {
        next(err)
    }
}

const createDishes = async (req, res, next) => {
    try {
        const dish = await Dishes.create(req.body)
        // console.log('Dish created ', dish);
        res.status(200).json(dish)
    } catch (err) {
        next(err)
    }
}

const deleteDishes = async (req, res, next) => {
    try {
        const dishes = await Dishes.remove({})
        res.status(200).json(dishes)
    } catch (err) {
        next(err)
    }
}

// controller functions for (dishes/dishId) route

const getDish = async (req, res, next) => {
    try {
        const dish = await Dishes.findById(req.params.dishId).populate(
            'comments.author'
        )
        res.status(200).json(dish)
    } catch (err) {
        next(err)
    }
}

const updateDish = async (req, res, next) => {
    try {
        const dish = await Dishes.findByIdAndUpdate(req.params.dishId, {
            ...req.body,
        })

        if (!dish) {
            res.status(400).json({ error: 'No dish found' })
            return
        }

        res.status(200).json(dish)
    } catch (err) {
        next(err)
    }
}

const deleteDish = async (req, res, next) => {
    try {
        const dish = await Dishes.findByIdAndRemove(req.params.dishId)

        if (!dish) {
            res.status(400).json({ error: 'No dish found' })
            return
        }

        res.status(200).json(dish)
    } catch (err) {
        next(err)
    }
}

// controller functions for (dishes/dishId/comments) route

const getComments = async (req, res, next) => {
    try {
        const dish = await Dishes.findById(req.params.dishId).populate(
            'comments.author'
        )

        if (!dish) {
            res.status(400).json({ error: 'No dish found' })
            return
        }

        res.status(200).json(dish.comments)
    } catch (err) {
        next(err)
    }
}

const addComment = async (req, res, next) => {
    try {
        const dish = await Dishes.findById(req.params.dishId)
        if (dish != null) {
            req.body.author = req.user._id
            dish.comments = dish.comments.concat(req.body)
            const savedDish = await dish.save()
            const populatedDish = await Dishes.findById(savedDish._id).populate(
                'comments.author'
            )
            res.setHeader('Content-Type', 'application/json')
            res.status(200).json(populatedDish)
        } else {
            const err = new Error(`Dish ${req.params.dishId} not found`)
            err.status = 404
            return next(err)
        }
    } catch (err) {
        next(err)
    }
}

const deleteComments = async (req, res, next) => {
    try {
        const dish = await Dishes.findById(req.params.dishId)
        if (dish != null) {
            // for (let i = dish.comments.length - 1; i >= 0; i--) {
            //   dish.comments.id(dish.comments[i]._id).remove();
            // }
            // await dish.comments.remove({});
            dish.comments = []
            const savedDish = await dish.save()
            res.setHeader('Content-Type', 'application/json')
            res.status(200).json(savedDish)
        } else {
            const err = new Error(`Dish ${req.params.dishId} not found`)
            err.status = 404
            return next(err)
        }
    } catch (err) {
        next(err)
    }
}

// (dishes/dishId/comments/commentId)

const getComment = async (req, res, next) => {
    try {
        const dish = await Dishes.findById(req.params.dishId).populate(
            'comments.author'
        )
        if (dish != null && dish.comments.id(req.params.commentId) != null) {
            res.setHeader('Content-Type', 'application/json')
            res.status(200).json(dish.comments.id(req.params.commentId))
        } else if (dish == null) {
            const err = new Error(`Dish ${req.params.dishId} not found`)
            err.status = 404
            return next(err)
        } else {
            const err = new Error(`Comment ${req.params.commentId} not found`)
            err.status = 404
            return next(err)
        }
    } catch (err) {
        next(err)
    }
}

const updateComment = async (req, res, next) => {
    try {
        const dish = await Dishes.findById(req.params.dishId)
        const comment = dish?.comments.id(req.params.commentId)

        if (dish != null && comment != null) {
            if (comment.author.toString() !== req.user._id.toString()) {
                const err = new Error(
                    'You are not authorized to edit this comment'
                )
                err.status = 403
                return next(err)
            }

            if (req.body.rating) {
                comment.rating = req.body.rating
            }
            if (req.body.comment) {
                comment.comment = req.body.comment
            }
            await dish.save()
            res.setHeader('Content-Type', 'application/json')
            res.status(200).json(dish)
        } else if (dish == null) {
            const err = new Error(`Dish ${req.params.dishId} not found`)
            err.status = 404
            return next(err)
        } else {
            const err = new Error(`Comment ${req.params.commentId} not found`)
            err.status = 404
            return next(err)
        }
    } catch (err) {
        next(err)
    }
}

const deleteComment = async (req, res, next) => {
    try {
        const dish = await Dishes.findById(req.params.dishId)
        const comment = dish?.comments.id(req.params.commentId)

        if (dish != null && comment != null) {
            if (comment.author.toString() !== req.user._id.toString()) {
                const err = new Error(
                    'You are not authorized to edit this comment'
                )
                err.status = 403
                return next(err)
            }
            comment.deleteOne()
            await dish.save()

            res.setHeader('Content-Type', 'application/json')
            res.status(200).json(dish)
        } else if (dish == null) {
            const err = new Error(`Dish ${req.params.dishId} not found`)
            err.status = 404
            return next(err)
        } else {
            const err = new Error(`Comment ${req.params.commentId} not found`)
            err.status = 404
            return next(err)
        }
    } catch (err) {
        next(err)
    }
}

module.exports = {
    getDishes,
    createDishes,
    updateDish,
    deleteDishes,
    getDish,
    deleteDish,
    getComments,
    addComment,
    deleteComments,
    getComment,
    updateComment,
    deleteComment,
}
