const express = require('express');
const router = express.Router();
const userUtil = require('../utils/util.users');
const validateUser = require('../middlewares/validateUser');
const verifyToken = require('../middlewares/verifyToken');
const commonUtil = require('../utils/util.common');
const crypto = require('crypto');
var path = require('path');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'uploads/profile_images')
    },
    filename: (req, file, callback) => {
        crypto.pseudoRandomBytes(16, function(err, raw) {
            if (err) return callback(err);
            callback(null, raw.toString('hex') + path.extname(file.originalname));
        });
        // callback(null, Date.now() + '_' + file.originalname)
    }
});
const upload = multer({storage: storage});

//User Registarion
router.post('/signup', [upload.single('profileImage'), validateUser.validateUserSignUp], (req, res) => {
    userUtil.createUser(req)
        .then((token) => {
            res.status(200).send({auth: true, auth_token: token});
        }).catch((err) => {
            console.log('Error: ', err);
            commonUtil.removeFile(req.file.path);
            res.status(400).send(err);
        });
});

//User Login
router.post('/login', validateUser.validateUserLogin, (req, res) => {
    userUtil.logUser(req)
        .then((token) => {
            res.status(200).send({auth: true, auth_token: token});
        }).catch((err) => {
            console.log('Error: ', err);
            res.status(400).send('Invalid email or password');
        });
});

//User Logout
router.post('/logout', verifyToken, (req, res) => {
    res.status(200).send({auth: false, auth_token: null});
});

//View User details
router.get('/', verifyToken, (req, res) => {
    userUtil.getUserDetails(req.userid)
        .then((result) => {
            res.status(200).send(result);
        }).catch(err => res.status(400).send(err))
});

//Update User
router.post('/', [verifyToken, validateUser.validateUserUpdate], (req, res) => {
    userUtil.updateUser(req)
        .then((result) => {
            res.status(200).send('User Updated Successfully');
        }).catch(err => res.status(400).send(err))
});

//Forgot Password
router.post('/forgot', validateUser.validateForgotUser, (req, res) => {
    userUtil.forgotUser(req)
        .then((token) => {
            res.status(200).send({resetPasswordToken: token});
        }).catch(err => {
            console.log(err);
            res.status(400).send(err)
        })
});

//Reset Password
router.post('/reset/:token', validateUser.validateResetPassword, (req, res) => {
    userUtil.resetPassword(req)
        .then((result) => {
            res.status(200).send({message: 'Password reset successfully'});
        }).catch(err => {
            console.log(err);
            res.status(400).send(err)
        })
});

module.exports = router;