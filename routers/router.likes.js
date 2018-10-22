const express = require('express');
const router = express.Router();
const likeUtil = require('../utils/util.likes');
const verifyToken = require('../middlewares/verifyToken');

//Like or dislike a post
router.put('/:postid', verifyToken, (req, res) => {
    likeUtil.likePost(req)
        .then((result) => {
            res.status(200).send({message: 'Post liked successfully'});
        }).catch((err) => {
            console.log('Error: ', err);
            res.status(400).send(err);
        });
});

module.exports = router;