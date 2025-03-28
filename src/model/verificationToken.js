const mongoose = require('mongoose');
const Schema = mongoose.Schema

const tokenSchema = new Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    token: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expiredAt: 500
    }
})

module.exports = mongoose.model('verificationToken', tokenSchema)