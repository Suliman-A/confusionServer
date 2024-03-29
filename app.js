require('dotenv').config()
const path = require('path')
const createError = require('http-errors')
const express = require('express')
const logger = require('morgan')
const passport = require('passport')
const mongoose = require('mongoose')
// const cookieParser = require('cookie-parser');
// const session = require('express-session');
// const FileStore = require('session-file-store')(session);

const indexRouter = require('./routes/index')
const usersRouter = require('./routes/users')
const dishRouter = require('./routes/dishRouter')
const promoRouter = require('./routes/promoRouter')
const leaderRouter = require('./routes/leaderRouter')
const uploadRouter = require('./routes/uploadRouter')
const favoriteRouter = require('./routes/favoriteRouter')
// establish connection to mongodb server

// const url = config.mongoUrl;
// const connect = mongoose.connect(url, {useMongoClient:true});

// connect.then((db) => {
//   console.log('Connected correctly to server');
// }, (err) => { console.log(err); });
// connect to db

const app = express()

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        //  listen for requests
        app.listen('3443', () => {
            console.log('Hello World!', '3443')
        })
    })
    .catch((error) => {
        console.log(error)
    })

// secure traffic only
// app.all('*', (req, res, next) => {
//   if(req.secure) {
//     return next();
//   }
//   else {
//     res.redirect(307, 'https://' + req.hostname + ':' + app.get('secPort') + req.url);
//   }
// });

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// app.use(cookieParser('12345-67890-09876-54321'));
app.use(passport.initialize())

app.use('/', indexRouter)
app.use('/users', usersRouter)

app.use(express.static(path.join(__dirname, 'public')))

app.use('/dishes', dishRouter)
app.use('/promotions', promoRouter)
app.use('/leaders', leaderRouter)
app.use('/imageUpload', uploadRouter)
app.use('/favorite', favoriteRouter)

// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404))
})

// error handler
app.use((err, req, res) => {
    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    // render the error page
    res.status(err.status || 500)
    res.render('error')
})

module.exports = app
