const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const commentSchema = new mongoose.Schema({
    post: { type: ObjectId, ref: 'post' },
    comments: String,
    user: { type: ObjectId, ref: 'user' },
    createdDate: { type: Date, default: Date.now() }
});

const CommentModel = mongoose.model('comment', commentSchema);

module.exports = CommentModel;