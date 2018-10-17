const Joi = require('joi');

const validateUser = function(req, res, next) {
    const userSchema = {
        firstName: Joi.string().max(50).required().label('First Name'),
        lastName: Joi.string().max(50).required().label('Last Name'),
        email: Joi.string().required().email(),
        password: Joi.string().min(8).max(20).required().regex(/^[a-zA-Z0-9]{8,30}$/)
    }

    const { error } = Joi.validate(req.body, userSchema);

    if (error) {
        return res.status(400).send(error.details[0].message);
    } else {
        next();
    }
}

module.exports = validateUser;