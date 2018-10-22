const express = require('express');
const router = express.Router();
const commentUtil = require('../utils/util.comments');
const verifyToken = require('../middlewares/verifyToken');
const validatePost = require('../middlewares/validatePost');

//Like or dislike a post
router.put('/', [verifyToken, validatePost.validateCommentCreation], (req, res) => {
    commentUtil.commentPost(req)
        .then((result) => {
            res.status(200).send({message: 'Comment added successfully'});
        }).catch((err) => {
            console.log('Error: ', err);
            res.status(400).send(err);
        });
});

module.exports = router;