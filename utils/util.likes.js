const LikeModel = require('../models/model.likes');
const PostModel = require('../models/model.posts');

const checkPost = (postid) => {
    return new Promise((resolve, reject) => {
        PostModel.countDocuments({ _id: postid })
        .then(count => {
            if (count != 0 ) {
                resolve();
            } else {
                reject('No post found');
            }
        }).catch((err) => {
            reject(err)
        });
    })
}

const checkLike = (likes) => {
    return new Promise((resolve, reject) => {
        LikeModel.countDocuments(likes)
        .then(count => {
            if (count != 0 ) {
                reject('Post already Liked');
            } else {
                resolve();
            }
        }).catch((err) => {
            reject(err)
        });
    })
}

const saveLike = (likeObj) => {
    return new Promise((resolve, reject) => {
        const like = new LikeModel(likeObj);
        like.save()
        .then((res) => {
            resolve(res);
        })
        .catch(err => reject(err))
    })
}

const updateLikesCount = (postid) => {
    return new Promise((resolve, reject) => {
        PostModel.findByIdAndUpdate(postid, { $inc: { totalLikes: 1 } })
        .then((res) => {
            resolve(res)
        }, (err) => reject(err))
    })
}

const likePost = (req) => {
    const postid = req.params.postid;
    const likeObj = {
        post: postid,
        user: req.userid
    };

    return new Promise((resolve, reject) => {
        checkPost(postid).then(() => {
            return checkLike(likeObj)
        })
        .then(() => {
            return saveLike(likeObj)
        })
        .then((res) => {
            return updateLikesCount(postid)
        })
        .then((result) => {
            resolve(result);
        })
        .catch(err => reject(err))
    })
}

module.exports = {
    likePost: likePost
}