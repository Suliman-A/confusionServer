const express = require('express')
const multer = require('multer')
const authenticate = require('../authenticate')
const cors = require('./cors')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images')
    },

    filename: (req, file, cb) => {
        cb(null, file.originalname)
    },
})

const imageFileFilter = (req, file, cb) => {
    if (file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        cb(null, true)
    } else {
        cb(new Error('You can upload only image files!'), false)
    }
}

const upload = multer({ storage, fileFilter: imageFileFilter })

const uploadRouter = express.Router()

// image upload route
uploadRouter
    .route('/')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200)
    })
    .get(
        cors.cors,
        authenticate.verifyUser,
        authenticate.verifyAdmin,
        (req, res) => {
            res.statusCode = 403
            res.end('GET operation not supported on /imageUpload')
        }
    )
    .post(
        cors.corsWithOptions,
        authenticate.verifyUser,
        authenticate.verifyAdmin,
        upload.single('imageFile'),
        (req, res) => {
            console.log('body data:', req.body)
            console.log('files data:', req.files)
            console.log('file', req.file)
            res.statusCode = 200
            // res.setHeader('Content-Type', 'application/json')
            res.json(req.file)
        }
    )
    .put(
        cors.corsWithOptions,
        authenticate.verifyUser,
        authenticate.verifyAdmin,
        (req, res) => {
            res.statusCode = 403
            res.end('PUT operation not supported on /imageUpload')
        }
    )
    .delete(
        cors.corsWithOptions,
        authenticate.verifyUser,
        authenticate.verifyAdmin,
        (req, res) => {
            res.statusCode = 403
            res.end('DELETE operation not supported on /imageUpload')
        }
    )

module.exports = uploadRouter
