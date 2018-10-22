const CommentModel = require('../models/model.comments');
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

const saveComments = (commentObj) => {
    return new Promise((resolve, reject) => {
        const comment = new CommentModel(commentObj);
        comment.save()
        .then((res) => {
            resolve(res);
        })
        .catch(err => reject(err))
    })
}

const updateCommentsCount = (postid) => {
    return new Promise((resolve, reject) => {
        PostModel.findByIdAndUpdate(postid, { $inc: { totalComments: 1 } })
        .then((res) => {
            resolve(res)
        }, (err) => reject(err))
    })
}

const commentPost = (req) => {
    const postid = req.body.postid;
    const commentObj = {
        post: postid,
        user: req.userid,
        comments: req.body.comments
    };

    return new Promise((resolve, reject) => {
        checkPost(postid).then(() => {
            return saveComments(commentObj)
        })
        .then(() => {
            return updateCommentsCount(postid)
        })
        .then((result) => {
            resolve(result);
        })
        .catch(err => reject(err))
    })
}

module.exports = {
    commentPost: commentPost
}