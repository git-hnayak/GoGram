const express = require('express');
const router = express.Router();
const postUtil = require('../utils/util.posts');
const path = require('path');
const validatePost = require('../middlewares/validatePost');
const verifyToken = require('../middlewares/verifyToken');
const crypto = require('crypto');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'uploads/post_images')
    },
    filename: (req, file, callback) => {
        crypto.pseudoRandomBytes(16, function(err, raw) {
            if (err) return callback(err);
            callback(null, raw.toString('hex') + path.extname(file.originalname));
        });
    }
});
const upload = multer({storage: storage});

//Create a new post
router.put('/', [verifyToken, upload.single('postImage'), validatePost.validatePostCreation], (req, res) => {
    postUtil.createPost(req)
        .then((result) => {
            res.status(200).send({message: 'Post created successfully'});
        }).catch((err) => {
            console.log('Error: ', err);
            if(req.file) {
                commonUtil.removeFile(req.file.path);
            }
            res.status(400).send(err);
        });
});

//Get all public posts
router.get('/', verifyToken, (req, res) => {
    postUtil.getAllPublicPost(req)
        .then((result) => {
            res.status(200).send(result);
        }).catch((err) => {
            console.log('Error: ', err);
            res.status(400).send(err);
        });
});

//Delete a post
router.delete('/:postid', verifyToken, (req, res) => {
    postUtil.deletePost(req)
        .then((result) => {
            res.status(200).send({message: 'Your post has been deleted successfully'});
        }).catch((err) => {
            console.log('Error: ', err);
            res.status(400).send(err);
        });
});

module.exports = router;