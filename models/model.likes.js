const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const likeSchema = new mongoose.Schema({
    post: { type: ObjectId, ref: 'post' },
    user: { type: ObjectId, ref: 'user' },
    createdDate: { type: Date, default: Date.now() }
});

const LikeModel = mongoose.model('like', likeSchema);

module.exports = LikeModel;