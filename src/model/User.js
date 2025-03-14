const mongoose = require('mongoose');
const Schema = mongoose.Schema

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    resetPaswordToken: {
        type: String
    },
    resetPasswordExpiredAt: {
        type: Date
    },
    creatAt: {
        type: Date,
        default: Date.now()
    }
});


module.exports = mongoose.model('User', userSchema);