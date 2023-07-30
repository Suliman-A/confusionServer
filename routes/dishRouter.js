const express = require('express')
const authenticate = require('../authenticate')
const cors = require('./cors')
const {
    createDishes,
    updateDish,
    getDishes,
    deleteDishes,
    getDish,
    deleteDish,
    getComments,
    addComment,
    getComment,
    deleteComments,
    updateComment,
    deleteComment,
} = require('../controllers/dishController')

const dishRouter = express.Router()

dishRouter
    .route('/')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200)
    })
    // GET DIGHES
    .get(cors.cors, getDishes)
    // POST DIGHES
    .post(
        cors.corsWithOptions,
        authenticate.verifyUser,
        authenticate.verifyAdmin,
        createDishes
    )
    // UPDATE DIGHES
    .put(
        cors.corsWithOptions,
        authenticate.verifyUser,
        authenticate.verifyAdmin,
        (req, res) => {
            res.status(403).end('PUT operation not supported on /dishes')
        }
    )
    // DELETE ALL DIGHES
    .delete(
        cors.corsWithOptions,
        authenticate.verifyUser,
        authenticate.verifyAdmin,
        deleteDishes
    )

// dishId
dishRouter
    .route('/:dishId')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200)
    })
    .get(cors.cors, getDish)
    .post(
        cors.corsWithOptions,
        authenticate.verifyUser,
        authenticate.verifyAdmin,
        (req, res) => {
            res.status(403).end(
                `POST operation not supported on /dishes/${req.params.dishId}`
            )
        }
    )
    .patch(
        cors.corsWithOptions,
        authenticate.verifyUser,
        authenticate.verifyAdmin,
        updateDish
    )
    .delete(
        cors.corsWithOptions,
        authenticate.verifyUser,
        authenticate.verifyAdmin,
        deleteDish
    )

// dishId/comments
dishRouter
    .route('/:dishId/comments')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200)
    })
    .get(cors.cors, getComments)
    .post(cors.corsWithOptions, authenticate.verifyUser, addComment)
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
        res.status(403).end(
            `PUT operation not supported on /dishes/${req.params.dishId}/comments`
        )
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, deleteComments)

// dishId/comments/commentId
dishRouter
    .route('/:dishId/comments/:commentId')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200)
    })
    .get(cors.cors, getComment)
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
        res.status(403).end(
            `POST operation not supported on /dishes/${req.params.dishId}/comments/${req.params.commentId}`
        )
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, updateComment)
    .delete(cors.corsWithOptions, authenticate.verifyUser, deleteComment)

module.exports = dishRouter
