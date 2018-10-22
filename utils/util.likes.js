const LikeModel = require('../models/model.likes');

const likePost = (req) => {
    const likeFlag = req.body.likeFlag;
    const likeObj = {
        post: req.body.postid,
        user: req.userid
    };

    if (likeFlag) {

    }
}

module.exports = {
    likePost: likePost
}