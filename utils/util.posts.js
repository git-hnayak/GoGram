const PostModel = require('../models/model.posts');

const createPost = (req) => {
    const postObj = {};
    if (req.body.description) {
        postObj.description = req.body.description;
    }
    if (req.file) {
        postObj.imagePath = req.file.path;
        postObj.imageUrl = req.protocol + '://' + req.get('host') + '/' + req.file.filename;
    }
    postObj.owner = req.userid;

    return new Promise((resolve, reject) => {
        const post = new PostModel(postObj)
        post.save()
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
}

const getAllPublicPost = (req) => {
    const pageNo = parseInt(req.query.pageNo)  || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const skip = pageSize * (pageNo - 1);
    return new Promise((resolve, reject) => {
        PostModel.find()
            .limit(pageSize)
            .skip(skip)
            .sort({ createdDate: -1 })
            .populate({path: 'owner', select: '-_id firstName lastName'})
            .select({imagePath: 0})
            .then(result => resolve(result))
            .catch((err) => {
                reject(err)
            });
    })
}

const checkPost = (postid, owner) => {
    return new Promise((resolve, reject) => {
        PostModel.countDocuments({ _id: postid, owner: owner })
        .then(count => {
            console.log('Post Count: ', count);
            if (count != 0 ) {
                resolve();
            } else {
                reject('No post to delete');
            }
        }).catch((err) => {
            reject(err)
        });
    })
}

const deletePost = (req) => {
    const postId = req.params.postid;
    return new Promise((resolve, reject) => {
        checkPost(postId, req.userid).then((result) => {
            PostModel.remove({ _id: postId, owner: req.userid })
            .then(result => resolve(result))
            .catch(err => reject(err))
        }).catch(err => reject(err))
    })
}

module.exports = {
    createPost: createPost,
    getAllPublicPost: getAllPublicPost,
    deletePost: deletePost
}