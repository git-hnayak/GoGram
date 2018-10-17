const mongoose = require('mongoose');

const userSchems = new mongoose.Schema({
    userName: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdDate: { type: Date, default: Date.now() },
    imagePath: { type: String, required: true },
    resetPasswordToken: String,
    resetPasswordExpires: Date
});

const UserModel = mongoose.model('user', userSchems);

module.exports = UserModel;