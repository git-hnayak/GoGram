const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const postSchema = new mongoose.Schema({
    description: String,
    imagePath: String,
    owner: { type: ObjectId, ref: 'user' },
    createdDate: { type: Date, default: Date.now() },
    totalLikes: { type: Number, default: 0 },
    totalComments: { type: Number, default: 0 }
});

const PostModel = mongoose.model('post', postSchema);

module.exports = PostModel;