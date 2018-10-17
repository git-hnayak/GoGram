//Node Modules
const express = require('express');
const mongoose = require('mongoose');
const config = require('./config');

//Router modules
const homeRouter = require('./routers/router.home');
const usersRouter = require('./routers/router.users');

const app = express();
const environment = config.environment;
const port = config.port;

//DB Connection
mongoose.connect('mongodb://localhost/gogram', { useNewUrlParser: true })
    .then((res) => console.log('Connected to data base...'))
    .catch(err => console.log('Error while establishing connection to data base', err));

//Middlewares
app.use(express.json()); //for parsing JSON request body
app.use(express.urlencoded({ extended: true })); //for parsing url encoded request
app.use(express.static('public')); //for serving static files
app.use(express.static('uploads'));

//Routes
app.use('/', homeRouter);
app.use('/api/user', usersRouter);

//App settings
app.set('view engine', 'pug'); //setting view engine for the app i.e. pug
app.set('views', 'public'); //setting views file path i.e. public

//Starting server
app.listen(port, () => debug(`Server listening on port ${port}...`));



