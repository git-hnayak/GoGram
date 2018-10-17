const express = require('express');
const router = express.Router();
const userUtil = require('../utils/util.users');
const validateUser = require('../middlewares/validateUserInput');

router.post('/signup', validateUser, (req, res) => {
    userUtil.createUser(req)
        .then((result) => {
            res.send('User Craeted Successfully');
        }).catch((err) => {
            console.log('Error: ', err);
            res.status(400).send(err);
        });
});

router.get('/', (req, res) => {
    userUtil.findAllUsers()
        .then((result) => {
            res.send(result);
        }).catch(err => res.status(400).send(err))
});

module.exports = router;