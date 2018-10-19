const Joi = require('joi');
const commonUtil = require('../utils/util.common');

const validateUserSignUp = function(req, res, next) {
    const userSchema = {
        firstName: Joi.string().max(50).required().label('First Name'),
        lastName: Joi.string().max(50).required().label('Last Name'),
        email: Joi.string().required().email(),
        password: Joi.string().min(8).max(20).required().regex(/^[a-zA-Z0-9]{8,30}$/)
    }

    const { error } = Joi.validate(req.body, userSchema);

    if (!req.file) {
        res.status(400).send('Profile picture is required');
    } else if (error) {
        commonUtil.removeFile(req.file.path)
        return res.status(400).send(error.details[0].message);
    } else {
        next();
    }
}

const validateUserLogin = (req, res, next) => {
    const userSchema = {
        email: Joi.string().required().email(),
        password: Joi.string().min(8).max(20).required().regex(/^[a-zA-Z0-9]{8,30}$/)
    }

    const { error } = Joi.validate(req.body, userSchema);
    if (error) return res.status(400).send(error.details[0].message);
    next();
}

const validateUserUpdate = (req, res, next) => {
    const userSchema = {
        firstName: Joi.string().max(50).required().label('First Name'),
        lastName: Joi.string().max(50).required().label('Last Name')
    }

    const { error } = Joi.validate(req.body, userSchema);
    if (error) return res.status(400).send(error.details[0].message);
    next();
}

const validateForgotUser = (req, res, next) => {
    const userSchema = {
        email: Joi.string().required().email()
    }

    const { error } = Joi.validate(req.body, userSchema);
    if (error) return res.status(400).send(error.details[0].message);
    next();
}

const validateResetPassword = (req, res, next) => {
    const userSchema = {
        password: Joi.string().min(8).max(20).required().regex(/^[a-zA-Z0-9]{8,30}$/)
    }

    const { error } = Joi.validate(req.body, userSchema);
    if (error) return res.status(400).send(error.details[0].message);
    next();
}

module.exports = {
    validateUserSignUp: validateUserSignUp,
    validateUserLogin: validateUserLogin,
    validateUserUpdate: validateUserUpdate,
    validateForgotUser: validateForgotUser,
    validateResetPassword: validateResetPassword
};