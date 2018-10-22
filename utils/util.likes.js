const LikeModel = require('../models/model.likes');
const PostModel = require('../models/model.posts');

const likePost = (req) => {
    const postid = req.params.postid;
    const likeObj = {
        post: postid,
        user: req.userid
    };

    return new Promise((resolve, reject) => {
        const like = new LikeModel(likeObj);
        like.save()
        .then((result) => {
            PostModel.findByIdAndUpdate(likeObj.post, { $inc: { totalLikes: 1 } })
            .then((res) => {
                resolve(res)
            }, (err) => reject(err))
        })
        .catch(err => reject(err))
        
    })
}

module.exports = {
    likePost: likePost
}