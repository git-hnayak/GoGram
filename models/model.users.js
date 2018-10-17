const mongoose = require('mongoose');

const userSchems = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdDate: { type: Date, default: Date.now() },
    imagePath: { type: String },
    resetPasswordToken: String,
    resetPasswordExpires: Date
});

const UserModel = mongoose.model('user', userSchems);

module.exports = UserModel;