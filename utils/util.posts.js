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

const deletePost = (req) => {
    const postId = req.params.postid;
    return new Promise((resolve, reject) => {
        PostModel.remove({ _id: postId })
        .then(result => resolve(result))
        .catch(err => reject(err))
    })
}

module.exports = {
    createPost: createPost,
    getAllPublicPost: getAllPublicPost,
    deletePost: deletePost
}