const express = require('express');
const router = express.Router();
const likeUtil = require('../utils/util.likes');
const verifyToken = require('../middlewares/verifyToken');
const validatePost = require('../middlewares/validatePost');

//Like or dislike a post
router.post('/', [verifyToken, validatePost.validateLike], (req, res) => {
    likeUtil.likePost(req)
        .then((result) => {
            res.status(200).send({message: 'Post created successfully'});
        }).catch((err) => {
            console.log('Error: ', err);
            res.status(400).send(err);
        });
});

module.exports = router;