//Node Modules
const express = require('express');
const mongoose = require('mongoose');
const config = require('./config');

const secret = config.get('secret_key');
console.log('Secret Key: ', secret);

//Router modules
const homeRouter = require('./routers/router.home');
const usersRouter = require('./routers/router.users');

const app = express();
const environment = app.get('env'); //Get Environment variable NODE_ENV
const port = process.env.PORT || 4004;

//DB Connection
mongoose.connect('mongodb://localhost/turbosea', { useNewUrlParser: true })
    .then((res) => debug('Connected to data base...'))
    .catch(err => debug('Error while establishing connection to data base', err));

//Middlewares
app.use(express.json()); //for parsing JSON request body
app.use(express.urlencoded({ extended: true })); //for parsing url encoded request
app.use(express.static('public')); //for serving static files
app.use(express.static('uploads'));

//Routes
app.use('/', homeRouter);
app.use('/api/users', usersRouter);

//App settings
app.set('view engine', 'pug'); //setting view engine for the app i.e. pug
app.set('views', 'public'); //setting views file path i.e. public

//Starting server
app.listen(port, () => debug(`Server listening on port ${port}...`));



