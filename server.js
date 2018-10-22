//Node Modules
const express = require('express');
const mongoose = require('mongoose');
const config = require('./config');

//Router modules
const homeRouter = require('./routers/router.home');
const usersRouter = require('./routers/router.users');
const postRouter = require('./routers/router.posts');
const likeRouter = require('./routers/router.likes');

const app = express();
const port = config.port;

//DB Connection
mongoose.connect('mongodb://localhost/gogram', { useNewUrlParser: true, useCreateIndex: true })
    .then((res) => console.log('Connected to data base...'))
    .catch(err => console.log('Error while establishing connection to data base', err));

//Middlewares
app.use(express.json()); //for parsing JSON request body
app.use(express.urlencoded({ extended: true })); //for parsing url encoded request
app.use(express.static('public')); //for serving static files
app.use(express.static('uploads/profile_images')); //for serving profile images
app.use(express.static('uploads/post_images')); //for serving post images

//Routes
app.use('/', homeRouter);
app.use('/api/user', usersRouter);
app.use('/api/feed', postRouter);
app.use('/api/like', likeRouter);

//App settings
app.set('view engine', 'pug'); //setting view engine as pug for the app
app.set('views', 'public'); //setting views file path to public

//Starting server
app.listen(port, () => console.log(`Server listening on port ${port}...`));



