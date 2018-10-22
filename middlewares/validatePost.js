const Joi = require('joi');
const commonUtil = require('../utils/util.common');

const validatePostCreation = function(req, res, next) {
    const postSchema = {
        description: Joi.string().min(8).max(50).label('Post Description')
    }

    const { error } = Joi.validate(req.body, postSchema);
    if (!req.file && !req.body.description) {
        res.status(400).send('Post description or a post image is required');
    } else if (error) {
        if (req.file) {
            commonUtil.removeFile(req.file.path)
        }
        return res.status(400).send(error.details[0].message);
    } else {
        next();
    }
}

module.exports = {
    validatePostCreation: validatePostCreation
};